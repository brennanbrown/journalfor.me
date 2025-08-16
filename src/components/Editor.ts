import { appStore } from '../stores/AppStore'

/**
 * Markdown Editor component
 */

export function renderEditor(entryId?: string): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return
  
  const isEditing = Boolean(entryId)
  const currentEntryId = entryId // Capture entryId in scope
  
  mainContent.innerHTML = `
    <div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ${isEditing ? 'Edit Entry' : 'New Entry'}
        </h1>
        <div class="flex space-x-3">
          <button id="save-btn" class="btn-primary">
            <i class="fas fa-save mr-2"></i>Save
          </button>
          <button id="cancel-btn" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Editor Panel -->
        <div class="card">
          <div class="mb-4">
            <label for="entry-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input 
              type="text" 
              id="entry-title" 
              class="input-field" 
              placeholder="Enter your entry title..."
              value="${isEditing ? 'Sample Entry Title' : ''}"
            >
          </div>
          
          <div class="mb-4">
            <label for="entry-content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea 
              id="editor-textarea" 
              rows="20" 
              class="input-field font-mono text-sm" 
              placeholder="Start writing your thoughts..."
            >${isEditing ? 'This is a sample entry content in **Markdown** format.\n\n## Today was interesting\n\nI learned about:\n- TypeScript\n- PWAs\n- IndexedDB\n\nOverall a productive day!' : ''}</textarea>
          </div>
          
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span id="word-count">0 words</span>
            <span id="auto-save-status">All changes saved</span>
          </div>
        </div>
        
        <!-- Preview Panel -->
        <div class="card">
          <div class="mb-4 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Preview</h3>
            <button id="fullscreen-btn" class="btn-ghost text-sm">
              <i class="fas fa-expand mr-1"></i>Fullscreen
            </button>
          </div>
          
          <div id="editor-preview" class="prose dark:prose-invert max-w-none">
            ${isEditing ? 
              '<h1>Sample Entry Title</h1><p>This is a sample entry content in <strong>Markdown</strong> format.</p><h2>Today was interesting</h2><p>I learned about:</p><ul><li>TypeScript</li><li>PWAs</li><li>IndexedDB</li></ul><p>Overall a productive day!</p>' :
              '<p class="text-gray-400 italic">Preview will appear here as you type...</p>'
            }
          </div>
        </div>
      </div>
      
      <!-- Entry Metadata -->
      <div class="mt-6 card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Entry Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="entry-tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input 
              type="text" 
              id="entry-tags" 
              class="input-field" 
              placeholder="personal, reflection, coding"
              value="${isEditing ? 'personal, coding, learning' : ''}"
            >
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="entry-favorite" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              ${isEditing ? 'checked' : ''}
            >
            <label for="entry-favorite" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Mark as favorite
            </label>
          </div>
        </div>
      </div>
    </div>
  `
  
  setupEditor(currentEntryId)
}

function setupEditor(entryId?: string): void {
  const titleInput = document.getElementById('entry-title') as HTMLInputElement
  const contentTextarea = document.getElementById('editor-textarea') as HTMLTextAreaElement
  const previewContent = document.getElementById('editor-preview') as HTMLDivElement
  const wordCountSpan = document.getElementById('word-count') as HTMLSpanElement
  const autoSaveStatus = document.getElementById('auto-save-status') as HTMLSpanElement
  
  // Update word count
  function updateWordCount(): void {
    const content = contentTextarea.value
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    wordCountSpan.textContent = `${words} words`
  }
  
  // Update preview with improved markdown parsing
  function updatePreview(): void {
    const content = contentTextarea.value
    if (!content.trim()) {
      previewContent.innerHTML = '<p class="text-gray-400 italic">Preview will appear here as you type...</p>'
      return
    }
    
    // Improved markdown parsing with proper order and styling
    let html = content
    
    // First, handle code blocks (to protect them from other processing)
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto"><code>$1</code></pre>')
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono">$1</code>')
    
    // Handle headings (before other formatting)
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h1>')
    
    // Handle lists (before paragraph processing)
    const lines = html.split('\n')
    let inList = false
    let processedLines = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isListItem = /^[-*+] (.+)$/.test(line.trim())
      
      if (isListItem && !inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-1 my-3 text-gray-700 dark:text-gray-300">')
        inList = true
      } else if (!isListItem && inList) {
        processedLines.push('</ul>')
        inList = false
      }
      
      if (isListItem) {
        const listContent = line.replace(/^[-*+] (.+)$/, '$1')
        processedLines.push(`<li class="ml-4">${listContent}</li>`)
      } else {
        processedLines.push(line)
      }
    }
    
    if (inList) {
      processedLines.push('</ul>')
    }
    
    html = processedLines.join('\n')
    
    // Handle text formatting (bold, italic)
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    
    // Handle links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">$1</a>')
    
    // Handle paragraphs (split by double newlines, but avoid wrapping headings and lists)
    const paragraphs = html.split(/\n\s*\n/)
    const processedParagraphs = paragraphs.map(para => {
      const trimmed = para.trim()
      if (!trimmed) return ''
      
      // Don't wrap headings, lists, or code blocks in paragraphs
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || 
          trimmed.startsWith('<pre') || trimmed.includes('</h') || 
          trimmed.includes('</ul>') || trimmed.includes('</pre>')) {
        return trimmed
      }
      
      return `<p class="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">${trimmed}</p>`
    })
    
    html = processedParagraphs.filter(p => p).join('\n')
    
    previewContent.innerHTML = html
  }
  
  // Event listeners
  contentTextarea?.addEventListener('input', () => {
    updateWordCount()
    updatePreview()
    autoSaveStatus.textContent = 'Saving...'
    
    // Simulate auto-save
    setTimeout(() => {
      autoSaveStatus.textContent = 'All changes saved'
    }, 1000)
  })
  
  titleInput?.addEventListener('input', () => {
    autoSaveStatus.textContent = 'Saving...'
    setTimeout(() => {
      autoSaveStatus.textContent = 'All changes saved'
    }, 1000)
  })
  
  // Save button
  document.getElementById('save-btn')?.addEventListener('click', async () => {
    console.log('Saving entry...', { entryId, isEditing: Boolean(entryId) })
    
    const title = titleInput?.value.trim()
    const content = contentTextarea?.value.trim()
    const tagsInput = document.getElementById('entry-tags') as HTMLInputElement
    const favoriteCheckbox = document.getElementById('entry-favorite') as HTMLInputElement
    
    if (!title || !content) {
      alert('Please enter both a title and content for your entry.')
      return
    }
    
    // Update save status
    autoSaveStatus.textContent = 'Saving...'
    const saveBtn = document.getElementById('save-btn') as HTMLButtonElement
    const originalText = saveBtn.innerHTML
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...'
    saveBtn.disabled = true
    
    try {
      // Parse tags from input field
      const tagsFromInput = tagsInput?.value
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0) || []
      
      // Also extract hashtags from content
      const hashtagMatches = content.match(/#\w+/g) || []
      const hashtagsFromContent = hashtagMatches.map(tag => tag.substring(1).toLowerCase())
      
      // Combine and deduplicate tags
      const allTags = [...new Set([...tagsFromInput, ...hashtagsFromContent])]
      
      const isFavorite = favoriteCheckbox?.checked || false
      
      let result
      if (entryId) {
        // Update existing entry
        result = await appStore.updateEntry(entryId, { 
          title, 
          content, 
          tags: allTags,
          isFavorite 
        })
        console.log('✅ Entry updated successfully!', result)
      } else {
        // Create new entry
        result = await appStore.createEntry(title, content, allTags)
        if (isFavorite && result) {
          await appStore.toggleFavorite(result.id)
        }
        console.log('✅ Entry created successfully!', result)
      }
      
      // Update save status
      autoSaveStatus.textContent = 'All changes saved'
      
      // Navigate back to dashboard
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { path: '/' } 
      }))
      
    } catch (error) {
      console.error('Error saving entry:', error)
      autoSaveStatus.textContent = 'Save failed'
      alert(`Failed to save entry: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Restore save button
      saveBtn.innerHTML = originalText
      saveBtn.disabled = false
    }
  })
  
  // Cancel button
  document.getElementById('cancel-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to discard changes?')) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/' } }))
    }
  })
  
  // Fullscreen toggle
  document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
    // TODO: Implement fullscreen mode
    console.log('Toggle fullscreen')
  })
  
  // Initial updates
  updateWordCount()
  updatePreview()
}
