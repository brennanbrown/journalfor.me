import{a as g}from"./index-Cyaz7mcM.js";async function v(){const r=document.getElementById("main-content");if(!r)return;const e=g.getState(),a=await g.getWritingStats(),i=e.entries.slice(0,3),s=new Date;s.setHours(0,0,0,0);const o=e.entries.filter(t=>{const n=new Date(t.createdAt);return n.setHours(0,0,0,0),n.getTime()===s.getTime()}).reduce((t,n)=>t+n.wordCount,0),l=e.user?.preferences.dailyWordTarget||250,c=Math.min(o/l*100,100);r.innerHTML=`
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">${a.currentStreak} Day Streak</h3>
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">${a.totalEntries} Entries</h3>
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
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">${e.user?.preferences.dailyWordTarget||250} Words</h3>
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
            ${i.length>0?i.map(t=>`
                <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 cursor-pointer transform hover:scale-102 hover:-translate-y-1 group" data-entry-id="${t.id}">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      ${t.title}
                      ${t.isFavorite?'<span class="ml-1">⭐</span>':""}
                    </h3>
                    <div class="flex gap-1">
                      ${t.tags.slice(0,2).map(n=>`
                        <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          ${n}
                        </span>
                      `).join("")}
                    </div>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ${p(t.createdAt)}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    ${x(t.content).slice(0,120)}${t.content.length>120?"...":""}
                  </p>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">${t.wordCount} words</span>
                  </div>
                </div>
              `).join(""):'<div class="p-8 text-center"><p class="text-gray-500 dark:text-gray-400">No entries yet. <a href="/write" class="link">Create your first entry!</a> ✨</p></div>'}
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
              <span class="text-sm text-gray-500 dark:text-gray-400">${o} / ${l} words</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: ${c}%"></div>
            </div>
            ${o>=l?'<p class="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">🎉 Daily goal achieved!</p>':o>0?`<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">${Math.round(c)}% complete</p>`:'<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Start writing to track progress</p>'}
          </div>
          
          <!-- Weekly Stats -->
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">This week</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${a.entriesThisWeek} entries</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">This month</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${a.entriesThisMonth} entries</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Average words/entry</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${a.averageWordsPerEntry} words</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Longest streak</span>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">${a.longestStreak} days</span>
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
  `,m()}function x(r){return r.replace(/^#{1,6}\s+(.+)$/gm,"$1").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/__(.+?)__/g,"$1").replace(/_(.+?)_/g,"$1").replace(/\[(.+?)\]\(.+?\)/g,"$1").replace(/```[\s\S]*?```/g,"").replace(/`(.+?)`/g,"$1").replace(/^>\s+(.+)$/gm,"$1").replace(/^[\s]*[-*+]\s+(.+)$/gm,"$1").replace(/^[\s]*\d+\.\s+(.+)$/gm,"$1").replace(/\n\s*\n/g," ").replace(/\s+/g," ").trim()}function p(r){const e=new Date(r),i=new Date().getTime()-e.getTime(),s=Math.floor(i/(1e3*60*60)),d=Math.floor(s/24);return s<1?"Just now":s<24?`${s}h ago`:d===1?"Yesterday":d<7?`${d} days ago`:e.toLocaleDateString()}function m(){document.querySelectorAll("[data-entry-id]").forEach(r=>{r.addEventListener("click",e=>{const a=e.currentTarget.getAttribute("data-entry-id");a&&window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/entry/${a}`}}))})}),document.querySelectorAll("[data-action]").forEach(r=>{r.addEventListener("click",e=>{switch(e.currentTarget.getAttribute("data-action")){case"view-streak":console.log("Show streak details");break;case"new-entry":window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/write"}}));break;case"view-entries":window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/search"}}));break;case"edit-goal":window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/settings"}}));break}})})}export{v as renderDashboard};
//# sourceMappingURL=Dashboard-DjZAVpDv.js.map
