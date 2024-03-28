import { parseCookies } from "@Utils/index";
import { Utils } from "@adewaskar/lms-common";
import path from "path";
import getConfig from "next/config";

export const getIsServer = (): boolean => {
  return typeof window === "undefined";
};

export const getCookie = (key: string): string => {
  const cookieString = require("next/headers").headers().get("cookie");
  const cookies = parseCookies(cookieString);

  return cookies[key];
};

export const setCookie = (key: string, value: string) => {
  return require("next/headers").cookies().set(key, value);
};

export const deleteCookie = (key: string) => {
  return require("next/headers").cookies().delete(key);
};

export const getStaticPath = () => {
  const staticPath =
    process.cwd() + getConfig().serverRuntimeConfig.staticFolder;
  console.log(staticPath);
  return staticPath;
};

export const getRequestHeaders = (): {
  orgAlias?: string;
  userType?: string;
  affiliateId?: string;
} => {
  const isServer = getIsServer();
  if (isServer) {
    const cookieString = require("next/headers").headers().get("cookie");
    const cookies = parseCookies(cookieString);
    console.log("herehherherre", cookies);
    return {
      orgAlias: cookies["orgAlias"],
      userType: cookies["userType"],
      affiliateId: cookies["affiliateId"],
    };
  }

  return {
    orgAlias: Utils.Storage.GetItem("orgAlias"),
    userType: Utils.Storage.GetItem("userType"),
    affiliateId: Utils.Storage.GetItem("affiliateId"),
  };
};
