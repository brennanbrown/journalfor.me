import { StorageManager } from '../utils/storage'
import { EntryManager } from '../utils/entries'
import { ThemeManager } from '../utils/theme'
import type { JournalEntry, User, AppState, UserPreferences } from '../types'

/**
 * Global application state manager
 */
export class AppStore {
  public storage: StorageManager
  private entryManager: EntryManager
  private themeManager: ThemeManager
  private state: AppState
  private listeners: Set<(state: AppState) => void> = new Set()
  
  constructor() {
    this.storage = new StorageManager()
    this.entryManager = new EntryManager(this.storage)
    this.themeManager = new ThemeManager()
    
    // Initialize state
    this.state = {
      user: null,
      currentEntry: null,
      entries: [],
      isLoading: false,
      isOffline: !navigator.onLine,
      lastSyncAt: null
    }
    
    // Listen for online/offline events
    window.addEventListener('online', () => this.updateState({ isOffline: false }))
    window.addEventListener('offline', () => this.updateState({ isOffline: true }))
  }
  
  /**
   * Initialize the application
   */
  async initialize(masterPassword?: string): Promise<void> {
    this.updateState({ isLoading: true })
    
    try {
      // Initialize core services
      await this.themeManager.initialize()
      await this.storage.initialize(masterPassword)
      
      // Load user and entries only if we have a password (meaning login attempt)
      if (masterPassword) {
        const user = await this.storage.getUser()
        const entries = await this.entryManager.getAllEntries()
        
        if (!user) {
          throw new Error('No user found with this password')
        }
        
        this.updateState({
          user,
          entries,
          isLoading: false,
          lastSyncAt: new Date()
        })
      } else {
        // No password provided - just basic initialization
        this.updateState({
          isLoading: false
        })
      }
      
      console.log('🚀 App initialized successfully!')
    } catch (error) {
      console.error('Failed to initialize app:', error)
      this.updateState({ isLoading: false })
      throw error
    }
  }
  
  /**
   * Create a new journal entry
   */
  async createEntry(title: string, content: string, tags: string[] = []): Promise<JournalEntry> {
    const entry = await this.entryManager.createEntry(title, content, tags)
    
    // Update state with new entry
    const entries = [entry, ...this.state.entries]
    this.updateState({ entries, currentEntry: entry })
    
    return entry
  }
  
  /**
   * Update an existing entry
   */
  async updateEntry(id: string, updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'tags' | 'isFavorite'>>): Promise<JournalEntry | null> {
    const updatedEntry = await this.entryManager.updateEntry(id, updates)
    
    if (updatedEntry) {
      // Update entries list
      const entries = this.state.entries.map(entry => 
        entry.id === id ? updatedEntry : entry
      )
      
      // Update current entry if it's the one being edited
      const currentEntry = this.state.currentEntry?.id === id ? updatedEntry : this.state.currentEntry
      
      this.updateState({ entries, currentEntry })
    }
    
    return updatedEntry
  }
  
  /**
   * Delete an entry
   */
  async deleteEntry(id: string): Promise<void> {
    await this.entryManager.deleteEntry(id)
    
    // Remove from state
    const entries = this.state.entries.filter(entry => entry.id !== id)
    const currentEntry = this.state.currentEntry?.id === id ? null : this.state.currentEntry
    
    this.updateState({ entries, currentEntry })
  }
  
  /**
   * Load a specific entry
   */
  async loadEntry(id: string): Promise<JournalEntry | null> {
    const entry = await this.entryManager.getEntry(id)
    
    if (entry) {
      this.updateState({ currentEntry: entry })
    }
    
    return entry
  }
  
  /**
   * Search entries
   */
  async searchEntries(query: string = '', tags: string[] = []): Promise<JournalEntry[]> {
    return await this.entryManager.searchEntries(query, tags)
  }
  
  /**
   * Get entries for a specific date
   */
  async getEntriesForDate(date: Date): Promise<JournalEntry[]> {
    return await this.entryManager.getEntriesForDate(date)
  }
  
  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<void> {
    const updatedEntry = await this.entryManager.toggleFavorite(id)
    
    if (updatedEntry) {
      const entries = this.state.entries.map(entry => 
        entry.id === id ? updatedEntry : entry
      )
      
      const currentEntry = this.state.currentEntry?.id === id ? updatedEntry : this.state.currentEntry
      
      this.updateState({ entries, currentEntry })
    }
  }
  
  /**
   * Get writing statistics
   */
  async getWritingStats() {
    return await this.entryManager.getWritingStats()
  }

  /**
   * Get statistics (alias for getWritingStats for test compatibility)
   */
  async getStatistics() {
    return await this.getWritingStats()
  }
  
  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    return await this.entryManager.getAllTags()
  }
  
  /**
   * Create a new user
   */
  async createUser(email: string, masterPassword: string): Promise<User> {
    // Check if user already exists
    try {
      const existingUser = await this.storage.getUser()
      if (existingUser && existingUser.email === email) {
        throw new Error('User with this email already exists. Please login instead.')
      }
    } catch (error) {
      // If error accessing user data, it's fine - probably no existing user
    }
    
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      createdAt: new Date(),
      preferences: {
        theme: 'system',
        fontSize: 'medium',
        lineHeight: 'normal',
        fontFamily: 'system',
        autoSave: true,
        showWordCount: true,
        enableAnimations: true,
        dailyWordTarget: 250
      }
    }
    
    // First, re-initialize storage with the new password to set encryption key
    await this.storage.initialize(masterPassword)
    
    // Register user with server sync
    await this.storage.registerUser(email, masterPassword, user)
    this.updateState({ user })
    
    return user
  }
  
  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.state.user) {
      throw new Error('No user logged in')
    }

    const updatedUser = {
      ...this.state.user,
      preferences: {
        ...this.state.user.preferences,
        ...preferences
      }
    }

    // Save to storage
    await this.storage.saveUser(updatedUser)
    
    // Update state
    this.updateState({ user: updatedUser })
  }

  /**
   * Clear current entry
   */
  clearCurrentEntry(): void {
    this.updateState({ currentEntry: null })
  }
  
  /**
   * Get current application state
   */
  getState(): AppState {
    return { ...this.state }
  }
  
  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates }
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.state)
      } catch (error) {
        console.error('Error in state listener:', error)
      }
    })
  }
  
  /**
   * Get storage manager (for advanced operations)
   */
  getStorageManager(): StorageManager {
    return this.storage
  }
  
  /**
   * Get theme manager
   */
  getThemeManager(): ThemeManager {
    return this.themeManager
  }
  
  /**
   * Export all data
   */
  async exportData() {
    return await this.storage.exportData()
  }
  
  /**
   * Clear all data
   */
  async clearAllData(): Promise<void> {
    await this.storage.clearAllData()
    this.updateState({
      user: null,
      currentEntry: null,
      entries: [],
      lastSyncAt: null
    })
  }
}

// Global app store instance
export const appStore = new AppStore()
