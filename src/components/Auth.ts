import { appStore } from '../stores/AppStore'

/**
 * Authentication components - Login and Register
 */

export function renderLogin(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  mainContent.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="fas fa-book text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <h2 class="mt-6 text-center text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Welcome Back! 👋
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue your journaling journey
          </p>
        </div>
        
        <form class="mt-8 space-y-6" id="login-form">
          <div id="auth-error" class="hidden p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <div class="flex">
              <span class="text-red-400 mr-2">⚠️</span>
              <p class="text-sm text-red-700 dark:text-red-300" id="auth-error-message"></p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="input-field mt-1"
                placeholder="Enter your email"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Master Password 🔐
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="input-field mt-1"
                placeholder="Enter your master password"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                🛡️ This decrypts your encrypted journal entries
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              id="login-submit"
              class="btn-primary w-full transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span id="login-submit-text">🚀 Sign In</span>
              <span id="login-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            </button>
          </div>
          
          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <a href="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                Sign up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  `
  
  setupLoginForm()
}

export function renderRegister(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  mainContent.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="fas fa-user-plus text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <h2 class="mt-6 text-center text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Join Journal for Me ✨
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Start your personal journaling journey today
          </p>
        </div>
        
        <form class="mt-8 space-y-6" id="register-form">
          <div id="register-error" class="hidden p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <div class="flex">
              <span class="text-red-400 mr-2">⚠️</span>
              <p class="text-sm text-red-700 dark:text-red-300" id="register-error-message"></p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="input-field mt-1"
                placeholder="Enter your email"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Master Password 🔐
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="new-password" 
                required 
                class="input-field mt-1"
                placeholder="Create a secure master password"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                🛡️ This encrypts all your journal entries locally. Keep it safe!
              </p>
            </div>
            
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <input 
                id="confirm-password" 
                name="confirm-password" 
                type="password" 
                autocomplete="new-password" 
                required 
                class="input-field mt-1"
                placeholder="Confirm your password"
              >
            </div>
          </div>
          
          <div class="flex items-center">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            >
            <label for="terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Terms of Service
              </a> and 
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <div>
            <button 
              type="submit" 
              id="register-submit"
              class="btn-primary w-full transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span id="register-submit-text">✨ Create Account</span>
              <span id="register-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            </button>
          </div>
          
          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                Sign in
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  `
  
  setupRegisterForm()
}

function setupLoginForm(): void {
  const form = document.getElementById('login-form') as HTMLFormElement
  const submitButton = document.getElementById('login-submit') as HTMLButtonElement
  const errorDiv = document.getElementById('auth-error') as HTMLDivElement
  const errorMessage = document.getElementById('auth-error-message') as HTMLParagraphElement
  const submitText = document.getElementById('login-submit-text') as HTMLSpanElement
  const loadingSpinner = document.getElementById('login-loading') as HTMLSpanElement

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // Hide previous errors
    hideError()

    // Validation
    if (!email || !password) {
      showError('Please fill in all required fields')
      return
    }

    // Show loading state
    setLoading(true)

    try {
      // Use the new server-sync login method
      const user = await appStore.storage.loginUser(email, password)
      
      // Initialize app store with the logged-in user
      await appStore.initialize(password)
      
      // If successful, navigate to dashboard
      console.log('✅ Login successful!', user.email)
      
      // Store session key for persistence
      sessionStorage.setItem('journal-session-key', password)
      localStorage.setItem('journal-user-email', email)
      console.log('💾 Session data stored for persistence')
      
      // Trigger user menu update immediately
      window.dispatchEvent(new CustomEvent('userStateChanged'))
      
      console.log('🧭 Dispatching navigation to /')
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { path: '/', replace: true } 
      }))
      
      // Also try direct navigation as a fallback
      setTimeout(() => {
        if (window.location.pathname === '/login') {
          console.log('🔄 Fallback: manually changing location')
          window.location.href = '/'
        }
      }, 100)
    } catch (error) {
      console.error('Login error:', error)
      
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  })

  function showError(message: string): void {
    errorMessage.textContent = message
    errorDiv.classList.remove('hidden')
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function hideError(): void {
    errorDiv.classList.add('hidden')
  }

  function setLoading(loading: boolean): void {
    submitButton.disabled = loading
    
    if (loading) {
      submitText.classList.add('hidden')
      loadingSpinner.classList.remove('hidden')
      submitButton.classList.add('opacity-75')
    } else {
      submitText.classList.remove('hidden')
      loadingSpinner.classList.add('hidden')
      submitButton.classList.remove('opacity-75')
    }
  }
}

function setupRegisterForm(): void {
  const form = document.getElementById('register-form') as HTMLFormElement
  const submitButton = document.getElementById('register-submit') as HTMLButtonElement
  const errorDiv = document.getElementById('register-error') as HTMLDivElement
  const errorMessage = document.getElementById('register-error-message') as HTMLParagraphElement
  const submitText = document.getElementById('register-submit-text') as HTMLSpanElement
  const loadingSpinner = document.getElementById('register-loading') as HTMLSpanElement

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string
    
    // Hide previous errors
    hideError()

    // Validation
    if (!email || !password || !confirmPassword) {
      showError('Please fill in all required fields')
      return
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters long')
      return
    }

    // Show loading state
    setLoading(true)

    try {
      // Check if user already exists
      const storageManager = appStore.getStorageManager()
      if (await storageManager.hasExistingUser()) {
        // Try to get existing user to check email
        try {
          await storageManager.initialize(password)
          const existingUser = await storageManager.getUser()
          if (existingUser && existingUser.email === email) {
            showError('An account with this email already exists. Please sign in instead.')
            return
          } else if (existingUser) {
            showError('An account already exists with a different email. Please use a different email or sign in.')
            return
          }
        } catch (error) {
          // If password is wrong, that's fine - different user
          console.log('Existing user has different password, proceeding with registration')
        }
      }
      
      // Create new user with server sync
      const user = await appStore.createUser(email, password)
      
      // Register with server (handled internally by createUser)
      
      // Verify user is set in store
      const state = appStore.getState()
      console.log('✅ Account created successfully!', user.email)
      console.log('📊 Current app state after registration:', { user: state.user?.email, entriesCount: state.entries.length })
      
      // Store session key for persistence
      sessionStorage.setItem('journal-session-key', password)
      console.log('💾 Session key stored for persistence')
      
      console.log('🧭 Dispatching navigation to /')
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { path: '/', replace: true } 
      }))
      
      // Also try direct navigation as a fallback
      setTimeout(() => {
        if (window.location.pathname === '/register') {
          console.log('🔄 Fallback: manually changing location')
          window.location.href = '/'
        }
      }, 100)
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Account creation failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  })

  function showError(message: string): void {
    errorMessage.textContent = message
    errorDiv.classList.remove('hidden')
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function hideError(): void {
    errorDiv.classList.add('hidden')
  }

  function setLoading(loading: boolean): void {
    submitButton.disabled = loading
    
    if (loading) {
      submitText.classList.add('hidden')
      loadingSpinner.classList.remove('hidden')
      submitButton.classList.add('opacity-75')
    } else {
      submitText.classList.remove('hidden')
      loadingSpinner.classList.add('hidden')
      submitButton.classList.remove('opacity-75')
    }
  }
}
