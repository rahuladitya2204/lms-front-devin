import React, { useEffect, useRef, useState } from "react";

const Fullscreen = ({ children }) => {
  const fullscreenRef = useRef(null);
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (fullscreenRef.current) {
          // @ts-ignore
          await fullscreenRef.current.requestFullscreen();
        }
      } catch (error) {
        console.error("Permission error:", error);
        setPermissionError(true);
      }
    };

    const exitFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    enterFullscreen();

    return () => {
      exitFullscreen();
    };
  }, []);

  if (permissionError) {
    return children;
  }

  return <div ref={fullscreenRef}>{children}</div>;
};

export default Fullscreen;
