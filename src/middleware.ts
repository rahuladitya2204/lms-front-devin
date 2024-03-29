import { initInterceptors } from "@Network/index";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateOrgAlias, validateUser } from "server/api";
import { getSubdomainFromHostname, initStorage } from "./utils";
import { Utils } from "@adewaskar/lms-common";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
  runtime: "experimental-edge",
  unstable_allowDynamic: ["**/node_modules/lodash/*.js"],
};

export async function middleware(request: NextRequest) {
  console.log("[Middleware]: started");
  initInterceptors();
  initStorage();

  const orgAliasSet = request.cookies.get("orgAlias");
  const userTypeSet = request.cookies.get("userType");

  const orgAlias = getSubdomainFromHostname(request.headers.get("host"));
  await validateOrgAlias({ alias: orgAlias })
    .then((res) => {
      return res.json();
    })
    .catch(() => {});

  const userType = Utils.getUserType(orgAlias);
  request.cookies.set({ name: "orgAlias", value: orgAlias });
  request.cookies.set({ name: "userType", value: userType });

  const tokenCookieString = `${userType}-auth-token`;
  const token = request.cookies.get(tokenCookieString);
  if (token?.value) {
    await validateUser({
      userType,
      orgAlias,
      token: token.value,
    })
      .then((res) => res.json())
      .catch(() => {});
  }

  const response = NextResponse.next();
  // set response cookies for client side authentication
  if (!orgAliasSet) {
    response.cookies.set({
      name: "orgAlias",
      value: orgAlias,
      path: "/",
      domain: request.headers.get("host") ?? "",
    });
  }
  if (!userTypeSet) {
    response.cookies.set({
      name: "userType",
      value: userType,
      path: "/",
      domain: request.headers.get("host") ?? "",
    });
  }

  console.log("[Middleware]: ended");

  // Continue with the request
  return response;
}
