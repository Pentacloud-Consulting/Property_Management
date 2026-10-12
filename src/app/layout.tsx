import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWRProvider } from "@/components/providers/swr-provider";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HomeOwner365 | Complete Property Management",
  description:
    "Manage properties, units, tenants, leases, rent collection, and maintenance with HomeOwner365—your complete property management platform.",
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${manrope.className} h-full antialiased text-foreground bg-background [font-variant-numeric:tabular-nums]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SWRProvider>
            <TooltipProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
