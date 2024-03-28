import { parseCookies } from "@Utils/index";
import { Utils } from "@adewaskar/lms-common";
import getConfig from "next/config";

export const getIsServer = (): boolean => {
  return typeof window === "undefined";
};

export const getServerCookie = (): string => {
  return require("next/headers").headers().get("cookie");
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
