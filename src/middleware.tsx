import NotFoundScreen from "./screens/NotFoundScreen/NotFoundScreen";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateOrgAlias } from "server/api";
import { getHostnameFromHost, getSubdomainFromHost } from "./utils";
import { Utils } from "@adewaskar/lms-common";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";
import { renderToString } from "react-dom/server";

export const config = {
  matcher:
    "/((?!api|_next/static|public|images|favicon.ico|logo192.png|logo512.png|manifest.json|not-found|robotsd*.txt).*)",
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

  const referrer = request.headers.get("referer") || "";
  // todo: testing only
  let cameFromGoogleSEO = false;
  // Check if the user came via Google SEO
  if (referrer.includes("google.com") && !referrer.includes("gclid")) {
    cameFromGoogleSEO = true;
    console.log("[Middleware]: User came from Google SEO");

    // Optionally: Set a cookie to track this
    const response = NextResponse.next();
    response.cookies.set({
      name: "seo_utm_cookie",
      value: "google",
      path: "/",
    });

    // Continue processing
    return response;
  }

  const hasOrgAlias = request.cookies.has("orgAlias");
  const hasUserType = request.cookies.has("userType");

  console.log(
    request.nextUrl.pathname,
    request.headers.get("cookie"),
    request.cookies.get("orgAlias"),
    request.cookies.has("orgAlias"),
    request.cookies.get("userType"),
    request.cookies.has("userType")
  );
  const response = NextResponse.next();
  let updatedResponseCookies = false;

  try {
    if (!hasOrgAlias || !hasUserType) {
      const host = request.headers.get("host");
      const orgAlias = getSubdomainFromHost(host);
      const userType = Utils.getUserType(orgAlias);

      console.log("[Middleware]: validating org alias");

      try {
        await validateOrgAlias({ alias: orgAlias }).then((res) => {
          return res.json();
        });
      } catch (e) {
        console.log("[Middleware] Error validating org alias", e);
        // TODO: catching these errors for testing on azure app service. Remove this when sanity testing is done
      }
      // set response cookies for client side authentication
      const cookiesToSet: Array<SetResponseCookie> = [
        { isSet: hasOrgAlias, name: "orgAlias", value: orgAlias },
        { isSet: hasUserType, name: "userType", value: userType },
      ];

      for (let cookie of cookiesToSet) {
        const { isSet, ...rest } = cookie;
        if (!cookie.isSet) {
          console.log(
            "[Middleware] Setting ",
            cookie.name,
            cookie.value,
            getHostnameFromHost(host)
          );

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
    // return NextResponse.redirect(new URL("/not-found", request.url));
  }
  const validRoutes = [
    "/",
    "/test",
    "/blog",
    "/home",
    "/news",
    "/test-series",
    "/exam",
    "/app",
    "/policies",
    "/sitemap.xml",
    // "/robots.txt",
    "/admin",
  ];
  const isValidRoute = validRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  console.log(request.nextUrl.pathname, "isValidRoute");
  // Redirect to 404 if the route is not valid
  if (!isValidRoute) {
    const html = renderToString(<NotFoundScreen />);
    return new Response(`<!DOCTYPE html>${html}`, {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
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
