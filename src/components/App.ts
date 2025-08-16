/**
 * Main application component
 */
import { appStore } from '../stores/AppStore'

/**
 * Render the main application
 */
export function renderApp(container: HTMLElement): void {
  container.innerHTML = `
    <div id="app-root" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Navigation Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo and Title -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <a href="/" class="link-subtle group" data-route="/">
                  <h1 class="text-xl font-display font-semibold text-gray-900 dark:text-gray-100 group-hover:animate-wiggle">
                    📖✨ Journal for Me
                  </h1>
                </a>
              </div>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-4">
              <a href="/" class="nav-link" data-route="/">
                <span class="mr-2">🏠</span>Dashboard
              </a>
              <a href="/write" class="nav-link" data-route="/write">
                <span class="mr-2">✍️</span>Write
              </a>
              <a href="/calendar" class="nav-link" data-route="/calendar">
                <span class="mr-2">📅</span>Calendar
              </a>
              <a href="/search" class="nav-link" data-route="/search">
                <span class="mr-2">🔍</span>Search
              </a>
            </div>
            
            <!-- Theme Toggle and User Menu -->
            <div class="flex items-center space-x-4">
              <button 
                id="theme-toggle" 
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Toggle theme"
              >
                <span class="dark:hidden text-lg">🌙</span>
                <span class="hidden dark:inline text-lg">☀️</span>
              </button>
              
              <div class="relative">
                <button 
                  id="user-menu-toggle"
                  class="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <span class="text-xl">👤</span>
                </button>
                
                <!-- User Dropdown (hidden by default) -->
                <div 
                  id="user-menu" 
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 hidden z-50"
                >
                  <div class="py-1">
                    <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <span class="mr-2">⚙️</span>Settings
                    </a>
                    <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      <span class="mr-2">👋</span>Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile menu button -->
            <div class="md:hidden flex items-center">
              <button 
                id="mobile-menu-toggle"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <span class="text-lg">☰</span>
              </button>
            </div>
          </div>
          
          <!-- Mobile Navigation -->
          <div id="mobile-menu" class="md:hidden hidden">
            <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              <a href="/" class="mobile-nav-link" data-route="/">
                <span class="mr-2">🏠</span>Dashboard
              </a>
              <a href="/write" class="mobile-nav-link" data-route="/write">
                <span class="mr-2">✍️</span>Write
              </a>
              <a href="/calendar" class="mobile-nav-link" data-route="/calendar">
                <span class="mr-2">📅</span>Calendar
              </a>
              <a href="/search" class="mobile-nav-link" data-route="/search">
                <span class="mr-2">🔍</span>Search
              </a>
            </div>
          </div>
        </nav>
      </header>
      
      <!-- Main Content Area -->
      <main id="main-content" class="flex-1">
        <!-- Content will be dynamically loaded here by the router -->
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div class="text-center py-12">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="Loading">
              <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Loading your journal...</p>
          </div>
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto sticky bottom-0 z-50">
        <div class="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
            <div class="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <span>Made with ❤️ for thoughtful journaling</span>
              <span class="hidden sm:inline">•</span>
              <span>Created by <a href="https://brennanbrown.ca" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">Brennan Kenneth Brown</a></span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                🚀 Early Access
              </span>
              <span id="online-status" class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
  
  // Setup event listeners
  setupAppEventListeners()
  
  // Setup navigation styles
  setupNavigationStyles()
  
  // Update user menu based on current state
  updateUserMenu()
  
  // Subscribe to state changes to update user menu (with delay to ensure appStore is ready)
  setTimeout(() => {
    const appStore = (window as any).appStore
    if (appStore) {
      console.log('🔗 Setting up appStore subscription for user menu updates')
      appStore.subscribe(() => {
        updateUserMenu()
      })
      // Initial update
      updateUserMenu()
    } else {
      console.log('⚠️ AppStore not ready during app render, will retry later')
    }
  }, 200)
}

/**
 * Handle logout functionality
 */
let isLoggingOut = false // Prevent multiple logout attempts

async function handleLogout(event: Event): Promise<void> {
  event.preventDefault()
  
  // Prevent multiple logout dialogs
  if (isLoggingOut) {
    return
  }
  
  isLoggingOut = true
  
  try {
    if (confirm('Are you sure you want to log out?')) {
      // Clear session storage first
      sessionStorage.removeItem('journal-session-key')
      console.log('🗑️ Session key cleared')
      
      // Get app store and clear data
      const appStore = (window as any).appStore
      if (appStore) {
        await appStore.clearAllData()
        console.log('🚪 User logged out successfully')
      }
      
      // Navigate to login page
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { path: '/login', replace: true } 
      }))
      
      // Force page reload to clear any cached state
      setTimeout(() => {
        window.location.reload()
      }, 100)
      
    }
  } catch (error) {
    console.error('Error during logout:', error)
    alert('Error logging out. Please refresh the page.')
  } finally {
    isLoggingOut = false // Reset the flag
  }
}

/**
 * Update user menu based on authentication state
 */
function updateUserMenu(): void {
  const appStore = (window as any).appStore
  if (!appStore) {
    console.log('🔄 User menu update skipped: no appStore')
    return
  }
  
  const state = appStore.getState()
  const userMenuToggle = document.getElementById('user-menu-toggle')
  const userMenu = document.getElementById('user-menu')
  
  if (!userMenuToggle || !userMenu) {
    console.log('🔄 User menu update skipped: elements not found')
    return
  }
  
  console.log('🔄 Updating user menu with state:', { 
    hasUser: !!state.user, 
    userEmail: state.user?.email 
  })
  
  if (state.user) {
    // User is logged in - show email and logout option
    userMenuToggle.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-xl">👤</span>
        <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">${state.user.email}</span>
      </div>
    `
    
    userMenu.innerHTML = `
      <div class="py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 min-w-48">
        <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
          Signed in as <strong>${state.user.email}</strong>
        </div>
        <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <span class="mr-2">⚙️</span>Settings
        </a>
        <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <span class="mr-2">👋</span>Logout
        </a>
      </div>
    `
  } else {
    // User is not logged in - show login option
    userMenuToggle.innerHTML = `
      <span class="text-xl">👤</span>
    `
    
    userMenu.innerHTML = `
      <div class="py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 min-w-48">
        <a href="/login" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <span class="mr-2">🔑</span>Sign In
        </a>
        <a href="/register" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <span class="mr-2">📝</span>Register
        </a>
      </div>
    `
  }
  
  console.log('🔄 User menu updated:', state.user ? `${state.user.email} (logged in)` : 'not logged in')
  
  // Re-attach logout event listener if user is logged in
  if (state.user) {
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
      // Remove any existing listeners before adding new one
      logoutBtn.removeEventListener('click', handleLogout)
      logoutBtn.addEventListener('click', handleLogout)
      console.log('🔗 Logout event listener attached')
    }
  }
}

/**
 * Setup application event listeners
 */
function setupAppEventListeners(): void {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle')
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const themeManager = (window as any).themeManager
      if (themeManager) {
        themeManager.toggleTheme()
      }
    })
  }
  
  // User menu toggle functionality
  const userMenuToggle = document.getElementById('user-menu-toggle')
  const userMenu = document.getElementById('user-menu')
  if (userMenuToggle && userMenu) {
    userMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      userMenu.classList.toggle('hidden')
    })
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenuToggle.contains(e.target as Node) && !userMenu.contains(e.target as Node)) {
        userMenu.classList.add('hidden')
      }
    })
  }
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  mobileMenuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden')
  })
  
  // Navigation link handling
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('[data-route]') as HTMLAnchorElement
    
    if (link) {
      event.preventDefault()
      const route = link.getAttribute('data-route')
      if (route) {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path: route } }))
        // Close mobile menu if open
        mobileMenu?.classList.add('hidden')
      }
    }
  })
  
  // Note: Logout handling is now done dynamically in updateUserMenu()
  
  // Online/Offline status
  updateOnlineStatus()
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
}

/**
 * Setup navigation link styles
 */
function setupNavigationStyles(): void {
  const style = document.createElement('style')
  style.textContent = `
    .nav-link {
      @apply px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 flex items-center transform hover:scale-105 active:scale-95 underline decoration-transparent hover:decoration-blue-300 dark:hover:decoration-blue-600 decoration-1 underline-offset-2;
    }
    
    .nav-link.active {
      @apply bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 scale-105 shadow-md;
    }
    
    .mobile-nav-link {
      @apply block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 underline decoration-transparent hover:decoration-blue-300 dark:hover:decoration-blue-600 decoration-1 underline-offset-2;
    }
    
    .mobile-nav-link.active {
      @apply bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 scale-105 shadow-md;
    }
  `
  document.head.appendChild(style)
}

/**
 * Update online/offline status indicator
 */
function updateOnlineStatus(): void {
  const statusElement = document.getElementById('online-status')
  if (statusElement) {
    const isOnline = navigator.onLine
    statusElement.innerHTML = `
      <span class="w-2 h-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2"></span>
      ${isOnline ? 'Online' : 'Offline'}
    `
  }
}

/**
 * Update active navigation link
 */
export function updateActiveNavigation(currentPath: string): void {
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('active')
  })
  
  // Add active class to current route
  document.querySelectorAll(`[data-route="${currentPath}"]`).forEach(link => {
    link.classList.add('active')
  })
}

/**
 * Show loading state in main content
 */
export function showLoading(message: string = 'Loading...'): void {
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="Loading">
            <span class="sr-only">Loading</span>
          </div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">${message}</p>
        </div>
      </div>
    `
  }
}

/**
 * Show error state in main content
 */
export function showError(message: string, canRetry: boolean = true): void {
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.innerHTML = `
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">${message}</p>
          ${canRetry ? '<button onclick="location.reload()" class="btn-primary">Try Again</button>' : ''}
        </div>
      </div>
    `
  }
}
