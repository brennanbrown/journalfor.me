import { StorageManager } from './storage'
import type { JournalEntry } from '../types'

/**
 * Journal Entry Manager - High-level API for managing entries
 */
export class EntryManager {
  private storage: StorageManager
  
  constructor(storage: StorageManager) {
    this.storage = storage
  }
  
  /**
   * Create a new journal entry
   */
  async createEntry(title: string, content: string, tags: string[] = []): Promise<JournalEntry> {
    const now = new Date()
    const entry: JournalEntry = {
      id: this.generateId(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      tags: tags.map(tag => tag.trim().toLowerCase()).filter(Boolean),
      isFavorite: false,
      wordCount: this.countWords(content),
      isEncrypted: false // Will be set by storage layer
    }
    
    await this.storage.saveEntry(entry)
    console.log(`✍️ Created new entry: "${entry.title}"`)
    return entry
  }
  
  /**
   * Update an existing journal entry
   */
  async updateEntry(id: string, updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'tags' | 'isFavorite'>>): Promise<JournalEntry | null> {
    const existingEntry = await this.storage.getEntry(id)
    if (!existingEntry) {
      throw new Error(`Entry with id ${id} not found`)
    }
    
    const updatedEntry: JournalEntry = {
      ...existingEntry,
      ...updates,
      updatedAt: new Date(),
      wordCount: updates.content ? this.countWords(updates.content) : existingEntry.wordCount,
      tags: updates.tags ? updates.tags.map(tag => tag.trim().toLowerCase()).filter(Boolean) : existingEntry.tags
    }
    
    await this.storage.saveEntry(updatedEntry)
    console.log(`📝 Updated entry: "${updatedEntry.title}"`)
    return updatedEntry
  }
  
  /**
   * Get a single entry by ID
   */
  async getEntry(id: string): Promise<JournalEntry | null> {
    return await this.storage.getEntry(id)
  }
  
  /**
   * Get all entries
   */
  async getAllEntries(): Promise<JournalEntry[]> {
    return await this.storage.getAllEntries()
  }
  
  /**
   * Delete an entry
   */
  async deleteEntry(id: string): Promise<void> {
    const entry = await this.storage.getEntry(id)
    if (entry) {
      await this.storage.deleteEntry(id)
      console.log(`🗑️ Deleted entry: "${entry.title}"`)
    }
  }
  
  /**
   * Search entries by query and tags
   */
  async searchEntries(query: string = '', tags: string[] = []): Promise<JournalEntry[]> {
    return await this.storage.searchEntries(query, tags)
  }
  
  /**
   * Get entries by date range
   */
  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    return await this.storage.getEntriesByDateRange(startDate, endDate)
  }
  
  /**
   * Get entries for a specific date
   */
  async getEntriesForDate(date: Date): Promise<JournalEntry[]> {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    return await this.getEntriesByDateRange(startOfDay, endOfDay)
  }
  
  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<JournalEntry | null> {
    const entry = await this.storage.getEntry(id)
    if (!entry) return null
    
    return await this.updateEntry(id, { isFavorite: !entry.isFavorite })
  }
  
  /**
   * Get writing statistics
   */
  async getWritingStats(): Promise<{
    totalEntries: number
    totalWords: number
    averageWordsPerEntry: number
    currentStreak: number
    longestStreak: number
    entriesThisWeek: number
    entriesThisMonth: number
  }> {
    const entries = await this.getAllEntries()
    const totalEntries = entries.length
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0)
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
    
    // Calculate streaks
    const sortedDates = entries
      .map(entry => this.getDateOnly(new Date(entry.createdAt)))
      .sort((a, b) => b.getTime() - a.getTime())
    
    const uniqueDates = Array.from(new Set(sortedDates.map(date => date.getTime())))
      .map(time => new Date(time))
      .sort((a, b) => b.getTime() - a.getTime())
    
    const { currentStreak, longestStreak } = this.calculateStreaks(uniqueDates)
    
    // This week/month counts
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const entriesThisWeek = entries.filter(entry => new Date(entry.createdAt) >= weekAgo).length
    const entriesThisMonth = entries.filter(entry => new Date(entry.createdAt) >= monthAgo).length
    
    return {
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      currentStreak,
      longestStreak,
      entriesThisWeek,
      entriesThisMonth
    }
  }
  
  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const entries = await this.getAllEntries()
    const allTags = entries.flatMap(entry => entry.tags)
    return Array.from(new Set(allTags)).sort()
  }
  
  /**
   * Generate a unique ID for entries
   */
  private generateId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Count words in text
   */
  private countWords(text: string): number {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).length
  }
  
  /**
   * Get date without time
   */
  private getDateOnly(date: Date): Date {
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    return dateOnly
  }
  
  /**
   * Calculate writing streaks
   */
  private calculateStreaks(sortedDates: Date[]): { currentStreak: number; longestStreak: number } {
    if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 }
    
    const today = this.getDateOnly(new Date())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    let currentStreak = 0
    let longestStreak = 0
    let currentCount = 0
    
    // Check if there's an entry for today or yesterday to start current streak
    const hasRecentEntry = sortedDates.some(date => 
      date.getTime() === today.getTime() || date.getTime() === yesterday.getTime()
    )
    
    if (hasRecentEntry) {
      let checkDate = today
      for (const entryDate of sortedDates) {
        if (entryDate.getTime() === checkDate.getTime()) {
          currentStreak++
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000)
        } else if (entryDate.getTime() < checkDate.getTime()) {
          break
        }
      }
    }
    
    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      currentCount = 1
      for (let j = i + 1; j < sortedDates.length; j++) {
        const daysDiff = Math.floor((sortedDates[j - 1].getTime() - sortedDates[j].getTime()) / (24 * 60 * 60 * 1000))
        if (daysDiff === 1) {
          currentCount++
        } else {
          break
        }
      }
      longestStreak = Math.max(longestStreak, currentCount)
    }
    
    return { currentStreak, longestStreak }
  }
}
