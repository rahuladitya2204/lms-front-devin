import UAParser from "ua-parser-js";
import { GlobalRef } from "./globalRef";
import { initializeApp } from "@Utils/index";

export const getServerEnv = () => {
  return process.env.NODE_ENV;
};

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

export const initializeServerApp = () => {
  const isProd = getServerEnv() === "production";

  // always have to initialize app for each request on development server
  if (!isProd) {
    console.log("Initializing Server Utils");
    initializeApp();
    return;
  }

  // use global ref for initializing app only once on production server
  const initialization = new GlobalRef("app.initialized");
  if (!initialization.value) {
    console.log("Initializing Server Utils", initialization.value);
    initializeApp();
    initialization.value = true;
  }
};
