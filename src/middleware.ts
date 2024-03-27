import { initInterceptors } from "@Network/index";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateOrgAlias } from "server/api";
import { getSubdomainFromHostname } from "./utils";
import { Utils } from "@adewaskar/lms-common";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

export async function middleware(request: NextRequest) {
  console.log("[Middleware]: started");
  initInterceptors();

  const subdomain = getSubdomainFromHostname(request.headers.get("host"));
  const result = await validateOrgAlias({ alias: subdomain })
    .then((res) => {
      return res.json();
    })
    .catch(() => {});

  // if org is validated
  // TODO: implement affiliate ID match
  if (result) {
    request.cookies.set({ name: "orgAlias", value: subdomain });
    request.cookies.set({
      name: "userType",
      value: Utils.getUserType(subdomain),
    });
  } else {
    return;
  }

  const response = NextResponse.next();

  console.log("[Middleware]: ended");

  // Continue with the request
  return response;
}
