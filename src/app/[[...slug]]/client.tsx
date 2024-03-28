"use client";

import React from "react";
import dynamic from "next/dynamic";
import { initInterceptors } from "@Network/index";
import { useDehydrationEffect } from "@ServerHooks/useDehydrationEffect";

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly(): JSX.Element {
  initInterceptors();
  useDehydrationEffect();
  // @ts-ignore
  return <App />;
}
