/**
 * CORE SDK: Mock Native Bridges
 * 
 * This file simulates the NativeModules that the iOS/Android team will eventually build.
 * Mini-App developers should import these functions to access device hardware and Auth.
 */

// 1. Authentication Bridge
export const AuthBridge = {
  /**
   * Simulates asking the Native Host for the currently logged-in user's SSO token.
   */
  getAccessToken: async (): Promise<string> => {
    console.log('[Mock AuthBridge] Fetching token from Native Host...');
    
    // Simulate a slight Native bridge delay
    await new Promise(resolve => setTimeout(resolve, 300)); 
    
    return "mock-jwt-sso-token-847294";
  },

  /**
   * Simulates asking the Native Host for the user's basic profile.
   */
  getUserProfile: async (): Promise<{ name: string, role: string }> => {
    return { name: "Sean (Intern)", role: "Field Engineer" };
  }
};

// 2. Network Client Bridge
export const NetworkBridge = {
  /**
   * A wrapper around API calls. In the future, this will automatically grab 
   * the token from AuthBridge and inject it into the headers.
   */
  postData: async (endpoint: string, data: object): Promise<{ success: boolean }> => {
    const token = await AuthBridge.getAccessToken();
    
    console.log(`[Mock NetworkBridge] Sending data to ${endpoint}`);
    console.log(`[Mock NetworkBridge] Attached Token: ${token}`);
    console.log(`[Mock NetworkBridge] Payload:`, JSON.stringify(data, null, 2));

    // Simulate network request time
    await new Promise(resolve => setTimeout(resolve, 800));

    return { success: true };
  }
};

// 3. Hardware Bridge (For later)
export const HardwareBridge = {
  openCamera: async (): Promise<string> => {
    console.log('[Mock HardwareBridge] Opening Native Camera...');
    return "mock-image-uri-path.jpg";
  },
  
  getGPSLocation: async (): Promise<{ lat: number, lng: number }> => {
    console.log('[Mock HardwareBridge] Fetching GPS coordinates...');
    return { lat: 2.9213, lng: 101.6559 }; // Cyberjaya coordinates!
  }
};