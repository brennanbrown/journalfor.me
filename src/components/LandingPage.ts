/**
 * Landing page component for non-authenticated users
 */

export function renderLandingPage(): void {
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return

  mainContent.innerHTML = `
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Your thoughts,</span>
                <span class="block text-blue-600 dark:text-blue-400 xl:inline">beautifully organized</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A secure, private journal that grows with you. Write, reflect, and discover insights in your personal thoughts with powerful features designed for mindful journaling.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <button id="get-started-btn" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200">
                    Get started free
                  </button>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <button id="learn-more-btn" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition-colors duration-200">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden">
          <img 
            src="/journal-hero.jpg" 
            alt="Beautiful journal and writing setup" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div class="text-white text-center max-w-md px-6">
              <div class="text-2xl font-medium italic drop-shadow-lg" style="font-family: 'EB Garamond', serif;">
                "The act of writing is the act of discovering what you believe."
              </div>
              <div class="text-lg mt-2 opacity-90" style="font-family: 'EB Garamond', serif;">
                — David Hare
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need for mindful journaling
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Powerful features designed to help you capture, organize, and reflect on your thoughts with complete privacy and security.
          </p>
        </div>

        <div class="mt-10">
          <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">🔒</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">End-to-end encryption</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Your entries are encrypted locally with your master password. Only you can read your thoughts.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">✨</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Beautiful markdown support</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Write with rich formatting using markdown. Headers, lists, links, and more render beautifully.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">🏷️</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Smart organization</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Tag your entries, search through your thoughts, and organize by date with powerful filtering.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">📊</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Writing insights</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Track your writing habits, word counts, and progress toward your daily journaling goals.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">🌙</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Dark mode & themes</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Customize your writing environment with beautiful themes and comfortable dark mode.
              </dd>
            </div>

            <div class="relative">
              <dt>
                <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span class="text-xl">💾</span>
                </div>
                <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Export & backup</p>
              </dt>
              <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                Your data belongs to you. Export everything anytime and keep full control of your journal.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-600 dark:bg-blue-800">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to start journaling?</span>
          <span class="block">Create your account today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-blue-200">
          Join thousands of people who have made journaling a meaningful part of their daily routine.
        </p>
        <button id="cta-signup-btn" class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-colors duration-200">
          Sign up for free
        </button>
      </div>
    </div>

    <!-- Privacy & Security Section -->
    <div class="bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Your privacy is our priority
            </h2>
            <p class="mt-3 max-w-3xl text-lg text-gray-500 dark:text-gray-300">
              We believe your thoughts should remain private. That's why we've built journalfor.me with privacy and security at its core.
            </p>
            <dl class="mt-10 space-y-10">
              <div class="relative">
                <dt>
                  <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <span class="text-xl">🔐</span>
                  </div>
                  <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Local-first storage</p>
                </dt>
                <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Your journal entries are stored locally on your device, encrypted with your master password.
                </dd>
              </div>
              <div class="relative">
                <dt>
                  <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <span class="text-xl">🚫</span>
                  </div>
                  <p class="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">No tracking or analytics</p>
                </dt>
                <dd class="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  We don't track your usage, collect analytics, or store any personal information on our servers.
                </dd>
              </div>
            </dl>
          </div>
          <div class="mt-8 lg:mt-0">
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
              <div class="text-center">
                <div class="text-4xl mb-4">🛡️</div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">100% Private</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Your journal entries never leave your device unencrypted. Even we can't read your thoughts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  setupLandingPageEventListeners()
}

/**
 * Setup event listeners for landing page interactions
 */
function setupLandingPageEventListeners(): void {
  // Get started button
  document.getElementById('get-started-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/register' } }))
  })

  // Learn more button - scroll to features
  document.getElementById('learn-more-btn')?.addEventListener('click', () => {
    // Find the features section by looking for the specific heading
    const headings = document.querySelectorAll('h2')
    let featuresSection = null
    
    for (const heading of headings) {
      if (heading.textContent?.includes('Everything you need for mindful journaling')) {
        featuresSection = heading.parentElement
        break
      }
    }
    
    // Fallback to finding by class
    if (!featuresSection) {
      featuresSection = document.querySelector('.py-12.bg-white')
    }
    
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  })

  // CTA signup button
  document.getElementById('cta-signup-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/register' } }))
  })
}
