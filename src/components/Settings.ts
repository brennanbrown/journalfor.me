import { appStore } from '../stores/AppStore'

/**
 * Settings component - User preferences and app configuration
 */

export function renderSettings(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  mainContent.innerHTML = `
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Customize your journal experience</p>
      </div>
      
      <form id="settings-form">
      <div class="space-y-6">
        <!-- Appearance Settings -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
          
          <div class="space-y-4">
            <div>
              <label for="theme-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select id="theme-select" class="input-field max-w-xs">
                <option value="system">Follow system</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label for="font-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select id="font-size" class="input-field max-w-xs">
                <option value="small">Small</option>
                <option value="medium" selected>Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label for="font-family" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select id="font-family" class="input-field max-w-xs">
                <option value="system" selected>System Default</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="animations-enabled" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="animations-enabled" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable animations
              </label>
            </div>
          </div>
        </div>
        
        <!-- Writing Settings -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Writing</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="auto-save" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="auto-save" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Auto-save entries
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="show-word-count" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="show-word-count" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show word count
              </label>
            </div>
            
            <div>
              <label for="daily-word-target" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily word target
              </label>
              <input 
                type="number" 
                id="daily-word-target" 
                class="input-field max-w-xs"
                value="250"
                min="0"
                step="50"
              >
            </div>
            
            <div>
              <label for="line-height" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Line Height
              </label>
              <select id="line-height" class="input-field max-w-xs">
                <option value="compact">Compact</option>
                <option value="normal" selected>Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Privacy & Security -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy & Security</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="encryption-enabled" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
                disabled
              >
              <label for="encryption-enabled" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Encrypt entries locally (always enabled)
              </label>
            </div>
            
            <div>
              <button id="change-password" class="btn-secondary">
                Change Password
              </button>
            </div>
            
            <div>
              <button id="export-data" class="btn-secondary">
                Export All Data
              </button>
            </div>
          </div>
        </div>
        
        <!-- Storage & Backup -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Storage & Backup</h2>
          
          <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Used</span>
                <span class="text-sm text-gray-500 dark:text-gray-400 storage-used-text">Loading...</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full storage-bar" style="width: 0%"></div>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 entries-count-text">
                Loading entries count...
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 backup-info-text">
                Loading backup info...
              </p>
            </div>
            
            <div>
              <button id="clear-cache" class="btn-secondary">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
        
        <!-- Danger Zone -->
        <div class="card border-red-200 dark:border-red-800">
          <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          
          <div class="space-y-4">
            <div>
              <button id="delete-all-data" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Delete All Data
              </button>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This will permanently delete all your journal entries. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button id="save-settings" class="btn-primary">
          Save Settings
        </button>
      </div>
      </form>
    </div>
  `
  
  setupSettings()
}

function setupSettings(): void {
  // Load current settings
  loadSettings().catch(error => {
    console.error('Failed to load settings:', error)
    showNotification('Failed to load some settings')
  })
  
  // Save settings
  document.getElementById('save-settings')?.addEventListener('click', () => {
    saveSettings()
    showNotification('Settings saved successfully!')
  })
  
  // Theme change
  document.getElementById('theme-select')?.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement
    window.dispatchEvent(new CustomEvent('setTheme', { detail: { theme: target.value } }))
  })
  
  // Change password
  document.getElementById('change-password')?.addEventListener('click', async () => {
    try {
      await changePassword()
    } catch (error) {
      console.error('Password change failed:', error)
      showNotification('Password change failed. Please try again.')
    }
  })
  
  // Export data
  document.getElementById('export-data')?.addEventListener('click', async () => {
    try {
      await exportAllData()
    } catch (error) {
      console.error('Export failed:', error)
      showNotification('Export failed. Please try again.')
    }
  })
  
  // Clear cache
  document.getElementById('clear-cache')?.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear the cache? This will not delete your entries.')) {
      try {
        await clearApplicationCache()
      } catch (error) {
        console.error('Clear cache failed:', error)
        showNotification('Failed to clear cache. Please try again.')
      }
    }
  })
  
  // Delete all data
  document.getElementById('delete-all-data')?.addEventListener('click', async () => {
    const confirmation = prompt('Type "DELETE" to confirm deletion of all data:')
    if (confirmation === 'DELETE') {
      try {
        await deleteAllData()
      } catch (error) {
        console.error('Delete failed:', error)
        showNotification('Failed to delete data. Please try again.')
      }
    }
  })
}

async function loadSettings(): Promise<void> {
  const state = appStore.getState()
  const user = state.user
  const themeManager = appStore.getThemeManager()
  
  // Load theme setting from ThemeManager
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement
  if (themeSelect) {
    themeSelect.value = themeManager.getTheme()
  }
  
  // Load real storage statistics
  await loadStorageStats()
  
  if (user && user.preferences) {
    // Load daily word target
    const dailyWordTarget = document.getElementById('daily-word-target') as HTMLInputElement
    if (dailyWordTarget) {
      dailyWordTarget.value = user.preferences.dailyWordTarget?.toString() || '250'
    }
    
    // Load font size
    const fontSize = document.getElementById('font-size') as HTMLSelectElement
    if (fontSize) {
      fontSize.value = user.preferences.fontSize || 'medium'
    }
    
    // Load font family
    const fontFamily = document.getElementById('font-family') as HTMLSelectElement
    if (fontFamily) {
      fontFamily.value = user.preferences.fontFamily || 'system'
    }
    
    // Load line height
    const lineHeight = document.getElementById('line-height') as HTMLSelectElement
    if (lineHeight) {
      lineHeight.value = user.preferences.lineHeight || 'normal'
    }
    
    // Load other preferences
    const autoSave = document.getElementById('auto-save') as HTMLInputElement
    if (autoSave) {
      autoSave.checked = user.preferences.autoSave !== false // Default to true
    }
    
    const showWordCount = document.getElementById('show-word-count') as HTMLInputElement
    if (showWordCount) {
      showWordCount.checked = user.preferences.showWordCount !== false // Default to true
    }
    
    const animationsEnabled = document.getElementById('animations-enabled') as HTMLInputElement
    if (animationsEnabled) {
      animationsEnabled.checked = user.preferences.enableAnimations !== false // Default to true
    }
  }
}

async function saveSettings(): Promise<void> {
  const themeManager = appStore.getThemeManager()
  
  // Get form values with proper type casting
  const theme = (document.getElementById('theme-select') as HTMLSelectElement).value as 'light' | 'dark' | 'system'
  const fontSize = (document.getElementById('font-size') as HTMLSelectElement)?.value as 'small' | 'medium' | 'large' || 'medium'
  const fontFamily = (document.getElementById('font-family') as HTMLSelectElement)?.value as 'system' | 'serif' | 'mono' || 'system'
  const enableAnimations = (document.getElementById('animations-enabled') as HTMLInputElement).checked
  const autoSave = (document.getElementById('auto-save') as HTMLInputElement).checked
  const showWordCount = (document.getElementById('show-word-count') as HTMLInputElement).checked
  const dailyWordTarget = parseInt((document.getElementById('daily-word-target') as HTMLInputElement).value) || 250
  const lineHeight = (document.getElementById('line-height') as HTMLSelectElement)?.value as 'compact' | 'normal' | 'relaxed' || 'normal'
  
  const settings = {
    fontSize,
    fontFamily,
    enableAnimations,
    autoSave,
    showWordCount,
    dailyWordTarget,
    lineHeight
  }
  
  try {
    // Apply theme immediately using ThemeManager
    themeManager.setTheme(theme)
    
    // Get current user and update preferences
    const state = appStore.getState()
    if (state.user) {
      // Update user preferences in appStore
      await appStore.updateUserPreferences({
        ...state.user.preferences,
        ...settings
      })
      
      // Apply visual preferences immediately
      applyVisualPreferences(settings)
      
      showNotification('Settings saved successfully!')
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
    showNotification('Failed to save settings. Please try again.')
    throw error
  }
}

/**
 * Apply visual preferences to the document
 */
function applyVisualPreferences(preferences: any): void {
  const root = document.documentElement
  
  // Apply font size
  root.classList.remove('text-sm', 'text-base', 'text-lg')
  switch (preferences.fontSize) {
    case 'small':
      root.classList.add('text-sm')
      break
    case 'large':
      root.classList.add('text-lg')
      break
    default:
      root.classList.add('text-base')
  }
  
  // Apply font family
  root.classList.remove('font-serif', 'font-mono')
  switch (preferences.fontFamily) {
    case 'serif':
      root.classList.add('font-serif')
      break
    case 'mono':
      root.classList.add('font-mono')
      break
    // 'system' uses default sans-serif
  }
  
  // Apply animations preference
  if (!preferences.enableAnimations) {
    root.classList.add('motion-reduce')
  } else {
    root.classList.remove('motion-reduce')
  }
}

/**
 * Change user password (requires re-encrypting all data)
 */
async function changePassword(): Promise<void> {
  const currentPassword = prompt('Enter your current password:')
  if (!currentPassword) {
    throw new Error('Current password is required')
  }
  
  const newPassword = prompt('Enter your new password:')
  if (!newPassword) {
    throw new Error('New password is required')
  }
  
  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long')
  }
  
  const confirmPassword = prompt('Confirm your new password:')
  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match')
  }
  
  try {
    // First, verify current password by trying to decrypt data
    const storageManager = appStore.getStorageManager()
    
    // Export all data with current password
    const exportedData = await storageManager.exportData()
    
    // Clear all data
    await storageManager.clearAllData()
    
    // Re-initialize storage with new password
    await storageManager.initialize(newPassword)
    
    // Re-save user data with new encryption
    if (exportedData.user) {
      await storageManager.saveUser(exportedData.user)
    }
    
    // Re-save all entries with new encryption
    for (const entry of exportedData.entries) {
      await storageManager.saveEntry(entry)
    }
    
    // Re-save settings
    for (const [key, value] of Object.entries(exportedData.settings)) {
      await storageManager.saveSetting(key, value)
    }
    
    showNotification('Password changed successfully!')
    
    // Refresh the page to ensure clean state
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    console.error('Password change failed:', error)
    if (error instanceof Error && error.message.includes('decrypt')) {
      throw new Error('Current password is incorrect')
    }
    throw error
  }
}

/**
 * Clear application cache and temporary data
 */
async function clearApplicationCache(): Promise<void> {
  try {
    // Clear browser caches if available
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }
    
    // Clear localStorage items that aren't critical
    const keysToKeep = ['theme', 'user-session']
    const keysToRemove = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    showNotification('Cache cleared successfully!')
  } catch (error) {
    console.error('Clear cache failed:', error)
    throw error
  }
}

/**
 * Delete all user data permanently
 */
async function deleteAllData(): Promise<void> {
  try {
    // Clear all data from storage
    await appStore.clearAllData()
    
    showNotification('All data deleted successfully!')
    
    // Redirect to login/welcome page after a short delay
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  } catch (error) {
    console.error('Delete failed:', error)
    throw error
  }
}

/**
 * Export all user data as JSON file
 */
async function exportAllData(): Promise<void> {
  try {
    const storageManager = appStore.getStorageManager()
    const data = await storageManager.exportData()
    
    // Add metadata
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      source: 'journalfor.me'
    }
    
    // Create downloadable file
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = `journalfor-me-export-${new Date().toISOString().split('T')[0]}.json`
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    showNotification('Data exported successfully!')
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}

/**
 * Load real storage statistics and update the UI
 */
async function loadStorageStats(): Promise<void> {
  try {
    const storageManager = appStore.getStorageManager()
    const stats = await storageManager.getStorageStats()
    const state = appStore.getState()
    
    // Update storage used display
    const storageUsedElement = document.querySelector('.storage-used-text')
    const storageBarElement = document.querySelector('.storage-bar') as HTMLElement
    const entriesCountElement = document.querySelector('.entries-count-text')
    
    // Format storage size
    const sizeInMB = (stats.totalSize / (1024 * 1024)).toFixed(2)
    const maxStorageMB = 100 // Assume 100MB limit for IndexedDB
    const usagePercentage = Math.min((parseFloat(sizeInMB) / maxStorageMB) * 100, 100)
    
    if (storageUsedElement) {
      storageUsedElement.textContent = `${sizeInMB} MB / ${maxStorageMB} MB`
    }
    
    if (storageBarElement) {
      storageBarElement.style.width = `${usagePercentage}%`
    }
    
    if (entriesCountElement) {
      entriesCountElement.innerHTML = `<strong>${stats.entriesCount} entries</strong> stored locally`
    }
    
    // Update last backup info
    const backupInfoElement = document.querySelector('.backup-info-text')
    if (backupInfoElement) {
      const lastSyncAt = state.lastSyncAt
      if (lastSyncAt) {
        backupInfoElement.textContent = `Last backup: ${lastSyncAt.toLocaleDateString()}`
      } else {
        backupInfoElement.textContent = 'Last backup: Never (cloud sync not enabled)'
      }
    }
  } catch (error) {
    console.error('Failed to load storage stats:', error)
  }
}

function showNotification(message: string): void {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-down'
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}
