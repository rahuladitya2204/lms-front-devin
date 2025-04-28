"use client";

import { memo, Suspense, useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic"; // For dynamic imports

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// Dynamic imports for large components to improve FCP
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import { ServerAuthProvider } from "@ServerComponents/ServerAuthProvider";
import { lazyLoadStore } from "@Utils/dynamicImports";

/**
 * Create a query client based on whether it's the browser or server.
 * Memoized to prevent unnecessary re-creation.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Cache data for 1 minute to prevent unnecessary refetching
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient(); // Server: Create a new client for every request
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient(); // Browser: Create only once
  }
  return browserQueryClient;
}

const MemoizedChildren = memo(({ children }: { children: React.ReactNode }) => children);

/**
 * Providers Component
 * Uses memoization to prevent unnecessary renders and optimize the provider tree.
 */
// Dynamic import for Store to reduce initial bundle size
const DynamicAuthProvider = dynamic(
  () => import('@adewaskar/lms-common').then((mod) => {
    const Store = mod.Store;
    return {
      default: ({ children }) => (
        <Store.AuthenticationStoreProvider>
          {children}
        </Store.AuthenticationStoreProvider>
      ),
    };
  }),
  { ssr: true } // Important for SEO - ensure server-side rendering
);

const DynamicGlobalProvider = dynamic(
  () => import('@adewaskar/lms-common').then((mod) => {
    const Store = mod.Store;
    return {
      default: ({ children }) => (
        <Store.GlobalStoreProvider>
          {children}
        </Store.GlobalStoreProvider>
      ),
    };
  }),
  { ssr: true } // Important for SEO - ensure server-side rendering
);

export default function Providers({ children }) {
  const queryClient = useMemo(() => getQueryClient(), []); // Memoize the query client

  return (
    <MemoizedChildren>
      <DynamicAuthProvider>
        <DynamicGlobalProvider>
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <ServerAuthProvider>
                <AntdRegistry>
                  {children}
                </AntdRegistry>
              </ServerAuthProvider>
            </ModalProvider>
          </QueryClientProvider>
        </DynamicGlobalProvider>
      </DynamicAuthProvider>
    </MemoizedChildren>
  );
}
