import{a as m}from"./index-BduBbZtS.js";function k(){const t=document.getElementById("main-content");t&&(t.innerHTML=`
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
                  ${y().map(r=>`<option value="${r}">${r}</option>`).join("")}
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
          ${v({query:"",tag:"",dateFrom:"",dateTo:"",favoritesOnly:!1,sortBy:"date-desc"})}
        </div>
        
        <!-- Load More -->
        <div class="text-center">
          <button id="load-more" class="btn-secondary">
            Load more results
          </button>
        </div>
      </div>
    </div>
  `,p())}function y(){const t=m.getState(),r=new Set;return t.entries.forEach(a=>{a.tags.forEach(n=>r.add(n))}),Array.from(r).sort()}function v(t){let a=[...m.getState().entries];if(t.query){const e=t.query.toLowerCase();a=a.filter(s=>s.title.toLowerCase().includes(e)||s.content.toLowerCase().includes(e)||s.tags.some(d=>d.toLowerCase().includes(e)))}if(t.tag&&(a=a.filter(e=>e.tags.includes(t.tag))),t.dateFrom){const e=new Date(t.dateFrom);a=a.filter(s=>new Date(s.createdAt)>=e)}if(t.dateTo){const e=new Date(t.dateTo);e.setHours(23,59,59,999),a=a.filter(s=>new Date(s.createdAt)<=e)}switch(t.favoritesOnly&&(a=a.filter(e=>e.isFavorite)),t.sortBy){case"date-asc":a.sort((e,s)=>new Date(e.createdAt).getTime()-new Date(s.createdAt).getTime());break;case"title":a.sort((e,s)=>e.title.localeCompare(s.title));break;case"date-desc":default:a.sort((e,s)=>new Date(s.createdAt).getTime()-new Date(e.createdAt).getTime());break}const n=document.getElementById("results-count");return n&&(n.textContent=`(${a.length} ${a.length===1?"entry":"entries"})`),a.length===0?`
      <div class="card text-center py-12">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">No entries found</p>
        <p class="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or <a href="/write" class="link">create a new entry</a></p>
      </div>
    `:a.map(e=>`
    <div class="card hover:shadow-md transition-shadow duration-200 cursor-pointer" data-entry-id="${e.id}">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ${e.title}
          ${e.isFavorite?'<i class="fas fa-star text-yellow-500 ml-2"></i>':""}
        </h3>
        <span class="text-sm text-gray-500 dark:text-gray-400">${x(e.createdAt.toISOString())}</span>
      </div>
      
      <p class="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">${f(e.content).slice(0,200)}${e.content.length>200?"...":""}</p>
      
      <div class="flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          ${e.tags.map(s=>`
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              ${s}
            </span>
          `).join("")}
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>${e.wordCount} words</span>
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
  `).join("")}function f(t){return t.replace(/^#{1,6}\s+(.+)$/gm,"$1").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/__(.+?)__/g,"$1").replace(/_(.+?)_/g,"$1").replace(/\[(.+?)\]\(.+?\)/g,"$1").replace(/```[\s\S]*?```/g,"").replace(/`(.+?)`/g,"$1").replace(/^>\s+(.+)$/gm,"$1").replace(/^[\s]*[-*+]\s+(.+)$/gm,"$1").replace(/^[\s]*\d+\.\s+(.+)$/gm,"$1").replace(/\n\s*\n/g," ").replace(/\s+/g," ").trim()}function x(t){return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}function p(){const t=document.getElementById("search-query"),r=document.getElementById("search-button"),a=document.getElementById("tag-filter"),n=document.getElementById("date-from"),e=document.getElementById("date-to"),s=document.getElementById("favorites-only"),d=document.getElementById("sort-by");function l(){const i={query:t.value,tag:a.value,dateFrom:n.value,dateTo:e.value,favoritesOnly:s.checked,sortBy:d.value},o=document.getElementById("search-results");o&&(o.innerHTML=v(i),o.querySelectorAll("[data-entry-id]").forEach(u=>{u.addEventListener("click",c=>{const g=c.currentTarget.getAttribute("data-entry-id");g&&window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/entry/${g}`}}))})}))}t?.addEventListener("input",l),r?.addEventListener("click",l),a?.addEventListener("change",l),n?.addEventListener("change",l),e?.addEventListener("change",l),s?.addEventListener("change",l),d?.addEventListener("change",l),document.getElementById("clear-filters")?.addEventListener("click",()=>{t.value="",a.value="",n.value="",e.value="",s.checked=!1,d.value="date-desc",l()}),document.querySelectorAll("[data-entry-id]").forEach(i=>{i.addEventListener("click",o=>{const c=o.currentTarget.getAttribute("data-entry-id");console.log("Clicked entry:",c)})}),document.getElementById("load-more")?.addEventListener("click",()=>{console.log("Load more results")})}export{k as renderSearch};
//# sourceMappingURL=Search-zxN4s41P.js.map
