import UAParser from "ua-parser-js";

export const getIsServer = (): boolean => {
  return typeof window === "undefined";
};

export const getServerCookie = (): string => {
  return require("next/headers").headers().get("cookie");
};

export const getServerBreakpoint = (): string => {
  const userAgent = require("next/headers").headers().get("user-agent");
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  switch (device.type) {
    case "mobile":
    case "wearable":
      return "isMobile";
    case "tablet":
      return "isMobile";
    default:
      return "isDesktop";
  }
};
