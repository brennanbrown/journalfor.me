/**
 * Comprehensive API debugging and testing utilities
 */

import { apiClient } from './api';

export class ApiDebugger {
  
  /**
   * Test server connectivity and debug CORS issues
   */
  static async testServerConnection(): Promise<void> {
    console.log('🧪 === API DEBUG TEST SUITE ===');
    
    // Test 1: Direct health check
    console.log('\n🔍 Test 1: Direct health check');
    try {
      const isHealthy = await apiClient.healthCheck();
      console.log(`✅ Health check result: ${isHealthy}`);
    } catch (error) {
      console.error('❌ Health check failed:', error);
    }
    
    // Test 2: Manual fetch to debug CORS
    console.log('\n🔍 Test 2: Manual fetch with detailed logging');
    try {
      const response = await fetch('https://journalforme-production.up.railway.app/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response ok: ${response.ok}`);
      console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log(`📊 Response body: ${text}`);
      
      const data = JSON.parse(text);
      console.log(`📊 Parsed data:`, data);
      
    } catch (error) {
      console.error('❌ Manual fetch failed:', error);
    }
    
    // Test 3: Check environment variables
    console.log('\n🔍 Test 3: Environment check');
    console.log(`📊 VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
    console.log(`📊 NODE_ENV: ${import.meta.env.NODE_ENV}`);
    console.log(`📊 MODE: ${import.meta.env.MODE}`);
    
    // Test 4: Test login endpoint specifically
    console.log('\n🔍 Test 4: Test login endpoint');
    try {
      const response = await fetch('https://journalforme-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          passwordHash: 'testhash'
        })
      });
      
      console.log(`📊 Login endpoint status: ${response.status}`);
      const text = await response.text();
      console.log(`📊 Login endpoint response: ${text}`);
      
    } catch (error) {
      console.error('❌ Login endpoint test failed:', error);
    }
  }
  
  /**
   * Test authentication flow with detailed logging
   */
  static async testAuthFlow(email: string, password: string): Promise<void> {
    console.log('\n🧪 === AUTHENTICATION FLOW TEST ===');
    console.log(`📧 Testing with email: ${email}`);
    
    try {
      // Hash password like the real flow
      const CryptoJS = (await import('crypto-js')).default;
      const passwordHash = CryptoJS.SHA256(password).toString();
      console.log(`🔐 Password hash: ${passwordHash.substring(0, 10)}...`);
      
      // Test login
      const authResponse = await apiClient.login(email, passwordHash);
      console.log('✅ Login successful:', authResponse);
      
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
    }
  }
  
  /**
   * Check if we're hitting localhost instead of production
   */
  static checkUrlConfiguration(): void {
    console.log('\n🔍 === URL CONFIGURATION CHECK ===');
    
    // Check current API client configuration
    const apiInstance = apiClient as any;
    console.log(`📊 API Client baseUrl: ${apiInstance.baseUrl}`);
    
    // Check if any code is still referencing localhost
    const currentUrl = window.location.href;
    console.log(`📊 Current page URL: ${currentUrl}`);
    
    // Check localStorage for any localhost references
    const authToken = localStorage.getItem('auth_token');
    console.log(`📊 Auth token exists: ${!!authToken}`);
    
    if (authToken) {
      console.log(`📊 Auth token preview: ${authToken.substring(0, 20)}...`);
    }
  }
}

// Auto-run basic diagnostics when loaded
if (typeof window !== 'undefined') {
  console.log('🧪 API Debug utilities loaded');
  
  // Add to global scope for easy access
  (window as any).apiDebug = ApiDebugger;
  
  // Auto-run URL check
  ApiDebugger.checkUrlConfiguration();
}

export default ApiDebugger;
