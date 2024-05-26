import React from "react";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";
import { CameraProvider } from "@Components/ActionModal/Camera/AppCamera";

function App() {
  // console.log("came in app!");
  return (
    <ErrorBoundary>
      <CameraProvider>
        <AppRouter />
      </CameraProvider>
    </ErrorBoundary>
  );
}

export default App;
