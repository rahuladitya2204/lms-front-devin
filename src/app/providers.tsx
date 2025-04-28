"use client";

import { memo, Suspense, useMemo } from "react";
import dynamic from "next/dynamic"; // For dynamic imports

import { Store } from "@adewaskar/lms-common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// Dynamic imports for large components to improve FCP
import { ModalProvider } from "@Components/ActionModal/ModalContext";
import { ServerAuthProvider } from "@ServerComponents/ServerAuthProvider";

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

const MemoizedChildren = memo(({ children }) => children);

/**
 * Providers Component
 * Uses memoization to prevent unnecessary renders and optimize the provider tree.
 */
export default function Providers({ children }) {
  const queryClient = useMemo(() => getQueryClient(), []); // Memoize the query client

  return (
    <MemoizedChildren>
      {/* Optimize provider nesting to reduce render blocking */}
      <QueryClientProvider client={queryClient}>
        <Store.AuthenticationStoreProvider>
          <Store.GlobalStoreProvider>
            <ModalProvider>
              <ServerAuthProvider>
                <AntdRegistry>
                  {children}
                </AntdRegistry>
              </ServerAuthProvider>
            </ModalProvider>
          </Store.GlobalStoreProvider>
        </Store.AuthenticationStoreProvider>
      </QueryClientProvider>
    </MemoizedChildren>
  );
}
