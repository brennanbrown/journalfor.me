import { appStore } from '../stores/AppStore'

/**
 * Calendar component - Visual overview of journal entries
 */

let currentDate = new Date()

export function renderCalendar(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  mainContent.innerHTML = `
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
        <div class="flex space-x-2">
          <button id="prev-month" class="btn-ghost">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button id="today-btn" class="btn-secondary">Today</button>
          <button id="next-month" class="btn-ghost">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div class="card">
        <div class="mb-6 text-center">
          <h2 id="current-month" class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        
        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1 mb-4">
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Sun</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Mon</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Tue</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Wed</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Thu</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Fri</div>
          <div class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">Sat</div>
        </div>
        
        <div id="calendar-grid" class="calendar-grid grid grid-cols-7 gap-1">
          ${generateCalendarDays()}
        </div>
      </div>
      
      <!-- Legend -->
      <div class="mt-6 card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Legend</h3>
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Has entry</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Multiple entries</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Favorite entry</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 border-2 border-blue-500 rounded mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      </div>
    </div>
  `
  
  setupCalendar()
}

function generateCalendarDays(): string {
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  // Get entries from app store
  const state = appStore.getState()
  const entriesByDate = new Map<string, any[]>()
  
  // Group entries by date
  state.entries.forEach(entry => {
    const entryDate = new Date(entry.createdAt)
    const dateKey = entryDate.toISOString().split('T')[0]
    if (!entriesByDate.has(dateKey)) {
      entriesByDate.set(dateKey, [])
    }
    entriesByDate.get(dateKey)!.push(entry)
  })
  
  const days = []
  const iterDate = new Date(startDate)
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = iterDate.getMonth() === currentMonth
    const isToday = iterDate.toDateString() === today.toDateString()
    const dayNumber = iterDate.getDate()
    const dateKey = iterDate.toISOString().split('T')[0]
    
    // Get real entry data for this date
    const dayEntries = entriesByDate.get(dateKey) || []
    const hasEntry = dayEntries.length > 0
    const hasMultiple = dayEntries.length > 1
    const isFavorite = dayEntries.some(entry => entry.isFavorite)
    
    let dayClass = 'calendar-day p-2 h-16 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors'
    
    if (!isCurrentMonth) {
      dayClass += ' text-gray-400 dark:text-gray-500'
    } else {
      dayClass += ' text-gray-900 dark:text-gray-100'
    }
    
    if (isToday) {
      dayClass += ' ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900'
    }
    
    if (hasEntry && isCurrentMonth) {
      dayClass += ' has-entries'
    }
    
    let indicator = ''
    if (hasEntry && isCurrentMonth) {
      if (isFavorite) {
        indicator = '<div class="w-2 h-2 bg-yellow-500 rounded-full ml-auto"></div>'
      } else if (hasMultiple) {
        indicator = '<div class="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>'
      } else {
        indicator = '<div class="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>'
      }
    }
    
    days.push(`
      <div class="${dayClass}" data-date="${iterDate.toISOString().split('T')[0]}">
        <div class="flex justify-between items-start h-full">
          <span class="text-sm font-medium">${dayNumber}</span>
          ${indicator}
        </div>
      </div>
    `)
    
    iterDate.setDate(iterDate.getDate() + 1)
  }
  
  return days.join('')
}

function updateMonthDisplay(): void {
  const monthDisplay = document.getElementById('current-month')
  if (monthDisplay) {
    monthDisplay.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
}

function updateCalendarGrid(): void {
  const calendarGrid = document.getElementById('calendar-grid')
  if (calendarGrid) {
    calendarGrid.innerHTML = generateCalendarDays()
    
    // Re-attach event listeners to new calendar days
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLElement
        const date = target.getAttribute('data-date')
        if (date) {
          const state = appStore.getState()
          const dayEntries = state.entries.filter(entry => {
            const entryDate = new Date(entry.createdAt)
            return entryDate.toISOString().split('T')[0] === date
          })
          
          if (dayEntries.length > 0) {
            window.dispatchEvent(new CustomEvent('navigate', { 
              detail: { path: `/entry/${dayEntries[0].id}` } 
            }))
          } else {
            window.dispatchEvent(new CustomEvent('navigate', { 
              detail: { path: `/write?date=${date}` } 
            }))
          }
        }
      })
    })
  }
}

function setupCalendar(): void {
  // Calendar navigation
  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1)
    updateMonthDisplay()
    updateCalendarGrid()
  })
  
  document.getElementById('next-month')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1)
    updateMonthDisplay()
    updateCalendarGrid()
  })
  
  document.getElementById('today-btn')?.addEventListener('click', () => {
    currentDate = new Date()
    updateMonthDisplay()
    updateCalendarGrid()
  })
  
  // Day click handlers
  document.querySelectorAll('.calendar-day').forEach(day => {
    day.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement
      const date = target.getAttribute('data-date')
      if (date) {
        // Check if there are entries for this date
        const state = appStore.getState()
        const dayEntries = state.entries.filter(entry => {
          const entryDate = new Date(entry.createdAt)
          return entryDate.toISOString().split('T')[0] === date
        })
        
        if (dayEntries.length > 0) {
          // Navigate to the first entry for this date
          window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/entry/${dayEntries[0].id}` } 
          }))
        } else {
          // Create new entry for this date
          window.dispatchEvent(new CustomEvent('navigate', { 
            detail: { path: `/write?date=${date}` } 
          }))
        }
      }
    })
  })
}
