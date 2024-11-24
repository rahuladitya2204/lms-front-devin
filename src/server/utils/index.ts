import UAParser from "ua-parser-js";
import { parse, serialize } from "cookie";
import { Constants } from "@adewaskar/lms-common";
Constants.config.API_URL = process.env.NEXT_API_URL;
export const getServerEnv = () => {
  return process.env.NODE_ENV;
};

export const getIsServer = (): boolean => {
  return typeof window === "undefined";
};

export const getServerCookie = (): string => {
  return require("next/headers").headers().get("cookie");
};

export const getCookie = (key: string) => {
  const cookieString = getServerCookie()
  const cookies = parse(cookieString ?? "");
  return cookies[key];
}

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