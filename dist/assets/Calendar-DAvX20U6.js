import{a as f}from"./index-BduBbZtS.js";let a=new Date;function T(){const t=document.getElementById("main-content");t&&(t.innerHTML=`
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
            ${a.toLocaleDateString("en-US",{month:"long",year:"numeric"})}
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
          ${b()}
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
  `,M())}function b(){const t=new Date,d=a.getMonth(),m=a.getFullYear(),s=new Date(m,d,1),n=new Date(s);n.setDate(n.getDate()-s.getDay());const i=f.getState(),e=new Map;i.entries.forEach(c=>{const l=new Date(c.createdAt).toISOString().split("T")[0];e.has(l)||e.set(l,[]),e.get(l).push(c)});const o=[],r=new Date(n);for(let c=0;c<42;c++){const u=r.getMonth()===d,l=r.toDateString()===t.toDateString(),w=r.getDate(),D=r.toISOString().split("T")[0],v=e.get(D)||[],p=v.length>0,E=v.length>1,k=v.some(S=>S.isFavorite);let g="calendar-day p-2 h-16 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors";u?g+=" text-gray-900 dark:text-gray-100":g+=" text-gray-400 dark:text-gray-500",l&&(g+=" ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900"),p&&u&&(g+=" has-entries");let y="";p&&u&&(k?y='<div class="w-2 h-2 bg-yellow-500 rounded-full ml-auto"></div>':E?y='<div class="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>':y='<div class="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>'),o.push(`
      <div class="${g}" data-date="${r.toISOString().split("T")[0]}">
        <div class="flex justify-between items-start h-full">
          <span class="text-sm font-medium">${w}</span>
          ${y}
        </div>
      </div>
    `),r.setDate(r.getDate()+1)}return o.join("")}function x(){const t=document.getElementById("current-month");t&&(t.textContent=a.toLocaleDateString("en-US",{month:"long",year:"numeric"}))}function h(){const t=document.getElementById("calendar-grid");t&&(t.innerHTML=b(),document.querySelectorAll(".calendar-day").forEach(d=>{d.addEventListener("click",m=>{const n=m.currentTarget.getAttribute("data-date");if(n){const e=f.getState().entries.filter(o=>new Date(o.createdAt).toISOString().split("T")[0]===n);e.length>0?window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/entry/${e[0].id}`}})):window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/write?date=${n}`}}))}})}))}function M(){document.getElementById("prev-month")?.addEventListener("click",()=>{a.setMonth(a.getMonth()-1),x(),h()}),document.getElementById("next-month")?.addEventListener("click",()=>{a.setMonth(a.getMonth()+1),x(),h()}),document.getElementById("today-btn")?.addEventListener("click",()=>{a=new Date,x(),h()}),document.querySelectorAll(".calendar-day").forEach(t=>{t.addEventListener("click",d=>{const s=d.currentTarget.getAttribute("data-date");if(s){const i=f.getState().entries.filter(e=>new Date(e.createdAt).toISOString().split("T")[0]===s);i.length>0?window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/entry/${i[0].id}`}})):window.dispatchEvent(new CustomEvent("navigate",{detail:{path:`/write?date=${s}`}}))}})})}export{T as renderCalendar};
//# sourceMappingURL=Calendar-DAvX20U6.js.map
