// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { useEffect } from "react";

export function useDehydrationEffect() {
  const isServer = typeof window === "undefined";

  useEffect(() => {
    if (!isServer) {
      initializeApp();
    }
  }, [isServer]);
}
