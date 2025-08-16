import { appStore } from '../stores/AppStore'

/**
 * Dashboard component - Main landing page for authenticated users
 */

export async function renderDashboard(): Promise<void> {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  // Get real data from the store
  const state = appStore.getState()
  const stats = await appStore.getWritingStats()
  const recentEntries = state.entries.slice(0, 3) // Get 3 most recent
  
  // Calculate today's word count
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEntries = state.entries.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })
  const todayWordCount = todayEntries.reduce((total, entry) => total + entry.wordCount, 0)
  const dailyTarget = state.user?.preferences.dailyWordTarget || 250
  const progressPercentage = Math.min((todayWordCount / dailyTarget) * 100, 100)
  
  mainContent.innerHTML = `
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 animate-slide-up">
          Welcome back! 👋
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400 animate-fade-in">
          Ready to capture your thoughts today? ✨
        </p>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <a href="/write" class="stat-card link-subtle" data-action="new-entry">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl group-hover:animate-bounce-gentle">
              <span class="text-3xl">✍️</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                New Entry
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Start writing ✨</p>
            </div>
          </div>
        </a>
        
        <div class="stat-card cursor-pointer" data-action="view-streak" title="View writing streak details">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900 dark:to-red-800 rounded-xl group-hover:animate-pulse-gentle">
              <span class="text-3xl">🔥</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">${stats.currentStreak} Day Streak</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Keep it up! 💪</p>
            </div>
          </div>
        </div>
        
        <a href="/search" class="stat-card link-subtle" data-action="view-entries">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900 dark:to-pink-800 rounded-xl group-hover:animate-wiggle">
              <span class="text-3xl">📚</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${stats.totalEntries} Entries</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total written 📖</p>
            </div>
          </div>
        </a>
        
        <a href="/settings" class="stat-card link-subtle" data-action="edit-goal">
          <div class="flex items-center">
            <div class="p-3 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 rounded-xl group-hover:animate-bounce-gentle">
              <span class="text-3xl">🎯</span>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">${state.user?.preferences.dailyWordTarget || 250} Words</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Today's goal ⚡</p>
            </div>
          </div>
        </a>
      </div>
      
      <!-- Recent Entries -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Entries</h2>
          <div class="space-y-4">
            ${recentEntries.length > 0 ? 
              recentEntries.map(entry => `
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:-translate-y-1 group" data-entry-id="${entry.id}">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      ${entry.title}
                      ${entry.isFavorite ? '<span class="ml-1">⭐</span>' : ''}
                    </h3>
                    <div class="flex gap-1">
                      ${entry.tags.slice(0, 2).map(tag => `
                        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          ${tag}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ${formatRelativeDate(entry.createdAt)}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    ${convertMarkdownToPlainText(entry.content).slice(0, 120)}${entry.content.length > 120 ? '...' : ''}
                  </p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">${entry.wordCount} words</span>
                  </div>
                </div>
              `).join('') 
              : 
              '<div class="p-8 text-center"><p class="text-gray-500 dark:text-gray-400">No entries yet. <a href="/write" class="link">Create your first entry!</a> ✨</p></div>'
            }
          </div>
          
          <div class="mt-4">
            <a href="/search" class="link text-sm font-medium">
              View all entries ✨
            </a>
          </div>
        </div>
        
        <!-- Writing Stats -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Writing Progress</h2>
          
          <!-- Today's Progress -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Word Count</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">${todayWordCount} / ${dailyTarget} words</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: ${progressPercentage}%"></div>
            </div>
            ${todayWordCount >= dailyTarget ? 
              '<p class="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">🎉 Daily goal achieved!</p>' : 
              todayWordCount > 0 ? 
                `<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">${Math.round(progressPercentage)}% complete</p>` : 
                '<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Start writing to track progress</p>'
            }
          </div>
          
          <!-- Weekly Stats -->
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">This week</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${stats.entriesThisWeek} entries</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">This month</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${stats.entriesThisMonth} entries</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Average words/entry</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${stats.averageWordsPerEntry} words</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Longest streak</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${stats.longestStreak} days</span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <a href="/calendar" class="link text-sm font-medium">
              View calendar 📅
            </a>
          </div>
        </div>
      </div>
    </div>
  `
  
  // Setup event listeners for entry interactions
  setupDashboardEventListeners()
}

/**
 * Convert markdown to plain text for previews
 */
function convertMarkdownToPlainText(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Remove bold and italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove links
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+(.+)$/gm, '$1')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')
    .replace(/^[\s]*\d+\.\s+(.+)$/gm, '$1')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Format date for relative display
 */
function formatRelativeDate(date: Date | string): string {
  const entryDate = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - entryDate.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return entryDate.toLocaleDateString()
}

/**
 * Setup dashboard event listeners
 */
function setupDashboardEventListeners(): void {
  // Entry click handlers
  document.querySelectorAll('[data-entry-id]').forEach(element => {
    element.addEventListener('click', (event) => {
      const entryId = (event.currentTarget as HTMLElement).getAttribute('data-entry-id')
      if (entryId) {
        window.dispatchEvent(new CustomEvent('navigate', { 
          detail: { path: `/entry/${entryId}` } 
        }))
      }
    })
  })
  
  // Stat card click handlers
  document.querySelectorAll('[data-action]').forEach(element => {
    element.addEventListener('click', (event) => {
      const action = (event.currentTarget as HTMLElement).getAttribute('data-action')
      
      switch (action) {
        case 'view-streak':
          // TODO: Show streak details modal
          console.log('Show streak details')
          break
        case 'new-entry':
          window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: '/write' } 
          }))
          break
        case 'view-entries':
          window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: '/search' } 
          }))
          break
        case 'edit-goal':
          window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: '/settings' } 
          }))
          break
      }
    })
  })
}
