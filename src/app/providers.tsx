"use client";

import { ParticlesProvider } from "@Components/Particles/ParticleProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Global } from "@emotion/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true,
            staleTime: Infinity,
          },
        },
      })
  );
  return (
    <ParticlesProvider>
      <Global
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
        }}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ParticlesProvider>
  );
}
