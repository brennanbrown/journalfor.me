import{a as d}from"./index-BduBbZtS.js";function m(a){let t=a;return t=t.replace(/^# (.+)$/gm,'<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 first:mt-0">$1</h1>'),t=t.replace(/^## (.+)$/gm,'<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">$1</h2>'),t=t.replace(/^### (.+)$/gm,'<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-4">$1</h3>'),t=t.replace(/^#### (.+)$/gm,'<h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">$1</h4>'),t=t.replace(/^##### (.+)$/gm,'<h5 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3">$1</h5>'),t=t.replace(/^###### (.+)$/gm,'<h6 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3">$1</h6>'),t=t.replace(/\*\*\*(.*?)\*\*\*/g,'<strong class="font-bold"><em class="italic">$1</em></strong>'),t=t.replace(/\*\*(.*?)\*\*/g,'<strong class="font-bold">$1</strong>'),t=t.replace(/\*(.*?)\*/g,'<em class="italic">$1</em>'),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'),t=t.replace(/`([^`]+)`/g,'<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>'),t=t.replace(/^> (.+)$/gm,'<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 text-gray-700 dark:text-gray-300 italic">$1</blockquote>'),t=t.replace(/^---$/gm,'<hr class="border-gray-300 dark:border-gray-600 my-6">'),t=f(t),t=g(t),t=u(t),t}function f(a){const t=a.split(`
`),i=[];let e=!1,s=[];for(let n=0;n<t.length;n++){const r=t[n],o=r.match(/^- (.+)$/);if(o)e||(e=!0),s.push(`<li class="mb-1">${o[1]}</li>`);else{if(e){const l=`<ul class="list-disc list-inside mb-4 space-y-1">${s.join("")}</ul>`;i.push(l),s=[],e=!1}i.push(r)}}if(e&&s.length>0){const n=`<ul class="list-disc list-inside mb-4 space-y-1">${s.join("")}</ul>`;i.push(n)}return i.join(`
`)}function g(a){const t=a.split(`
`),i=[];let e=!1,s=[];for(let n=0;n<t.length;n++){const r=t[n],o=r.match(/^\d+\. (.+)$/);if(o)e||(e=!0),s.push(`<li class="mb-1">${o[1]}</li>`);else{if(e){const l=`<ol class="list-decimal list-inside mb-4 space-y-1">${s.join("")}</ol>`;i.push(l),s=[],e=!1}i.push(r)}}if(e&&s.length>0){const n=`<ol class="list-decimal list-inside mb-4 space-y-1">${s.join("")}</ol>`;i.push(n)}return i.join(`
`)}function u(a){const t=a.split(`
`),i=[];let e=!1;for(let s=0;s<t.length;s++){const n=t[s].trim();if(n===""){e&&(i.push("</p>"),e=!1);continue}if(n.match(/^<(h[1-6]|ul|ol|blockquote|hr)/)){e&&(i.push("</p>"),e=!1),i.push(n);continue}e||(i.push('<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">'),e=!0),i.push(n)}return e&&i.push("</p>"),i.join(`
`)}function v(a){const t=document.getElementById("main-content");if(!t)return;if(!a){t.innerHTML=`
      <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center py-12">
          <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p class="text-xl text-gray-600 dark:text-gray-400">Entry not found</p>
        </div>
      </div>
    `;return}const e=d.getState().entries.find(s=>s.id===a);if(!e){t.innerHTML=`
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
    `;return}t.innerHTML=`
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ${e.title}
            ${e.isFavorite?'<i class="fas fa-star text-yellow-500 ml-2"></i>':""}
          </h1>
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span><i class="fas fa-calendar mr-1"></i>${c(e.createdAt.toISOString())}</span>
            <span><i class="fas fa-clock mr-1"></i>${p(e.createdAt.toISOString())}</span>
            <span><i class="fas fa-edit mr-1"></i>Updated ${x(e.updatedAt.toISOString())}</span>
            <span><i class="fas fa-font mr-1"></i>${e.wordCount} words</span>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button id="favorite-btn" class="btn-ghost" title="${e.isFavorite?"Remove from favorites":"Add to favorites"}">
            <i class="fas fa-star ${e.isFavorite?"text-yellow-500":"text-gray-400"}"></i>
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
          ${e.tags.map(s=>`
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <i class="fas fa-tag mr-1"></i>${s}
            </span>
          `).join("")}
        </div>
      </div>
      
      <!-- Content -->
      <div class="card">
        <div id="entry-content" class="entry-content prose dark:prose-invert max-w-none">
          ${m(e.content)}
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
  `,b(e)}function c(a){return new Date(a).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}function p(a){return new Date(a).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}function x(a){const t=new Date(a),e=new Date().getTime()-t.getTime(),s=Math.floor(e/(1e3*60)),n=Math.floor(s/60),r=Math.floor(n/24);return s<1?"just now":s<60?`${s}m ago`:n<24?`${n}h ago`:r<30?`${r}d ago`:c(a)}function b(a){document.getElementById("favorite-btn")?.addEventListener("click",()=>{console.log("Toggle favorite for entry:",a.id)}),document.getElementById("edit-btn")?.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/write/${a.id}`}}))}),document.getElementById("print-btn")?.addEventListener("click",()=>{window.print()}),document.getElementById("share-btn")?.addEventListener("click",()=>{navigator.share?navigator.share({title:a.title,text:a.content.substring(0,200)+"...",url:window.location.href}):(navigator.clipboard.writeText(window.location.href),h("Link copied to clipboard!"))}),document.getElementById("delete-btn")?.addEventListener("click",()=>{confirm("Are you sure you want to delete this entry? This action cannot be undone.")&&(console.log("Delete entry:",a.id),window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/"}})))}),document.getElementById("prev-entry")?.addEventListener("click",()=>{console.log("Navigate to previous entry")}),document.getElementById("next-entry")?.addEventListener("click",()=>{console.log("Navigate to next entry")})}function h(a){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-down",t.textContent=a,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}export{v as renderEntryView};
//# sourceMappingURL=EntryView-D-BTqWl6.js.map
