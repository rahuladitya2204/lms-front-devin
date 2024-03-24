"use client";

import React from "react";
import dynamic from "next/dynamic";
import { initInterceptors } from "@Network/index";
import { Network } from "@adewaskar/lms-common";

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly() {
  initInterceptors(Network.Axios);

  return <App />;
}
