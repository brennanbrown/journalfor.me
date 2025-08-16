import { openDB, DBSchema, IDBPDatabase } from 'idb'
import CryptoJS from 'crypto-js'
import type { JournalEntry, User, StorageItem } from '../types'
import { apiClient, type ServerEntry } from './api'

/**
 * Database schema for IndexedDB
 */
interface JournalDB extends DBSchema {
  entries: {
    key: string
    value: StorageItem<JournalEntry>
    indexes: { 'by-date': Date; 'by-title': string }
  }
  user: {
    key: string
    value: StorageItem<string> // Store encrypted user data as string
  }
  settings: {
    key: string
    value: StorageItem<any>
  }
}

/**
 * Storage management utility using IndexedDB with encryption
 */
export class StorageManager {
  private db: IDBPDatabase<JournalDB> | null = null
  private readonly dbName = 'journalfor-me'
  private readonly dbVersion = 1
  private encryptionKey: string | null = null
  private serverAvailable: boolean = false
  private syncInProgress: boolean = false
  
  /**
   * Initialize the storage system
   */
  async initialize(masterPassword?: string): Promise<void> {
    try {
      this.db = await openDB<JournalDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          // Create entries store
          const entriesStore = db.createObjectStore('entries', { keyPath: 'id' })
          entriesStore.createIndex('by-date', 'data.createdAt')
          entriesStore.createIndex('by-title', 'data.title')
          
          // Create user store
          db.createObjectStore('user', { keyPath: 'id' })
          
          // Create settings store
          db.createObjectStore('settings', { keyPath: 'id' })
        }
      })
      
      // Check server health
      this.serverAvailable = await apiClient.healthCheck()
      if (this.serverAvailable) {
        console.log('🌐 Server available - online mode')
      } else {
        console.log('🌐 Server unavailable - offline mode')
      }
      
      // Initialize encryption
      if (masterPassword) {
        this.encryptionKey = this.deriveEncryptionKey(masterPassword)
        
        // Clean up any corrupted data with encryption key available
        await this.cleanupCorruptedData()
        
        // Verify password works by trying to get existing user
        try {
          const existingUser = await this.getUser()
          if (existingUser && existingUser.email) {
            console.log(`🔓 Found existing user: ${existingUser.email}`)
            // Test decryption by trying to access encrypted data
            const entries = await this.getAllEntries()
            console.log(`🔓 Successfully decrypted ${entries.length} entries`)
          } else {
            console.log('🆕 No existing user found - ready for registration')
          }
        } catch (decryptError) {
          console.error('Login validation failed:', decryptError)
          this.encryptionKey = null // Reset encryption key
          
          // Provide specific error messages
          if (decryptError instanceof Error) {
            if (decryptError.message.includes('Master password required')) {
              throw new Error('Master password required to access existing user data')
            } else if (decryptError.message.includes('Invalid master password')) {
              throw new Error('Invalid master password - please check your password and try again')
            }
          }
          throw new Error('Authentication failed - unable to access user data with provided password')
        }
      } else {
        // Check if user exists - if so, we need password for login, not registration
        if (await this.hasExistingUser()) {
          console.log('👤 Existing user found - password required for login')
          // Don't throw error - let the app handle login flow
          return
        }
        console.log('🆕 No user data found - ready for registration')
      }
      
      console.log('📦 Storage initialized successfully')
    } catch (error) {
      console.error('Failed to initialize storage:', error)
      throw new Error('Failed to initialize storage')
    }
  }
  
  /**
   * Derive encryption key from master password
   */
  private deriveEncryptionKey(password: string): string {
    return CryptoJS.PBKDF2(password, 'journalfor.me-salt', {
      keySize: 256/32,
      iterations: 10000
    }).toString()
  }
  
  /**
   * Encrypt sensitive data
   */
  private encrypt(text: string): string {
    if (!this.encryptionKey) {
      return text // Store unencrypted if no key
    }
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString()
  }
  
  /**
   * Decrypt sensitive data
   */
  private decrypt(encryptedText: string): string {
    if (!this.encryptionKey) {
      return encryptedText // Return as-is if no key
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      
      // Validate that decryption actually worked
      if (!decryptedData || decryptedData.length === 0) {
        throw new Error('Decryption resulted in empty data')
      }
      
      return decryptedData
    } catch (error) {
      console.error('Decryption failed:', error)
      throw error // Re-throw to let caller handle the error
    }
  }
  
  /**
   * Save a journal entry with encryption and server sync
   */
  async saveEntry(entry: JournalEntry): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    
    // Create encrypted copy of entry
    const encryptedEntry: JournalEntry = {
      ...entry,
      title: this.encrypt(entry.title),
      content: this.encrypt(entry.content),
      isEncrypted: this.encryptionKey !== null
    }
    
    const storageItem: StorageItem<JournalEntry> = {
      id: entry.id,
      data: encryptedEntry,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Save locally first
    await this.db.put('entries', storageItem)
    console.log(`💾 Entry saved locally: ${entry.title} (${entry.isEncrypted ? 'encrypted' : 'plain'})`)
    
    // Sync to server if available
    if (this.serverAvailable && !this.syncInProgress) {
      try {
        const encryptedData = JSON.stringify(encryptedEntry)
        await apiClient.createEntry(encryptedData)
        console.log(`☁️ Entry synced to server: ${entry.id}`)
      } catch (error) {
        console.warn('Failed to sync entry to server:', error)
        // Entry is still saved locally, sync will retry later
      }
    }
  }
  
  /**
   * Get a journal entry by ID with decryption
   */
  async getEntry(id: string): Promise<JournalEntry | null> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const item = await this.db.get('entries', id)
    if (!item?.data) return null
    
    // Decrypt entry if encrypted
    const entry = item.data
    if (entry.isEncrypted && this.encryptionKey) {
      return {
        ...entry,
        title: this.decrypt(entry.title),
        content: this.decrypt(entry.content)
      }
    }
    
    return entry
  }
  
  /**
   * Get all journal entries with decryption and server sync
   */
  async getAllEntries(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Storage not initialized')
    
    // Sync from server first if available
    if (this.serverAvailable && !this.syncInProgress) {
      await this.syncFromServer()
    }
    
    const items = await this.db.getAll('entries')
    return items
      .map(item => {
        const entry = item.data
        if (entry.isEncrypted && this.encryptionKey) {
          return {
            ...entry,
            title: this.decrypt(entry.title),
            content: this.decrypt(entry.content)
          }
        }
        return entry
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  
  /**
   * Delete a journal entry
   */
  async deleteEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    
    await this.db.delete('entries', id)
  }
  
  /**
   * Search entries by query
   */
  async searchEntries(query: string, tags?: string[]): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const allEntries = await this.getAllEntries()
    const searchQuery = query.toLowerCase()
    
    return allEntries.filter(entry => {
      // Text search
      const textMatch = 
        entry.title.toLowerCase().includes(searchQuery) ||
        entry.content.toLowerCase().includes(searchQuery)
      
      // Tag filter
      const tagMatch = !tags || tags.length === 0 || 
        tags.some(tag => entry.tags.includes(tag))
      
      return textMatch && tagMatch
    })
  }
  
  /**
   * Get entries by date range
   */
  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const tx = this.db.transaction('entries', 'readonly')
    const index = tx.store.index('by-date')
    const range = IDBKeyRange.bound(startDate, endDate)
    
    const items = await index.getAll(range)
    return items.map(item => item.data)
  }
  
  /**
   * Save user data
   */
  async saveUser(user: User): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    if (!this.encryptionKey) throw new Error('Encryption key not available')
    
    const storageItem: StorageItem<string> = {
      id: user.id,
      data: this.encrypt(JSON.stringify(user)),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await this.db.put('user', storageItem)
  }
  
  /**
   * Check if user exists in storage (without requiring decryption)
   */
  async hasExistingUser(): Promise<boolean> {
    if (!this.db) return false
    
    try {
      const users = await this.db.getAll('user')
      return users.length > 0
    } catch (error) {
      console.error('Error checking for existing user:', error)
      return false
    }
  }

  /**
   * Validate user credentials without full initialization
   */
  async validateUserCredentials(email: string, password: string): Promise<{ exists: boolean; passwordValid: boolean; user?: User }> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const users = await this.db.getAll('user')
    if (!users.length) {
      return { exists: false, passwordValid: false }
    }
    
    // Try to decrypt with provided password
    const tempEncryptionKey = this.deriveEncryptionKey(password)
    const userData = users[0].data
    
    try {
      const bytes = CryptoJS.AES.decrypt(userData, tempEncryptionKey)
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
      
      // Check if decryption actually worked by validating the result
      if (!decryptedData || decryptedData.length === 0) {
        return { exists: true, passwordValid: false }
      }
      
      // Additional validation: ensure it's valid UTF-8 and JSON
      let user: User
      try {
        user = JSON.parse(decryptedData) as User
      } catch (jsonError) {
        // If JSON parsing fails, the password is likely wrong
        return { exists: true, passwordValid: false }
      }
      
      // Check if email matches
      if (!user.email || user.email.toLowerCase() !== email.toLowerCase()) {
        return { exists: true, passwordValid: false }
      }
      
      return { exists: true, passwordValid: true, user }
    } catch (error) {
      console.error('Credential validation failed:', error)
      return { exists: true, passwordValid: false }
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<User | null> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const users = await this.db.getAll('user')
    if (!users.length) return null
    
    const userData = users[0].data
    if (!userData) return null
    
    try {
      // Try to decrypt - if it fails, the data might be unencrypted (old data)
      if (!this.encryptionKey) {
        throw new Error('Master password required to access user data')
      }
      
      const decryptedData = this.decrypt(userData)
      if (!decryptedData) {
        throw new Error('Invalid master password - decryption failed')
      }
      
      return JSON.parse(decryptedData) as User
    } catch (error) {
      console.error('Failed to decrypt user data:', error)
      if (error instanceof Error) {
        throw error // Re-throw with original message
      }
      throw new Error('Invalid master password - unable to decrypt user data')
    }
  }
  
  /**
   * Save application settings
   */
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const storageItem: StorageItem = {
      id: key,
      data: value,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await this.db.put('settings', storageItem)
  }
  
  /**
   * Get application setting
   */
  async getSetting(key: string): Promise<any> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const item = await this.db.get('settings', key)
    return item?.data
  }
  
  /**
   * Export all data for backup
   */
  async exportData(): Promise<{ entries: JournalEntry[]; user: User | null; settings: Record<string, any> }> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const entries = await this.getAllEntries()
    const user = await this.getUser()
    const settingsItems = await this.db.getAll('settings')
    const settings = settingsItems.reduce((acc, item) => {
      acc[item.id] = item.data
      return acc
    }, {} as Record<string, any>)
    
    return { entries, user, settings }
  }
  
  /**
   * Clear all data (for logout/reset)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const tx = this.db.transaction(['entries', 'user', 'settings'], 'readwrite')
    await Promise.all([
      tx.objectStore('entries').clear(),
      tx.objectStore('user').clear(),
      tx.objectStore('settings').clear()
    ])
    await tx.done
    console.log('🗑️ All data cleared from storage')
  }

  /**
   * Clean up any corrupted or unencrypted data
   */
  async cleanupCorruptedData(): Promise<void> {
    if (!this.db) throw new Error('Storage not initialized')
    
    try {
      // Check if we have any unencrypted user data
      const users = await this.db.getAll('user')
      if (users.length > 0 && !this.encryptionKey) {
        console.log('🧹 Found data but no encryption key - clearing corrupted data')
        await this.clearAllData()
        return
      }
      
      // Try to decrypt existing user data only if we have an encryption key
      if (this.encryptionKey && users.length > 0) {
        for (const userItem of users) {
          try {
            if (userItem.data) {
              // Try to decrypt - if it fails, the data is corrupted
              const decryptedData = this.decrypt(userItem.data)
              JSON.parse(decryptedData) // Verify it's valid JSON
            }
          } catch (error) {
            console.log('🧹 Found corrupted user data - clearing all data')
            await this.clearAllData()
            return
          }
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
      // Only clear data if it's a critical error, not just decryption failures
      if (error instanceof Error && !error.message.includes('Malformed UTF-8')) {
        await this.clearAllData()
      }
    }
  }
  
  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{ entriesCount: number; totalSize: number }> {
    if (!this.db) throw new Error('Storage not initialized')
    
    const entries = await this.getAllEntries()
    const entriesCount = entries.length
    
    // Estimate storage size (rough calculation)
    const totalSize = entries.reduce((size, entry) => {
      return size + JSON.stringify(entry).length * 2 // UTF-16 bytes
    }, 0)
    
    return { entriesCount, totalSize }
  }

  /**
   * Sync entries from server to local storage
   */
  private async syncFromServer(): Promise<void> {
    if (!this.serverAvailable || this.syncInProgress) return
    
    this.syncInProgress = true
    
    try {
      const serverEntries = await apiClient.getEntries()
      console.log(`☁️ Fetched ${serverEntries.length} entries from server`)
      
      for (const serverEntry of serverEntries) {
        try {
          // Parse the encrypted entry data
          const encryptedEntry = JSON.parse(serverEntry.encryptedData) as JournalEntry
          
          // Check if we already have this entry locally
          const existingEntry = await this.db!.get('entries', serverEntry.id)
          
          if (!existingEntry || new Date(serverEntry.updatedAt) > existingEntry.updatedAt) {
            // Server version is newer, update local copy
            const storageItem: StorageItem<JournalEntry> = {
              id: serverEntry.id,
              data: encryptedEntry,
              createdAt: new Date(serverEntry.createdAt),
              updatedAt: new Date(serverEntry.updatedAt)
            }
            
            await this.db!.put('entries', storageItem)
            console.log(`🔄 Synced entry from server: ${serverEntry.id}`)
          }
        } catch (error) {
          console.warn(`Failed to sync entry ${serverEntry.id}:`, error)
        }
      }
    } catch (error) {
      console.warn('Failed to sync from server:', error)
      this.serverAvailable = false // Mark server as unavailable
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Register user with server sync
   */
  async registerUser(email: string, password: string, user: User): Promise<void> {
    if (!this.encryptionKey) throw new Error('Encryption key not available')
    
    // Save user locally first
    await this.saveUser(user)
    
    // Sync to server if available
    if (this.serverAvailable) {
      try {
        const passwordHash = CryptoJS.SHA256(password).toString()
        const encryptedUserData = this.encrypt(JSON.stringify(user))
        
        const authResponse = await apiClient.register(email, passwordHash, encryptedUserData)
        console.log(`☁️ User registered on server: ${authResponse.user.email}`)
        
        // Store the server user data
        const serverUser = JSON.parse(this.decrypt(authResponse.user.encryptedData)) as User
        await this.saveUser(serverUser)
      } catch (error) {
        console.warn('Failed to register user on server:', error)
        // User is still registered locally
      }
    }
  }

  /**
   * Login user with server sync
   */
  async loginUser(email: string, password: string): Promise<User> {
    const passwordHash = CryptoJS.SHA256(password).toString()
    
    // Try server login first if available
    if (this.serverAvailable) {
      try {
        const authResponse = await apiClient.login(email, passwordHash)
        console.log(`☁️ User logged in from server: ${authResponse.user.email}`)
        
        // Decrypt and save user data locally
        const serverUser = JSON.parse(this.decrypt(authResponse.user.encryptedData)) as User
        await this.saveUser(serverUser)
        
        // Sync entries from server
        await this.syncFromServer()
        
        return serverUser
      } catch (error) {
        console.warn('Server login failed, trying local login:', error)
      }
    }
    
    // Fallback to local login
    const validation = await this.validateUserCredentials(email, password)
    if (!validation.passwordValid || !validation.user) {
      throw new Error('Invalid email or password')
    }
    
    return validation.user
  }
}
