import "./App.css";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";
import { Global } from "@emotion/react";
import { ParticlesProvider } from "@Components/Particles/ParticleProvider";

function App() {
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

      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </ParticlesProvider>
  );
}

export default App;
