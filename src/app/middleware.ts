import { initInterceptors } from "@Network/index";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  initInterceptors();
  // Continue with the request
  return NextResponse.next();
}
