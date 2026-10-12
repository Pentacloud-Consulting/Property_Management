"use client";

import * as React from "react";
import { SWRConfig } from "swr";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        dedupingInterval: 15000,
        errorRetryCount: 2,
      }}
    >
      {children}
    </SWRConfig>
  );
}
