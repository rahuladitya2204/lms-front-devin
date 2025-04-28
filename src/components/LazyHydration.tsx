"use client";

import React, { useEffect, useState, useRef } from 'react';

interface LazyHydrationProps {
  children: React.ReactNode;
  whenVisible?: boolean;
  whenIdle?: boolean;
  afterTimeout?: number;
  ssrOnly?: boolean;
  on?: string[];
  triggerHydration?: boolean;
}

/**
 * LazyHydration Component
 * 
 * Improves FCP by delaying hydration of non-critical components until:
 * - They become visible in the viewport
 * - The browser is idle
 * - A specified timeout has elapsed
 * - A specific event occurs
 * 
 * This significantly reduces the initial JavaScript execution time
 * and improves FCP by prioritizing critical content.
 */
export default function LazyHydration({
  children,
  whenVisible = false,
  whenIdle = false,
  afterTimeout,
  ssrOnly = false,
  on = [],
  triggerHydration = false,
}: LazyHydrationProps) {
  const [hydrated, setHydrated] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ssrOnly) return;

    if (triggerHydration) {
      setHydrated(true);
      return;
    }

    if (whenVisible && rootRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHydrated(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' } // Start hydrating when within 200px of viewport
      );
      
      observer.observe(rootRef.current);
      return () => observer.disconnect();
    }

    if (whenIdle && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        setHydrated(true);
      });
      
      return () => window.cancelIdleCallback(idleCallback);
    } else if (whenIdle) {
      const timeoutId = setTimeout(() => {
        setHydrated(true);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }

    if (typeof afterTimeout === 'number') {
      const timeoutId = setTimeout(() => {
        setHydrated(true);
      }, afterTimeout);
      
      return () => clearTimeout(timeoutId);
    }

    if (on.length > 0) {
      const handleEvent = () => {
        setHydrated(true);
      };
      
      on.forEach(eventName => {
        window.addEventListener(eventName, handleEvent, { once: true });
      });
      
      return () => {
        on.forEach(eventName => {
          window.removeEventListener(eventName, handleEvent);
        });
      };
    }
  }, [whenVisible, whenIdle, afterTimeout, ssrOnly, on, triggerHydration]);

  return (
    <div ref={rootRef} suppressHydrationWarning>
      {hydrated ? (
        children
      ) : (
        <div dangerouslySetInnerHTML={{ __html: '' }} />
      )}
    </div>
  );
}
