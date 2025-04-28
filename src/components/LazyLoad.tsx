"use client";

import React, { Suspense, lazy, ComponentType } from 'react';
import { Spin } from 'antd';

/**
 * LazyLoad Component
 * 
 * This component provides a standardized way to lazy load components
 * to improve initial load performance and reduce bundle size
 * 
 * @param importFn - Function that returns a dynamic import
 * @param fallback - Optional custom loading component
 * @returns A lazy-loaded component wrapped in Suspense
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spin size="large" /></div>
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Usage example:
 * 
 * const LazyDashboard = createLazyComponent(() => import('../screens/Dashboard'));
 * 
 * function App() {
 *   return (
 *     <div>
 *       <LazyDashboard />
 *     </div>
 *   );
 * }
 */
