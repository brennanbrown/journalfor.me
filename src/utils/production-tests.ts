/**
 * Production-readiness test suite
 * Tests critical user flows and edge cases that must work in production
 */

import { StorageManager } from './storage'
import { AppStore } from '../stores/AppStore'

interface ProductionTestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

interface ProductionTestSuite {
  name: string
  results: ProductionTestResult[]
  passed: number
  failed: number
  duration: number
}

export class ProductionTestRunner {
  private results: ProductionTestSuite[] = []
  private storage: StorageManager
  private appStore: AppStore

  constructor() {
    this.storage = new StorageManager()
    this.appStore = new AppStore()
  }

  /**
   * Run all production-readiness tests
   */
  async runAllTests(): Promise<void> {
    console.log('🏭 Starting Production Readiness Test Suite...')
    const overallStart = Date.now()

    try {
      // Critical flow tests
      await this.runFreshInstallTests()
      await this.runExistingUserTests()
      await this.runDataCorruptionTests()
      await this.runNetworkFailureTests()
      await this.runStorageQuotaTests()
      await this.runConcurrencyTests()
      
      // Generate comprehensive report
      this.generateProductionReport()
      
    } catch (error) {
      console.error('💥 Production test suite failed:', error)
    }

    console.log(`⏱️ Total test duration: ${Date.now() - overallStart}ms`)
  }

  /**
   * Test fresh installation scenarios
   */
  private async runFreshInstallTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Fresh Install Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Clear all data to simulate fresh install
    await this.clearAllBrowserData()

    // Test 1: Storage initialization on fresh install
    await this.runProductionTest(suite, 'Fresh Storage Initialization', async () => {
      const storage = new StorageManager()
      await storage.initialize() // Should not throw error
      
      // Verify no user exists
      const hasUser = await storage.hasExistingUser()
      if (hasUser) throw new Error('Fresh install should not have existing user')
    })

    // Test 2: First user registration flow
    await this.runProductionTest(suite, 'First User Registration', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      
      // Create first user
      await appStore.createUser('fresh@test.com', 'password123')
      
      // Verify user was created
      const state = appStore.getState()
      if (!state.hasUser) throw new Error('User should be created')
      if (state.userEmail !== 'fresh@test.com') throw new Error('User email mismatch')
    })

    // Test 3: App state after fresh registration
    await this.runProductionTest(suite, 'Post-Registration App State', async () => {
      // Simulate page refresh after registration
      const newAppStore = new AppStore()
      await newAppStore.initialize()
      
      const state = newAppStore.getState()
      if (!state.hasUser) throw new Error('User state should persist after refresh')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Test existing user scenarios
   */
  private async runExistingUserTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Existing User Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Storage initialization with existing user (no password)
    await this.runProductionTest(suite, 'Existing User Storage Init (No Password)', async () => {
      const storage = new StorageManager()
      // Should not throw error - this was the production bug
      await storage.initialize()
      
      // Should detect existing user
      const hasUser = await storage.hasExistingUser()
      if (!hasUser) throw new Error('Should detect existing user')
    })

    // Test 2: Login with correct credentials
    await this.runProductionTest(suite, 'Valid Login Flow', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      
      const success = await appStore.login('fresh@test.com', 'password123')
      if (!success) throw new Error('Login should succeed with correct credentials')
      
      const state = appStore.getState()
      if (!state.hasUser) throw new Error('User should be logged in')
    })

    // Test 3: Login with incorrect credentials
    await this.runProductionTest(suite, 'Invalid Login Handling', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      
      const success = await appStore.login('fresh@test.com', 'wrongpassword')
      if (success) throw new Error('Login should fail with incorrect credentials')
      
      const state = appStore.getState()
      if (state.hasUser) throw new Error('User should not be logged in after failed login')
    })

    // Test 4: Session persistence
    await this.runProductionTest(suite, 'Session Persistence', async () => {
      // Login first
      const appStore1 = new AppStore()
      await appStore1.initialize()
      await appStore1.login('fresh@test.com', 'password123')
      
      // Simulate page refresh with new app instance
      const appStore2 = new AppStore()
      await appStore2.initialize()
      
      const state = appStore2.getState()
      if (!state.hasUser) throw new Error('Session should persist across page refreshes')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Test data corruption and recovery scenarios
   */
  private async runDataCorruptionTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Data Corruption Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Corrupted session data recovery
    await this.runProductionTest(suite, 'Corrupted Session Recovery', async () => {
      // Corrupt session data
      sessionStorage.setItem('journal-session-key', 'invalid-corrupted-key')
      localStorage.setItem('journal-user-email', 'corrupted@test.com')
      
      const appStore = new AppStore()
      await appStore.initialize() // Should not crash
      
      const state = appStore.getState()
      if (state.hasUser) throw new Error('Corrupted session should not result in logged-in state')
    })

    // Test 2: Invalid IndexedDB data handling
    await this.runProductionTest(suite, 'Invalid IndexedDB Data', async () => {
      // Create storage with valid data first
      const storage = new StorageManager()
      await storage.initialize('password123')
      
      // Now try to access with wrong password
      const storage2 = new StorageManager()
      await storage2.initialize('wrongpassword')
      
      // Should handle gracefully without crashing
      const hasUser = await storage2.hasExistingUser()
      if (!hasUser) throw new Error('Should still detect user exists even with wrong password')
    })

    // Test 3: Mixed encrypted/unencrypted data
    await this.runProductionTest(suite, 'Mixed Data States', async () => {
      const storage = new StorageManager()
      await storage.initialize()
      
      // This should handle mixed states gracefully
      await storage.cleanupCorruptedData()
      
      // Verify storage is still functional
      await storage.initialize('newpassword123')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Test network failure scenarios
   */
  private async runNetworkFailureTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Network Failure Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Offline app initialization
    await this.runProductionTest(suite, 'Offline App Initialization', async () => {
      // Simulate offline state
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false })
      
      const appStore = new AppStore()
      await appStore.initialize() // Should work offline
      
      const state = appStore.getState()
      if (!state.isOffline) throw new Error('App should detect offline state')
      
      // Restore online state
      Object.defineProperty(navigator, 'onLine', { writable: true, value: true })
    })

    // Test 2: Entry creation while offline
    await this.runProductionTest(suite, 'Offline Entry Creation', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      await appStore.login('fresh@test.com', 'password123')
      
      // Simulate offline
      Object.defineProperty(navigator, 'onLine', { writable: true, value: false })
      
      // Create entry offline
      await appStore.createEntry({
        id: 'offline-test',
        title: 'Offline Test Entry',
        content: 'This was created offline',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['offline'],
        isEncrypted: true
      })
      
      // Verify entry was saved locally
      const entries = await appStore.getAllEntries()
      const offlineEntry = entries.find(e => e.id === 'offline-test')
      if (!offlineEntry) throw new Error('Offline entry should be saved locally')
      
      // Restore online state
      Object.defineProperty(navigator, 'onLine', { writable: true, value: true })
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Test storage quota and limits
   */
  private async runStorageQuotaTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Storage Quota Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Large entry handling
    await this.runProductionTest(suite, 'Large Entry Storage', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      await appStore.login('fresh@test.com', 'password123')
      
      // Create a large entry (1MB of text)
      const largeContent = 'A'.repeat(1024 * 1024)
      
      await appStore.createEntry({
        id: 'large-test',
        title: 'Large Test Entry',
        content: largeContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['large'],
        isEncrypted: true
      })
      
      // Verify it was saved and can be retrieved
      const entry = await appStore.getEntry('large-test')
      if (!entry) throw new Error('Large entry should be saved')
      if (entry.content !== largeContent) throw new Error('Large entry content should match')
    })

    // Test 2: Storage statistics accuracy
    await this.runProductionTest(suite, 'Storage Statistics', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      await appStore.login('fresh@test.com', 'password123')
      
      const stats = await appStore.getStatistics()
      if (typeof stats.entriesCount !== 'number') throw new Error('Entry count should be a number')
      if (typeof stats.totalWords !== 'number') throw new Error('Word count should be a number')
      if (stats.entriesCount < 0) throw new Error('Entry count should not be negative')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Test concurrent operations
   */
  private async runConcurrencyTests(): Promise<void> {
    const suite: ProductionTestSuite = {
      name: 'Concurrency Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Concurrent entry creation
    await this.runProductionTest(suite, 'Concurrent Entry Creation', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      await appStore.login('fresh@test.com', 'password123')
      
      // Create multiple entries concurrently
      const promises = Array.from({ length: 5 }, (_, i) => 
        appStore.createEntry({
          id: `concurrent-${i}`,
          title: `Concurrent Entry ${i}`,
          content: `Content for entry ${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['concurrent'],
          isEncrypted: true
        })
      )
      
      await Promise.all(promises)
      
      // Verify all entries were created
      const entries = await appStore.getAllEntries()
      const concurrentEntries = entries.filter(e => e.tags.includes('concurrent'))
      if (concurrentEntries.length !== 5) throw new Error('All concurrent entries should be created')
    })

    // Test 2: Concurrent read/write operations
    await this.runProductionTest(suite, 'Concurrent Read/Write', async () => {
      const appStore = new AppStore()
      await appStore.initialize()
      await appStore.login('fresh@test.com', 'password123')
      
      // Perform concurrent reads and writes
      const writePromise = appStore.createEntry({
        id: 'rw-test',
        title: 'Read/Write Test',
        content: 'Testing concurrent operations',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['rw-test'],
        isEncrypted: true
      })
      
      const readPromise = appStore.getAllEntries()
      
      const [, entries] = await Promise.all([writePromise, readPromise])
      
      // Should complete without errors
      if (!Array.isArray(entries)) throw new Error('Read operation should return array')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Run a single production test
   */
  private async runProductionTest(
    suite: ProductionTestSuite,
    testName: string,
    testFn: () => Promise<void>
  ): Promise<void> {
    const start = Date.now()
    
    try {
      await testFn()
      
      const result: ProductionTestResult = {
        name: testName,
        passed: true,
        duration: Date.now() - start
      }
      
      suite.results.push(result)
      suite.passed++
      console.log(`✅ ${testName}`)
      
    } catch (error) {
      const result: ProductionTestResult = {
        name: testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - start
      }
      
      suite.results.push(result)
      suite.failed++
      console.log(`❌ ${testName}: ${result.error}`)
    }
  }

  /**
   * Clear all browser data to simulate fresh install
   */
  private async clearAllBrowserData(): Promise<void> {
    // Clear IndexedDB
    if (this.storage) {
      try {
        await this.storage.clearAllData()
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
    
    // Clear localStorage and sessionStorage
    localStorage.clear()
    sessionStorage.clear()
    
    console.log('🧹 Browser data cleared for fresh install simulation')
  }

  /**
   * Generate comprehensive production readiness report
   */
  private generateProductionReport(): void {
    console.log('\n🏭 PRODUCTION READINESS REPORT')
    console.log('=====================================')
    
    let totalPassed = 0
    let totalFailed = 0
    let totalDuration = 0
    
    this.results.forEach(suite => {
      totalPassed += suite.passed
      totalFailed += suite.failed
      totalDuration += suite.duration
      
      const successRate = suite.results.length > 0 
        ? ((suite.passed / suite.results.length) * 100).toFixed(1)
        : '0.0'
      
      console.log(`\n📋 ${suite.name}`)
      console.log(`   ✅ Passed: ${suite.passed}`)
      console.log(`   ❌ Failed: ${suite.failed}`)
      console.log(`   📊 Success Rate: ${successRate}%`)
      console.log(`   ⏱️  Duration: ${suite.duration}ms`)
      
      // Show failed tests
      suite.results.filter(r => !r.passed).forEach(result => {
        console.log(`   🔍 Failed: ${result.name} - ${result.error}`)
      })
    })
    
    const overallSuccessRate = (totalPassed + totalFailed) > 0 
      ? ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)
      : '0.0'
    
    console.log('\n🎯 OVERALL RESULTS')
    console.log(`   ✅ Total Passed: ${totalPassed}`)
    console.log(`   ❌ Total Failed: ${totalFailed}`)
    console.log(`   📊 Overall Success Rate: ${overallSuccessRate}%`)
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`)
    
    // Production readiness assessment
    const isProductionReady = totalFailed === 0 && parseFloat(overallSuccessRate) >= 95
    
    console.log('\n🚀 PRODUCTION READINESS ASSESSMENT')
    if (isProductionReady) {
      console.log('   ✅ READY FOR PRODUCTION')
      console.log('   All critical tests passed. Safe to deploy.')
    } else {
      console.log('   ❌ NOT READY FOR PRODUCTION')
      console.log(`   ${totalFailed} critical tests failed. Fix issues before deploying.`)
    }
    
    console.log('\n=====================================')
  }
}

// Export for use in test runner
export const productionTestRunner = new ProductionTestRunner()
