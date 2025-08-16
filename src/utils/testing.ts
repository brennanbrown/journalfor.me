/**
 * Testing utilities for development and debugging
 * Note: Only for development use, not for production
 */

export interface TestUser {
  email: string
  password: string
}

export interface TestEntry {
  title: string
  content: string
  tags?: string[]
}

/**
 * Development testing utilities
 * Access via window.testUtils in browser console
 */
export class TestUtils {
  private appStore: any

  constructor() {
    // Get global app store
    this.appStore = (window as any).appStore
  }

  /**
   * Quick login with test credentials
   */
  async quickLogin(email: string = 'test@example.com', password: string = 'password123'): Promise<void> {
    try {
      console.log('🧪 Test: Attempting login...')
      await this.appStore.initialize(password)
      
      const state = this.appStore.getState()
      if (state.user) {
        sessionStorage.setItem('journal-session-key', password)
        console.log('✅ Test: Login successful!', state.user.email)
        // Trigger navigation
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/' } }))
        return
      }
      
      throw new Error('Login failed - no user found')
    } catch (error) {
      console.log('❌ Test: Login failed, trying to create account...')
      await this.quickRegister(email, password)
    }
  }

  /**
   * Quick registration with test credentials
   */
  async quickRegister(email: string = 'test@example.com', password: string = 'password123'): Promise<void> {
    try {
      console.log('🧪 Test: Creating test account...')
      await this.appStore.createUser(email, password)
      sessionStorage.setItem('journal-session-key', password)
      
      const state = this.appStore.getState()
      console.log('✅ Test: Account created!', state.user?.email)
      
      // Trigger navigation
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/' } }))
    } catch (error) {
      console.error('❌ Test: Registration failed:', error)
      throw error
    }
  }

  /**
   * Quick logout
   */
  async quickLogout(): Promise<void> {
    console.log('🧪 Test: Logging out...')
    sessionStorage.removeItem('journal-session-key')
    await this.appStore.clearAllData()
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/login' } }))
    setTimeout(() => window.location.reload(), 100)
    console.log('✅ Test: Logged out!')
  }

  /**
   * Create test journal entries
   */
  async createTestEntries(count: number = 3): Promise<void> {
    console.log(`🧪 Test: Creating ${count} test entries...`)
    
    const sampleEntries: TestEntry[] = [
      {
        title: 'My First Day',
        content: 'Today was amazing! I started journaling and it feels great. #gratitude #newbeginnings',
        tags: ['gratitude', 'newbeginnings']
      },
      {
        title: 'Morning Thoughts',
        content: 'Woke up early today and watched the sunrise. There\'s something magical about quiet mornings. #mindfulness #peace',
        tags: ['mindfulness', 'peace']
      },
      {
        title: 'Learning Progress',
        content: 'Made some good progress on my coding project today. Feeling productive! #coding #productivity #learning',
        tags: ['coding', 'productivity', 'learning']
      },
      {
        title: 'Weekend Plans',
        content: 'Planning to go hiking this weekend. Need to get out in nature more often. #adventure #nature',
        tags: ['adventure', 'nature']
      },
      {
        title: 'Reflection Time',
        content: 'Taking a moment to reflect on the week. Some challenges but overall growth. #reflection #growth',
        tags: ['reflection', 'growth']
      }
    ]

    for (let i = 0; i < count && i < sampleEntries.length; i++) {
      const entry = sampleEntries[i]
      await this.appStore.createEntry(entry.title, entry.content, entry.tags)
      console.log(`✅ Created: "${entry.title}"`)
    }
    
    console.log(`✅ Test: Created ${count} entries successfully!`)
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<void> {
    console.log('🧪 Test: Clearing all data...')
    await this.appStore.clearAllData()
    sessionStorage.removeItem('journal-session-key')
    console.log('✅ Test: All data cleared!')
  }

  /**
   * Get current app state
   */
  getState(): any {
    return this.appStore.getState()
  }

  /**
   * Show available test commands
   */
  help(): void {
    console.log(`
🧪 Test Utils Available Commands:

testUtils.quickLogin(email?, password?)     - Quick login/register
testUtils.quickLogout()                     - Quick logout  
testUtils.createTestEntries(count?)         - Create sample entries
testUtils.clearAllData()                    - Clear all data
testUtils.getState()                        - Get current app state
testUtils.help()                            - Show this help

Examples:
  testUtils.quickLogin()                    - Login with default test account
  testUtils.createTestEntries(5)            - Create 5 sample entries
  testUtils.clearAllData()                  - Reset everything
    `)
  }
}

/**
 * Initialize test utils for development
 */
export function initializeTestUtils(): void {
  if (typeof window !== 'undefined') {
    (window as any).testUtils = new TestUtils()
    console.log('🧪 Test utilities loaded! Type "testUtils.help()" for commands.')
  }
}
