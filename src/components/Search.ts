import { appStore } from '../stores/AppStore'

/**
 * Search component - Find and filter journal entries
 */

export function renderSearch(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  mainContent.innerHTML = `
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Search Entries</h1>
        
        <!-- Search Form -->
        <div class="card">
          <div class="space-y-4">
            <div>
              <label for="search-query" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div class="flex">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    id="search-query" 
                    class="input-field pl-10 rounded-r-none" 
                    placeholder="Search your entries..."
                  >
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
                <button id="search-button" class="btn-primary rounded-l-none">
                  Search
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="tag-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <select id="tag-filter" class="input-field">
                  <option value="">All tags</option>
                  ${getAvailableTags().map(tag => `<option value="${tag}">${tag}</option>`).join('')}
                </select>
              </div>
              
              <div>
                <label for="date-from" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From Date
                </label>
                <input type="date" id="date-from" class="input-field">
              </div>
              
              <div>
                <label for="date-to" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To Date
                </label>
                <input type="date" id="date-to" class="input-field">
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <label class="flex items-center">
                  <input type="checkbox" id="favorites-only" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded">
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Favorites only</span>
                </label>
              </div>
              
              <button id="clear-filters" class="btn-ghost">
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Search Results -->
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Search Results <span id="results-count" class="text-gray-500 dark:text-gray-400">(3 entries)</span>
          </h2>
          
          <div class="flex items-center space-x-2">
            <label for="sort-by" class="text-sm text-gray-700 dark:text-gray-300">Sort by:</label>
            <select id="sort-by" class="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded">
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title">Title A-Z</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>
        
        <!-- Results List -->
        <div id="search-results" class="space-y-4">
          ${generateSearchResults({ query: '', tag: '', dateFrom: '', dateTo: '', favoritesOnly: false, sortBy: 'date-desc' })}
        </div>
        
        <!-- Load More -->
        <div class="text-center">
          <button id="load-more" class="btn-secondary">
            Load more results
          </button>
        </div>
      </div>
    </div>
  `
  
  setupSearch()
}

/**
 * Get all available tags from entries
 */
function getAvailableTags(): string[] {
  const state = appStore.getState()
  const allTags = new Set<string>()
  
  state.entries.forEach(entry => {
    entry.tags.forEach((tag: string) => allTags.add(tag))
  })
  
  return Array.from(allTags).sort()
}

function generateSearchResults(filters: any): string {
  const state = appStore.getState()
  let entries = [...state.entries]
  
  // Apply filters
  if (filters.query) {
    const query = filters.query.toLowerCase()
    entries = entries.filter(entry => 
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (filters.tag) {
    entries = entries.filter(entry => entry.tags.includes(filters.tag))
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom)
    entries = entries.filter(entry => new Date(entry.createdAt) >= fromDate)
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo)
    toDate.setHours(23, 59, 59, 999) // End of day
    entries = entries.filter(entry => new Date(entry.createdAt) <= toDate)
  }
  
  if (filters.favoritesOnly) {
    entries = entries.filter(entry => entry.isFavorite)
  }
  
  // Sort entries
  switch (filters.sortBy) {
    case 'date-asc':
      entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'title':
      entries.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'date-desc':
    default:
      entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }
  
  // Update results count
  const resultsCount = document.getElementById('results-count')
  if (resultsCount) {
    resultsCount.textContent = `(${entries.length} ${entries.length === 1 ? 'entry' : 'entries'})`
  }
  
  if (entries.length === 0) {
    return `
      <div class="card text-center py-12">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No entries found</p>
        <p class="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or <a href="/write" class="link">create a new entry</a></p>
      </div>
    `
  }
  
  return entries.map(entry => `
    <div class="card hover:shadow-md transition-shadow duration-200 cursor-pointer" data-entry-id="${entry.id}">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ${entry.title}
          ${entry.isFavorite ? '<i class="fas fa-star text-yellow-500 ml-2"></i>' : ''}
        </h3>
        <span class="text-sm text-gray-500 dark:text-gray-400">${formatDate(entry.createdAt.toISOString())}</span>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">${convertMarkdownToPlainText(entry.content).slice(0, 200)}${entry.content.length > 200 ? '...' : ''}</p>
      
      <div class="flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          ${entry.tags.map(tag => `
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              ${tag}
            </span>
          `).join('')}
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>${entry.wordCount} words</span>
          <div class="flex space-x-2">
            <button class="hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="hover:text-red-600 dark:hover:text-red-400" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('')
}

/**
 * Convert markdown to plain text for search previews
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function setupSearch(): void {
  const searchQuery = document.getElementById('search-query') as HTMLInputElement
  const searchButton = document.getElementById('search-button') as HTMLButtonElement
  const tagFilter = document.getElementById('tag-filter') as HTMLSelectElement
  const dateFrom = document.getElementById('date-from') as HTMLInputElement
  const dateTo = document.getElementById('date-to') as HTMLInputElement
  const favoritesOnly = document.getElementById('favorites-only') as HTMLInputElement
  const sortBy = document.getElementById('sort-by') as HTMLSelectElement
  
  // Search functionality
  function performSearch(): void {
    const filters = {
      query: searchQuery.value,
      tag: tagFilter.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      favoritesOnly: favoritesOnly.checked,
      sortBy: sortBy.value
    }
    
    // Update search results
    const searchResults = document.getElementById('search-results')
    if (searchResults) {
      searchResults.innerHTML = generateSearchResults(filters)
      
      // Re-attach event listeners to new results
      searchResults.querySelectorAll('[data-entry-id]').forEach(entry => {
        entry.addEventListener('click', (event) => {
          const target = event.currentTarget as HTMLElement
          const entryId = target.getAttribute('data-entry-id')
          if (entryId) {
            window.dispatchEvent(new CustomEvent('navigate', { 
              detail: { path: `/entry/${entryId}` } 
            }))
          }
        })
      })
    }
  }
  
  // Event listeners
  searchQuery?.addEventListener('input', performSearch)
  searchButton?.addEventListener('click', performSearch)
  tagFilter?.addEventListener('change', performSearch)
  dateFrom?.addEventListener('change', performSearch)
  dateTo?.addEventListener('change', performSearch)
  favoritesOnly?.addEventListener('change', performSearch)
  sortBy?.addEventListener('change', performSearch)
  
  // Clear filters
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    searchQuery.value = ''
    tagFilter.value = ''
    dateFrom.value = ''
    dateTo.value = ''
    favoritesOnly.checked = false
    sortBy.value = 'date-desc'
    performSearch()
  })
  
  // Entry click handlers
  document.querySelectorAll('[data-entry-id]').forEach(entry => {
    entry.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      const entryId = target.getAttribute('data-entry-id')
      console.log('Clicked entry:', entryId)
      // TODO: Navigate to entry view
    })
  })
  
  // Load more
  document.getElementById('load-more')?.addEventListener('click', () => {
    console.log('Load more results')
    // TODO: Implement pagination
  })
}
