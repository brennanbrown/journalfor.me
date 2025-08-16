import{a as x}from"./index-Cyaz7mcM.js";function $(l){const u=document.getElementById("main-content");if(!u)return;const n=!!l,p=l;u.innerHTML=`
    <div class="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          ${n?"Edit Entry":"New Entry"}
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
              value="${n?"Sample Entry Title":""}"
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
            >${n?`This is a sample entry content in **Markdown** format.

## Today was interesting

I learned about:
- TypeScript
- PWAs
- IndexedDB

Overall a productive day!`:""}</textarea>
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
            ${n?"<h1>Sample Entry Title</h1><p>This is a sample entry content in <strong>Markdown</strong> format.</p><h2>Today was interesting</h2><p>I learned about:</p><ul><li>TypeScript</li><li>PWAs</li><li>IndexedDB</li></ul><p>Overall a productive day!</p>":'<p class="text-gray-400 italic">Preview will appear here as you type...</p>'}
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
              value="${n?"personal, coding, learning":""}"
            >
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="entry-favorite" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              ${n?"checked":""}
            >
            <label for="entry-favorite" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Mark as favorite
            </label>
          </div>
        </div>
      </div>
    </div>
  `,E(p)}function E(l){const u=document.getElementById("entry-title"),n=document.getElementById("editor-textarea"),p=document.getElementById("editor-preview"),w=document.getElementById("word-count"),i=document.getElementById("auto-save-status");function f(){const s=n.value,t=s.trim()?s.trim().split(/\s+/).length:0;w.textContent=`${t} words`}function h(){const s=n.value;if(!s.trim()){p.innerHTML='<p class="text-gray-400 italic">Preview will appear here as you type...</p>';return}let t=s;t=t.replace(/```([\s\S]*?)```/g,'<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto"><code>$1</code></pre>'),t=t.replace(/`([^`]+)`/g,'<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono">$1</code>'),t=t.replace(/^### (.+)$/gm,'<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h3>'),t=t.replace(/^## (.+)$/gm,'<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100">$1</h2>'),t=t.replace(/^# (.+)$/gm,'<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');const y=t.split(`
`);let o=!1,a=[];for(let r=0;r<y.length;r++){const e=y[r],d=/^[-*+] (.+)$/.test(e.trim());if(d&&!o?(a.push('<ul class="list-disc list-inside space-y-1 my-3 text-gray-700 dark:text-gray-300">'),o=!0):!d&&o&&(a.push("</ul>"),o=!1),d){const v=e.replace(/^[-*+] (.+)$/,"$1");a.push(`<li class="ml-4">${v}</li>`)}else a.push(e)}o&&a.push("</ul>"),t=a.join(`
`),t=t.replace(/\*\*\*(.+?)\*\*\*/g,'<strong class="font-bold"><em class="italic">$1</em></strong>'),t=t.replace(/\*\*(.+?)\*\*/g,'<strong class="font-bold">$1</strong>'),t=t.replace(/\*(.+?)\*/g,'<em class="italic">$1</em>'),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">$1</a>'),t=t.split(/\n\s*\n/).map(r=>{const e=r.trim();return e?e.startsWith("<h")||e.startsWith("<ul")||e.startsWith("<pre")||e.includes("</h")||e.includes("</ul>")||e.includes("</pre>")?e:`<p class="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">${e}</p>`:""}).filter(r=>r).join(`
`),p.innerHTML=t}n?.addEventListener("input",()=>{f(),h(),i.textContent="Saving...",setTimeout(()=>{i.textContent="All changes saved"},1e3)}),u?.addEventListener("input",()=>{i.textContent="Saving...",setTimeout(()=>{i.textContent="All changes saved"},1e3)}),document.getElementById("save-btn")?.addEventListener("click",async()=>{console.log("Saving entry...",{entryId:l,isEditing:!!l});const s=u?.value.trim(),t=n?.value.trim(),y=document.getElementById("entry-tags"),o=document.getElementById("entry-favorite");if(!s||!t){alert("Please enter both a title and content for your entry.");return}i.textContent="Saving...";const a=document.getElementById("save-btn"),b=a.innerHTML;a.innerHTML='<i class="fas fa-spinner fa-spin mr-2"></i>Saving...',a.disabled=!0;try{const c=y?.value.split(",").map(m=>m.trim().toLowerCase()).filter(m=>m.length>0)||[],e=(t.match(/#\w+/g)||[]).map(m=>m.substring(1).toLowerCase()),d=[...new Set([...c,...e])],v=o?.checked||!1;let g;l?(g=await x.updateEntry(l,{title:s,content:t,tags:d,isFavorite:v}),console.log("✅ Entry updated successfully!",g)):(g=await x.createEntry(s,t,d),v&&g&&await x.toggleFavorite(g.id),console.log("✅ Entry created successfully!",g)),i.textContent="All changes saved",window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/"}}))}catch(c){console.error("Error saving entry:",c),i.textContent="Save failed",alert(`Failed to save entry: ${c instanceof Error?c.message:"Unknown error"}`)}finally{a.innerHTML=b,a.disabled=!1}}),document.getElementById("cancel-btn")?.addEventListener("click",()=>{confirm("Are you sure you want to discard changes?")&&window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/"}}))}),document.getElementById("fullscreen-btn")?.addEventListener("click",()=>{console.log("Toggle fullscreen")}),f(),h()}export{$ as renderEditor};
//# sourceMappingURL=Editor-CK-gnr76.js.map
