import { appStore } from '../stores/AppStore'
import { Router } from './router'
import { renderApp } from '../components/App'
import { initializeTestUtils } from './testing'
import { initializeAutomatedTesting } from './automated-tests'

/**
 * Initialize the journal application
 */
export async function initializeApp(): Promise<void> {
  try {
    // Initialize router first
    const router = new Router()
    router.initialize()
    
    // Render the main application
    const appContainer = document.getElementById('app')
    if (appContainer) {
      renderApp(appContainer)
    }
    
    // Make app store available globally early
    if (typeof window !== 'undefined') {
      (window as any).appStore = appStore
    }
    
    // Setup navigation event listener
    window.addEventListener('navigate', async (event: Event) => {
      const customEvent = event as CustomEvent
      console.log('🧭 Navigation event received:', customEvent.detail)
      const { path, replace = false } = customEvent.detail
      await router.navigate(path, !replace)
    })
    
    // Try to initialize app store (may require authentication)
    try {
      // Check if we have a stored session
      const sessionPassword = sessionStorage.getItem('journal-session-key')
      const userEmail = localStorage.getItem('journal-user-email')
      
      if (sessionPassword && userEmail) {
        console.log('🔐 Found session data, attempting to restore user session...')
        
        // Skip local storage validation - directly try to restore session
        console.log('🔐 Attempting direct session restoration with stored credentials')
        
        // Try to initialize with session password directly
        try {
          // Initialize app store with the session password
          await appStore.initialize(sessionPassword)
          
          // Verify the user is actually logged in
          const state = appStore.getState()
          if (!state.user) {
            throw new Error('Session restoration failed - no user in state')
          }
          
          console.log('✅ User session verified:', state.user.email)
        } catch (sessionError) {
          console.log('🔐 Session restoration failed:', sessionError)
          sessionStorage.removeItem('journal-session-key')
          localStorage.removeItem('journal-user-email')
          await appStore.initialize()
          router.start()
          return
        }
        
        // Trigger user menu update after successful session restore
        setTimeout(() => {
          const appContainer = document.getElementById('app')
          if (appContainer) {
            window.dispatchEvent(new CustomEvent('userStateChanged'))
          }
        }, 100)
      } else {
        console.log('🚀 No session found, initializing without user data...')
        // Add timeout to prevent hanging
        try {
          await Promise.race([
            appStore.initialize(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Initialization timeout')), 5000)
            )
          ])
        } catch (error) {
          console.warn('AppStore initialization failed or timed out:', error)
          // Continue anyway to prevent hanging
        }
      }
      
      console.log('🎉 Journal app initialized successfully!')
      // Start routing after successful initialization
      router.start()
    } catch (error) {
      // If initialization fails, user likely needs to authenticate
      if (error instanceof Error && error.message.includes('Master password required')) {
        console.log('🔐 Authentication required')
        // Clear potentially corrupted session data
        sessionStorage.removeItem('journal-session-key')
        localStorage.removeItem('journal-user-email')
        router.start()
        router.navigate('/login', false)
      } else if (error instanceof Error && error.message.includes('No user found') && sessionStorage.getItem('journal-session-key')) {
        console.log('🔐 Session invalid, clearing and redirecting to login')
        sessionStorage.removeItem('journal-session-key')
        localStorage.removeItem('journal-user-email')
        router.start()
        router.navigate('/login', false)
      } else {
        router.start() // Start routing even if initialization failed
        throw error
      }
    }
    
    // Setup global error handling
    setupErrorHandling()
    
    // Initialize test utilities in development
    initializeTestUtils()
    
    // Defer automated testing until appStore is ready
    setTimeout(() => {
      initializeAutomatedTesting()
    }, 100)
    
  } catch (error) {
    console.error('Failed to initialize app:', error)
    showErrorMessage('Failed to initialize the application. Please refresh the page.')
  }
}

/**
 * Setup global error handling
 */
function setupErrorHandling(): void {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    showErrorMessage('An unexpected error occurred.')
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    showErrorMessage('An unexpected error occurred.')
  })
}

/**
 * Show error message to user
 */
function showErrorMessage(message: string): void {
  // Create a simple error notification
  const errorDiv = document.createElement('div')
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-down'
  errorDiv.textContent = message
  
  document.body.appendChild(errorDiv)
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}
