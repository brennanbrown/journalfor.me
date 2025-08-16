import type { Route, RouteHandler } from '../types'

/**
 * Simple client-side router
 */
export class Router {
  private routes: Map<string, Route> = new Map()
  private currentRoute: string = '/'
  private isInitialized = false
  
  constructor() {
    this.setupDefaultRoutes()
  }
  
  /**
   * Initialize the router
   */
  initialize(): void {
    if (this.isInitialized) return
    
    // Listen for browser navigation
    window.addEventListener('popstate', this.handlePopState.bind(this))
    
    this.isInitialized = true
    console.log('🧭 Router initialized successfully')
  }
  
  /**
   * Start routing (call after app store is ready)
   */
  start(): void {
    // Handle initial route
    this.navigate(window.location.pathname, false)
  }
  
  /**
   * Register a route
   */
  addRoute(path: string, handler: RouteHandler, options?: { title?: string; requiresAuth?: boolean }): void {
    this.routes.set(path, {
      path,
      handler,
      title: options?.title,
      requiresAuth: options?.requiresAuth || false
    })
  }
  
  /**
   * Navigate to a route
   */
  async navigate(path: string, pushState: boolean = true): Promise<void> {
    console.log(`🧭 Router navigating to: ${path} (pushState: ${pushState})`)
    try {
      // Find matching route
      const route = this.findRoute(path)
      if (!route) {
        console.warn(`No route found for path: ${path}`)
        this.navigate('/404', pushState)
        return
      }
      
      // Check authentication if required
      if (route.requiresAuth && !this.isAuthenticated()) {
        this.navigate('/login', pushState)
        return
      }
      
      // Update browser history
      if (pushState) {
        window.history.pushState({ path }, route.title || '', path)
      }
      
      // Update page title
      if (route.title) {
        document.title = `${route.title} - Journal for Me`
      }
      
      // Update current route
      this.currentRoute = path
      
      // Execute route handler
      await route.handler()
      
      // Dispatch route change event
      window.dispatchEvent(new CustomEvent('routeChanged', {
        detail: { path, route }
      }))
      
    } catch (error) {
      console.error('Navigation error:', error)
      this.navigate('/error', false)
    }
  }
  
  /**
   * Get current route path
   */
  getCurrentRoute(): string {
    return this.currentRoute
  }
  
  /**
   * Go back in history
   */
  goBack(): void {
    window.history.back()
  }
  
  /**
   * Go forward in history
   */
  goForward(): void {
    window.history.forward()
  }
  
  /**
   * Replace current route without adding to history
   */
  replace(path: string): void {
    this.navigate(path, false)
    window.history.replaceState({ path }, '', path)
  }
  
  /**
   * Setup default application routes
   */
  private setupDefaultRoutes(): void {
    // Home - Landing page for non-authenticated users, Dashboard for authenticated users
    this.addRoute('/', async () => {
      if (this.isAuthenticated()) {
        const { renderDashboard } = await import('../components/Dashboard')
        await renderDashboard()
        document.title = 'Dashboard - Journal for Me'
      } else {
        const { renderLandingPage } = await import('../components/LandingPage')
        renderLandingPage()
        document.title = 'Journal for Me - Your thoughts, beautifully organized'
      }
    }, { title: 'Home' })
    
    // Login
    this.addRoute('/login', async () => {
      const { renderLogin } = await import('../components/Auth')
      renderLogin()
    }, { title: 'Login' })
    
    // Register
    this.addRoute('/register', async () => {
      const { renderRegister } = await import('../components/Auth')
      renderRegister()
    }, { title: 'Register' })
    
    // Write/Edit Entry
    this.addRoute('/write', async () => {
      const { renderEditor } = await import('../components/Editor')
      renderEditor()
    }, { title: 'Write', requiresAuth: true })
    
    this.addRoute('/write/:id', async () => {
      const { renderEditor } = await import('../components/Editor')
      const entryId = this.extractParam(this.currentRoute, 'id') || undefined
      renderEditor(entryId)
    }, { title: 'Edit Entry', requiresAuth: true })
    
    // Entry View
    this.addRoute('/entry/:id', async () => {
      const { renderEntryView } = await import('../components/EntryView')
      const entryId = this.extractParam(this.currentRoute, 'id') || undefined
      renderEntryView(entryId)
    }, { title: 'Entry', requiresAuth: true })
    
    // Calendar
    this.addRoute('/calendar', async () => {
      const { renderCalendar } = await import('../components/Calendar')
      renderCalendar()
    }, { title: 'Calendar', requiresAuth: true })
    
    // Search
    this.addRoute('/search', async () => {
      const { renderSearch } = await import('../components/Search')
      renderSearch()
    }, { title: 'Search', requiresAuth: true })
    
    // Settings
    this.addRoute('/settings', async () => {
      const { renderSettings } = await import('../components/Settings')
      renderSettings()
    }, { title: 'Settings', requiresAuth: true })
    
    // 404 Error
    this.addRoute('/404', async () => {
      this.render404()
    }, { title: 'Page Not Found' })
    
    // General Error
    this.addRoute('/error', async () => {
      this.renderError()
    }, { title: 'Error' })
  }
  
  /**
   * Find route by path (supports parameters)
   */
  private findRoute(path: string): Route | undefined {
    // First try exact match
    if (this.routes.has(path)) {
      return this.routes.get(path)
    }
    
    // Then try pattern matching for parameterized routes
    for (const [routePath, route] of this.routes) {
      if (this.matchRoute(routePath, path)) {
        return route
      }
    }
    
    return undefined
  }
  
  /**
   * Check if route pattern matches path
   */
  private matchRoute(pattern: string, path: string): boolean {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    
    if (patternParts.length !== pathParts.length) {
      return false
    }
    
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index]
    })
  }
  
  /**
   * Extract parameter from route
   */
  private extractParam(path: string, paramName: string): string | null {
    // Find matching route pattern
    for (const routePath of this.routes.keys()) {
      if (this.matchRoute(routePath, path)) {
        const patternParts = routePath.split('/')
        const pathParts = path.split('/')
        
        const paramIndex = patternParts.findIndex(part => part === `:${paramName}`)
        if (paramIndex !== -1) {
          return pathParts[paramIndex]
        }
      }
    }
    
    return null
  }
  
  /**
   * Handle browser back/forward navigation
   */
  private handlePopState(event: PopStateEvent): void {
    const path = event.state?.path || window.location.pathname
    this.navigate(path, false)
  }
  
  /**
   * Check if user is authenticated
   */
  private isAuthenticated(): boolean {
          // Check if app store has a user
      try {
        // Import dynamically to avoid circular dependencies
        const appStore = (window as any).appStore
        if (appStore) {
          const state = appStore.getState()
          console.log('🔐 Auth check - user state:', state.user ? `${state.user.email}` : 'null')
          console.log('🔐 Auth check - full state:', { 
            hasUser: !!state.user, 
            entriesCount: state.entries.length,
            isLoading: state.isLoading 
          })
          return state.user !== null
        }
        console.log('🔐 Auth check - no app store found')
        return false
      } catch (error) {
        console.log('🔐 Auth check - error:', error)
        return false
      }
  }
  
  /**
   * Render 404 page
   */
  private render404(): void {
    const appContainer = document.getElementById('app')
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
            <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
            <button 
              onclick="history.back()" 
              class="mt-6 btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      `
    }
  }
  
  /**
   * Render error page
   */
  private renderError(): void {
    const appContainer = document.getElementById('app')
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">Oops!</h1>
            <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">Something went wrong</p>
            <button 
              onclick="location.reload()" 
              class="mt-6 btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      `
    }
  }
}
