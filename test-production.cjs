#!/usr/bin/env node

/**
 * Production Test Runner
 * Runs comprehensive pre-production tests to catch critical bugs
 */

const puppeteer = require('puppeteer')
const path = require('path')

class ProductionTestRunner {
  constructor() {
    this.browser = null
    this.page = null
    this.results = []
  }

  async initialize() {
    console.log('🏭 Initializing Production Test Runner...')
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    this.page = await this.browser.newPage()
    
    // Set up error logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`❌ Browser Error: ${msg.text()}`)
      }
    })
    
    this.page.on('pageerror', error => {
      console.log(`💥 Page Error: ${error.message}`)
    })
  }

  async runAllTests() {
    console.log('🧪 Starting Production Readiness Tests...')
    
    try {
      // Find the correct port for the preview server
      const port = await this.findPreviewPort()
      const baseUrl = `http://localhost:${port}`
      
      console.log(`📱 Testing application at: ${baseUrl}`)
      
      // Run test suites
      await this.testFreshInstallFlow(baseUrl)
      await this.testExistingUserFlow(baseUrl)
      await this.testErrorRecovery(baseUrl)
      await this.testOfflineCapabilities(baseUrl)
      await this.testDataPersistence(baseUrl)
      
      this.generateReport()
      
    } catch (error) {
      console.error('💥 Production tests failed:', error)
      throw error
    }
  }

  async findPreviewPort() {
    // Try common Vite preview ports
    const ports = [4173, 5173, 3000, 8080]
    
    for (const port of ports) {
      try {
        await this.page.goto(`http://localhost:${port}`, { 
          waitUntil: 'networkidle0',
          timeout: 5000 
        })
        console.log(`✅ Found preview server on port ${port}`)
        return port
      } catch (error) {
        console.log(`❌ Port ${port} not available`)
      }
    }
    
    throw new Error('No preview server found. Run "npm run preview" first.')
  }

  async testFreshInstallFlow(baseUrl) {
    console.log('\n🆕 Testing Fresh Install Flow...')
    
    // Clear all browser data to simulate fresh install
    await this.page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
      // Clear IndexedDB
      if (window.indexedDB) {
        indexedDB.deleteDatabase('journalfor-me')
      }
    })
    
    await this.runTest('Fresh Install - App Loads', async () => {
      await this.page.goto(baseUrl, { waitUntil: 'networkidle0' })
      
      // Should show landing page for fresh install
      const title = await this.page.title()
      if (!title.includes('Journal for Me')) {
        throw new Error(`Wrong title: ${title}`)
      }
    })
    
    await this.runTest('Fresh Install - Registration Works', async () => {
      // Navigate to registration
      await this.page.click('a[href="/register"]')
      await this.page.waitForSelector('#register-form', { timeout: 5000 })
      
      // Fill registration form
      await this.page.type('#email', 'production@test.com')
      await this.page.type('#password', 'productiontest123')
      await this.page.type('#confirm-password', 'productiontest123')
      
      // Submit registration
      await this.page.click('#register-submit')
      
      // Wait for redirect to dashboard
      await this.page.waitForSelector('.dashboard', { timeout: 10000 })
      
      // Verify user is logged in
      const userMenu = await this.page.$('.user-menu')
      if (!userMenu) throw new Error('User menu not found after registration')
    })
    
    await this.runTest('Fresh Install - Entry Creation', async () => {
      // Navigate to editor
      await this.page.click('a[href="/editor"]')
      await this.page.waitForSelector('#editor-textarea', { timeout: 5000 })
      
      // Create entry
      await this.page.type('#editor-textarea', '# Production Test Entry\n\nThis entry was created during production testing.')
      
      // Save entry
      await this.page.click('#save-entry')
      
      // Wait for save confirmation
      await this.page.waitForFunction(() => {
        return document.querySelector('.save-status')?.textContent?.includes('Saved')
      }, { timeout: 5000 })
    })
  }

  async testExistingUserFlow(baseUrl) {
    console.log('\n👤 Testing Existing User Flow...')
    
    await this.runTest('Existing User - Page Refresh Persistence', async () => {
      // Refresh page to test session persistence
      await this.page.reload({ waitUntil: 'networkidle0' })
      
      // Should still be logged in
      await this.page.waitForSelector('.user-menu', { timeout: 10000 })
      
      // Verify dashboard loads
      const dashboardElements = await this.page.$$('.dashboard')
      if (dashboardElements.length === 0) {
        throw new Error('Dashboard not loaded after refresh')
      }
    })
    
    await this.runTest('Existing User - Logout and Login', async () => {
      // Logout
      await this.page.click('.logout-button')
      await this.page.waitForSelector('a[href="/login"]', { timeout: 5000 })
      
      // Login again
      await this.page.click('a[href="/login"]')
      await this.page.waitForSelector('#login-form', { timeout: 5000 })
      
      await this.page.type('#email', 'production@test.com')
      await this.page.type('#password', 'productiontest123')
      await this.page.click('#login-submit')
      
      // Should redirect to dashboard
      await this.page.waitForSelector('.dashboard', { timeout: 10000 })
    })
    
    await this.runTest('Existing User - Wrong Password Handling', async () => {
      // Logout first
      await this.page.click('.logout-button')
      await this.page.waitForSelector('a[href="/login"]', { timeout: 5000 })
      
      // Try wrong password
      await this.page.click('a[href="/login"]')
      await this.page.waitForSelector('#login-form', { timeout: 5000 })
      
      await this.page.type('#email', 'production@test.com')
      await this.page.type('#password', 'wrongpassword')
      await this.page.click('#login-submit')
      
      // Should show error and stay on login page
      await this.page.waitForSelector('.error-message', { timeout: 5000 })
      
      const errorText = await this.page.$eval('.error-message', el => el.textContent)
      if (!errorText.toLowerCase().includes('password')) {
        throw new Error('Should show password error')
      }
    })
  }

  async testErrorRecovery(baseUrl) {
    console.log('\n🔧 Testing Error Recovery...')
    
    await this.runTest('Error Recovery - Corrupted Session', async () => {
      // Login with correct credentials first
      await this.page.type('#email', 'production@test.com')
      await this.page.type('#password', 'productiontest123')
      await this.page.click('#login-submit')
      await this.page.waitForSelector('.dashboard', { timeout: 10000 })
      
      // Corrupt session data
      await this.page.evaluate(() => {
        sessionStorage.setItem('journal-session-key', 'corrupted-key')
        localStorage.setItem('journal-user-email', 'corrupted@email.com')
      })
      
      // Refresh page - should handle corruption gracefully
      await this.page.reload({ waitUntil: 'networkidle0' })
      
      // Should either show login page or recover gracefully
      const hasLoginForm = await this.page.$('#login-form')
      const hasDashboard = await this.page.$('.dashboard')
      
      if (!hasLoginForm && !hasDashboard) {
        throw new Error('App should show either login form or dashboard after corruption')
      }
    })
    
    await this.runTest('Error Recovery - Network Offline', async () => {
      // Login first if needed
      const hasDashboard = await this.page.$('.dashboard')
      if (!hasDashboard) {
        await this.page.click('a[href="/login"]')
        await this.page.waitForSelector('#login-form', { timeout: 5000 })
        await this.page.type('#email', 'production@test.com')
        await this.page.type('#password', 'productiontest123')
        await this.page.click('#login-submit')
        await this.page.waitForSelector('.dashboard', { timeout: 10000 })
      }
      
      // Simulate offline
      await this.page.setOfflineMode(true)
      
      // Try to create entry offline
      await this.page.click('a[href="/editor"]')
      await this.page.waitForSelector('#editor-textarea', { timeout: 5000 })
      
      await this.page.type('#editor-textarea', '# Offline Test\n\nThis was created offline.')
      await this.page.click('#save-entry')
      
      // Should save locally without errors
      await this.page.waitForFunction(() => {
        return document.querySelector('.save-status')?.textContent?.includes('Saved')
      }, { timeout: 5000 })
      
      // Restore online
      await this.page.setOfflineMode(false)
    })
  }

  async testOfflineCapabilities(baseUrl) {
    console.log('\n📱 Testing Offline Capabilities...')
    
    await this.runTest('Offline - App Loads When Offline', async () => {
      await this.page.setOfflineMode(true)
      
      // Refresh page while offline
      await this.page.reload({ waitUntil: 'networkidle0' })
      
      // Should still load (PWA cache)
      const title = await this.page.title()
      if (!title.includes('Journal for Me')) {
        throw new Error('App should load offline via service worker')
      }
      
      await this.page.setOfflineMode(false)
    })
  }

  async testDataPersistence(baseUrl) {
    console.log('\n💾 Testing Data Persistence...')
    
    await this.runTest('Data Persistence - Entries Survive Refresh', async () => {
      // Ensure we're logged in
      const hasDashboard = await this.page.$('.dashboard')
      if (!hasDashboard) {
        await this.page.goto(`${baseUrl}/login`)
        await this.page.waitForSelector('#login-form', { timeout: 5000 })
        await this.page.type('#email', 'production@test.com')
        await this.page.type('#password', 'productiontest123')
        await this.page.click('#login-submit')
        await this.page.waitForSelector('.dashboard', { timeout: 10000 })
      }
      
      // Check if entries exist
      await this.page.goto(`${baseUrl}/dashboard`)
      await this.page.waitForSelector('.dashboard', { timeout: 5000 })
      
      // Look for entry list or create one if none exist
      const entryElements = await this.page.$$('.entry-item')
      if (entryElements.length === 0) {
        // Create an entry first
        await this.page.click('a[href="/editor"]')
        await this.page.waitForSelector('#editor-textarea', { timeout: 5000 })
        await this.page.type('#editor-textarea', '# Persistence Test\n\nTesting data persistence.')
        await this.page.click('#save-entry')
        await this.page.waitForFunction(() => {
          return document.querySelector('.save-status')?.textContent?.includes('Saved')
        }, { timeout: 5000 })
        
        // Go back to dashboard
        await this.page.click('a[href="/dashboard"]')
        await this.page.waitForSelector('.dashboard', { timeout: 5000 })
      }
      
      // Refresh and verify entries still exist
      await this.page.reload({ waitUntil: 'networkidle0' })
      await this.page.waitForSelector('.dashboard', { timeout: 5000 })
      
      const entriesAfterRefresh = await this.page.$$('.entry-item')
      if (entriesAfterRefresh.length === 0) {
        throw new Error('Entries should persist after page refresh')
      }
    })
  }

  async runTest(testName, testFn) {
    const start = Date.now()
    
    try {
      await testFn()
      
      const result = {
        name: testName,
        passed: true,
        duration: Date.now() - start
      }
      
      this.results.push(result)
      console.log(`✅ ${testName} (${result.duration}ms)`)
      
    } catch (error) {
      const result = {
        name: testName,
        passed: false,
        error: error.message,
        duration: Date.now() - start
      }
      
      this.results.push(result)
      console.log(`❌ ${testName}: ${error.message} (${result.duration}ms)`)
    }
  }

  generateReport() {
    console.log('\n🏭 PRODUCTION READINESS REPORT')
    console.log('=====================================')
    
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    const total = this.results.length
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'
    
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📊 Success Rate: ${successRate}%`)
    
    if (failed > 0) {
      console.log('\n🔍 FAILED TESTS:')
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`   ❌ ${result.name}: ${result.error}`)
      })
    }
    
    const isProductionReady = failed === 0 && parseFloat(successRate) >= 95
    
    console.log('\n🚀 PRODUCTION READINESS:')
    if (isProductionReady) {
      console.log('   ✅ READY FOR PRODUCTION')
      console.log('   All critical tests passed. Safe to deploy.')
    } else {
      console.log('   ❌ NOT READY FOR PRODUCTION')
      console.log(`   ${failed} critical tests failed. Fix issues before deploying.`)
    }
    
    console.log('=====================================\n')
    
    // Exit with error code if tests failed
    if (failed > 0) {
      process.exit(1)
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// Main execution
async function main() {
  const runner = new ProductionTestRunner()
  
  try {
    await runner.initialize()
    await runner.runAllTests()
  } catch (error) {
    console.error('💥 Production test suite failed:', error)
    process.exit(1)
  } finally {
    await runner.cleanup()
  }
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
  console.log('\n🛑 Test runner interrupted')
  process.exit(1)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Test runner terminated')
  process.exit(1)
})

if (require.main === module) {
  main()
}
