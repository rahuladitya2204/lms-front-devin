// utils/dehydration.ts
import { initializeApp } from "@Utils/index";
import { useEffect } from "react";

const useDehydration = () => {
  const isServer = typeof window === "undefined";

  useEffect(() => {
    if (!isServer) {
      initializeApp();
    }
  }, [isServer]);
};

export default useDehydration;
