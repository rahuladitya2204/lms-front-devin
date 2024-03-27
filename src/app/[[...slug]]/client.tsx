"use client";

import React from "react";
import dynamic from "next/dynamic";
import { initInterceptors } from "@Network/index";

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly() {
  initInterceptors();

  return <App />;
}
