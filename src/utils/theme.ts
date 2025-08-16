import type { UserPreferences } from '../types'

/**
 * Theme management utility
 */
export class ThemeManager {
  private currentTheme: 'light' | 'dark' | 'system' = 'system'
  private mediaQuery: MediaQueryList
  
  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  }
  
  /**
   * Initialize theme system
   */
  async initialize(): Promise<void> {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system'
    this.currentTheme = savedTheme
    
    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this))
    
    // Apply initial theme
    this.applyTheme()
    
    // Setup theme meta tag for PWA
    this.updateThemeColor()
  }
  
  /**
   * Set theme preference
   */
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    this.applyTheme()
    this.updateThemeColor()
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: this.getEffectiveTheme() } 
    }))
  }
  
  /**
   * Get current theme preference
   */
  getTheme(): 'light' | 'dark' | 'system' {
    return this.currentTheme
  }
  
  /**
   * Get effective theme (resolves 'system' to actual theme)
   */
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light'
    }
    return this.currentTheme
  }
  
  /**
   * Toggle between light and dark theme
   */
  toggleTheme(): void {
    const currentEffective = this.getEffectiveTheme()
    this.setTheme(currentEffective === 'dark' ? 'light' : 'dark')
  }
  
  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    const effectiveTheme = this.getEffectiveTheme()
    const htmlElement = document.documentElement
    
    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
    
    // Add smooth transition for theme changes
    htmlElement.style.transition = 'background-color 0.2s ease, color 0.2s ease'
    
    // Remove transition after animation completes
    setTimeout(() => {
      htmlElement.style.transition = ''
    }, 200)
  }
  
  /**
   * Handle system theme preference changes
   */
  private handleSystemThemeChange(): void {
    if (this.currentTheme === 'system') {
      this.applyTheme()
      this.updateThemeColor()
      
      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: this.getEffectiveTheme() } 
      }))
    }
  }
  
  /**
   * Update theme-color meta tag for PWA
   */
  private updateThemeColor(): void {
    const effectiveTheme = this.getEffectiveTheme()
    const themeColor = effectiveTheme === 'dark' ? '#111827' : '#ffffff'
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', themeColor)
  }
  
  /**
   * Get theme-aware colors for dynamic styling
   */
  getColors() {
    const effectiveTheme = this.getEffectiveTheme()
    
    if (effectiveTheme === 'dark') {
      return {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        accent: '#06b6d4'
      }
    } else {
      return {
        primary: '#2563eb',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        textSecondary: '#4b5563',
        border: '#e5e7eb',
        accent: '#0891b2'
      }
    }
  }
}
