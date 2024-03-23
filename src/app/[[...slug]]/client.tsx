"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const App = dynamic(() => import("../../App"), { ssr: false });

export function ClientOnly() {
  return;

  <HydrationBoundary state={dehydrate(queryClient)}>
    <App />
  </HydrationBoundary>;
}
