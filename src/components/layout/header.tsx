"use client";

import { Bell, Search, Plus, Calendar, Sun, Command, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-xl px-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center group">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search properties, tenants, accounts, leads..." 
            className="h-10 w-full rounded-xl border border-transparent bg-slate-100/70 pl-10 pr-12 text-[13px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 hover:bg-slate-100 transition-all placeholder:text-slate-400 font-medium"
          />
          <kbd className="absolute right-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-white px-1.5 font-mono text-[10px] font-bold text-slate-400 border border-slate-200 shadow-sm opacity-80">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-5">
        
        {/* Create Button */}
        <Button className="h-9 gap-1.5 bg-gradient-to-b from-[#1E5EFF] to-[#1442C4] text-white hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-[0_4px_12px_rgba(30,94,255,0.25)] border border-blue-400/20 px-4 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create
          <ChevronRight className="h-3.5 w-3.5 ml-1 opacity-70" />
        </Button>
        
        <div className="flex items-center gap-2 border-l border-slate-200/60 pl-5">
          <button className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-xl transition-all hover:scale-105 active:scale-95">
            <Calendar className="h-5 w-5" />
          </button>
          
          <button className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-xl transition-all relative hover:scale-105 active:scale-95">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-sm text-[9px] font-bold text-white">3</span>
          </button>
          
          <button className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 p-2 rounded-xl transition-all hover:scale-105 active:scale-95">
            <Sun className="h-5 w-5" />
          </button>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <Avatar className="h-9 w-9 bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-transparent text-slate-700 text-[11px] font-extrabold">MW</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col">
            <span className="text-[13px] font-extrabold text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">Mohamed Waseem</span>
            <span className="text-[11px] text-slate-500 font-semibold leading-none">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
