import { appStore } from '../stores/AppStore'
import { convertMarkdownToHTML } from '../utils/markdown'

/**
 * Entry View component - Display a single journal entry
 */

export function renderEntryView(entryId?: string): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  if (!entryId) {
    mainContent.innerHTML = `
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p class="text-xl text-gray-600 dark:text-gray-400">Entry not found</p>
        </div>
      </div>
    `
    return
  }
  
  // Get real entry data from app store
  const state = appStore.getState()
  const entry = state.entries.find(e => e.id === entryId)
  
  if (!entry) {
    mainContent.innerHTML = `
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p class="text-xl text-gray-600 dark:text-gray-400">Entry not found</p>
          <p class="text-gray-500 dark:text-gray-400 mt-2">The entry you're looking for doesn't exist or may have been deleted.</p>
          <a href="/" class="btn-primary mt-4 inline-block">
            <i class="fas fa-home mr-2"></i>Back to Dashboard
          </a>
        </div>
      </div>
    `
    return
  }
  
  mainContent.innerHTML = `
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ${entry.title}
            ${entry.isFavorite ? '<i class="fas fa-star text-yellow-500 ml-2"></i>' : ''}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span><i class="fas fa-calendar mr-1"></i>${formatDate(entry.createdAt.toISOString())}</span>
            <span><i class="fas fa-clock mr-1"></i>${formatTime(entry.createdAt.toISOString())}</span>
            <span><i class="fas fa-edit mr-1"></i>Updated ${formatRelativeTime(entry.updatedAt.toISOString())}</span>
            <span><i class="fas fa-font mr-1"></i>${entry.wordCount} words</span>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button id="favorite-btn" class="btn-ghost" title="${entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
            <i class="fas fa-star ${entry.isFavorite ? 'text-yellow-500' : 'text-gray-400'}"></i>
          </button>
          <button id="edit-btn" class="btn-secondary">
            <i class="fas fa-edit mr-2"></i>Edit
          </button>
          <button id="print-btn" class="btn-ghost" title="Print">
            <i class="fas fa-print"></i>
          </button>
          <button id="share-btn" class="btn-ghost" title="Share">
            <i class="fas fa-share"></i>
          </button>
          <button id="delete-btn" class="btn-ghost text-red-600 dark:text-red-400" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <!-- Tags -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          ${entry.tags.map(tag => `
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <i class="fas fa-tag mr-1"></i>${tag}
            </span>
          `).join('')}
        </div>
      </div>
      
      <!-- Content -->
      <div class="card">
        <div id="entry-content" class="entry-content prose dark:prose-invert max-w-none">
          ${convertMarkdownToHTML(entry.content)}
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="mt-8 flex justify-between items-center">
        <button id="prev-entry" class="btn-ghost">
          <i class="fas fa-chevron-left mr-2"></i>Previous Entry
        </button>
        
        <a href="/" class="btn-secondary">
          <i class="fas fa-home mr-2"></i>Back to Dashboard
        </a>
        
        <button id="next-entry" class="btn-ghost">
          Next Entry<i class="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  `
  
  setupEntryView(entry)
}

// convertMarkdownToHTML function is now imported from shared utils/markdown.ts

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(dateString)
}

function setupEntryView(entry: any): void {
  // Favorite toggle
  document.getElementById('favorite-btn')?.addEventListener('click', () => {
    // TODO: Toggle favorite status
    console.log('Toggle favorite for entry:', entry.id)
  })
  
  // Edit button
  document.getElementById('edit-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { 
      detail: { path: `/write/${entry.id}` } 
    }))
  })
  
  // Print button
  document.getElementById('print-btn')?.addEventListener('click', () => {
    window.print()
  })
  
  // Share button
  document.getElementById('share-btn')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: entry.title,
        text: entry.content.substring(0, 200) + '...',
        url: window.location.href
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      showNotification('Link copied to clipboard!')
    }
  })
  
  // Delete button
  document.getElementById('delete-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      // TODO: Delete entry
      console.log('Delete entry:', entry.id)
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/' } }))
    }
  })
  
  // Navigation
  document.getElementById('prev-entry')?.addEventListener('click', () => {
    // TODO: Navigate to previous entry
    console.log('Navigate to previous entry')
  })
  
  document.getElementById('next-entry')?.addEventListener('click', () => {
    // TODO: Navigate to next entry
    console.log('Navigate to next entry')
  })
}

function showNotification(message: string): void {
  const notification = document.createElement('div')
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-down'
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}
