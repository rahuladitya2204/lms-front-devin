import { getIsServer } from "@ServerUtils/index";
import { useEffect, useState } from "react";

const getDeviceConfig = (width: number) => {
  if (width < 768) {
    return "isMobile";
  } else if (width >= 768 && width < 992) {
    return "isTablet";
  } else {
    return "isDesktop";
  }
};

const useBreakpoint = () => {
  const [width, setWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const isServer = getIsServer();
    const calcInnerWidth = () => {
      setWidth(window.innerWidth);
      setBreakpoint(getDeviceConfig(window.innerWidth));
    };

    if (!isServer) {
      calcInnerWidth();
      window.addEventListener("resize", calcInnerWidth);
    }

    return () => {
      if (!isServer) {
        window.removeEventListener("resize", calcInnerWidth);
      }
    };
  }, []);

  // console.log()
  return {
    isMobile: breakpoint === "isMobile",
    isTablet: breakpoint === "isTablet",
    isDesktop: breakpoint === "isDesktop",
    width,
  };
};

export default useBreakpoint;
