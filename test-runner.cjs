#!/usr/bin/env node

/**
 * Automated test runner for the journal application
 * Runs tests in a headless browser environment
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function runAutomatedTests() {
  console.log('🚀 Starting automated test runner...');
  
  let browser;
  try {
    // Launch browser with additional flags for better compatibility
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
    
    const page = await browser.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.error('❌ Browser Error:', text);
      } else if (text.includes('🤖') || text.includes('✅') || text.includes('❌') || text.includes('🧪')) {
        console.log(text);
      }
    });
    
    // Better error handling
    page.on('pageerror', error => {
      console.error('❌ Page Error:', error.message);
    });
    
    page.on('requestfailed', request => {
      console.error('❌ Request Failed:', request.url(), request.failure()?.errorText);
    });
    
    page.on('response', response => {
      if (!response.ok() && response.url().includes('.ts') || response.url().includes('.js')) {
        console.error('❌ Script Request Failed:', response.url(), response.status());
      }
    });
    
    // Navigate to the application - try multiple ports
    let appUrl = 'http://localhost:5173';
    let pageLoaded = false;
    
    // Try common Vite ports
    const ports = [5178, 5173, 5174, 5175, 5176, 5177, 3000];
    
    for (const port of ports) {
      appUrl = `http://localhost:${port}`;
      console.log(`📱 Trying to load application: ${appUrl}`);
      
      try {
        await page.goto(appUrl, { waitUntil: 'networkidle0', timeout: 5000 });
        pageLoaded = true;
        console.log(`✅ Successfully connected to ${appUrl}`);
        break;
      } catch (error) {
        console.log(`⚠️  Port ${port} not available, trying next...`);
      }
    }
    
    if (!pageLoaded) {
      console.error('❌ Failed to load application on any port. Make sure the dev server is running:');
      console.error('   npm run dev');
      process.exit(1);
    }
    

    
    // Wait for the app to initialize
    console.log('⏳ Waiting for application to initialize...');
    
    // First wait for basic DOM elements
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // Then wait for our test functions to be available
    await page.waitForFunction(() => {
      return typeof window.runAutomatedTests === 'function' && 
             typeof window.testUtils === 'object' &&
             window.appStore;
    }, { timeout: 20000 });
    
    console.log('✅ Application initialized, starting tests...\n');
    
    // Run the automated tests
    await page.evaluate(() => {
      return window.runAutomatedTests();
    });
    
    console.log('\n🎯 Test execution completed!');
    
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if puppeteer is available
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log('📦 Installing puppeteer for automated testing...');
    const { execSync } = require('child_process');
    
    try {
      execSync('npm install --save-dev puppeteer', { stdio: 'inherit' });
      console.log('✅ Puppeteer installed successfully!');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install puppeteer:', installError.message);
      console.error('Please install manually: npm install --save-dev puppeteer');
      return false;
    }
  }
}

// Main execution
async function main() {
  console.log('🧪 Journal App - Automated Test Runner');
  console.log('=====================================\n');
  
  const depsOk = await checkDependencies();
  if (!depsOk) {
    process.exit(1);
  }
  
  await runAutomatedTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runAutomatedTests };
