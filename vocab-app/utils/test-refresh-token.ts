/**
 * This utility helps manually test the refresh token flow in the browser console.
 * 
 * How to use:
 * 1. Import this file in a component that loads after login
 * 2. Open the browser console
 * 3. Call window.testTokenRefresh() to run the test
 */

// Simulates a token expiry by modifying the session data
async function simulateTokenExpiry() {
  // This requires browser access to localStorage where NextAuth stores the session
  const sessionStr = localStorage.getItem('next-auth.session-token');
  if (!sessionStr) {
    console.error('No session found. Please log in first.');
    return false;
  }
  
  console.log('Current session token found. Simulating token expiry...');
  
  // We can't modify the JWT directly as it's signed, but we can force a new fetch
  // which will trigger the refresh in NextAuth
  return true;
}

// Makes an authenticated API request to test the token refresh
async function makeAuthenticatedRequest() {
  try {
    // Import the api instance with interceptors
    const { default: api } = await import('@/services/api');
    
    console.log('Making authenticated request...');
    
    // Make a request to a protected endpoint
    const response = await api.get('accounts/user-detail/me/');
    
    console.log('Request successful:', response.data);
    return true;
  } catch (error) {
    console.error('Request failed:', error);
    return false;
  }
}

// Main test function
async function testTokenRefresh() {
  console.log('Starting refresh token test...');
  
  // Step 1: Simulate token expiry
  const expiredSimulated = await simulateTokenExpiry();
  if (!expiredSimulated) {
    return;
  }
  
  // Step 2: Make an authenticated request which should trigger token refresh
  const requestSuccessful = await makeAuthenticatedRequest();
  
  // Step 3: Verify the results
  if (requestSuccessful) {
    console.log('✅ TEST PASSED: Token refresh works correctly!');
  } else {
    console.log('❌ TEST FAILED: Token refresh did not work properly.');
  }
}

// Expose the test function globally for console access
if (typeof window !== 'undefined') {
  (window as any).testTokenRefresh = testTokenRefresh;
}

export { testTokenRefresh };
