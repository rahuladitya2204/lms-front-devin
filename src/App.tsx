import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true,
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
<<<<<<< Updated upstream
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
=======
    <ParticlesProvider>
      <QueryClientProvider client={queryClient}>
        <Global
          styles={{
            body: {
              margin: 0,
              padding: 0,
            },
          }}
        />

        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </QueryClientProvider>
    </ParticlesProvider>
>>>>>>> Stashed changes
  );
}

export default App;
