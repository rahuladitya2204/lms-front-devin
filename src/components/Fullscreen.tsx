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

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      exitFullscreen();
    };
  }, []);

  if (permissionError) {
    return <div>{children}</div>;
  }

  return <div ref={fullscreenRef}>{children}</div>;
};

export default Fullscreen;
