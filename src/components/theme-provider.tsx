"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

// Filter out the React 19 / Turbopack false-positive overlay warning for next-themes' inline script
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

