// @ts-nocheck
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    // console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return this.props.fallbackComponent;
    }

    return <div suppressHydrationWarning>{this.props.children}</div>;
  }
}

export default ErrorBoundary;
