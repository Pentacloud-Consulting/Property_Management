"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Users,
  IndianRupee,
  DoorOpen,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowUpRight,
  Layers,
  Clock,
  Briefcase,
  UserCheck,
  Check,
  Receipt,
  FileCheck2,
  RefreshCw,
  LogOut,
  HelpCircle,
  PieChart as PieChartIcon,
  Activity,
  User,
  Search,
  Bell,
  Plus,
  LayoutDashboard,
  Star,
  Zap,
  Globe,
  Shield,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { HomeOwner365Logo } from "@/components/shared/homeowner365-logo";
import { LoginDialog } from "@/components/auth/login-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function HomeOwner365HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "properties" | "tenants" | "rent" | "maintenance"
  >("dashboard");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroMockupTab, setHeroMockupTab] = useState<"overview" | "rent" | "units">("overview");
  const [scrollY, setScrollY] = useState(0);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Illustrative preview data
  const revenueTrendData = [
    { month: "Jan", collected: 420000, target: 450000, pending: 30000 },
    { month: "Feb", collected: 435000, target: 460000, pending: 25000 },
    { month: "Mar", collected: 460000, target: 480000, pending: 20000 },
    { month: "Apr", collected: 475000, target: 500000, pending: 25000 },
    { month: "May", collected: 490000, target: 510000, pending: 20000 },
    { month: "Jun", collected: 520000, target: 540000, pending: 20000 },
  ];

  // Screenshot replication data (6-month trend matching exact CRM numbers)
  const heroRevenueTrendData = [
    { month: "Jan", collected: 180000, pending: 35000, target: 195000 },
    { month: "Feb", collected: 172000, pending: 38000, target: 205000 },
    { month: "Mar", collected: 188000, pending: 36000, target: 215000 },
    { month: "Apr", collected: 182000, pending: 34000, target: 220000 },
    { month: "May", collected: 190000, pending: 32000, target: 215000 },
    { month: "Jun", collected: 50000, pending: 0, target: 125000 },
  ];

  const heroOccupancyDonutData = [
    { name: "Occupied", value: 2, color: "#6155F5" },
    { name: "Vacant", value: 2, color: "#E2E8F0" },
  ];

  const faqs = [
    {
      q: "What is HomeOwner365?",
      a: "HomeOwner365 is a complete, enterprise-grade property management SaaS platform designed for property owners, landlords, and property managers to oversee properties, unit inventory, tenant lifecycles, rent collection, and maintenance tickets in one unified workspace.",
    },
    {
      q: "Can I manage multiple properties?",
      a: "Yes. HomeOwner365 supports unlimited portfolios across apartments, standalone villas, multi-unit buildings, commercial complexes, and PGs. Each property maintains its own address context, floors, documents, and individual units.",
    },
    {
      q: "Can I manage residential and commercial properties?",
      a: "Absolutely. You can categorize properties as Apartments, Villas, Independent Houses, Commercial, Plots, or PGs, with custom specifications such as built-up area, parking slots, and amenities.",
    },
    {
      q: "Can I manage multiple units in one property?",
      a: "Yes. Within each property, you can add flats, BHK units (1BHK, 2BHK, 3BHK, 4BHK), studios, shops, and offices. Unit bedrooms are automatically derived or customized, and each unit tracks occupancy status, rent benchmarks, and security deposits.",
    },
    {
      q: "Can I track rent payments and overdue balances?",
      a: "Yes. HomeOwner365 provides a comprehensive rent ledger with tracking for Paid, Pending, Partial, and Overdue statuses across UPI, NEFT/RTGS, Cheque, Online, and Cash with transaction reference numbers and receipt uploads.",
    },
    {
      q: "Can I renew leases without duplicating tenant records?",
      a: "Yes. Our lease renewal workflow allows you to extend dates, adjust monthly rent, update security deposits, and upload fresh rental agreements while completely preserving the existing tenant record and transaction history.",
    },
    {
      q: "How does tenant deposit settlement work?",
      a: "During tenant exit, you record the move-out inspection, itemize deductions (unpaid rent, painting, repairs, utility dues), and HomeOwner365 calculates the exact refundable deposit or outstanding balance, automatically setting the unit back to Vacant upon settlement.",
    },
    {
      q: "Can I track maintenance expenses?",
      a: "Yes. Maintenance tickets categorize repairs across plumbing, electrical, carpentry, cleaning, and appliances, complete with priority levels, assignment to vendors, resolution status, and tracking whether expenses are owner-paid, tenant-paid, or shared.",
    },
    {
      q: "Can I upload property and tenant documents?",
      a: "Yes. Both property documents (title deeds, tax receipts, blueprints) and tenant documents (Govt ID, PAN, rental agreements, move-out inspection checklists) can be securely uploaded, viewed, and downloaded directly within the application.",
    },
    {
      q: "How do I get started?",
      a: "Click 'Sign In' or 'Get Started' to log in with your credentials (Username: Pentacloud, Password: Pentacloud@2026). Once logged in, your full dashboard and portfolio management tools are ready immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-[#111827] selection:bg-[#625BFF] selection:text-white font-sans antialiased">
      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} redirectTo="/dashboard" />

      {/* =========================================================================
          SECTION 1 — PREMIUM NAVIGATION
         ========================================================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrollY > 20
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(15,23,42,0.06)] border-b border-slate-200/70"
            : "bg-white/70 backdrop-blur-xl border-b border-slate-200/30"
        }`}
      >
        <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <HomeOwner365Logo href="/" size="md" showTagline={false} />

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "#platform", label: "Platform" },
                { href: "#features", label: "Features" },
                { href: "#showcase", label: "Solutions" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#faq", label: "FAQ" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative text-[13px] font-semibold text-[#475569] hover:text-[#6155F5] px-3 py-1.5 rounded-xl transition-all tracking-tight group"
                >
                  {item.label}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] group-hover:w-4/5 transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="group h-9 px-4 rounded-xl bg-gradient-to-r from-[#6155F5] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white font-bold text-[12.5px] shadow-[0_4px_14px_rgba(97,85,245,0.25)] hover:shadow-[0_6px_20px_rgba(97,85,245,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
                >
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="h-9 w-9 rounded-xl border border-[#CBD5E1]/70 bg-white/80 hover:bg-rose-50 text-[#64748B] hover:text-rose-600 flex items-center justify-center transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLoginOpen(true)}
                  className="h-9 px-3.5 text-[13px] font-bold text-[#111A3A] hover:text-[#6155F5] hover:bg-[#F0EEFF]/80 rounded-xl transition-all"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => setLoginOpen(true)}
                  className="h-9 px-4.5 text-[13px] font-bold bg-gradient-to-r from-[#6155F5] via-[#5A4FEE] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white rounded-xl shadow-[0_4px_14px_rgba(97,85,245,0.25)] hover:shadow-[0_6px_20px_rgba(97,85,245,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all btn-premium"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1 — SINGLE-SCREEN ULTRA-PREMIUM HERO
         ========================================================================= */}
      <section className="relative lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center py-5 lg:py-2 xl:py-4 overflow-hidden">
        {/* Dynamic Multi-Layer Atmospheric Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(1300px 650px at 50% -80px, rgba(98, 91, 255, 0.16), transparent 75%),
                radial-gradient(850px 520px at 85% 25%, rgba(139, 92, 246, 0.13), transparent 70%),
                radial-gradient(650px 420px at 15% 35%, rgba(99, 102, 241, 0.09), transparent 60%),
                linear-gradient(180deg, #FFFFFF 0%, #F5F7FD 50%, #F0F3FB 100%)
              `,
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_32%,#000_35%,transparent_90%)]"
            style={{
              backgroundImage: `radial-gradient(rgba(98, 91, 255, 0.18) 1.2px, transparent 1.2px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="absolute -top-24 left-1/4 w-[550px] h-[550px] bg-gradient-to-br from-[#625BFF]/18 to-[#A78BFA]/5 rounded-full blur-[110px] animate-float-slow" />
          <div className="absolute top-1/3 -right-24 w-[650px] h-[650px] bg-gradient-to-bl from-[#7C3AED]/14 via-[#625BFF]/8 to-transparent rounded-full blur-[130px] animate-float-medium" />
          <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-gradient-to-tr from-[#38BDF8]/10 to-transparent rounded-full blur-[90px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#625BFF]/25 to-transparent" />
        </div>

        <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 items-center">
            {/* ---------------------------------------------------------------
                Hero Left Column: Value Proposition & Conversion
               --------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-3 lg:space-y-3.5 xl:space-y-4 animate-slide-up">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-[#625BFF]/25 text-[#5145E5] text-[10.5px] font-black uppercase tracking-wider shadow-[0_2px_12px_rgba(98,91,255,0.1)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#625BFF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#625BFF]" />
                </span>
                <span className="bg-gradient-to-r from-[#625BFF] to-[#7C3AED] bg-clip-text text-transparent">
                  PROPERTY MANAGEMENT, SIMPLIFIED
                </span>
                <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 rounded bg-[#EEF0FF] text-[#625BFF]">
                  v2.4
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[44px] font-black tracking-[-0.035em] text-[#0A1226] leading-[1.08]">
                Every Property.
                <br />
                Every Tenant.
                <br />
                <span
                  className="bg-gradient-to-r from-[#625BFF] via-[#7C3AED] to-[#4F46E5] bg-clip-text text-transparent animate-text-gradient drop-shadow-xs"
                  style={{ backgroundSize: '200% auto' }}
                >
                  Everything Under Control.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[13px] sm:text-[14px] text-[#475569] font-normal leading-[1.55] max-w-md">
                Manage your complete property portfolio, BHK unit inventory, tenant lifecycles, automated UPI rent collection, and maintenance tickets in one intelligent workspace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
                <Button
                  onClick={() => setLoginOpen(true)}
                  className="group h-10.5 px-6 rounded-xl bg-gradient-to-r from-[#625BFF] via-[#5A4FEE] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white font-extrabold text-[13px] shadow-[0_8px_22px_-4px_rgba(98,91,255,0.42),0_0_0_1px_rgba(255,255,255,0.2)_inset] hover:shadow-[0_12px_26px_-4px_rgba(98,91,255,0.52)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 btn-premium animate-shimmer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
                <a
                  href="#showcase"
                  className="group h-10.5 px-5 rounded-xl border border-slate-300/80 bg-white/90 hover:bg-white text-[#0A1226] font-bold text-[13px] backdrop-blur-md shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-[#625BFF]" />
                  <span>Explore the Platform</span>
                </a>
              </div>

              {/* Social Proof & Trust Stack */}
              <div className="flex items-center gap-2.5 pt-0.5">
                <div className="flex -space-x-1.5">
                  {[
                    { initial: "AK", bg: "from-blue-600 to-indigo-600" },
                    { initial: "PS", bg: "from-purple-600 to-pink-600" },
                    { initial: "RM", bg: "from-emerald-600 to-teal-600" },
                    { initial: "VT", bg: "from-amber-600 to-orange-600" },
                  ].map((av, i) => (
                    <div
                      key={i}
                      className={`w-6.5 h-6.5 rounded-full bg-gradient-to-br ${av.bg} text-white font-black text-[9.5px] flex items-center justify-center ring-2 ring-white shadow-xs`}
                    >
                      {av.initial}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-black text-[#0A1226] ml-1">4.9/5</span>
                  </div>
                  <span className="text-[#94A3B8]">•</span>
                  <p className="font-semibold text-[#64748B]">
                    500+ Indian Landlords & Owners
                  </p>
                </div>
              </div>

              {/* Feature Checklist Chips */}
              <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px]">
                {[
                  "Complete Portfolio Visibility",
                  "Smarter Rental Operations",
                  "Clear Financial Tracking",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-[#0A1226] tracking-tight">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------------
                Hero Right Column: The Interactive Compact Dashboard Mockup
               --------------------------------------------------------------- */}
            <div className="lg:col-span-7 w-full animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="relative group">
                {/* 3D Floating Glass Badge 1 (Top-Right): Recent Rent Payment */}
                <div className="absolute -top-3.5 -right-2 sm:-right-4 z-30 p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.18),0_0_0_1px_rgba(98,91,255,0.08)] flex items-center gap-2.5 animate-float-slow transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    <IndianRupee className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <p className="text-[11px] font-black text-[#0A1226] leading-none">₹50,000 Rent Received</p>
                    </div>
                    <p className="text-[9px] font-bold text-[#64748B] mt-0.5">UPI (GPay) • Unit 201 • Auto-Reconciled</p>
                  </div>
                </div>

                {/* 3D Floating Glass Badge 2 (Bottom-Left): Occupancy Milestone */}
                <div className="absolute bottom-2 -left-2 sm:-left-4 z-30 p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_16px_36px_-8px_rgba(15,23,42,0.18),0_0_0_1px_rgba(98,91,255,0.08)] flex items-center gap-2.5 animate-float-medium transition-transform hover:scale-105">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#625BFF] to-[#8B5CF6] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                    <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">↑ 92.4%</span>
                      <p className="text-[11px] font-black text-[#0A1226] leading-none">Portfolio Occupancy</p>
                    </div>
                    <p className="text-[9px] font-bold text-[#64748B] mt-0.5">4 Active Units • 0 Overdue Dues</p>
                  </div>
                </div>

                {/* 3D Floating Glass Badge 3 (Top-Left Pill) */}
                <div className="hidden xl:flex absolute top-6 -left-3 z-30 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-md items-center gap-1.5 animate-float-slow">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#625BFF]" />
                  <span className="text-[10px] font-black text-[#0A1226]">Zero-Duplicate Leases</span>
                </div>

                {/* Ambient Backlight Glow */}
                <div className="absolute -inset-3 bg-gradient-to-r from-[#625BFF]/22 via-[#8B5CF6]/18 to-[#4F46E5]/22 rounded-[28px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animate-pulse-glow" />

                {/* Main Dashboard Window Frame */}
                <div className="relative bg-[#0B132B] rounded-2xl border border-white/20 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.30),0_0_0_1px_rgba(255,255,255,0.1)_inset] overflow-hidden transition-transform duration-500 group-hover:-translate-y-0.5">

                  {/* Browser / Workspace Top Chrome Bar */}
                  <div className="h-9 bg-gradient-to-r from-[#0B132B] via-[#0F1C3F] to-[#0B132B] border-b border-white/[0.08] px-3.5 flex items-center justify-between text-white select-none">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-[0_0_6px_rgba(255,95,86,0.6)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-[0_0_6px_rgba(255,189,46,0.6)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-[0_0_6px_rgba(39,201,63,0.6)]" />
                      <span className="hidden sm:inline-block ml-2 text-[9.5px] font-semibold text-white/40 tracking-wider">
                        app.homeowner365.com/dashboard
                      </span>
                    </div>

                    {/* Interactive Tab Switcher in the Window Chrome */}
                    <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg border border-white/[0.08]">
                      {(
                        [
                          { id: "overview", label: "Overview", icon: LayoutDashboard },
                          { id: "rent", label: "Rent Ledger", icon: IndianRupee },
                          { id: "units", label: "Unit Inventory", icon: DoorOpen },
                        ] as const
                      ).map((tab) => {
                        const Icon = tab.icon;
                        const isActive = heroMockupTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setHeroMockupTab(tab.id)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-extrabold transition-all duration-200 cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-xs"
                                : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                            }`}
                          >
                            <Icon className="w-2.5 h-2.5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Live Sync Pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span className="hidden sm:inline text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Live Sync
                      </span>
                    </div>
                  </div>

                  {/* Window Body: Dark Sidebar + Bright Content */}
                  <div className="flex bg-[#F3F5F9] overflow-hidden">
                    {/* Left Dark Sidebar */}
                    <div className="w-36 sm:w-40 bg-gradient-to-b from-[#0B132B] to-[#080E1F] border-r border-white/[0.06] flex flex-col justify-between py-2.5 px-2 shrink-0 hidden md:flex select-none">
                      <div className="space-y-2.5">
                        {/* Logo */}
                        <div className="px-1 flex items-center gap-1.5">
                          <Image
                            src="/logo-icon.png"
                            alt="HomeOwner365"
                            width={22}
                            height={22}
                            className="w-5.5 h-5.5 object-contain shrink-0"
                          />
                          <div className="leading-tight">
                            <div className="text-[11px] font-black text-white tracking-tight">
                              HomeOwner<span className="text-[#00D084]">365</span>
                            </div>
                            <div className="text-[7px] font-bold text-white/35 tracking-widest uppercase">
                              WORKSPACE
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-0.5 text-[10px] font-bold">
                          <div
                            onClick={() => setHeroMockupTab("overview")}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors ${
                              heroMockupTab === "overview"
                                ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-xs"
                                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                            }`}
                          >
                            <LayoutDashboard className="w-3 h-3" />
                            <span>Dashboard</span>
                          </div>
                          <div
                            onClick={() => setHeroMockupTab("units")}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors ${
                              heroMockupTab === "units"
                                ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-xs"
                                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                            }`}
                          >
                            <DoorOpen className="w-3 h-3" />
                            <span>Units</span>
                          </div>
                          <div
                            onClick={() => setHeroMockupTab("rent")}
                            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors ${
                              heroMockupTab === "rent"
                                ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-xs"
                                : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                            }`}
                          >
                            <IndianRupee className="w-3 h-3" />
                            <span>Rent Collection</span>
                          </div>
                          {[
                            { icon: Layers, label: "Accounts" },
                            { icon: UserCheck, label: "Contacts" },
                            { icon: Building2, label: "Properties" },
                            { icon: Users, label: "Tenants" },
                            { icon: Wrench, label: "Maintenance" },
                          ].map(({ icon: Icon, label }) => (
                            <div
                              key={label}
                              className="flex items-center gap-2 px-2 py-1 rounded-md text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors cursor-pointer"
                            >
                              <Icon className="w-3 h-3" />
                              <span>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* User Profile */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                            P
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black text-white truncate">Pentacloud</p>
                            <p className="text-[7px] text-white/35 truncate">Admin</p>
                          </div>
                        </div>
                        <LogOut className="w-2.5 h-2.5 text-white/30 hover:text-white shrink-0" />
                      </div>
                    </div>

                    {/* Right Dashboard Body Canvas */}
                    <div className="flex-1 min-w-0 bg-[#F3F5F9] flex flex-col">
                      {/* Top App Header */}
                      <div className="h-9 bg-white border-b border-[#E8ECF3] px-3 flex items-center justify-between gap-2">
                        <div className="flex-1 max-w-xs flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[9.5px] text-[#64748B]">
                          <Search className="w-2.5 h-2.5 text-[#94A3B8]" />
                          <span className="truncate">Search properties, units, tenants...</span>
                          <span className="ml-auto text-[7.5px] font-extrabold px-1 py-0.2 rounded bg-white border border-[#CBD5E1] text-[#64748B]">
                            ⌘K
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setLoginOpen(true)}
                            className="h-6 px-2 rounded-md bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white text-[9px] font-black flex items-center gap-1 shadow-xs hover:opacity-95 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[3]" /> Create
                          </button>
                          <div className="relative w-6 h-6 rounded-md border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B]">
                            <Bell className="w-2.5 h-2.5" />
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 text-white text-[6.5px] font-bold flex items-center justify-center">
                              3
                            </span>
                          </div>
                          <div className="flex items-center gap-1 pl-1 border-l border-[#E2E8F0]">
                            <div className="w-5 h-5 rounded-full bg-[#F0EEFF] text-[#625BFF] text-[8px] font-black flex items-center justify-center border border-[#625BFF]/30">
                              PE
                            </div>
                            <div className="hidden xl:block text-left leading-none">
                              <p className="text-[8.5px] font-black text-[#101B3A]">Pentacloud</p>
                              <p className="text-[6.5px] text-[#64748B]">Admin</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Dynamic View Area */}
                      <div className="p-2.5 space-y-2 overflow-x-auto">
                        {/* TAB 1: OVERVIEW */}
                        {heroMockupTab === "overview" && (
                          <>
                            {/* 4 Clean, Bold, High-Impact KPI Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                              {[
                                { icon: IndianRupee, bg: "bg-emerald-50", text: "text-emerald-600", label: "Monthly Rent", value: "₹50,000", change: "↑ 15%", changeColor: "bg-emerald-50 text-emerald-600", note: "100% on-time" },
                                { icon: Clock, bg: "bg-purple-50", text: "text-purple-600", label: "Occupancy", value: "50%", change: "2 of 4 Units", changeColor: "bg-purple-50 text-purple-600", note: "2 vacant ready" },
                                { icon: Building2, bg: "bg-blue-50", text: "text-blue-600", label: "Properties", value: "2", change: "Active", changeColor: "bg-blue-50 text-blue-600", note: "Ayub Khan & Pentacloud" },
                                { icon: Wrench, bg: "bg-amber-50", text: "text-amber-600", label: "Maintenance", value: "100%", change: "0 Open", changeColor: "bg-emerald-50 text-emerald-600", note: "All tickets resolved" },
                              ].map(({ icon: Icon, bg, text, label, value, change, changeColor, note }, idx) => (
                                <div key={idx} className="p-1.5 rounded-lg bg-white border border-[#E8ECF3] shadow-xs hover:border-[#625BFF]/30 transition-colors">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <div className={`w-4.5 h-4.5 rounded ${bg} ${text} flex items-center justify-center`}>
                                      <Icon className="w-2.5 h-2.5" />
                                    </div>
                                    <span className={`text-[7px] font-bold px-1 py-0.2 rounded ${changeColor}`}>
                                      {change}
                                    </span>
                                  </div>
                                  <p className="text-[7px] font-extrabold text-[#64748B] uppercase tracking-wider">{label}</p>
                                  <p className="text-[12px] font-black text-[#101B3A] leading-tight mt-0.5">{value}</p>
                                  <p className="text-[6.5px] font-medium text-[#94A3B8] mt-0.5 truncate">{note}</p>
                                </div>
                              ))}
                            </div>

                            {/* Row 2: Revenue Chart + Occupancy & Unit Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                              {/* Revenue Area Chart Card */}
                              <div className="lg:col-span-7 p-2 rounded-xl border border-[#E8ECF3] bg-white shadow-xs">
                                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4.5 h-4.5 rounded-md bg-[#625BFF]/10 text-[#625BFF] flex items-center justify-center">
                                      <IndianRupee className="w-2.5 h-2.5" />
                                    </div>
                                    <div>
                                      <h4 className="text-[10px] font-black text-[#101B3A] leading-tight">Revenue & Collection</h4>
                                      <p className="text-[7px] font-medium text-[#64748B]">6-month trend analysis</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-[7px] font-bold text-[#64748B]">
                                    <span className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#625BFF]" /> Collected
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="w-2 h-0.5 bg-slate-400 border-t border-dashed" /> Target
                                    </span>
                                  </div>
                                </div>

                                {/* 3 Metric Pills */}
                                <div className="grid grid-cols-3 gap-1 mb-1.5">
                                  {[
                                    { value: "₹50,000", label: "Total Revenue", change: "↑ 12%", changeColor: "text-emerald-600", borderColor: "border-[#625BFF]" },
                                    { value: "₹50,000", label: "Collected (UPI)", change: "100%", changeColor: "text-emerald-600", borderColor: "border-emerald-500" },
                                    { value: "₹0", label: "Pending Dues", change: "0", changeColor: "text-emerald-600", borderColor: "border-amber-500" },
                                  ].map(({ value, label, change, changeColor, borderColor }, idx) => (
                                    <div key={idx} className={`p-1 rounded-md bg-[#F8FAFC] border-l-2 ${borderColor} border-t border-r border-b border-[#E2E8F0]`}>
                                      <p className="text-[10px] font-black text-[#101B3A]">{value}</p>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[6.5px] font-semibold text-[#64748B]">{label}</span>
                                        <span className={`text-[6.5px] font-bold ${changeColor}`}>{change}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Area Chart */}
                                <div className="h-20 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={heroRevenueTrendData} margin={{ top: 2, right: 4, left: -25, bottom: 0 }}>
                                      <defs>
                                        <linearGradient id="heroRevGradient" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#625BFF" stopOpacity={0.28} />
                                          <stop offset="95%" stopColor="#625BFF" stopOpacity={0.0} />
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 7.5, fill: "#94A3B8" }} />
                                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 7.5, fill: "#94A3B8" }} tickFormatter={(val) => `₹${val/1000}K`} />
                                      <Area type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth={1.2} fill="none" dot={false} />
                                      <Area type="monotone" dataKey="collected" stroke="#625BFF" strokeWidth={2} fill="url(#heroRevGradient)" dot={false} />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Occupancy Donut & Unit Allocation */}
                              <div className="lg:col-span-5 p-2 rounded-xl border border-[#E8ECF3] bg-white shadow-xs flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4.5 h-4.5 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                                      <Clock className="w-2.5 h-2.5" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-[#101B3A]">Unit Allocation</h4>
                                  </div>
                                  <span className="text-[7.5px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                                    50% Occupied
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 my-1">
                                  <div className="h-16 w-16 relative shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={heroOccupancyDonutData}
                                          innerRadius={20}
                                          outerRadius={30}
                                          dataKey="value"
                                          stroke="none"
                                          startAngle={90}
                                          endAngle={-270}
                                        >
                                          <Cell fill="#625BFF" />
                                          <Cell fill="#E2E8F0" />
                                        </Pie>
                                      </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                      <span className="text-[11px] font-black text-[#101B3A] leading-none">50%</span>
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0 space-y-1">
                                    {[
                                      { unit: "Flat 201 (2BHK)", tenant: "Arshad Khan", rent: "₹28,000", tag: "Paid", bg: "bg-emerald-50 text-emerald-700" },
                                      { unit: "Flat 101 (1BHK)", tenant: "Rahul Sharma", rent: "₹22,000", tag: "Paid", bg: "bg-emerald-50 text-emerald-700" },
                                    ].map((u, i) => (
                                      <div key={i} className="p-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-[7px]">
                                        <div className="min-w-0">
                                          <p className="font-black text-[#101B3A] truncate">{u.unit}</p>
                                          <p className="text-[#64748B] text-[6.5px] truncate">{u.tenant}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-black text-[#101B3A] block">{u.rent}</span>
                                          <span className={`px-1 py-0.1 rounded font-extrabold text-[6px] ${u.bg}`}>{u.tag}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#F1F5F9] text-center">
                                  <div className="p-0.5 rounded bg-indigo-50/70 border border-indigo-100">
                                    <p className="text-[8.5px] font-black text-[#625BFF] leading-tight">4</p>
                                    <p className="text-[6px] font-extrabold text-[#625BFF]/70 uppercase">TOTAL</p>
                                  </div>
                                  <div className="p-0.5 rounded bg-emerald-50/70 border border-emerald-100">
                                    <p className="text-[8.5px] font-black text-emerald-600 leading-tight">2</p>
                                    <p className="text-[6px] font-extrabold text-emerald-600/70 uppercase">FILLED</p>
                                  </div>
                                  <div className="p-0.5 rounded bg-slate-50 border border-slate-200">
                                    <p className="text-[8.5px] font-black text-slate-600 leading-tight">2</p>
                                    <p className="text-[6px] font-extrabold text-slate-500 uppercase">VACANT</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Row 3: Properties + Maintenance + Live Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5">
                              {/* Property Portfolio */}
                              <div className="lg:col-span-4 p-2 rounded-xl border border-[#E8ECF3] bg-white shadow-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                      <Building2 className="w-2.5 h-2.5" />
                                    </div>
                                    <h5 className="text-[9px] font-black text-[#101B3A]">Portfolio</h5>
                                  </div>
                                  <span className="text-[7px] font-bold text-[#64748B]">View All</span>
                                </div>
                                <div className="space-y-1">
                                  {[
                                    { name: "AYUB KHAN MANZIL", units: "2 Active Units", status: "Active", statusBg: "bg-emerald-50 text-emerald-700 font-bold" },
                                    { name: "PENTACLOUD HTS", units: "2 Active Units", status: "Active", statusBg: "bg-emerald-50 text-emerald-700 font-bold" },
                                  ].map(({ name, units, status, statusBg }, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                                      <div className="flex items-center gap-1 min-w-0">
                                        <div className="w-4 h-4 rounded bg-[#625BFF]/10 text-[#625BFF] flex items-center justify-center shrink-0">
                                          <Building2 className="w-2 h-2" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-[8px] font-black text-[#101B3A] truncate">{name}</p>
                                          <p className="text-[6.5px] text-[#64748B]">{units}</p>
                                        </div>
                                      </div>
                                      <span className={`text-[6.5px] font-extrabold px-1 py-0.2 rounded ${statusBg}`}>{status}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Maintenance */}
                              <div className="lg:col-span-4 p-2 rounded-xl border border-[#E8ECF3] bg-white shadow-xs">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded bg-rose-50 text-rose-600 flex items-center justify-center">
                                      <Wrench className="w-2.5 h-2.5" />
                                    </div>
                                    <h5 className="text-[9px] font-black text-[#101B3A]">Maintenance</h5>
                                  </div>
                                  <span className="text-[7px] font-bold text-[#64748B]">View All</span>
                                </div>
                                <div className="py-1 flex flex-col items-center justify-center text-center">
                                  <div className="w-5.5 h-5.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-0.5">
                                    <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                                  </div>
                                  <p className="text-[8.5px] font-black text-[#101B3A]">All caught up!</p>
                                  <p className="text-[6.5px] text-[#64748B]">0 pending tickets across units</p>
                                </div>
                              </div>

                              {/* Activity Feed */}
                              <div className="lg:col-span-4 p-2 rounded-xl border border-[#E8ECF3] bg-white shadow-xs">
                                <div className="flex items-center gap-1 mb-1">
                                  <div className="w-4 h-4 rounded bg-[#101B3A] text-white flex items-center justify-center">
                                    <Activity className="w-2.5 h-2.5" />
                                  </div>
                                  <h5 className="text-[9px] font-black text-[#101B3A]">Activity Feed</h5>
                                </div>
                                <div className="space-y-1">
                                  {[
                                    { text: "Rent Paid: ₹50,000 Unit 201", tag: "PAID", tagBg: "bg-emerald-50 text-emerald-700", time: "10m" },
                                    { text: "Lease Renewed: Arshad Khan", tag: "RENEW", tagBg: "bg-purple-50 text-purple-700", time: "1h" },
                                    { text: "Unit U-1 inspection complete", tag: "AUDIT", tagBg: "bg-blue-50 text-blue-700", time: "3h" },
                                  ].map((act, idx) => (
                                    <div key={idx} className="flex items-start justify-between gap-1 text-[7px]">
                                      <div className="flex items-center gap-1 min-w-0">
                                        <span className={`px-1 py-0.2 rounded ${act.tagBg} font-extrabold uppercase shrink-0`}>
                                          {act.tag}
                                        </span>
                                        <span className="font-semibold text-[#101B3A] truncate">
                                          {act.text}
                                        </span>
                                      </div>
                                      <span className="text-[#94A3B8] shrink-0 font-medium">{act.time}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* TAB 2: RENT LEDGER PREVIEW */}
                        {heroMockupTab === "rent" && (
                          <div className="p-2.5 bg-white rounded-xl border border-[#E8ECF3] shadow-xs space-y-2">
                            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8ECF3]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Receipt className="w-3 h-3" />
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-black text-[#101B3A]">Monthly Rent Ledger</h4>
                                  <p className="text-[7px] text-[#64748B]">Automated UPI, NEFT & Cheque tracking</p>
                                </div>
                              </div>
                              <span className="text-[7.5px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ₹50,000 Collected (100%)
                              </span>
                            </div>

                            <table className="w-full text-left text-[8px]">
                              <thead>
                                <tr className="border-b border-[#E8ECF3] text-[7px] font-extrabold text-[#64748B] uppercase">
                                  <th className="pb-1">Tenant & Unit</th>
                                  <th className="pb-1">Due Date</th>
                                  <th className="pb-1">Amount</th>
                                  <th className="pb-1">Method</th>
                                  <th className="pb-1 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1F5F9] font-medium">
                                {[
                                  { name: "Arshad Khan", unit: "Ayub Khan Manzil - U1", date: "05th", amount: "₹28,000", method: "UPI (Google Pay)", status: "Paid", statusBg: "bg-emerald-50 text-emerald-700" },
                                  { name: "Rahul Sharma", unit: "Pentacloud Heights - 302", date: "01st", amount: "₹22,000", method: "NEFT / RTGS Transfer", status: "Paid", statusBg: "bg-emerald-50 text-emerald-700" },
                                  { name: "Sneha Varma", unit: "Pentacloud Heights - 104", date: "10th", amount: "₹18,000", method: "Cheque Deposit", status: "Upcoming", statusBg: "bg-blue-50 text-blue-700" },
                                ].map((row, idx) => (
                                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                                    <td className="py-1.5 font-bold text-[#101B3A]">
                                      {row.name} <span className="text-[6.5px] text-[#64748B] block font-normal">{row.unit}</span>
                                    </td>
                                    <td className="py-1.5 text-[#64748B]">{row.date}</td>
                                    <td className="py-1.5 font-black text-[#101B3A]">{row.amount}</td>
                                    <td className="py-1.5 text-[#475569]">{row.method}</td>
                                    <td className="py-1.5 text-right">
                                      <span className={`px-1.5 py-0.2 rounded font-extrabold text-[7px] ${row.statusBg}`}>
                                        {row.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* TAB 3: UNIT INVENTORY PREVIEW */}
                        {heroMockupTab === "units" && (
                          <div className="p-2.5 bg-white rounded-xl border border-[#E8ECF3] shadow-xs space-y-2">
                            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8ECF3]">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                  <DoorOpen className="w-3 h-3" />
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-black text-[#101B3A]">Unit Inventory & Specifications</h4>
                                  <p className="text-[7px] text-[#64748B]">Auto-derived BHK bedrooms & benchmarks</p>
                                </div>
                              </div>
                              <span className="text-[7.5px] font-extrabold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                4 Total Units
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { unit: "Flat 101", bldg: "Ayub Khan Manzil", bhk: "1BHK (1 Bed)", rent: "₹18,000/mo", status: "Occupied", bg: "bg-emerald-50 text-emerald-700" },
                                { unit: "Flat 201", bldg: "Ayub Khan Manzil", bhk: "2BHK (2 Bed)", rent: "₹28,000/mo", status: "Occupied", bg: "bg-emerald-50 text-emerald-700" },
                                { unit: "Unit 301", bldg: "Pentacloud Heights", bhk: "3BHK (3 Bed)", rent: "₹38,000/mo", status: "Vacant", bg: "bg-slate-100 text-slate-700" },
                                { unit: "Studio S-1", bldg: "Pentacloud Heights", bhk: "Studio (1 Bed)", rent: "₹12,000/mo", status: "Vacant", bg: "bg-slate-100 text-slate-700" },
                              ].map((u, idx) => (
                                <div key={idx} className="p-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-[#101B3A]">{u.unit}</span>
                                    <span className={`text-[6.5px] font-extrabold px-1 py-0.2 rounded ${u.bg}`}>{u.status}</span>
                                  </div>
                                  <p className="text-[7px] text-[#64748B]">{u.bldg}</p>
                                  <div className="flex items-center justify-between pt-0.5 border-t border-[#E8ECF3] text-[7px]">
                                    <span className="font-bold text-[#625BFF]">{u.bhk}</span>
                                    <span className="font-black text-[#101B3A]">{u.rent}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 2 — PREMIUM FEATURE CARDS
         ========================================================================= */}
      <section id="features" className="py-28 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#F0EEFF]/50 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#F0EEFF]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <Zap className="w-3.5 h-3.5" />
              Comprehensive Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              Everything You Need to Manage
              <br />
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">
                Your Properties.
              </span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed max-w-2xl mx-auto">
              From property ownership to tenant exit, keep every important property operation connected in one platform.
            </p>
          </div>

          {/* 8 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: PieChartIcon, title: "Dashboard & Analytics", desc: "Monitor properties, units, and active tenants in real time. Track monthly rental income, occupancy rate, pending rent, revenue trends, and activity summaries.", features: ["Live occupancy benchmarks", "Revenue vs target tracking"], gradient: "from-blue-500 to-indigo-600" },
              { icon: Briefcase, title: "Account Management", desc: "Manage individual and company ownership accounts with PAN, GSTIN, and registration numbers. Includes 3-in-1 unified creation.", features: ["Individual & corporate entities", "3-in-1 portfolio onboarding wizard"], gradient: "from-violet-500 to-purple-600" },
              { icon: Users, title: "Contact Management", desc: "Maintain records for property owners, tenants, vendors, brokers, and emergency contacts. Easily link contacts to parent accounts.", features: ["Classified contact roles", "Direct account linkage"], gradient: "from-emerald-500 to-teal-600" },
              { icon: Building2, title: "Property Management", desc: "Full lifecycle support for apartments, villas, independent houses, commercial buildings, PGs, and plots with specs & amenities.", features: ["Photo gallery & cover selector", "Geolocation & document repository"], gradient: "from-orange-500 to-amber-600" },
              { icon: DoorOpen, title: "Unit Inventory", desc: "Manage individual flats, BHK units (1BHK to 4BHK), studios, shops, and offices. Auto-derives bedrooms, tracks rent benchmarks.", features: ["Auto-derived BHK specifications", "Vacant & occupied state engine"], gradient: "from-pink-500 to-rose-600" },
              { icon: UserCheck, title: "Tenant & Lease Management", desc: "Streamlined tenant onboarding, ID proofs, and agreement uploads. Extend leases cleanly without duplicating tenant history.", features: ["Zero-duplication lease renewal", "Deposit refund reconciliation"], gradient: "from-cyan-500 to-blue-600" },
              { icon: IndianRupee, title: "Rent Collection", desc: "Complete monthly ledger tracking paid, partial, pending, and overdue rents. Log UPI, NEFT/RTGS, cheques, and cash.", features: ["Multi-mode payment ledger", "Instant receipt & proof upload"], gradient: "from-green-500 to-emerald-600" },
              { icon: Wrench, title: "Maintenance Management", desc: "Ticket dispatch for plumbing, electrical, carpentry, and repairs. Track status from Open to Resolved with cost split.", features: ["Priority & category dispatch", "Owner vs tenant cost split"], gradient: "from-red-500 to-rose-600" },
            ].map(({ icon: Icon, title, desc, features, gradient }, idx) => (
              <div
                key={idx}
                className="premium-card p-6 rounded-2xl bg-white border border-[#E8ECF3] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[15px] font-extrabold text-[#101B3A] mb-2 group-hover:text-[#625BFF] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>
                <ul className="text-[11px] font-bold text-[#101B3A] space-y-1.5 pt-3 border-t border-[#E8ECF3]">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-[#625BFF] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INTERACTIVE PRODUCT SHOWCASE
         ========================================================================= */}
      <section id="showcase" className="py-28 bg-gradient-to-b from-[#F3F5F9] via-[#F0F1FA] to-[#F3F5F9] relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-gradient-to-br from-[#6155F5]/8 to-transparent rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-gradient-to-tl from-[#8B5CF6]/8 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <Globe className="w-3.5 h-3.5" />
              Interactive Product Walkthrough
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              One Platform.{" "}
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">
                Your Entire Property Operation.
              </span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">
              Explore how each interconnected module simplifies day-to-day real estate workflows.
            </p>
          </div>

          {/* Functional Tabs Navigation */}
          <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
            <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-[#E8ECF3] shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex items-center gap-1">
              {(
                [
                  { id: "dashboard", label: "Dashboard", icon: PieChartIcon },
                  { id: "properties", label: "Properties & Units", icon: Building2 },
                  { id: "tenants", label: "Tenants & Leases", icon: UserCheck },
                  { id: "rent", label: "Rent Collection", icon: IndianRupee },
                  { id: "maintenance", label: "Maintenance", icon: Wrench },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-extrabold transition-all duration-300 shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-[0_4px_16px_rgba(98,91,255,0.3)]"
                        : "text-[#64748B] hover:text-[#101B3A] hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Showcase Card */}
          <div className="bg-white rounded-3xl border border-[#E8ECF3] shadow-[0_25px_60px_rgba(16,27,58,0.06)] overflow-hidden">
            {activeTab === "dashboard" && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8ECF3] pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#101B3A]">
                      Executive Command Center
                    </h3>
                    <p className="text-[14px] text-[#64748B] font-medium mt-1">
                      Consolidated KPI cards, revenue analytics, occupancy metrics, and operations overview.
                    </p>
                  </div>
                  <Button
                    onClick={() => setLoginOpen(true)}
                    className="h-10 px-4 bg-gradient-to-r from-[#625BFF] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white text-[12px] font-extrabold rounded-xl shrink-0 shadow-[0_4px_12px_rgba(98,91,255,0.2)]"
                  >
                    Open Live Dashboard <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Portfolio Value", value: "₹18.40 Cr", sub: "+15.3% YOY appreciation", subColor: "text-emerald-600", border: "border-l-4 border-l-[#625BFF]" },
                    { label: "Monthly Revenue Target", value: "₹5,75,000", sub: "₹5,20,000 Collected (90.4%)", subColor: "text-[#64748B]", border: "border-l-4 border-l-emerald-500" },
                    { label: "Units & Occupancy", value: "44 Units", sub: "38 Occupied • 86.4% Rate", subColor: "text-emerald-600", border: "border-l-4 border-l-amber-500" },
                  ].map(({ label, value, sub, subColor, border }) => (
                    <div key={label} className={`p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#F3F5F9] border border-[#E8ECF3] space-y-2 ${border}`}>
                      <span className="text-[11px] font-extrabold text-[#64748B] uppercase">{label}</span>
                      <p className="text-2xl font-black text-[#101B3A]">{value}</p>
                      <p className={`text-[12px] font-bold ${subColor}`}>{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Illustrated Activity Feed */}
                <div className="p-5 rounded-2xl border border-[#E8ECF3] bg-white space-y-3">
                  <span className="text-[13px] font-extrabold text-[#101B3A]">Recent Operations Stream</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F3F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        ₹
                      </div>
                      <div>
                        <p className="font-extrabold text-[#101B3A]">Rent Paid — Unit 201 (₹35,000)</p>
                        <p className="text-[#64748B] text-[11px]">UPI Ref: UPI-9847128 • 10 mins ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F3F5F9]">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] text-[#625BFF] flex items-center justify-center font-bold">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-[#101B3A]">Lease Renewed — Arshad Khan</p>
                        <p className="text-[#64748B] text-[11px]">Ayub Khan Manzil • 1 Year Extension</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "properties" && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8ECF3] pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#101B3A]">
                      Property Portfolio & Unit Inventory
                    </h3>
                    <p className="text-[14px] text-[#64748B] font-medium mt-1">
                      Manage buildings, floors, BHK specs, rent benchmarks, and visual media galleries.
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] text-[#625BFF] text-[12px] font-extrabold border border-[#625BFF]/10">
                    Derived BHK Bedrooms Supported
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "Ayub Khan Manzil", loc: "RT Nagar, Bangalore • Apartment", units: "12 Flats", occ: "100%", monthly: "₹2.40L", status: "Active", statusBg: "bg-emerald-50 text-emerald-700" },
                    { name: "Pentacloud Heights", loc: "Koramangala, Bangalore • Mixed Use", units: "18 Units", occ: "88.8%", monthly: "₹4.10L", status: "Active", statusBg: "bg-blue-50 text-blue-700" },
                  ].map(({ name, loc, units, occ, monthly, status, statusBg }) => (
                    <div key={name} className="p-5 rounded-2xl border border-[#E8ECF3] bg-gradient-to-br from-white to-[#FAFBFF] space-y-4 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#625BFF] to-[#5145E5] text-white flex items-center justify-center font-bold shadow-lg">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[15px] font-extrabold text-[#101B3A]">{name}</p>
                            <p className="text-[12px] text-[#64748B]">{loc}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md ${statusBg} text-[10px] font-extrabold uppercase`}>
                          {status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[12px] font-bold">
                        <div className="p-2 rounded-lg bg-white border border-[#E8ECF3]">
                          <p className="text-[10px] text-[#64748B]">Units</p>
                          <p className="text-[14px] text-[#101B3A]">{units}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#E8ECF3]">
                          <p className="text-[10px] text-[#64748B]">Occupancy</p>
                          <p className="text-[14px] text-emerald-600">{occ}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-[#E8ECF3]">
                          <p className="text-[10px] text-[#64748B]">Monthly</p>
                          <p className="text-[14px] text-[#625BFF]">{monthly}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "tenants" && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8ECF3] pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#101B3A]">
                      Tenant Onboarding, Leases & Renewals
                    </h3>
                    <p className="text-[14px] text-[#64748B] font-medium mt-1">
                      Extend existing agreements with 0 duplicates, run check-out inspections, and refund deposits.
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[12px] font-extrabold border border-emerald-200/50">
                    Zero-Duplicate Architecture
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-[#E8ECF3] bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 font-black flex items-center justify-center text-sm shadow-[0_4px_12px_rgba(16,185,129,0.15)]">
                        AK
                      </div>
                      <div>
                        <h4 className="text-[15px] font-extrabold text-[#101B3A]">Arshad Khan</h4>
                        <p className="text-[12px] text-[#64748B]">
                          Assigned to Unit: <span className="font-bold text-[#101B3A]">Ayub Khan Manzil - U1 (2BHK)</span>
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-extrabold">
                      Active Lease
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-[#F3F5F9] text-[12px]">
                    <div>
                      <p className="text-[#64748B] font-bold text-[10px] uppercase">Monthly Rent</p>
                      <p className="font-black text-[#101B3A] text-[14px]">₹28,000</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-bold text-[10px] uppercase">Security Deposit</p>
                      <p className="font-black text-[#101B3A] text-[14px]">₹1,50,000</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-bold text-[10px] uppercase">Lease End Date</p>
                      <p className="font-bold text-[#101B3A] text-[13px]">31 Dec 2026</p>
                    </div>
                    <div>
                      <p className="text-[#64748B] font-bold text-[10px] uppercase">Agreement</p>
                      <p className="font-bold text-[#625BFF] flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5" /> Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rent" && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8ECF3] pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#101B3A]">
                      Rent Ledger & Invoicing Status
                    </h3>
                    <p className="text-[14px] text-[#64748B] font-medium mt-1">
                      Real-time visibility into collected, partial, pending, and overdue rental obligations.
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-[12px] font-extrabold border border-amber-200/50">
                    Payment Reconciliation Engine
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#E8ECF3] text-[11px] font-extrabold text-[#64748B] uppercase">
                        <th className="pb-3">Tenant & Unit</th>
                        <th className="pb-3">Due Date</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Method</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECF3] font-medium">
                      {[
                        { name: "Arshad Khan", unit: "Ayub Khan Manzil - U1", due: "05th of Month", amount: "₹28,000", method: "UPI (GPay)", status: "Paid", statusBg: "bg-emerald-50 text-emerald-700" },
                        { name: "Rahul Sharma", unit: "Pentacloud Heights - 302", due: "01st of Month", amount: "₹35,000", method: "NEFT Transfer", status: "Paid", statusBg: "bg-emerald-50 text-emerald-700" },
                        { name: "Sneha Varma", unit: "Pentacloud Heights - 104", due: "10th of Month", amount: "₹22,000", method: "—", status: "Pending", statusBg: "bg-amber-50 text-amber-700" },
                      ].map(({ name, unit, due, amount, method, status, statusBg }) => (
                        <tr key={name}>
                          <td className="py-3 font-extrabold text-[#101B3A]">
                            {name} <span className="text-[11px] text-[#64748B] block">{unit}</span>
                          </td>
                          <td className="py-3 text-[#64748B]">{due}</td>
                          <td className="py-3 font-extrabold text-[#101B3A]">{amount}</td>
                          <td className="py-3 text-slate-600">{method}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2.5 py-1 rounded-md ${statusBg} text-[11px] font-extrabold`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "maintenance" && (
              <div className="p-6 sm:p-10 space-y-6 animate-in fade-in-50 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8ECF3] pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#101B3A]">
                      Maintenance Dispatch & Cost Attribution
                    </h3>
                    <p className="text-[14px] text-[#64748B] font-medium mt-1">
                      Track repair status, vendor work orders, and allocate costs (owner-paid, tenant-paid, or shared).
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[12px] font-extrabold border border-blue-200/50">
                    Split Responsibility Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { priority: "High Priority", priBg: "bg-rose-100 text-rose-800", status: "In Progress", title: "Main Water Line Pressure Valve Replacement", loc: "Ayub Khan Manzil • Plumbing", cost: "Cost: ₹4,500", paidBy: "Owner Paid", paidBg: "text-[#625BFF] bg-[#EEF0FF]" },
                    { priority: "Resolved", priBg: "bg-emerald-100 text-emerald-800", status: "Completed Yesterday", title: "AC Master Filter Deep Cleaning & Refill", loc: "Pentacloud Heights - Unit 302", cost: "Cost: ₹1,800", paidBy: "Tenant Paid", paidBg: "text-amber-700 bg-amber-50" },
                  ].map(({ priority, priBg, status, title, loc, cost, paidBy, paidBg }) => (
                    <div key={title} className="p-4 rounded-2xl border border-[#E8ECF3] bg-gradient-to-br from-white to-[#F8FAFC] space-y-2 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${priBg}`}>
                          {priority}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{status}</span>
                      </div>
                      <h4 className="text-[14px] font-extrabold text-[#101B3A]">{title}</h4>
                      <p className="text-[12px] text-[#64748B]">{loc}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600">{cost}</span>
                        <span className={`${paidBg} px-2 py-0.5 rounded`}>{paidBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — COMPLETE TENANT LIFECYCLE
         ========================================================================= */}
      <section className="py-28 bg-white border-b border-[#E8ECF3] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#F0EEFF]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <RefreshCw className="w-3.5 h-3.5" />
              End-to-End Tenancy Automation
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              From Move-In to Move-Out.{" "}
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">
                Everything Connected.
              </span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">
              Experience seamless tenancy lifecycles without data duplication, messy spreadsheets, or settlement disputes.
            </p>
          </div>

          {/* 6 Stages Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative mb-14">
            {[
              { step: "01", title: "Unit Selection", desc: "Select an available unit with prepopulated rent & security deposit benchmarks.", status: "complete" },
              { step: "02", title: "Tenant Onboarding", desc: "Record tenant profile, ID documents, lease terms, and security deposit details.", status: "complete" },
              { step: "03", title: "Active Tenancy", desc: "Track monthly rent dues, automated receipts, maintenance requests, and documents.", status: "active" },
              { step: "04", title: "Lease Renewal", desc: "Extend lease period and adjust rent while completely preserving the tenant record.", status: "upcoming" },
              { step: "05", title: "Tenant Exit", desc: "Conduct physical move-out inspection, itemize damage repairs, and record utility dues.", status: "upcoming" },
              { step: "06", title: "Final Settlement", desc: "Reconcile deductions, refund remaining deposit, and automatically reset unit to Vacant.", status: "upcoming" },
            ].map((stage, idx) => {
              const isComplete = stage.status === "complete";
              const isActive = stage.status === "active";
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 ${
                    isActive
                      ? "bg-gradient-to-br from-[#EEF0FF] to-[#E8E4FF] border-[#625BFF] shadow-[0_8px_24px_rgba(98,91,255,0.12)]"
                      : isComplete
                      ? "bg-gradient-to-br from-emerald-50/50 to-emerald-50/30 border-emerald-200"
                      : "bg-gradient-to-br from-[#F8FAFC] to-[#F3F5F9] border-[#E8ECF3]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[12px] font-black px-2.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white shadow-sm"
                            : isComplete
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {stage.step}
                      </span>
                      {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#625BFF] animate-pulse shadow-[0_0_8px_rgba(98,91,255,0.4)]" />}
                    </div>
                    <h3 className="text-[14px] font-extrabold text-[#101B3A] mb-1.5">{stage.title}</h3>
                    <p className="text-[11.5px] text-[#64748B] leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — FINANCIAL VISIBILITY & RENT COLLECTION
         ========================================================================= */}
      <section className="py-28 bg-gradient-to-b from-[#F3F5F9] to-[#EEEAFF]/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6155F5]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <BarChart3 className="w-3.5 h-3.5" />
              Financial Intelligence
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              Know What Is Collected, What Is Due,{" "}
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">
                and What Needs Attention.
              </span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">
              Keep rental billing, payment records, receipts, and outstanding balances organized so you can make informed decisions.
            </p>
          </div>

          {/* 4 Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: "Monthly Rental Income", value: "₹5,75,000", sub: "Total contracted obligations", border: "border-[#E8ECF3]", labelColor: "text-[#64748B]", valueColor: "text-[#101B3A]" },
              { label: "Collected Rent", value: "₹4,85,000", sub: "84.3% collected this cycle", border: "border-emerald-200", labelColor: "text-emerald-600", valueColor: "text-emerald-600" },
              { label: "Pending Rent", value: "₹65,000", sub: "3 tenants in grace period", border: "border-amber-200", labelColor: "text-amber-600", valueColor: "text-amber-600" },
              { label: "Overdue Rent", value: "₹25,000", sub: "1 tenant past due notice", border: "border-rose-200", labelColor: "text-rose-600", valueColor: "text-rose-600" },
            ].map(({ label, value, sub, border, labelColor, valueColor }) => (
              <div key={label} className={`p-6 rounded-2xl bg-white ${border} border shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-300`}>
                <span className={`text-[11px] font-extrabold ${labelColor} uppercase tracking-wider`}>
                  {label}
                </span>
                <p className={`text-3xl font-black ${valueColor} mt-2`}>{value}</p>
                <div className="mt-2 text-[12px] font-bold text-slate-500">{sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart & Breakdown Card */}
          <div className="bg-white rounded-3xl border border-[#E8ECF3] shadow-[0_25px_60px_rgba(16,27,58,0.06)] p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-[#101B3A]">
                  6-Month Portfolio Revenue Trend (INR)
                </h3>
                <p className="text-[13px] text-[#64748B] font-medium mt-0.5">
                  Consistent collection curve formatted according to Indian financial standards.
                </p>
              </div>
              <div className="flex items-center gap-4 text-[12px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-[#625BFF]" /> Collected
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-slate-200" /> Target
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748B", fontWeight: 700 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [`₹${Number(value || 0).toLocaleString()}`, "Amount"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E8ECF3", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="target" fill="#E8ECF3" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="collected" fill="#625BFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — PROPERTY OWNERSHIP & PORTFOLIO MANAGEMENT
         ========================================================================= */}
      <section className="py-28 bg-white border-b border-[#E8ECF3] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#F0EEFF]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <Shield className="w-3.5 h-3.5" />
              Relational Architecture
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              Every Property, Unit, and Tenant{" "}
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">Connected.</span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">
              Understand the natural hierarchy that links ownership entities to day-to-day operations.
            </p>
          </div>

          {/* Visual Relationship Diagram */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#F8FAFC] to-[#F3F5F9] border border-[#E8ECF3] shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-12">
            <h3 className="text-center text-[13px] font-extrabold uppercase tracking-wider text-[#64748B] mb-8">
              Entity Hierarchy & Data Flow
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-center">
              {[
                { icon: Briefcase, title: "Account", sub: "Individual / Company", highlight: false },
                { icon: User, title: "Primary Contact", sub: "Owner / Manager", highlight: false },
                { icon: Building2, title: "Property", sub: "Apartment / Villa", highlight: false },
                { icon: DoorOpen, title: "Units", sub: "1BHK, 2BHK, 3BHK", highlight: false },
                { icon: UserCheck, title: "Tenant", sub: "Active Lease Holder", highlight: false },
                { icon: IndianRupee, title: "Operations", sub: "Rent & Maintenance", highlight: true },
              ].map(({ icon: Icon, title, sub, highlight }, idx) => (
                <div key={idx} className="contents">
                  <div className={`w-full lg:w-44 p-4 rounded-2xl border shadow-xs space-y-1 transition-all duration-300 hover:-translate-y-1 ${
                    highlight ? "bg-white border-[#625BFF] shadow-[0_8px_24px_rgba(98,91,255,0.1)]" : "bg-white border-[#E8ECF3]"
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 font-bold ${
                      highlight ? "bg-gradient-to-br from-[#625BFF] to-[#5145E5] text-white shadow-lg" : "bg-[#EEF0FF] text-[#625BFF]"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[13px] font-black text-[#101B3A]">{title}</p>
                    <p className={`text-[11px] ${highlight ? "text-[#625BFF] font-bold" : "text-[#64748B]"}`}>{sub}</p>
                  </div>
                  {idx < 5 && (
                    <div className="text-[#625BFF] font-black rotate-90 lg:rotate-0 text-lg">→</div>
                  )}
                </div>
              ))}
            </div>

            {/* 3-in-1 Wizard Highlight Banner */}
            <div className="mt-8 p-5 rounded-2xl bg-white border border-[#625BFF]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_16px_rgba(98,91,255,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#625BFF] to-[#5145E5] text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-extrabold text-[#101B3A]">
                    3-in-1 Accelerated Portfolio Setup
                  </h4>
                  <p className="text-[12px] text-[#64748B]">
                    Create an Account, Primary Contact, and First Property in a single unified submission.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setLoginOpen(true)}
                className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#625BFF] to-[#5145E5] hover:from-[#5145E5] hover:to-[#4338CA] text-white text-[12px] font-extrabold shrink-0 shadow-[0_4px_12px_rgba(98,91,255,0.2)]"
              >
                Try Setup Wizard
              </Button>
            </div>
          </div>

          {/* 4 Compact Portfolio Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { type: "01", title: "Individual Landlords", desc: "Single or multiple flats and homes managed with minimal overhead and crystal-clear records." },
              { type: "02", title: "Multi-Property Owners", desc: "Apartment blocks and commercial premises grouped under distinct company or family accounts." },
              { type: "03", title: "Commercial Owners", desc: "Shops, corporate offices, and warehouses with GST tracking, customized leases, and deposits." },
              { type: "04", title: "Property Management Businesses", desc: "Full third-party agencies handling multi-client portfolios, maintenance dispatch, and ledgers." },
            ].map(({ type, title, desc }) => (
              <div key={type} className="p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#F3F5F9] border border-[#E8ECF3] space-y-2 hover:-translate-y-1 transition-transform duration-300 group">
                <span className="text-[11px] font-black uppercase bg-gradient-to-r from-[#625BFF] to-[#8B5CF6] bg-clip-text text-transparent">
                  Portfolio Type {type}
                </span>
                <h4 className="text-[15px] font-extrabold text-[#101B3A] group-hover:text-[#625BFF] transition-colors">{title}</h4>
                <p className="text-[12px] text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — HOW IT WORKS + FAQ
         ========================================================================= */}
      <section id="how-it-works" className="py-28 bg-gradient-to-b from-[#F3F5F9] to-[#F0F1FA] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#6155F5]/15 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* How It Works Subsection */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
              <Zap className="w-3.5 h-3.5" />
              Fast-Track Onboarding
            </span>
            <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight leading-[1.1]">
              Start Managing Your Properties in{" "}
              <span className="bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] bg-clip-text text-transparent">
                Four Simple Steps.
              </span>
            </h2>
            <p className="text-[16px] text-[#64748B] font-medium leading-relaxed">
              Get up and running in minutes with structured configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
            {[
              { step: "01", title: "Create Your Account", desc: "Set up an individual owner profile or registered company account with PAN and GST details." },
              { step: "02", title: "Add Properties & Units", desc: "Configure your buildings, specify units (1BHK to 4BHK), and establish rental benchmarks." },
              { step: "03", title: "Onboard Tenants", desc: "Record tenant contact info, upload ID proofs, and specify lease dates and deposit terms." },
              { step: "04", title: "Run Day-to-Day Operations", desc: "Collect monthly rents, extend leases with 0 duplicates, log maintenance, and settle exits." },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#E8ECF3] shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#625BFF] to-[#5145E5] text-white flex items-center justify-center font-black text-lg mb-5 shadow-[0_6px_16px_rgba(98,91,255,0.3)] group-hover:shadow-[0_8px_24px_rgba(98,91,255,0.4)] transition-shadow">
                    {step.step}
                  </div>
                  <h3 className="text-[16px] font-extrabold text-[#101B3A] mb-2 group-hover:text-[#625BFF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Subsection */}
          <div id="faq" className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-14">
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#625BFF] bg-gradient-to-r from-[#EEF0FF] to-[#E8E4FF] px-4 py-2 rounded-full uppercase tracking-wider border border-[#625BFF]/10">
                <HelpCircle className="w-3.5 h-3.5" />
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-[42px] font-black text-[#101B3A] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-[15px] text-[#64748B] font-medium">
                Concise and accurate answers regarding HomeOwner365 capabilities.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border bg-white overflow-hidden transition-all duration-300 ${
                      isOpen ? "border-[#625BFF]/20 shadow-[0_8px_24px_rgba(98,91,255,0.06)]" : "border-[#E8ECF3] shadow-xs"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none group"
                    >
                      <span className={`text-[15px] font-extrabold transition-colors ${isOpen ? "text-[#625BFF]" : "text-[#101B3A]"}`}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#625BFF] transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-5 pb-5 text-[14px] text-[#64748B] leading-relaxed border-t border-slate-50 pt-3">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — PREMIUM CTA + FOOTER
         ========================================================================= */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F3F5F9] via-[#EEEAFF] to-[#F0EEFF] animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#0C1427] via-[#111B3A] to-[#0F1830] p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(12,20,39,0.4)]">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#625BFF]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.04] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.02] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-7">
              <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Get Started Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
                Bring Every Property{" "}
                <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#6155F5] bg-clip-text text-transparent">
                  Into Focus.
                </span>
              </h2>
              <p className="text-[16px] text-white/60 font-medium leading-relaxed">
                Organize your property portfolio, simplify rental operations, and manage every tenant lifecycle in one connected workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button
                  onClick={() => setLoginOpen(true)}
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-[#6155F5] to-[#8B5CF6] hover:from-[#5145E5] hover:to-[#7C3AED] text-white font-extrabold text-[15px] shadow-[0_10px_30px_rgba(97,85,245,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 btn-premium"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
                <a
                  href="#features"
                  className="w-full sm:w-auto h-13 px-7 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-extrabold text-[15px] transition-all flex items-center justify-center btn-premium"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C1427] text-white py-16 relative overflow-hidden">
        {/* Subtle gradient decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#6155F5]/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="inline-block group">
                <Image
                  src="/logo-horizontal-light.png"
                  alt="HomeOwner365"
                  width={210}
                  height={34}
                  className="h-[32px] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
              <p className="text-[13px] text-white/50 max-w-sm leading-relaxed font-medium">
                Every Property. Every Tenant. Every Day. Complete property intelligence platform for landlords, property owners, and property managers.
              </p>
              <div className="text-[12px] font-bold text-white/40 pt-1">
                Supported Credentials: <span className="text-[#A78BFA]">Pentacloud</span> / <span className="text-[#A78BFA]">Pentacloud@2026</span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="space-y-3">
              <p className="text-[12px] font-extrabold text-white/70 uppercase tracking-wider">
                Platform
              </p>
              <ul className="space-y-2.5 text-[13px] font-bold text-white/40">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/properties", label: "Properties" },
                  { href: "/units", label: "Units Inventory" },
                  { href: "/tenants", label: "Tenants & Leases" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-[#A78BFA] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Operations Links */}
            <div className="space-y-3">
              <p className="text-[12px] font-extrabold text-white/70 uppercase tracking-wider">
                Operations
              </p>
              <ul className="space-y-2.5 text-[13px] font-bold text-white/40">
                {[
                  { href: "/rent-collection", label: "Rent Collection" },
                  { href: "/maintenance", label: "Maintenance" },
                  { href: "/accounts", label: "Accounts" },
                  { href: "/contacts", label: "Contacts" },
                ].map(({ href, label }) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-[#A78BFA] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Quick Access */}
            <div className="space-y-3">
              <p className="text-[12px] font-extrabold text-white/70 uppercase tracking-wider">
                Access
              </p>
              <ul className="space-y-2.5 text-[13px] font-bold text-white/40">
                <li>
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="hover:text-[#A78BFA] transition-colors text-left font-bold"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#A78BFA] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#A78BFA] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[12px] text-white/30 font-medium gap-4">
            <p>© 2026 HomeOwner365. All rights reserved.</p>
            <p className="text-[11px] text-white/20">
              Engineered with precision for modern real estate operations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
