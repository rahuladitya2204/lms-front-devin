"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Preload Component
 * 
 * This component preloads critical resources to improve FCP and LCP
 * It uses resource hints to tell the browser to preload important assets
 */
export default function Preload() {
  useEffect(() => {
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ];
    
    const imageUrls = [
      '/logo.png',
      '/hero-image.jpg',
    ];
    
    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'style';
      document.head.appendChild(link);
      
      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = url;
      document.head.appendChild(styleLink);
    });
    
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = 'image';
      document.head.appendChild(link);
    });
    
    const apiDomain = new URL(process.env.NEXT_PUBLIC_API_URL || 'https://testmintai-back.azurewebsites.net').origin;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = apiDomain;
    document.head.appendChild(preconnect);
    
    if (process.env.NEXT_PUBLIC_CDN_URL) {
      const cdnDomain = new URL(process.env.NEXT_PUBLIC_CDN_URL).origin;
      const cdnPreconnect = document.createElement('link');
      cdnPreconnect.rel = 'preconnect';
      cdnPreconnect.href = cdnDomain;
      document.head.appendChild(cdnPreconnect);
    }
  }, []);
  
  return null;
}
