"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { initInterceptors } from "@Network/index";
import useDehydration from "@ServerHooks/useDehydration";
import LoadingScreen from "@Components/LoadingScreen";


const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly(): JSX.Element {
  initInterceptors();
  useDehydration();
  // @ts-ignore
  return (
    // <Suspense fallback={<LoadingScreen />}>
    <App />
    // </Suspense>
  );
}
