"use client";

import { Building2, Users, IndianRupee, DoorOpen, Wrench, ChevronDown, CheckCircle2, Activity, Home, PieChart as PieChartIcon, CreditCard, Layers, TrendingUp, TrendingDown, ArrowUpRight, Sparkles, MapPin, Calendar, BarChart3 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatDistanceToNow, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Link from "next/link";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  // --- Data Layer ---
  const stats = data?.stats || {
    totalAccounts: 0, totalProperties: 0, totalUnits: 0,
    activeTenants: 0, pendingRentTotal: 0, pendingRentCount: 0, openMaintenance: 0,
  };

  const occupancyRate = stats.totalUnits ? Math.round((stats.activeTenants / stats.totalUnits) * 100) : 0;
  const vacantUnits = Math.max(stats.totalUnits - stats.activeTenants, 0);
  const estimatedMonthlyRent = stats.activeTenants * 25000;
  const portfolioValue = stats.totalProperties * 15000000;
  const collectedRent = estimatedMonthlyRent - stats.pendingRentTotal;
  const collectionRate = estimatedMonthlyRent > 0 ? Math.round((collectedRent / estimatedMonthlyRent) * 100) : 0;

  const kpis = [
    { title: "Properties", value: stats.totalProperties.toString(), trend: "+12.5%", isUp: true, icon: Building2, gradient: "from-blue-500 to-indigo-600", lightBg: "bg-blue-50", lightText: "text-blue-600", ring: "ring-blue-500/20", sparkline: [10, 15, 12, 20, 18, 25, 22], stroke: "#3B82F6" },
    { title: "Total Units", value: stats.totalUnits.toString(), trend: "+8.2%", isUp: true, icon: Home, gradient: "from-violet-500 to-purple-600", lightBg: "bg-violet-50", lightText: "text-violet-600", ring: "ring-violet-500/20", sparkline: [10, 12, 14, 13, 16, 18, 20], stroke: "#8B5CF6" },
    { title: "Active Tenants", value: stats.activeTenants.toString(), trend: "+2.4%", isUp: true, icon: Users, gradient: "from-emerald-500 to-teal-600", lightBg: "bg-emerald-50", lightText: "text-emerald-600", ring: "ring-emerald-500/20", sparkline: [5, 5, 6, 7, 7, 8, 8], stroke: "#10B981" },
    { title: "Monthly Rent", value: formatINR(estimatedMonthlyRent), trend: "+15.3%", isUp: true, icon: IndianRupee, gradient: "from-amber-500 to-orange-600", lightBg: "bg-amber-50", lightText: "text-amber-600", ring: "ring-amber-500/20", sparkline: [40, 45, 42, 50, 48, 55, 60], stroke: "#F59E0B" },
    { title: "Occupancy", value: `${occupancyRate}%`, trend: "+4.1%", isUp: true, icon: PieChartIcon, gradient: "from-cyan-500 to-blue-600", lightBg: "bg-cyan-50", lightText: "text-cyan-600", ring: "ring-cyan-500/20", sparkline: [45, 46, 48, 47, 49, 50, 50], stroke: "#06B6D4" },
    { title: "Open Tickets", value: stats.openMaintenance.toString(), trend: "0%", isUp: false, icon: Wrench, gradient: "from-rose-500 to-red-600", lightBg: "bg-rose-50", lightText: "text-rose-600", ring: "ring-rose-500/20", sparkline: [5, 4, 3, 2, 1, 0, 0], stroke: "#F43F5E" },
    { title: "Pending Rent", value: formatINR(stats.pendingRentTotal), trend: "-8.2%", isUp: false, icon: CreditCard, gradient: "from-orange-500 to-red-500", lightBg: "bg-orange-50", lightText: "text-orange-600", ring: "ring-orange-500/20", sparkline: [60, 62, 65, 63, 68, 69, 70], stroke: "#F97316" },
  ];

  const revenueData = [
    { month: 'Jan', collected: 180000, pending: 20000, target: 220000 },
    { month: 'Feb', collected: 165000, pending: 35000, target: 220000 },
    { month: 'Mar', collected: 195000, pending: 15000, target: 225000 },
    { month: 'Apr', collected: 175000, pending: 25000, target: 225000 },
    { month: 'May', collected: 200000, pending: 18000, target: 230000 },
    { month: 'Jun', collected: collectedRent || 210000, pending: stats.pendingRentTotal || 12000, target: estimatedMonthlyRent || 235000 },
  ];

  const pieData = [
    { name: 'Occupied', value: stats.activeTenants || 0, color: '#6366F1' },
    { name: 'Vacant', value: vacantUnits || 0, color: '#E2E8F0' },
    { name: 'Maintenance', value: stats.openMaintenance || 0, color: '#F59E0B' },
  ];

  const propertiesList = data?.properties || [];
  const propertyPortfolio = propertiesList.map((p: any) => ({
    id: p._id?.toString(),
    name: p.propertyName,
    loc: `${p.address?.city || ''}, ${p.address?.state || ''}`.replace(/^, | , $/g, '') || 'No Location',
    units: p.totalUnits || 0,
    type: p.propertyType || 'Residential',
    status: p.status || 'Active',
  }));

  const maintenanceList = data?.maintenanceRequests || [];
  const tickets = maintenanceList.slice(0, 5).map((t: any) => {
    let prioColor = "text-emerald-700 bg-emerald-50 border-emerald-200/60";
    let prioLabel = "Low";
    if (t.priority === "High") { prioColor = "text-rose-700 bg-rose-50 border-rose-200/60"; prioLabel = "High"; }
    else if (t.priority === "Medium") { prioColor = "text-amber-700 bg-amber-50 border-amber-200/60"; prioLabel = "Medium"; }
    else if (t.priority === "Emergency") { prioColor = "text-red-700 bg-red-50 border-red-200/60"; prioLabel = "Urgent"; }
    else { prioLabel = t.priority || "Low"; }

    let statusColor = "text-slate-600 bg-slate-100";
    if (t.status === "Open") statusColor = "text-blue-700 bg-blue-50";
    else if (t.status === "In Progress") statusColor = "text-amber-700 bg-amber-50";
    else if (t.status === "Resolved") statusColor = "text-emerald-700 bg-emerald-50";

    return {
      title: t.title,
      loc: typeof t.propertyId === 'object' && t.propertyId !== null && 'propertyName' in t.propertyId ? String((t.propertyId as any).propertyName) : 'Unknown',
      status: t.status,
      statusColor,
      date: t.createdAt ? format(new Date(t.createdAt), "dd MMM") : 'N/A',
      prio: prioLabel,
      prioColor,
      category: t.category || 'General',
    };
  });

  const activities = (data?.recentActivities || []).slice(0, 6).map((act: any) => {
    let icon = Activity;
    let color = "from-slate-400 to-slate-500";
    let bg = "bg-slate-50";

    if (act.entityType === 'Tenant') { icon = Users; color = "from-blue-500 to-indigo-500"; bg = "bg-blue-50"; }
    else if (act.entityType === 'Unit') { icon = DoorOpen; color = "from-violet-500 to-purple-500"; bg = "bg-violet-50"; }
    else if (act.entityType === 'Property') { icon = Building2; color = "from-emerald-500 to-teal-500"; bg = "bg-emerald-50"; }
    else if (act.entityType === 'MaintenanceRequest') { icon = Wrench; color = "from-rose-500 to-red-500"; bg = "bg-rose-50"; }

    return {
      title: act.action,
      desc: act.description || `Action on ${act.entityType}`,
      time: act.createdAt ? formatDistanceToNow(new Date(act.createdAt), { addSuffix: true }).replace('about ', '') : 'Recently',
      icon,
      color,
      bg,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200/60 px-4 py-3 min-w-[160px]">
          <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                {entry.dataKey === 'collected' ? 'Collected' : entry.dataKey === 'pending' ? 'Pending' : 'Target'}
              </span>
              <span className="text-[12px] font-extrabold text-slate-900">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F0F2F5] overflow-hidden animate-in fade-in duration-500">

      {/* === TOP: Hero Banner + KPIs === */}
      <div className="flex-shrink-0 px-5 pt-5 pb-0">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-5">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3.5 pb-4 flex flex-col justify-between hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${kpi.gradient} blur-3xl scale-150`} style={{ opacity: 0 }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br from-current to-transparent" />

              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-sm`}>
                  <kpi.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{kpi.title}</span>
              </div>

              <div className="flex items-end justify-between relative z-10 mt-auto">
                {isLoading && !data ? (
                  <div className="h-5 w-14 bg-slate-200/80 animate-pulse rounded" />
                ) : (
                  <span className="text-[18px] font-black text-slate-900 tracking-tight leading-none">{kpi.value}</span>
                )}
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${kpi.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                  {kpi.isUp ? '↑' : '↓'} {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col gap-4 px-5 pb-5 min-h-0 overflow-hidden">

        {/* Row 1: Revenue Chart + Occupancy */}
        <div className="flex gap-4 flex-[1.3] min-h-0">

          {/* Revenue & Collection Chart */}
          <div className="flex-[1.6] bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
                  <IndianRupee className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">Revenue & Collection</h3>
                  <p className="text-[11px] font-medium text-slate-400">6-month trend analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />Collected</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Pending</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-1 rounded bg-slate-300" />Target</span>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3 px-5 py-3 flex-shrink-0">
              {[
                { label: "Total Revenue", value: formatINR(estimatedMonthlyRent), trend: "+12.3%", up: true, color: "border-l-indigo-500" },
                { label: "Collected", value: formatINR(collectedRent), trend: `${collectionRate}%`, up: true, color: "border-l-emerald-500" },
                { label: "Pending", value: formatINR(stats.pendingRentTotal), trend: `${stats.pendingRentCount}`, up: false, color: "border-l-amber-500" },
                { label: "Overdue", value: "₹0", trend: "0%", up: true, color: "border-l-rose-500" },
              ].map((s, i) => (
                <div key={i} className={`bg-slate-50/70 rounded-xl p-3 border-l-[3px] ${s.color} border border-slate-100`}>
                  <p className="text-[16px] font-black text-slate-900 leading-tight">{s.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] font-bold text-slate-500">{s.label}</p>
                    <span className={`text-[9px] font-extrabold ${s.up ? 'text-emerald-600' : 'text-amber-600'}`}>{s.up ? '↑' : '⬤'} {s.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="flex-1 px-2 pb-2 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="collected" stroke="#6366F1" strokeWidth={2.5} fill="url(#gradCollected)" dot={false} activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} fill="url(#gradPending)" dot={false} activeDot={{ r: 4, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="target" stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Donut */}
          <div className="flex-[0.8] bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <PieChartIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight">Occupancy</h3>
              </div>
            </div>

            {/* Donut chart */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0 py-4">
              <div className="w-[120px] h-[120px] relative flex-shrink-0">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={40} outerRadius={55} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={6}>
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[22px] font-black text-slate-900 leading-none tracking-tighter">{occupancyRate}%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Rate</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full space-y-1.5 mt-3">
                {[
                  { label: "Occupied", value: stats.activeTenants, color: "#6366F1" },
                  { label: "Vacant", value: vacantUnits, color: "#E2E8F0" },
                  { label: "Maintenance", value: stats.openMaintenance, color: "#F59E0B" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50/70 rounded-lg px-3 py-1.5 border border-slate-100/80">
                    <span className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0" style={{ background: item.color }} />
                      {item.label}
                    </span>
                    <span className="text-[13px] font-extrabold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-3 gap-2 p-3 border-t border-slate-100/80 flex-shrink-0">
              {[
                { label: "Total", value: stats.totalUnits, color: "text-indigo-700 bg-indigo-50 border-indigo-100" },
                { label: "Filled", value: stats.activeTenants, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                { label: "Open", value: vacantUnits, color: "text-amber-700 bg-amber-50 border-amber-100" },
              ].map((s, i) => (
                <div key={i} className={`flex flex-col items-center justify-center py-2 rounded-xl border ${s.color}`}>
                  <span className="text-[16px] font-black leading-none">{s.value}</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider mt-1 opacity-70">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Properties + Maintenance + Activity */}
        <div className="flex gap-4 flex-1 min-h-0">

          {/* Property Portfolio */}
          <div className="flex-[1.4] bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none">Property Portfolio</h3>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">{stats.totalProperties} Properties · {stats.totalUnits} Units</p>
                </div>
              </div>
              <Link href="/properties" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                View All
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isLoading && !data ? (
                <div className="space-y-1.5">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-28 bg-slate-200 rounded" />
                        <div className="h-2.5 w-16 bg-slate-100 rounded" />
                      </div>
                      <div className="h-5 w-14 bg-slate-200 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : propertyPortfolio.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                  <Building2 className="h-8 w-8 opacity-20" />
                  <p className="text-[12px] font-bold">No properties yet</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {propertyPortfolio.map((p: any, i: number) => (
                    <Link
                      key={i}
                      href={`/properties/${p.id}`}
                      className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 border border-indigo-200/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-extrabold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{p.name}</p>
                        <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />{p.loc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{p.units} units</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                          {p.status}
                        </span>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-sm">
                  <Wrench className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight">Maintenance</h3>
              </div>
              <Link href="/maintenance" className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                View All
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {isLoading && !data ? (
                <div className="space-y-1">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-slate-200" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-24 bg-slate-200 rounded" />
                        <div className="h-2 w-16 bg-slate-100 rounded" />
                      </div>
                      <div className="h-4 w-12 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 drop-shadow-sm" />
                  <p className="text-[12px] font-bold text-slate-700">All caught up!</p>
                  <p className="text-[10px] font-medium text-slate-400">No pending maintenance</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {tickets.map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 border border-amber-200/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Wrench className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-extrabold text-slate-900 truncate leading-tight">{t.title}</p>
                        <p className="text-[9px] font-medium text-slate-400 truncate mt-0.5">{t.loc} · {t.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${t.prioColor}`}>{t.prio}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${t.statusColor}`}>{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
                  <Activity className="h-3.5 w-3.5 text-white" />
                </div>
                <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight">Activity Feed</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {isLoading && !data ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-start gap-3.5 py-2 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-28 bg-slate-200 rounded" />
                        <div className="h-2 w-36 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <Activity className="h-8 w-8 text-slate-200" />
                  <p className="text-[12px] font-bold text-slate-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-0 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" />

                  {activities.map((act: any, i: number) => (
                    <div key={i} className="relative flex items-start gap-3.5 py-2.5 group">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${act.color} flex items-center justify-center flex-shrink-0 z-10 ring-[3px] ring-white shadow-sm group-hover:scale-110 transition-transform`}>
                        <act.icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-extrabold text-slate-900 truncate leading-tight">{act.title}</p>
                          <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded-md flex-shrink-0">{act.time}</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
