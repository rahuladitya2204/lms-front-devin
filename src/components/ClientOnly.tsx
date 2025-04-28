"use client";

import React, { useEffect, useState } from "react";

/**
 * Component that only renders its children on the client
 * This helps prevent hydration errors and improves FCP
 */
export default function ClientOnly({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
