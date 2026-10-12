import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWRProvider } from "@/components/providers/swr-provider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropCRM — Property Intelligence Platform",
  description: "Enterprise property management and portfolio intelligence",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${manrope.className} h-full antialiased text-foreground bg-background [font-variant-numeric:tabular-nums]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SWRProvider>
            <TooltipProvider>
              <div className="flex h-screen overflow-hidden">
                <Suspense fallback={<div className="w-[260px] h-full bg-sidebar-navy" />}>
                  <Sidebar />
                </Suspense>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Suspense fallback={<div className="h-14 w-full border-b bg-background" />}>
                    <Header />
                  </Suspense>
                  <main className="flex-1 overflow-y-auto bg-background">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
