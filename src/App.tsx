import React from "react";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";
import { CameraProvider } from "@Components/ActionModal/Camera/AppCamera";

function App() {
  console.log('Testing hot reload - App component rendered');
  return (
    <ErrorBoundary>
      <CameraProvider>
        {/* Use memoized AppRouter for better performance */}
        <AppRouter />
      </CameraProvider>
    </ErrorBoundary>
  );
}

export default App;
