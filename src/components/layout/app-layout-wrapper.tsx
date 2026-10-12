"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const isPublicPage = pathname === "/" || pathname === "/login";

  // If user is on a public page, render clean full-width without Sidebar/CRM Header
  if (isPublicPage) {
    return <main className="min-h-screen bg-[#F3F5F9]">{children}</main>;
  }

  // Authenticated CRM Layout
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Suspense fallback={<div className="w-[260px] h-full bg-[#0B1739]" />}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<div className="h-16 w-full border-b bg-background" />}>
          <Header />
        </Suspense>
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}

export function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F3F5F9]">{children}</main>}>
      <AppLayoutContent>{children}</AppLayoutContent>
    </Suspense>
  );
}
