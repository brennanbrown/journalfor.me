import{a as c}from"./index-Cyaz7mcM.js";function S(){const t=document.getElementById("main-content");t&&(t.innerHTML=`
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Customize your journal experience</p>
      </div>
      
      <form id="settings-form">
      <div class="space-y-6">
        <!-- Appearance Settings -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
          
          <div class="space-y-4">
            <div>
              <label for="theme-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select id="theme-select" class="input-field max-w-xs">
                <option value="system">Follow system</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label for="font-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <select id="font-size" class="input-field max-w-xs">
                <option value="small">Small</option>
                <option value="medium" selected>Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div>
              <label for="font-family" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select id="font-family" class="input-field max-w-xs">
                <option value="system" selected>System Default</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="animations-enabled" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="animations-enabled" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable animations
              </label>
            </div>
          </div>
        </div>
        
        <!-- Writing Settings -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Writing</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="auto-save" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="auto-save" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Auto-save entries
              </label>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="show-word-count" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
              >
              <label for="show-word-count" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show word count
              </label>
            </div>
            
            <div>
              <label for="daily-word-target" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily word target
              </label>
              <input 
                type="number" 
                id="daily-word-target" 
                class="input-field max-w-xs"
                value="250"
                min="0"
                step="50"
              >
            </div>
            
            <div>
              <label for="line-height" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Line Height
              </label>
              <select id="line-height" class="input-field max-w-xs">
                <option value="compact">Compact</option>
                <option value="normal" selected>Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Privacy & Security -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy & Security</h2>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="encryption-enabled" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                checked
                disabled
              >
              <label for="encryption-enabled" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Encrypt entries locally (always enabled)
              </label>
            </div>
            
            <div>
              <button id="change-password" class="btn-secondary">
                Change Password
              </button>
            </div>
            
            <div>
              <button id="export-data" class="btn-secondary">
                Export All Data
              </button>
            </div>
          </div>
        </div>
        
        <!-- Storage & Backup -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Storage & Backup</h2>
          
          <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Used</span>
                <span class="text-sm text-gray-500 dark:text-gray-400 storage-used-text">Loading...</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full storage-bar" style="width: 0%"></div>
              </div>
            </div>
            
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 entries-count-text">
                Loading entries count...
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 backup-info-text">
                Loading backup info...
              </p>
            </div>
            
            <div>
              <button id="clear-cache" class="btn-secondary">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
        
        <!-- Danger Zone -->
        <div class="card border-red-200 dark:border-red-800">
          <h2 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          
          <div class="space-y-4">
            <div>
              <button id="delete-all-data" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Delete All Data
              </button>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This will permanently delete all your journal entries. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button id="save-settings" class="btn-primary">
          Save Settings
        </button>
      </div>
      </form>
    </div>
  `,g())}function g(){y().catch(t=>{console.error("Failed to load settings:",t),l("Failed to load some settings")}),document.getElementById("save-settings")?.addEventListener("click",()=>{f(),l("Settings saved successfully!")}),document.getElementById("theme-select")?.addEventListener("change",t=>{const e=t.target;window.dispatchEvent(new CustomEvent("setTheme",{detail:{theme:e.value}}))}),document.getElementById("change-password")?.addEventListener("click",async()=>{try{await h()}catch(t){console.error("Password change failed:",t),l("Password change failed. Please try again.")}}),document.getElementById("export-data")?.addEventListener("click",async()=>{try{await b()}catch(t){console.error("Export failed:",t),l("Export failed. Please try again.")}}),document.getElementById("clear-cache")?.addEventListener("click",async()=>{if(confirm("Are you sure you want to clear the cache? This will not delete your entries."))try{await x()}catch(t){console.error("Clear cache failed:",t),l("Failed to clear cache. Please try again.")}}),document.getElementById("delete-all-data")?.addEventListener("click",async()=>{if(prompt('Type "DELETE" to confirm deletion of all data:')==="DELETE")try{await v()}catch(e){console.error("Delete failed:",e),l("Failed to delete data. Please try again.")}})}async function y(){const e=c.getState().user,o=c.getThemeManager(),a=document.getElementById("theme-select");if(a&&(a.value=o.getTheme()),await w(),e&&e.preferences){const n=document.getElementById("daily-word-target");n&&(n.value=e.preferences.dailyWordTarget?.toString()||"250");const r=document.getElementById("font-size");r&&(r.value=e.preferences.fontSize||"medium");const s=document.getElementById("font-family");s&&(s.value=e.preferences.fontFamily||"system");const m=document.getElementById("line-height");m&&(m.value=e.preferences.lineHeight||"normal");const u=document.getElementById("auto-save");u&&(u.checked=e.preferences.autoSave!==!1);const d=document.getElementById("show-word-count");d&&(d.checked=e.preferences.showWordCount!==!1);const i=document.getElementById("animations-enabled");i&&(i.checked=e.preferences.enableAnimations!==!1)}}async function f(){const t=c.getThemeManager(),e=document.getElementById("theme-select").value,o=document.getElementById("font-size")?.value||"medium",a=document.getElementById("font-family")?.value||"system",n=document.getElementById("animations-enabled").checked,r=document.getElementById("auto-save").checked,s=document.getElementById("show-word-count").checked,m=parseInt(document.getElementById("daily-word-target").value)||250,u=document.getElementById("line-height")?.value||"normal",d={fontSize:o,fontFamily:a,enableAnimations:n,autoSave:r,showWordCount:s,dailyWordTarget:m,lineHeight:u};try{t.setTheme(e);const i=c.getState();i.user&&(await c.updateUserPreferences({...i.user.preferences,...d}),p(d),l("Settings saved successfully!"))}catch(i){throw console.error("Failed to save settings:",i),l("Failed to save settings. Please try again."),i}}function p(t){const e=document.documentElement;switch(e.classList.remove("text-sm","text-base","text-lg"),t.fontSize){case"small":e.classList.add("text-sm");break;case"large":e.classList.add("text-lg");break;default:e.classList.add("text-base")}switch(e.classList.remove("font-serif","font-mono"),t.fontFamily){case"serif":e.classList.add("font-serif");break;case"mono":e.classList.add("font-mono");break}t.enableAnimations?e.classList.remove("motion-reduce"):e.classList.add("motion-reduce")}async function h(){if(!prompt("Enter your current password:"))throw new Error("Current password is required");const e=prompt("Enter your new password:");if(!e)throw new Error("New password is required");if(e.length<8)throw new Error("New password must be at least 8 characters long");const o=prompt("Confirm your new password:");if(e!==o)throw new Error("Passwords do not match");try{const a=c.getStorageManager(),n=await a.exportData();await a.clearAllData(),await a.initialize(e),n.user&&await a.saveUser(n.user);for(const r of n.entries)await a.saveEntry(r);for(const[r,s]of Object.entries(n.settings))await a.saveSetting(r,s);l("Password changed successfully!"),setTimeout(()=>{window.location.reload()},2e3)}catch(a){throw console.error("Password change failed:",a),a instanceof Error&&a.message.includes("decrypt")?new Error("Current password is incorrect"):a}}async function x(){try{if("caches"in window){const o=await caches.keys();await Promise.all(o.map(a=>caches.delete(a)))}const t=["theme","user-session"],e=[];for(let o=0;o<localStorage.length;o++){const a=localStorage.key(o);a&&!t.includes(a)&&e.push(a)}e.forEach(o=>localStorage.removeItem(o)),sessionStorage.clear(),l("Cache cleared successfully!")}catch(t){throw console.error("Clear cache failed:",t),t}}async function v(){try{await c.clearAllData(),l("All data deleted successfully!"),setTimeout(()=>{window.location.href="/"},2e3)}catch(t){throw console.error("Delete failed:",t),t}}async function b(){try{const o={...await c.getStorageManager().exportData(),exportedAt:new Date().toISOString(),version:"1.0",source:"journalfor.me"},a=JSON.stringify(o,null,2),n=new Blob([a],{type:"application/json"}),r=URL.createObjectURL(n),s=document.createElement("a");s.href=r,s.download=`journalfor-me-export-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r),l("Data exported successfully!")}catch(t){throw console.error("Export failed:",t),t}}async function w(){try{const e=await c.getStorageManager().getStorageStats(),o=c.getState(),a=document.querySelector(".storage-used-text"),n=document.querySelector(".storage-bar"),r=document.querySelector(".entries-count-text"),s=(e.totalSize/(1024*1024)).toFixed(2),m=100,u=Math.min(parseFloat(s)/m*100,100);a&&(a.textContent=`${s} MB / ${m} MB`),n&&(n.style.width=`${u}%`),r&&(r.innerHTML=`<strong>${e.entriesCount} entries</strong> stored locally`);const d=document.querySelector(".backup-info-text");if(d){const i=o.lastSyncAt;i?d.textContent=`Last backup: ${i.toLocaleDateString()}`:d.textContent="Last backup: Never (cloud sync not enabled)"}}catch(t){console.error("Failed to load storage stats:",t)}}function l(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-down",e.textContent=t,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}export{S as renderSettings};
//# sourceMappingURL=Settings-DTgy6tqV.js.map
