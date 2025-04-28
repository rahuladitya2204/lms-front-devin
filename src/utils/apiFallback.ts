/**
 * API Fallback Utility
 * 
 * This utility provides fallback mechanisms for API calls to improve user experience
 * when the API is unavailable or returns errors. This helps maintain a good FCP
 * even when backend services are unreachable.
 */

import axios from 'axios';

const apiCache = new Map();

/**
 * Makes an API request with fallback mechanisms
 * 
 * @param url The API endpoint URL
 * @param options Request options
 * @param fallbackData Data to return if the request fails
 * @param cacheTime Time in milliseconds to cache the response (0 to disable)
 * @returns The API response or fallback data
 */
export async function fetchWithFallback(
  url: string, 
  options: any = {}, 
  fallbackData: any = null,
  cacheTime: number = 60000
) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cachedData = apiCache.get(cacheKey);
  
  if (cachedData && cachedData.expiry > Date.now()) {
    return cachedData.data;
  }
  
  try {
    const response = await axios(url, {
      ...options,
      timeout: 5000, // 5 second timeout
    });
    
    if (cacheTime > 0) {
      apiCache.set(cacheKey, {
        data: response.data,
        expiry: Date.now() + cacheTime
      });
    }
    
    return response.data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    
    if (cachedData) {
      return cachedData.data;
    }
    
    return fallbackData;
  }
}

/**
 * Preloads critical API endpoints to improve FCP
 */
export function preloadCriticalEndpoints() {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      
      fetchWithFallback(`${apiUrl}/common/categories`, {}, [], 300000);
      fetchWithFallback(`${apiUrl}/common/popular-courses`, {}, [], 300000);
    });
  } else {
    setTimeout(() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      
      fetchWithFallback(`${apiUrl}/common/categories`, {}, [], 300000);
      fetchWithFallback(`${apiUrl}/common/popular-courses`, {}, [], 300000);
    }, 2000);
  }
}

/**
 * Clears the API cache
 */
export function clearApiCache() {
  apiCache.clear();
}
