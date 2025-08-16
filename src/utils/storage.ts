import { openDB, DBSchema, IDBPDatabase } from 'idb'
import CryptoJS from 'crypto-js'
import type { JournalEntry, User, StorageItem } from '../types'

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
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption failed:', error)
      return encryptedText
    }
  }
  
  /**
   * Save a journal entry with encryption
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
    
    await this.db.put('entries', storageItem)
    console.log(`💾 Entry saved: ${entry.title} (${entry.isEncrypted ? 'encrypted' : 'plain'})`)
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
   * Get all journal entries with decryption
   */
  async getAllEntries(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Storage not initialized')
    
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
      
      if (!decryptedData) {
        return { exists: true, passwordValid: false }
      }
      
      const user = JSON.parse(decryptedData) as User
      
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
      
      // Try to decrypt existing user data
      for (const userItem of users) {
        try {
          if (this.encryptionKey && userItem.data) {
            // userItem.data is now properly typed as string (encrypted JSON)
            const decryptedData = this.decrypt(userItem.data)
            JSON.parse(decryptedData) // Verify it's valid JSON
          }
        } catch (error) {
          console.log('🧹 Found corrupted user data - clearing all data')
          await this.clearAllData()
          return
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
      // If there are any issues, clear everything to start fresh
      await this.clearAllData()
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
}
