/**
 * Shared markdown conversion utilities
 * Used by both EntryView and Editor components for consistent rendering
 */

export function convertMarkdownToHTML(markdown: string): string {
  // Enhanced markdown conversion with proper spacing and styling
  let html = markdown
  
  // Convert headers with proper CSS classes
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 first:mt-0">$1</h1>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">$1</h2>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-4">$1</h3>')
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">$1</h4>')
  html = html.replace(/^##### (.+)$/gm, '<h5 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3">$1</h5>')
  html = html.replace(/^###### (.+)$/gm, '<h6 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3">$1</h6>')
  
  // Convert bold and italic with proper styling
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
  
  // Convert blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 text-gray-700 dark:text-gray-300 italic">$1</blockquote>')
  
  // Convert horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-gray-300 dark:border-gray-600 my-6">')
  
  // Convert lists - handle unordered lists
  html = convertUnorderedLists(html)
  html = convertOrderedLists(html)
  
  // Convert paragraphs with proper spacing
  html = convertParagraphs(html)
  
  return html
}

function convertUnorderedLists(html: string): string {
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inList = false
  let currentListItems: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const listMatch = line.match(/^- (.+)$/)
    
    if (listMatch) {
      if (!inList) {
        inList = true
      }
      currentListItems.push(`<li class="mb-1">${listMatch[1]}</li>`)
    } else {
      if (inList) {
        // End current list
        const listHtml = `<ul class="list-disc list-inside mb-4 space-y-1">${currentListItems.join('')}</ul>`
        processedLines.push(listHtml)
        currentListItems = []
        inList = false
      }
      processedLines.push(line)
    }
  }
  
  // Handle list at end of content
  if (inList && currentListItems.length > 0) {
    const listHtml = `<ul class="list-disc list-inside mb-4 space-y-1">${currentListItems.join('')}</ul>`
    processedLines.push(listHtml)
  }
  
  return processedLines.join('\n')
}

function convertOrderedLists(html: string): string {
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inList = false
  let currentListItems: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const listMatch = line.match(/^\d+\. (.+)$/)
    
    if (listMatch) {
      if (!inList) {
        inList = true
      }
      currentListItems.push(`<li class="mb-1">${listMatch[1]}</li>`)
    } else {
      if (inList) {
        // End current list
        const listHtml = `<ol class="list-decimal list-inside mb-4 space-y-1">${currentListItems.join('')}</ol>`
        processedLines.push(listHtml)
        currentListItems = []
        inList = false
      }
      processedLines.push(line)
    }
  }
  
  // Handle list at end of content
  if (inList && currentListItems.length > 0) {
    const listHtml = `<ol class="list-decimal list-inside mb-4 space-y-1">${currentListItems.join('')}</ol>`
    processedLines.push(listHtml)
  }
  
  return processedLines.join('\n')
}

function convertParagraphs(html: string): string {
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inParagraph = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (line === '') {
      if (inParagraph) {
        processedLines.push('</p>')
        inParagraph = false
      }
      continue
    }
    
    // Skip lines that are already HTML elements
    if (line.match(/^<(h[1-6]|ul|ol|blockquote|hr)/)) {
      if (inParagraph) {
        processedLines.push('</p>')
        inParagraph = false
      }
      processedLines.push(line)
      continue
    }
    
    // Regular text line
    if (!inParagraph) {
      processedLines.push('<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')
      inParagraph = true
    }
    
    processedLines.push(line)
  }
  
  // Close final paragraph if needed
  if (inParagraph) {
    processedLines.push('</p>')
  }
  
  return processedLines.join('\n')
}

/**
 * Convert markdown to plain text (strip all formatting)
 * Used for previews and search
 */
export function convertMarkdownToPlainText(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+(.+)$/gm, '$1') // Headers
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Bold italic
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/^> (.+)$/gm, '$1') // Blockquotes
    .replace(/^[-*+] (.+)$/gm, '• $1') // Unordered lists
    .replace(/^\d+\. (.+)$/gm, '• $1') // Ordered lists
    .replace(/^---$/gm, '') // Horizontal rules
    .replace(/\n\s*\n/g, '\n') // Multiple newlines
    .trim()
}
