/**
 * Core types for the journal application
 */

export interface JournalEntry {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isFavorite: boolean
  wordCount: number
  isEncrypted: boolean
}

export interface User {
  id: string
  email?: string
  createdAt: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  lineHeight: 'compact' | 'normal' | 'relaxed'
  fontFamily: 'system' | 'serif' | 'mono'
  autoSave: boolean
  showWordCount: boolean
  enableAnimations: boolean
  dailyWordTarget: number
}

export interface AppState {
  user: User | null
  currentEntry: JournalEntry | null
  entries: JournalEntry[]
  isLoading: boolean
  isOffline: boolean
  lastSyncAt: Date | null
}

export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
}

export interface SearchOptions {
  query: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy: 'date' | 'title' | 'relevance'
  sortOrder: 'asc' | 'desc'
}

export interface ExportOptions {
  format: 'pdf' | 'html' | 'markdown' | 'text'
  entries: string[] // entry IDs
  includeMetadata: boolean
  includeStats: boolean
}

export interface WritingStats {
  totalEntries: number
  totalWords: number
  averageWordsPerEntry: number
  longestStreak: number
  currentStreak: number
  writingDays: number
  monthlyStats: {
    month: string
    entries: number
    words: number
  }[]
}

// Router types
export type RouteHandler = () => void | Promise<void>

export interface Route {
  path: string
  handler: RouteHandler
  title?: string
  requiresAuth?: boolean
}

// Storage types
export interface StorageItem<T = any> {
  id: string
  data: T
  createdAt: Date
  updatedAt: Date
}

// Event types
export interface AppEvent {
  type: string
  payload?: any
  timestamp: Date
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type EventCallback<T = any> = (event: AppEvent & { payload: T }) => void
