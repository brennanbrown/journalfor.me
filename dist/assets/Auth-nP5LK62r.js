import{a as c}from"./index-BduBbZtS.js";function k(){const r=document.getElementById("main-content");r&&(r.innerHTML=`
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="fas fa-book text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <h2 class="mt-6 text-center text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Welcome Back! 👋
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue your journaling journey
          </p>
        </div>
        
        <form class="mt-8 space-y-6" id="login-form">
          <div id="auth-error" class="hidden p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <div class="flex">
              <span class="text-red-400 mr-2">⚠️</span>
              <p class="text-sm text-red-700 dark:text-red-300" id="auth-error-message"></p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="input-field mt-1"
                placeholder="Enter your email"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Master Password 🔐
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="input-field mt-1"
                placeholder="Enter your master password"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                🛡️ This decrypts your encrypted journal entries
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              id="login-submit"
              class="btn-primary w-full transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span id="login-submit-text">🚀 Sign In</span>
              <span id="login-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            </button>
          </div>
          
          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <a href="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                Sign up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  `,h())}function E(){const r=document.getElementById("main-content");r&&(r.innerHTML=`
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <i class="fas fa-user-plus text-blue-600 dark:text-blue-400 text-xl"></i>
          </div>
          <h2 class="mt-6 text-center text-3xl font-display font-bold text-gray-900 dark:text-gray-100">
            Join Journal for Me ✨
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Start your personal journaling journey today
          </p>
        </div>
        
        <form class="mt-8 space-y-6" id="register-form">
          <div id="register-error" class="hidden p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg">
            <div class="flex">
              <span class="text-red-400 mr-2">⚠️</span>
              <p class="text-sm text-red-700 dark:text-red-300" id="register-error-message"></p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="input-field mt-1"
                placeholder="Enter your email"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Master Password 🔐
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="new-password" 
                required 
                class="input-field mt-1"
                placeholder="Create a secure master password"
              >
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                🛡️ This encrypts all your journal entries locally. Keep it safe!
              </p>
            </div>
            
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <input 
                id="confirm-password" 
                name="confirm-password" 
                type="password" 
                autocomplete="new-password" 
                required 
                class="input-field mt-1"
                placeholder="Confirm your password"
              >
            </div>
          </div>
          
          <div class="flex items-center">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            >
            <label for="terms" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              I agree to the 
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Terms of Service
              </a> and 
              <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <div>
            <button 
              type="submit" 
              id="register-submit"
              class="btn-primary w-full transform hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span id="register-submit-text">✨ Create Account</span>
              <span id="register-loading" class="hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            </button>
          </div>
          
          <div class="text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                Sign in
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  `,v())}function h(){const r=document.getElementById("login-form"),o=document.getElementById("login-submit"),n=document.getElementById("auth-error"),f=document.getElementById("auth-error-message"),m=document.getElementById("login-submit-text"),u=document.getElementById("login-loading");r?.addEventListener("submit",async t=>{t.preventDefault();const d=new FormData(r),l=d.get("email"),s=d.get("password");if(x(),!l||!s){e("Please fill in all required fields");return}g(!0);try{const i=await c.storage.validateUserCredentials(l,s);if(!i.exists){e("No account found with this email address. Please check your email or create a new account.");return}if(!i.passwordValid){e("Incorrect password. Please check your password and try again.");return}await c.initialize(s);const a=c.getState();if(!a.user)throw new Error("Login failed - initialization error");console.log("✅ Login successful!",a.user.email),sessionStorage.setItem("journal-session-key",s),localStorage.setItem("journal-user-email",l),console.log("💾 Session data stored for persistence"),window.dispatchEvent(new CustomEvent("userStateChanged")),console.log("🧭 Dispatching navigation to /"),window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/",replace:!0}})),setTimeout(()=>{window.location.pathname==="/login"&&(console.log("🔄 Fallback: manually changing location"),window.location.href="/")},100)}catch(i){console.error("Login error:",i),i instanceof Error?e(i.message):e("Login failed. Please try again.")}finally{g(!1)}});function e(t){f.textContent=t,n.classList.remove("hidden"),n.scrollIntoView({behavior:"smooth",block:"nearest"})}function x(){n.classList.add("hidden")}function g(t){o.disabled=t,t?(m.classList.add("hidden"),u.classList.remove("hidden"),o.classList.add("opacity-75")):(m.classList.remove("hidden"),u.classList.add("hidden"),o.classList.remove("opacity-75"))}}function v(){const r=document.getElementById("register-form"),o=document.getElementById("register-submit"),n=document.getElementById("register-error"),f=document.getElementById("register-error-message"),m=document.getElementById("register-submit-text"),u=document.getElementById("register-loading");r?.addEventListener("submit",async t=>{t.preventDefault();const d=new FormData(r),l=d.get("email"),s=d.get("password"),i=d.get("confirm-password");if(x(),!l||!s||!i){e("Please fill in all required fields");return}if(s!==i){e("Passwords do not match");return}if(s.length<8){e("Password must be at least 8 characters long");return}g(!0);try{const a=c.getStorageManager();if(await a.hasExistingUser())try{await a.initialize(s);const p=await a.getUser();if(p&&p.email===l){e("An account with this email already exists. Please sign in instead.");return}else if(p){e("An account already exists with a different email. Please use a different email or sign in.");return}}catch{console.log("Existing user has different password, proceeding with registration")}const b=await c.createUser(l,s),y=c.getState();console.log("✅ Account created successfully!",b.email),console.log("📊 Current app state after registration:",{user:y.user?.email,entriesCount:y.entries.length}),sessionStorage.setItem("journal-session-key",s),console.log("💾 Session key stored for persistence"),console.log("🧭 Dispatching navigation to /"),window.dispatchEvent(new CustomEvent("navigate",{detail:{path:"/",replace:!0}})),setTimeout(()=>{window.location.pathname==="/register"&&(console.log("🔄 Fallback: manually changing location"),window.location.href="/")},100)}catch(a){console.error("Registration error:",a),a instanceof Error?e(a.message):e("Account creation failed. Please try again.")}finally{g(!1)}});function e(t){f.textContent=t,n.classList.remove("hidden"),n.scrollIntoView({behavior:"smooth",block:"nearest"})}function x(){n.classList.add("hidden")}function g(t){o.disabled=t,t?(m.classList.add("hidden"),u.classList.remove("hidden"),o.classList.add("opacity-75")):(m.classList.remove("hidden"),u.classList.add("hidden"),o.classList.remove("opacity-75"))}}export{k as renderLogin,E as renderRegister};
//# sourceMappingURL=Auth-nP5LK62r.js.map
