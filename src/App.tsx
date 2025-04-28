import React, { useEffect } from "react";

import AppRouter from "./screens/AppRouter";
import ErrorBoundary from "@Components/ErrorBoundary";
import { CameraProvider } from "@Components/ActionModal/Camera/AppCamera";

function App() {
  console.log('Hot reload test updated - ' + new Date().toISOString());
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@Utils/apiFallback').then(module => {
        module.preloadCriticalEndpoints();
      });
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <CameraProvider>
        {/* AppRouter wrapped in React.memo for better performance */}
        <AppRouter />
      </CameraProvider>
    </ErrorBoundary>
  );
}

export default App;
