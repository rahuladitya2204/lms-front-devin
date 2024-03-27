import { parseCookies } from "@Utils/index";
import getIsServer from "./getIsServer";
import { Utils } from "@adewaskar/lms-common";

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

export default getRequestHeaders;
