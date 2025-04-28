import React from "react";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";
import { CameraProvider } from "@Components/ActionModal/Camera/AppCamera";

function App() {
  return (
    <ErrorBoundary>
      <CameraProvider>
        {/* Add React.memo to AppRouter for improved rendering performance */}
        {React.memo(AppRouter)()}
      </CameraProvider>
    </ErrorBoundary>
  );
}

export default App;
