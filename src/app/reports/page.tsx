"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  FileText, 
  PieChart, 
  ArrowRight,
  Filter,
  DollarSign,
  Users,
  Building
} from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [propertyFilter, setPropertyFilter] = useState("All Properties");

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-400/20">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-[13px] font-medium text-slate-500">Generate and export financial and operational insights.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-10">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select 
              className="bg-transparent text-[13px] font-bold text-slate-700 focus:outline-none cursor-pointer"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-10">
            <Filter className="h-4 w-4 text-slate-400" />
            <select 
              className="bg-transparent text-[13px] font-bold text-slate-700 focus:outline-none cursor-pointer"
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
            >
              <option>All Properties</option>
              <option>Aurora Tower</option>
              <option>Zenith complex</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-200 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
              <DollarSign className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹1,240,000</h3>
          </div>
          <div className="mt-4 flex items-center text-[12px] font-bold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            <span>+12.5% from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-amber-200 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 border border-amber-100">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Total Expenses</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹425,500</h3>
          </div>
          <div className="mt-4 flex items-center text-[12px] font-bold text-red-600">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            <span>+4.2% from last period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
              <PieChart className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Net Operating Income</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹814,500</h3>
          </div>
          <div className="mt-4 flex items-center text-[12px] font-bold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            <span>+16.8% from last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Financial Reports</h2>
          </div>
          <div className="p-2">
            {[
              { title: "Rent Roll Summary", desc: "Overview of current leases, rent amounts, and statuses.", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Income & Expense Statement", desc: "Detailed breakdown of revenue vs costs.", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
              { title: "Arrears / Outstanding Rent", desc: "List of tenants with overdue balances.", icon: TrendingUp, color: "text-red-600", bg: "bg-red-50" },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center border border-slate-100`}>
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">{report.title}</h4>
                    <p className="text-[12px] font-medium text-slate-500">{report.desc}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Operational Reports</h2>
          </div>
          <div className="p-2">
            {[
              { title: "Occupancy & Vacancy Analysis", desc: "Current rates and historical trends.", icon: Building, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Maintenance Ticket Logs", desc: "All requests, statuses, and costs.", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
              { title: "Tenant Roster", desc: "Complete list of active and past tenants.", icon: Users, color: "text-slate-600", bg: "bg-slate-100" },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center border border-slate-100`}>
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">{report.title}</h4>
                    <p className="text-[12px] font-medium text-slate-500">{report.desc}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Report Builder Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-8 relative overflow-hidden shadow-xl mt-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight mb-2">Need a Custom Report?</h3>
            <p className="text-[14px] font-medium text-slate-300 max-w-lg leading-relaxed">
              Build your own query using our advanced report builder. Select specific fields, apply custom filters, and schedule automated email deliveries.
            </p>
          </div>
          <button className="shrink-0 h-11 px-6 gap-2 inline-flex items-center justify-center bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl shadow-lg border-none text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <BarChart3 className="h-4 w-4" />
            Open Report Builder
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
