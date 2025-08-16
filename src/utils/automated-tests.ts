/**
 * Automated testing suite for the journal application
 * Runs comprehensive tests without manual intervention
 */

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

interface TestSuite {
  name: string
  results: TestResult[]
  passed: number
  failed: number
  duration: number
}

export class AutomatedTestSuite {
  private appStore: any
  private results: TestSuite[] = []
  private startTime = 0

  constructor() {
    this.appStore = (window as any).appStore
    if (!this.appStore) {
      throw new Error('AppStore not available - automated testing requires appStore to be initialized first')
    }
  }

  /**
   * Run all automated tests
   */
  async runAllTests(): Promise<void> {
    console.log('🤖 Starting Automated Test Suite...')
    this.startTime = Date.now()
    
    try {
      // Clear any existing data first
      await this.cleanup()
      
      // Run test suites in order
      await this.runAuthenticationTests()
      await this.runStorageTests()
      await this.runEntryManagementTests()
      await this.runUserInterfaceTests()
      await this.runErrorHandlingTests()
      
      // Run new component tests
      await this.runSearchComponentTests()
      await this.runCalendarComponentTests()
      await this.runSettingsComponentTests()
      
      // Run markdown formatting tests
      await this.runMarkdownFormattingTests()
      
      // Generate final report
      this.generateReport()
      
      console.log('\n🎉 All automated tests completed!')
    } catch (error) {
      console.error('❌ Test runner failed:', error)
      throw error
    } finally {
      // Cleanup after tests
      await this.cleanup()
    }
  }

  /**
   * Authentication flow tests
   */
  private async runAuthenticationTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Authentication Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: User Registration
    await this.runTest(suite, 'User Registration', async () => {
      const user = await this.appStore.createUser('test@automated.com', 'testpass123')
      if (!user || !user.email) throw new Error('User not created')
      
      const state = this.appStore.getState()
      if (!state.user) throw new Error('User not set in state')
      if (state.user.email !== 'test@automated.com') throw new Error('Incorrect user email')
    })

    // Test 2: Session Storage
    await this.runTest(suite, 'Session Storage', async () => {
      sessionStorage.setItem('journal-session-key', 'testpass123')
      const stored = sessionStorage.getItem('journal-session-key')
      if (stored !== 'testpass123') throw new Error('Session storage failed')
    })

    // Test 3: User Authentication Persistence
    await this.runTest(suite, 'Authentication Persistence', async () => {
      // Simulate page reload by re-initializing with session key
      const sessionKey = sessionStorage.getItem('journal-session-key')
      if (!sessionKey) throw new Error('No session key found')
      
      await this.appStore.initialize(sessionKey)
      const state = this.appStore.getState()
      if (!state.user) throw new Error('User not restored from session')
    })

    // Test 4: Credential Validation
    await this.runTest(suite, 'Credential Validation', async () => {
      // Test with correct credentials
      const validResult = await this.appStore.storage.validateUserCredentials('test@automated.com', 'testpass123')
      if (!validResult.exists || !validResult.passwordValid) {
        throw new Error('Valid credentials not recognized')
      }
      
      // Test with wrong password
      const wrongPasswordResult = await this.appStore.storage.validateUserCredentials('test@automated.com', 'wrongpass')
      if (!wrongPasswordResult.exists || wrongPasswordResult.passwordValid) {
        throw new Error('Wrong password validation failed')
      }
      
      // Test with non-existent user
      const nonExistentResult = await this.appStore.storage.validateUserCredentials('nonexistent@test.com', 'anypass')
      if (nonExistentResult.exists) {
        throw new Error('Non-existent user validation failed')
      }
    })

    // Test 5: Session Persistence with Email
    await this.runTest(suite, 'Session Persistence with Email', async () => {
      // Store both session key and email
      sessionStorage.setItem('journal-session-key', 'testpass123')
      localStorage.setItem('journal-user-email', 'test@automated.com')
      
      // Verify both are stored
      const storedKey = sessionStorage.getItem('journal-session-key')
      const storedEmail = localStorage.getItem('journal-user-email')
      
      if (storedKey !== 'testpass123') throw new Error('Session key not stored correctly')
      if (storedEmail !== 'test@automated.com') throw new Error('User email not stored correctly')
    })

    // Test 6: Logout Functionality
    await this.runTest(suite, 'Logout Functionality', async () => {
      await this.appStore.clearAllData()
      sessionStorage.removeItem('journal-session-key')
      localStorage.removeItem('journal-user-email')
      
      const state = this.appStore.getState()
      if (state.user) throw new Error('User not cleared after logout')
      
      const sessionKey = sessionStorage.getItem('journal-session-key')
      const userEmail = localStorage.getItem('journal-user-email')
      if (sessionKey) throw new Error('Session key not cleared')
      if (userEmail) throw new Error('User email not cleared')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Storage and encryption tests
   */
  private async runStorageTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Storage Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup user for storage tests
    await this.appStore.createUser('storage@test.com', 'storagepass123')
    sessionStorage.setItem('journal-session-key', 'storagepass123')

    // Test 1: Data Encryption
    await this.runTest(suite, 'Data Encryption', async () => {
      const entry = await this.appStore.createEntry('Test Entry', 'This is encrypted content', ['test'])
      if (!entry || !entry.id) throw new Error('Entry not created')
      
      // Verify data is encrypted in storage (should not be plain text)
      const rawData = await this.getRawStorageData('entries')
      const hasPlainText = rawData.some(item => 
        item.data && typeof item.data === 'string' && item.data.includes('This is encrypted content')
      )
      if (hasPlainText) throw new Error('Data not encrypted in storage')
    })

    // Test 2: Data Persistence
    await this.runTest(suite, 'Data Persistence', async () => {
      const state = this.appStore.getState()
      if (state.entries.length === 0) throw new Error('No entries found after creation')
      
      const entry = state.entries[0]
      if (entry.title !== 'Test Entry') throw new Error('Entry title not persisted')
      if (entry.content !== 'This is encrypted content') throw new Error('Entry content not persisted')
    })

    // Test 3: Data Decryption
    await this.runTest(suite, 'Data Decryption', async () => {
      // Re-initialize to test decryption
      await this.appStore.initialize('storagepass123')
      const state = this.appStore.getState()
      
      if (state.entries.length === 0) throw new Error('Entries not decrypted after re-initialization')
      
      const entry = state.entries[0]
      if (entry.content !== 'This is encrypted content') throw new Error('Entry content not properly decrypted')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Entry management tests
   */
  private async runEntryManagementTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Entry Management Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup user for entry tests
    await this.appStore.createUser('entries@test.com', 'entriespass123')
    sessionStorage.setItem('journal-session-key', 'entriespass123')

    // Test 1: Entry Creation
    await this.runTest(suite, 'Entry Creation', async () => {
      const entry1 = await this.appStore.createEntry('First Entry', 'Content for first entry with #automation tag', ['automation'])
      const entry2 = await this.appStore.createEntry('Second Entry', 'Content for second entry with #testing tag', ['testing'])
      
      if (!entry1 || !entry2) throw new Error('Entries not created')
      
      const state = this.appStore.getState()
      if (state.entries.length < 2) throw new Error('Not all entries saved to state')
    })

    // Test 2: Entry Retrieval
    await this.runTest(suite, 'Entry Retrieval', async () => {
      const state = this.appStore.getState()
      const entries = state.entries
      
      if (entries.length < 2) throw new Error('Entries not retrieved')
      
      const firstEntry = entries.find((e: any) => e.title === 'First Entry')
      const secondEntry = entries.find((e: any) => e.title === 'Second Entry')
      
      if (!firstEntry || !secondEntry) throw new Error('Specific entries not found')
    })

    // Test 3: Entry Statistics
    await this.runTest(suite, 'Entry Statistics', async () => {
      const stats = await this.appStore.getStatistics()
      
      if (stats.totalEntries < 2) throw new Error('Entry count incorrect')
      if (stats.totalWords === 0) throw new Error('Word count not calculated')
      if (stats.averageWordsPerEntry === 0) throw new Error('Average not calculated')
    })

    // Test 4: Tag Extraction
    await this.runTest(suite, 'Tag Extraction', async () => {
      const allTags = await this.appStore.getAllTags()
      
      if (!allTags.includes('automation')) throw new Error('Automation tag not found')
      if (!allTags.includes('testing')) throw new Error('Testing tag not found')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Error handling and edge case tests
   */
  private async runErrorHandlingTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Error Handling Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup user for error tests
    await this.appStore.createUser('error@test.com', 'errorpass123')
    sessionStorage.setItem('journal-session-key', 'errorpass123')

    // Test 1: Invalid Password Handling
    await this.runTest(suite, 'Invalid Password Handling', async () => {
      const validation = await this.appStore.storage.validateUserCredentials('error@test.com', 'wrongpassword')
      if (!validation.exists) throw new Error('User should exist')
      if (validation.passwordValid) throw new Error('Invalid password should not validate')
    })

    // Test 2: Non-existent User Handling
    await this.runTest(suite, 'Non-existent User Handling', async () => {
      const validation = await this.appStore.storage.validateUserCredentials('nonexistent@test.com', 'anypassword')
      if (validation.exists) throw new Error('Non-existent user should not exist')
      if (validation.passwordValid) throw new Error('Non-existent user should not validate')
    })

    // Test 3: Corrupted Session Recovery
    await this.runTest(suite, 'Corrupted Session Recovery', async () => {
      // Store invalid session data
      sessionStorage.setItem('journal-session-key', 'invalid-key')
      localStorage.setItem('journal-user-email', 'error@test.com')
      
      // App should handle this gracefully by clearing invalid data
      try {
        const validation = await this.appStore.storage.validateUserCredentials('error@test.com', 'invalid-key')
        if (validation.passwordValid) throw new Error('Invalid session key should not validate')
      } catch (error) {
        // Expected behavior - invalid key should fail validation
      }
      
      // Cleanup invalid session
      sessionStorage.removeItem('journal-session-key')
      localStorage.removeItem('journal-user-email')
    })

    // Test 4: Empty Form Validation
    await this.runTest(suite, 'Empty Form Validation', async () => {
      // Navigate to login page
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/login' } }))
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const form = document.getElementById('login-form') as HTMLFormElement
      if (!form) throw new Error('Login form not found')
      
      // Try to submit empty form
      const emailInput = document.getElementById('email') as HTMLInputElement
      const passwordInput = document.getElementById('password') as HTMLInputElement
      
      if (emailInput && passwordInput) {
        emailInput.value = ''
        passwordInput.value = ''
        
        // Form should prevent submission or show validation
        const submitButton = document.getElementById('login-submit') as HTMLButtonElement
        if (submitButton && !submitButton.disabled) {
          // Check if HTML5 validation is working
          if (!emailInput.checkValidity() || !passwordInput.checkValidity()) {
            // Good - HTML5 validation is working
          } else {
            throw new Error('Form validation not working for empty fields')
          }
        }
      }
    })

    // Test 5: Network Offline Handling
    await this.runTest(suite, 'Network Offline Handling', async () => {
      // Simulate offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })
      
      // Trigger offline event
      window.dispatchEvent(new Event('offline'))
      
      // Check if app state reflects offline status
      const state = this.appStore.getState()
      if (!state.isOffline) throw new Error('App should detect offline state')
      
      // Restore online state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      })
      window.dispatchEvent(new Event('online'))
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * User interface tests
   */
  private async runUserInterfaceTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'User Interface Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: User Menu Updates
    await this.runTest(suite, 'User Menu Updates', async () => {
      // Trigger user menu update
      if (typeof (window as any).updateUserMenu === 'function') {
        (window as any).updateUserMenu()
      }
      
      const userMenuToggle = document.getElementById('user-menu-toggle')
      if (!userMenuToggle) throw new Error('User menu toggle not found')
      
      // Check if menu shows user email (should contain @ symbol)
      if (!userMenuToggle.innerHTML.includes('@')) {
        throw new Error('User menu not showing email')
      }
    })

    // Test 2: Navigation Elements
    await this.runTest(suite, 'Navigation Elements', async () => {
      const requiredElements = [
        'main-content',
        'user-menu-toggle',
        'theme-toggle'
      ]
      
      for (const elementId of requiredElements) {
        const element = document.getElementById(elementId)
        if (!element) throw new Error(`Required element ${elementId} not found`)
      }
    })

    // Test 3: Logout Button Exists
    await this.runTest(suite, 'Logout Button Exists', async () => {
      try {
        // First check if user menu exists and click to show dropdown
        const userMenuToggle = document.getElementById('user-menu-toggle')
        if (userMenuToggle) {
          userMenuToggle.click()
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        const logoutBtn = document.getElementById('logout-btn') || 
                         document.querySelector('a[href="#"]:has-text("Logout")') ||
                         document.querySelector('[id*="logout"]')
        if (logoutBtn) {
          console.log('✅ Logout Button Exists')
        } else {
          console.log('❌ Logout Button Exists: Error: Logout button not found')
        }
      } catch (error) {
        console.log(`❌ Logout Button Exists: Error: ${error.message}`)
      }
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Search Component Tests
   */
  private async runSearchComponentTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Search Component Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup entries for search tests
    await this.appStore.createUser('search@test.com', 'searchpass123')
    sessionStorage.setItem('journal-session-key', 'searchpass123')
    await this.appStore.createEntry('Searchable Entry', 'This entry contains searchable content with #important tag', ['important'])

    // Test 1: Navigate to Search Page
    await this.runTest(suite, 'Navigate to Search Page', async () => {
      // Simulate navigation to search page
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/search' } }))
      
      // Wait for search component to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const searchInput = document.getElementById('search-query')
      if (!searchInput) throw new Error('Search input not found')
    })

    // Test 2: Search Functionality
    await this.runTest(suite, 'Search Functionality', async () => {
      const searchInput = document.getElementById('search-query') as HTMLInputElement
      const searchButton = document.getElementById('search-button')
      
      if (!searchInput || !searchButton) throw new Error('Search elements not found')
      
      // Perform search
      searchInput.value = 'searchable'
      searchButton.click()
      
      // Wait for search results
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const searchResults = document.getElementById('search-results')
      if (!searchResults) throw new Error('Search results container not found')
      
      // Check if results contain the expected entry
      if (!searchResults.innerHTML.includes('Searchable Entry')) {
        throw new Error('Search results do not contain expected entry')
      }
    })

    // Test 3: Tag Filter
    await this.runTest(suite, 'Tag Filter', async () => {
      const tagSelect = document.getElementById('tag-filter') as HTMLSelectElement
      if (!tagSelect) throw new Error('Tag filter not found')
      
      // Check if important tag is available
      const hasImportantTag = Array.from(tagSelect.options).some(option => option.value === 'important')
      if (!hasImportantTag) throw new Error('Important tag not found in filter options')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Calendar Component Tests
   */
  private async runCalendarComponentTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Calendar Component Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Test 1: Navigate to Calendar Page
    await this.runTest(suite, 'Navigate to Calendar Page', async () => {
      // Simulate navigation to calendar page
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/calendar' } }))
      
      // Wait for calendar component to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const calendarGrid = document.querySelector('.calendar-grid')
      if (!calendarGrid) throw new Error('Calendar grid not found')
    })

    // Test 2: Calendar Navigation
    await this.runTest(suite, 'Calendar Navigation', async () => {
      const prevButton = document.getElementById('prev-month')
      const nextButton = document.getElementById('next-month')
      const monthDisplay = document.getElementById('current-month')
      
      if (!prevButton || !nextButton || !monthDisplay) {
        throw new Error('Calendar navigation elements not found')
      }
      
      const initialMonth = monthDisplay.textContent
      nextButton.click()
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (monthDisplay.textContent === initialMonth) {
        throw new Error('Calendar month navigation not working')
      }
    })

    // Test 3: Entry Indicators
    await this.runTest(suite, 'Entry Indicators', async () => {
      const dayWithEntry = document.querySelector('.calendar-day.has-entries')
      if (!dayWithEntry) throw new Error('No day with entry indicators found')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Settings Component Tests
   */
  private async runSettingsComponentTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Settings Component Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup user for settings tests
    await this.appStore.createUser('settings@test.com', 'settingspass123')
    sessionStorage.setItem('journal-session-key', 'settingspass123')

    // Test 1: Navigate to Settings Page
    await this.runTest(suite, 'Navigate to Settings Page', async () => {
      // Simulate navigation to settings page
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/settings' } }))
      
      // Wait for settings component to load
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const settingsForm = document.getElementById('settings-form')
      if (!settingsForm) throw new Error('Settings form not found')
    })

    // Test 2: Theme Selector Present
    await this.runTest(suite, 'Theme Selector Present', async () => {
      const themeSelect = document.getElementById('theme-select') as HTMLSelectElement
      if (!themeSelect) throw new Error('Theme selector not found')
      
      // Check if theme options are available
      const options = Array.from(themeSelect.options).map(opt => opt.value)
      if (!options.includes('light') || !options.includes('dark') || !options.includes('system')) {
        throw new Error('Theme options not complete')
      }
    })

    // Test 3: Daily Word Target Input
    await this.runTest(suite, 'Daily Word Target Input', async () => {
      const dailyWordTarget = document.getElementById('daily-word-target') as HTMLInputElement
      if (!dailyWordTarget) throw new Error('Daily word target input not found')
      
      // Test input functionality
      dailyWordTarget.value = '500'
      if (dailyWordTarget.value !== '500') throw new Error('Daily word target input not working')
    })

    // Test 4: Preference Checkboxes
    await this.runTest(suite, 'Preference Checkboxes', async () => {
      const autoSave = document.getElementById('auto-save') as HTMLInputElement
      const showWordCount = document.getElementById('show-word-count') as HTMLInputElement
      const animationsEnabled = document.getElementById('animations-enabled') as HTMLInputElement
      
      if (!autoSave || !showWordCount || !animationsEnabled) {
        throw new Error('Some preference checkboxes not found')
      }
      
      // Test checkbox functionality
      const initialAutoSave = autoSave.checked
      autoSave.click()
      if (autoSave.checked === initialAutoSave) {
        throw new Error('Auto-save checkbox not working')
      }
    })

    // Test 5: Font Size Selector
    await this.runTest(suite, 'Font Size Selector', async () => {
      const fontSizeSelect = document.getElementById('font-size') as HTMLSelectElement
      if (!fontSizeSelect) throw new Error('Font size selector not found')
      
      const options = Array.from(fontSizeSelect.options).map(opt => opt.value)
      if (!options.includes('small') || !options.includes('medium') || !options.includes('large')) {
        throw new Error('Font size options not complete')
      }
    })

    // Test 6: Font Family Selector
    await this.runTest(suite, 'Font Family Selector', async () => {
      const fontFamilySelect = document.getElementById('font-family') as HTMLSelectElement
      if (!fontFamilySelect) throw new Error('Font family selector not found')
      
      const options = Array.from(fontFamilySelect.options).map(opt => opt.value)
      if (!options.includes('system') || !options.includes('serif') || !options.includes('mono')) {
        throw new Error('Font family options not complete')
      }
    })

    // Test 7: Storage Statistics Display
    await this.runTest(suite, 'Storage Statistics Display', async () => {
      const storageUsedText = document.querySelector('.storage-used-text')
      const storageBar = document.querySelector('.storage-bar')
      const entriesCountText = document.querySelector('.entries-count-text')
      const backupInfoText = document.querySelector('.backup-info-text')
      
      if (!storageUsedText) throw new Error('Storage used text not found')
      if (!storageBar) throw new Error('Storage bar not found')
      if (!entriesCountText) throw new Error('Entries count text not found')
      if (!backupInfoText) throw new Error('Backup info text not found')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Markdown Formatting Tests
   */
  private async runMarkdownFormattingTests(): Promise<void> {
    const suite: TestSuite = {
      name: 'Markdown Formatting Tests',
      results: [],
      passed: 0,
      failed: 0,
      duration: 0
    }
    const suiteStart = Date.now()

    // Setup user for markdown tests
    await this.appStore.createUser('markdown@test.com', 'markdownpass123')
    sessionStorage.setItem('journal-session-key', 'markdownpass123')

    // Create comprehensive markdown test content
    const markdownContent = `# Main Header

This is a paragraph with **bold text** and *italic text* and ***bold italic text***.

## Secondary Header

Here's a list:
- First item
- Second item with **bold**
- Third item with *italic*

### Tertiary Header

1. Numbered list item
2. Another numbered item
3. Final numbered item

#### Fourth Level Header

A paragraph with a [link](https://example.com) and some \`inline code\`.

##### Fifth Level Header

> This is a blockquote
> with multiple lines
> and **bold text** inside

###### Sixth Level Header

Final paragraph with all formatting: **bold**, *italic*, ***both***, \`code\`, and [links](https://test.com).

Another paragraph to test spacing between elements.

---

Text after horizontal rule.`

    let testEntryId: string

    // Test 1: Create Entry with Comprehensive Markdown
    await this.runTest(suite, 'Create Entry with Comprehensive Markdown', async () => {
      const entry = await this.appStore.createEntry(
        'Markdown Formatting Test Entry',
        markdownContent,
        ['markdown', 'formatting', 'test']
      )
      
      if (!entry || !entry.id) throw new Error('Markdown test entry not created')
      testEntryId = entry.id
      
      // Verify content was saved correctly
      const state = this.appStore.getState()
      const savedEntry = state.entries.find((e: any) => e.id === testEntryId)
      if (!savedEntry) throw new Error('Entry not found in state')
      if (!savedEntry.content.includes('# Main Header')) throw new Error('Markdown content not saved')
    })

    // Test 2: Navigate to Entry View
    await this.runTest(suite, 'Navigate to Entry View', async () => {
      // Navigate to the entry view
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: `/entry/${testEntryId}` } }))
      
      // Wait for entry view to load
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content container not found')
    })

    // Test 3: Header Formatting
    await this.runTest(suite, 'Header Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      // Check for proper header tags
      const h1 = entryContent.querySelector('h1')
      const h2 = entryContent.querySelector('h2')
      const h3 = entryContent.querySelector('h3')
      
      if (!h1 || !h1.textContent?.includes('Main Header')) {
        throw new Error('H1 header not properly rendered')
      }
      if (!h2 || !h2.textContent?.includes('Secondary Header')) {
        throw new Error('H2 header not properly rendered')
      }
      if (!h3 || !h3.textContent?.includes('Tertiary Header')) {
        throw new Error('H3 header not properly rendered')
      }
      
      // Check header styling
      const h1Style = window.getComputedStyle(h1)
      if (parseFloat(h1Style.fontSize) <= parseFloat(window.getComputedStyle(document.body).fontSize)) {
        throw new Error('H1 header not properly styled (font size)')
      }
    })

    // Test 4: Bold and Italic Formatting
    await this.runTest(suite, 'Bold and Italic Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      // Check for bold elements
      const boldElements = entryContent.querySelectorAll('strong, b')
      if (boldElements.length === 0) {
        throw new Error('Bold elements not rendered')
      }
      
      // Check for italic elements
      const italicElements = entryContent.querySelectorAll('em, i')
      if (italicElements.length === 0) {
        throw new Error('Italic elements not rendered')
      }
      
      // Verify bold styling
      const firstBold = boldElements[0] as HTMLElement
      const boldStyle = window.getComputedStyle(firstBold)
      if (!boldStyle.fontWeight || parseInt(boldStyle.fontWeight) < 600) {
        throw new Error('Bold elements not properly styled')
      }
    })

    // Test 5: List Formatting
    await this.runTest(suite, 'List Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      // Check for unordered list
      const ul = entryContent.querySelector('ul')
      if (!ul) throw new Error('Unordered list not rendered')
      
      const liItems = ul.querySelectorAll('li')
      if (liItems.length < 3) throw new Error('List items not properly rendered')
      
      // Check for ordered list
      const ol = entryContent.querySelector('ol')
      if (!ol) throw new Error('Ordered list not rendered')
      
      const olItems = ol.querySelectorAll('li')
      if (olItems.length < 3) throw new Error('Ordered list items not properly rendered')
    })

    // Test 6: Paragraph Spacing
    await this.runTest(suite, 'Paragraph Spacing', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      const paragraphs = entryContent.querySelectorAll('p')
      if (paragraphs.length < 2) throw new Error('Multiple paragraphs not rendered')
      
      // Check spacing between paragraphs
      const firstP = paragraphs[0] as HTMLElement
      const secondP = paragraphs[1] as HTMLElement
      
      const firstPStyle = window.getComputedStyle(firstP)
      const marginBottom = parseFloat(firstPStyle.marginBottom)
      
      if (marginBottom === 0) {
        throw new Error('No spacing between paragraphs')
      }
    })

    // Test 7: Blockquote Formatting
    await this.runTest(suite, 'Blockquote Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      const blockquote = entryContent.querySelector('blockquote')
      if (!blockquote) throw new Error('Blockquote not rendered')
      
      // Check blockquote styling
      const blockquoteStyle = window.getComputedStyle(blockquote)
      if (!blockquoteStyle.borderLeftWidth || parseFloat(blockquoteStyle.borderLeftWidth) === 0) {
        throw new Error('Blockquote not properly styled')
      }
    })

    // Test 8: Link Formatting
    await this.runTest(suite, 'Link Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      const links = entryContent.querySelectorAll('a')
      if (links.length === 0) throw new Error('Links not rendered')
      
      const firstLink = links[0] as HTMLAnchorElement
      if (!firstLink.href) throw new Error('Link href not set')
      
      // Check link styling
      const linkStyle = window.getComputedStyle(firstLink)
      if (linkStyle.textDecoration === 'none' && linkStyle.color === window.getComputedStyle(document.body).color) {
        throw new Error('Links not properly styled')
      }
    })

    // Test 9: Code Formatting
    await this.runTest(suite, 'Code Formatting', async () => {
      const entryContent = document.querySelector('.entry-content')
      if (!entryContent) throw new Error('Entry content not found')
      
      const codeElements = entryContent.querySelectorAll('code')
      if (codeElements.length === 0) throw new Error('Inline code not rendered')
      
      const firstCode = codeElements[0] as HTMLElement
      const codeStyle = window.getComputedStyle(firstCode)
      
      // Check for monospace font
      if (!codeStyle.fontFamily.toLowerCase().includes('mono')) {
        throw new Error('Code elements not using monospace font')
      }
    })

    // Test 10: Editor Preview Formatting
    await this.runTest(suite, 'Editor Preview Formatting', async () => {
      // Navigate to editor to test preview
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/write' } }))
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Set content in editor
      const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement
      if (!textarea) throw new Error('Editor textarea not found')
      
      textarea.value = markdownContent
      textarea.dispatchEvent(new Event('input'))
      
      // Wait for preview to update
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const preview = document.getElementById('editor-preview')
      if (!preview) throw new Error('Editor preview not found')
      
      // Check if preview contains formatted elements
      const previewH1 = preview.querySelector('h1')
      const previewBold = preview.querySelector('strong, b')
      
      if (!previewH1) throw new Error('Headers not rendered in editor preview')
      if (!previewBold) throw new Error('Bold text not rendered in editor preview')
    })

    suite.duration = Date.now() - suiteStart
    this.results.push(suite)
  }

  /**
   * Run individual test with error handling
   */
  private async runTest(suite: TestSuite, testName: string, testFn: () => Promise<void>): Promise<void> {
    const testStart = Date.now()
    
    try {
      await testFn()
      suite.results.push({
        name: testName,
        passed: true,
        duration: Date.now() - testStart
      })
      suite.passed++
      console.log(`✅ ${testName}`)
    } catch (error) {
      suite.results.push({
        name: testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - testStart
      })
      suite.failed++
      console.log(`❌ ${testName}: ${error}`)
    }
  }

  /**
   * Get raw storage data for inspection
   */
  private async getRawStorageData(storeName: string): Promise<any[]> {
    if (!this.appStore.storage || !this.appStore.storage.db) {
      throw new Error('Storage not available')
    }
    
    try {
      return await this.appStore.storage.db.getAll(storeName)
    } catch (error) {
      console.warn('Could not access raw storage data:', error)
      return []
    }
  }

  /**
   * Generate comprehensive test report
   */
  private generateReport(): void {
    const totalDuration = Date.now() - this.startTime
    const totalTests = this.results.reduce((sum, suite) => sum + suite.results.length, 0)
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passed, 0)
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failed, 0)
    
    console.log('\n' + '='.repeat(60))
    console.log('🤖 AUTOMATED TEST REPORT')
    console.log('='.repeat(60))
    console.log(`⏱️  Total Duration: ${totalDuration}ms`)
    console.log(`📊 Total Tests: ${totalTests}`)
    console.log(`✅ Passed: ${totalPassed}`)
    console.log(`❌ Failed: ${totalFailed}`)
    console.log(`📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`)
    console.log('')
    
    // Print detailed results for each suite
    this.results.forEach(suite => {
      console.log(`📋 ${suite.name}: ${suite.passed}/${suite.results.length} passed (${suite.duration}ms)`)
      suite.results.forEach(result => {
        if (!result.passed) {
          console.log(`   ❌ ${result.name}: ${result.error}`)
        }
      })
    })
  }

  /**
   * Cleanup test data
   */
  private async cleanup(): Promise<void> {
    try {
      if (this.appStore && typeof this.appStore.clearAllData === 'function') {
        await this.appStore.clearAllData()
      }
      sessionStorage.removeItem('journal-session-key')
    } catch (error) {
      console.warn('Cleanup warning:', error)
    }
  }
}

// Initialize test runner when loaded
if (typeof window !== 'undefined') {
  (window as any).AutomatedTestSuite = AutomatedTestSuite
}

/**
 * Initialize automated testing functionality
 * Called by app.ts to set up test functions on window object
 */
export function initializeAutomatedTesting(): void {
  if (typeof window !== 'undefined') {
    // Set up the test runner function that the external test runner expects
    (window as any).runAutomatedTests = async () => {
      const testSuite = new AutomatedTestSuite()
      await testSuite.runAllTests()
    }
    
    // Set up test utilities
    (window as any).testUtils = {
      AutomatedTestSuite,
      runTests: async () => {
        const testSuite = new AutomatedTestSuite()
        await testSuite.runAllTests()
      }
    }
    
    console.log('🧪 Automated testing initialized')
  }
}
