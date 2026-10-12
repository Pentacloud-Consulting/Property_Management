"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Contact, 
  DoorOpen, 
  UserCheck, 
  IndianRupee, 
  Wrench, 
  Receipt, 
  FileText, 
  ChevronDown,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

export const SIDEBAR_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Accounts', href: '/accounts', icon: Building2 },
  { title: 'Contacts', href: '/contacts', icon: Contact },
  { title: 'Properties', href: '/properties', icon: Building2 },
  { title: 'Units', href: '/units', icon: DoorOpen },
  { title: 'Tenants', href: '/tenants', icon: UserCheck },
  { title: 'Rent Collection', href: '/rent-collection', icon: IndianRupee },
  { title: 'Maintenance', href: '/maintenance', icon: Wrench },
  { title: 'Reports', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-[260px] bg-gradient-to-b from-[#0B1739] via-[#08122D] to-[#040A1A] flex flex-col flex-shrink-0 border-r border-white/[0.02] shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50 relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Logo */}
      <Link href="/dashboard" className="px-6 py-5 flex items-center relative group">
        <Image
          src="/logo-horizontal-light.png"
          alt="HomeOwner365"
          width={185}
          height={32}
          className="h-[30px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
      </Link>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-1 pb-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-300 relative group overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-[0_4px_15px_rgba(98,91,255,0.35)] border border-indigo-400/20" 
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  )}
                >
                  {/* Subtle hover sweep for active items */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("h-[18px] w-[18px] transition-transform duration-300", isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400 group-hover:scale-110")} />
                    <span>{item.title}</span>
                  </div>
                  {(item as any).badge && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10 transition-colors",
                      isActive ? "bg-white/20 text-white" : "bg-[#060D24] border border-white/5 text-blue-400 group-hover:bg-blue-500/20"
                    )}>
                      {(item as any).badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile & Sign Out */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="flex items-center justify-between p-2 rounded-xl border border-transparent transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#625BFF] to-[#5145E5] border border-white/10 flex items-center justify-center text-white text-xs font-black shadow-inner relative overflow-hidden">
              <span>{user?.username?.charAt(0) || "P"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white truncate max-w-[110px]">
                {user?.username || "Pentacloud"}
              </span>
              <span className="text-[10px] text-indigo-300/70 font-semibold">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// MobileNav is kept simple for this specific requirement
export function MobileNav() {
  return null;
}
