import React, { useEffect } from "react";

// Create the Higher-Order Component
const withNonCopyable = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    useEffect(() => {
      // Disable right-click context menu
      const disableContextMenu = (e: MouseEvent) => e.preventDefault();

      // Disable common copy, cut, paste keyboard shortcuts
      const disableCopyShortcuts = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === "c" || e.key === "x" || e.key === "v")
        ) {
          e.preventDefault();
        }
      };

      // Disable copy, cut, and paste events
      const disableClipboardEvents = (e: ClipboardEvent) => e.preventDefault();

      // Attach event listeners to the document
      document.addEventListener("contextmenu", disableContextMenu);
      document.addEventListener("keydown", disableCopyShortcuts);
      document.addEventListener("copy", disableClipboardEvents);
      document.addEventListener("cut", disableClipboardEvents);
      document.addEventListener("paste", disableClipboardEvents);

      // Cleanup event listeners on component unmount
      return () => {
        document.removeEventListener("contextmenu", disableContextMenu);
        document.removeEventListener("keydown", disableCopyShortcuts);
        document.removeEventListener("copy", disableClipboardEvents);
        document.removeEventListener("cut", disableClipboardEvents);
        document.removeEventListener("paste", disableClipboardEvents);
      };
    }, []);

    // Wrap the component with refined non-copyable styles
    const wrapperStyle = {
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      MsUserSelect: "none",
    };

    const interactiveElementStyle = {
      pointerEvents: "auto", // Allow interactions for child elements
    };

    return (
      <div style={wrapperStyle}>
        <div style={interactiveElementStyle}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default withNonCopyable;
