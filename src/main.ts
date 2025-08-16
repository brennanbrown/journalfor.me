import './styles/main.css'
import { initializeApp } from './utils/app'
import './utils/api-debug-test'

document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp()
})

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
