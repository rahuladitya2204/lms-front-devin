import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateOrgAlias } from "server/api";
import { getHostnameFromHost, getSubdomainFromHost } from "./utils";
import { Utils } from "@adewaskar/lms-common";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
  runtime: "experimental-edge",
  unstable_allowDynamic: ["**/node_modules/lodash/*.js"],
};

type SetResponseCookie = {
  isSet: boolean;
  name: string;
  value: string;
};

export async function middleware(request: NextRequest) {
  console.log("[Middleware]: started");
  const hasOrgAlias = request.cookies.has("orgAlias");
  const hasUserType = request.cookies.has("userType");

  const response = NextResponse.next();
  let updatedResponseCookies = false;

  try {
    if (!hasOrgAlias || !hasUserType) {
      const host = request.headers.get("host");
      const orgAlias = getSubdomainFromHost(host);
      const userType = Utils.getUserType(orgAlias);

      console.log("[Middleware]: validating org alias");
      await validateOrgAlias({ alias: orgAlias }).then((res) => {
        return res.json();
      });

      // set response cookies for client side authentication
      const cookiesToSet: Array<SetResponseCookie> = [
        { isSet: hasOrgAlias, name: "orgAlias", value: orgAlias },
        { isSet: hasUserType, name: "userType", value: userType },
      ];

      for (let cookie of cookiesToSet) {
        const { isSet, ...rest } = cookie;
        if (!cookie.isSet) {
          console.log("[Middleware] Setting ", cookie.name, getHostnameFromHost(host));

          updatedResponseCookies = true;
          response.cookies.set({
            ...rest,
            path: "/",
            domain: getHostnameFromHost(host),
          });
        }
      }
    }
  } catch {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // only apply set cookies to current request cookies
  // if response cookies has been updated
  if (updatedResponseCookies) {
    applySetCookie(request, response);
  }

  console.log("[Middleware]: ended");

  // Continue with the request
  return response;
}

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}
