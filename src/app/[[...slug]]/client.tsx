"use client";

import React from "react";
import dynamic from "next/dynamic";
import { initInterceptors } from "@Network/index";
import useDehydration from "@ServerHooks/useDehydration";

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly(): JSX.Element {
  initInterceptors();
  useDehydration();
  // @ts-ignore
  return <App />;
}
