"use client";

import Link from "next/link";
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
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SIDEBAR_ITEMS = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
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

  return (
    <div className="h-screen w-[260px] bg-gradient-to-b from-[#0B1739] via-[#08122D] to-[#040A1A] flex flex-col flex-shrink-0 border-r border-white/[0.02] shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-50 relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3 relative">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-white/10">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[22px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-tight tracking-wide">PropCRM</span>
          <span className="text-[9px] text-blue-200/50 font-semibold tracking-widest uppercase">Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-1 pb-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-semibold transition-all duration-300 relative group overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-[#1E5EFF] to-[#1442C4] text-white shadow-[0_4px_15px_rgba(30,94,255,0.25)] border border-blue-400/20" 
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  )}
                >
                  {/* Subtle hover sweep for active items */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={cn("h-[18px] w-[18px] transition-transform duration-300", isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400 group-hover:scale-110")} />
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

      {/* User Profile */}
      <div className="p-4 mt-auto">
        <div className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] p-3 rounded-xl border border-transparent hover:border-white/[0.05] transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white text-xs font-bold shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">MW</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white group-hover:text-blue-200 transition-colors">Mohamed Waseem</span>
              <span className="text-[11px] text-slate-500 font-medium">Admin</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
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
