// utils/dehydration.ts
import { initInterceptors } from "@Network/index";
import { initStorage } from "@Utils/index";
import { useEffect } from "react";

export function useDehydrationEffect() {
  const isServer = typeof window === "undefined";

  useEffect(() => {
    if (!isServer) {
      initInterceptors();
      initStorage();
    }
  }, [isServer]);
}
