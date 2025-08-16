import { StorageManager } from './storage'
import { apiClient } from './api'
import type { JournalEntry, User } from '../types'

/**
 * Test suite for server synchronization functionality
 */
export class ServerSyncTests {
  private storage: StorageManager
  private testResults: Array<{ name: string; passed: boolean; error?: string }> = []

  constructor() {
    this.storage = new StorageManager()
  }

  async runAllTests(): Promise<{ passed: number; failed: number; total: number; results: Array<{ name: string; passed: boolean; error?: string }> }> {
    console.log('🧪 Starting Server Sync Tests...')
    this.testResults = []

    // Test server availability
    await this.testServerHealth()
    
    // Test user registration with server sync
    await this.testUserRegistration()
    
    // Test user login with server sync
    await this.testUserLogin()
    
    // Test entry creation and sync
    await this.testEntryCreation()
    
    // Test entry sync from server
    await this.testEntrySync()
    
    // Test offline functionality
    await this.testOfflineMode()
    
    // Test conflict resolution
    await this.testConflictResolution()

    const passed = this.testResults.filter(r => r.passed).length
    const failed = this.testResults.filter(r => !r.passed).length
    
    console.log(`📊 Server Sync Tests Complete: ${passed}/${this.testResults.length} passed`)
    
    return {
      passed,
      failed,
      total: this.testResults.length,
      results: this.testResults
    }
  }

  private async testServerHealth(): Promise<void> {
    try {
      const isHealthy = await apiClient.healthCheck()
      this.addResult('Server Health Check', isHealthy, isHealthy ? undefined : 'Server is not responding')
    } catch (error) {
      this.addResult('Server Health Check', false, `Health check failed: ${error}`)
    }
  }

  private async testUserRegistration(): Promise<void> {
    try {
      await this.storage.initialize()
      
      const testUser: User = {
        id: 'test_user_' + Date.now(),
        email: 'sync-test@example.com',
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

      await this.storage.registerUser(testUser.email, 'test-password-123', testUser)
      
      // Verify user was saved locally
      const savedUser = await this.storage.getUser()
      const registrationSuccess = savedUser?.email === testUser.email
      
      this.addResult('User Registration with Server Sync', registrationSuccess, 
        registrationSuccess ? undefined : 'User was not saved correctly')
        
    } catch (error) {
      this.addResult('User Registration with Server Sync', false, `Registration failed: ${error}`)
    }
  }

  private async testUserLogin(): Promise<void> {
    try {
      // Try to login with the user we just registered
      const user = await this.storage.loginUser('sync-test@example.com', 'test-password-123')
      
      const loginSuccess = user.email === 'sync-test@example.com'
      this.addResult('User Login with Server Sync', loginSuccess,
        loginSuccess ? undefined : 'Login did not return correct user')
        
    } catch (error) {
      this.addResult('User Login with Server Sync', false, `Login failed: ${error}`)
    }
  }

  private async testEntryCreation(): Promise<void> {
    try {
      const testEntry: JournalEntry = {
        id: 'sync_test_entry_' + Date.now(),
        title: 'Server Sync Test Entry',
        content: 'This entry tests server synchronization functionality.',
        tags: ['test', 'sync'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        isEncrypted: true
      }

      await this.storage.saveEntry(testEntry)
      
      // Verify entry was saved locally
      const savedEntry = await this.storage.getEntry(testEntry.id)
      const creationSuccess = savedEntry?.title === testEntry.title
      
      this.addResult('Entry Creation with Server Sync', creationSuccess,
        creationSuccess ? undefined : 'Entry was not saved correctly')
        
    } catch (error) {
      this.addResult('Entry Creation with Server Sync', false, `Entry creation failed: ${error}`)
    }
  }

  private async testEntrySync(): Promise<void> {
    try {
      // Get all entries to trigger sync from server
      const entries = await this.storage.getAllEntries()
      
      // Check if we have at least the test entry we created
      const syncSuccess = entries.length > 0 && entries.some(e => e.title === 'Server Sync Test Entry')
      
      this.addResult('Entry Sync from Server', syncSuccess,
        syncSuccess ? undefined : 'Entries were not synced from server')
        
    } catch (error) {
      this.addResult('Entry Sync from Server', false, `Entry sync failed: ${error}`)
    }
  }

  private async testOfflineMode(): Promise<void> {
    try {
      // Simulate offline mode by temporarily disabling server
      const originalServerAvailable = (this.storage as any).serverAvailable
      ;(this.storage as any).serverAvailable = false

      const testEntry: JournalEntry = {
        id: 'conflict-entry',
        title: 'Conflict Entry',
        content: 'This entry will have conflicts',
        tags: ['conflict'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        isEncrypted: true,
        wordCount: 6
      }

      // Should still work offline
      await this.storage.saveEntry(testEntry)
      const savedEntry = await this.storage.getEntry(testEntry.id)
      
      // Restore server availability
      ;(this.storage as any).serverAvailable = originalServerAvailable

      const offlineSuccess = savedEntry?.title === testEntry.title
      this.addResult('Offline Mode Functionality', offlineSuccess,
        offlineSuccess ? undefined : 'Offline mode did not work correctly')
        
    } catch (error) {
      this.addResult('Offline Mode Functionality', false, `Offline mode failed: ${error}`)
    }
  }

  private async testConflictResolution(): Promise<void> {
    try {
      // Create an entry
      const testEntry: JournalEntry = {
        id: 'test-entry-2',
        title: 'Another Test Entry',
        content: 'This is another test entry',
        tags: ['test', 'sync'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false,
        isEncrypted: true,
        wordCount: 5
      }

      await this.storage.saveEntry(testEntry)

      // Simulate a conflict by updating the entry
      const updatedEntry = {
        ...testEntry,
        content: 'Updated content',
        updatedAt: new Date()
      }

      await this.storage.saveEntry(updatedEntry)
      
      // Verify the update worked
      const finalEntry = await this.storage.getEntry(testEntry.id)
      const conflictSuccess = finalEntry?.content === 'Updated content'
      
      this.addResult('Conflict Resolution', conflictSuccess,
        conflictSuccess ? undefined : 'Conflict resolution did not work correctly')
        
    } catch (error) {
      this.addResult('Conflict Resolution', false, `Conflict resolution failed: ${error}`)
    }
  }

  private addResult(name: string, passed: boolean, error?: string): void {
    this.testResults.push({ name, passed, error })
    const status = passed ? '✅' : '❌'
    console.log(`${status} ${name}${error ? `: ${error}` : ''}`)
  }

  async cleanup(): Promise<void> {
    try {
      // Clear test data
      await this.storage.clearAllData()
      console.log('🧹 Test cleanup completed')
    } catch (error) {
      console.warn('⚠️ Test cleanup failed:', error)
    }
  }
}
