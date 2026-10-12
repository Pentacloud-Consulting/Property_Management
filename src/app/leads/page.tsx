"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, ArrowRight, Pencil, Trash2, UserPlus, Phone, Mail, Users, UserCheck, TrendingUp } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useLeads } from "@/hooks/use-leads";
import { ILeadDocument } from "@/models/Lead";
import { LEAD_STATUSES, LEAD_SOURCES } from "@/lib/constants";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";

export default function LeadsPage() {
  const { data: leads = [], isLoading, mutate } = useLeads({ page: 1, limit: 100 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/leads/${deleteId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete lead");
      
      toast.success("Lead deleted successfully");
      mutate(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<ILeadDocument>[] = [
    {
      accessorKey: "leadName",
      header: "Lead Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/50 flex items-center justify-center text-[11px] font-bold text-slate-600 shadow-sm">
            {row.getValue<string>("leadName").substring(0, 2).toUpperCase()}
          </div>
          <span className="font-extrabold text-slate-900 text-[13px] tracking-tight">{row.getValue("leadName")}</span>
        </div>
      ),
    },
    {
      accessorKey: "mobileNumber",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
            <Phone className="h-3 w-3 text-slate-400" />
            {row.getValue("mobileNumber")}
          </div>
          {row.original.email && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Mail className="h-3 w-3 text-slate-400" />
              {row.original.email}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200/60 shadow-sm">
          {row.getValue("source")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Added",
      cell: ({ row }) => (
        <span className="text-[12px] font-semibold text-slate-600">
          {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      cell: ({ row }) => {
        const status = row.getValue<string>("status");
        let colors = "bg-slate-100 text-slate-600 border-slate-200";
        if (status === "Converted") colors = "bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
        if (status === "New") colors = "bg-blue-50 text-blue-700 border-blue-200/50";
        if (status === "Contacted") colors = "bg-amber-50 text-amber-700 border-amber-200/50";
        if (status === "Lost") colors = "bg-red-50 text-red-700 border-red-200/50";

        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${colors}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;
        const isConverted = lead.status === "Converted";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-1.5">
              <DropdownMenuLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 mb-1" />
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-[12px] font-bold text-slate-700">
                <Link href={`/leads/${lead._id}`} className="flex w-full items-center px-2 py-1.5">View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-[12px] font-bold text-slate-700">
                <Link href={`/leads/${lead._id}/edit`} className="flex w-full items-center px-2 py-1.5">
                  <Pencil className="mr-2 h-3.5 w-3.5 text-slate-400" />
                  Edit Lead
                </Link>
              </DropdownMenuItem>
              {!isConverted && (
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50 text-[12px] font-bold text-blue-700 mt-1">
                   <Link href={`/leads/${lead._id}/convert`} className="flex w-full items-center px-2 py-1.5">
                    <ArrowRight className="mr-2 h-3.5 w-3.5" />
                    Convert to Owner
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 text-[12px] font-bold text-red-600 px-2 py-1.5"
                onClick={() => setDeleteId(lead._id.toString())}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leads</h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500 ml-12">Manage potential property owners and track conversion pipelines.</p>
        </div>
        
        <Link href="/leads/new" className="h-10 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#1E5EFF] to-[#1442C4] text-white hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-[0_4px_15px_rgba(30,94,255,0.25)] border border-blue-400/20 px-5 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Lead
        </Link>
      </div>

      {/* Mini Dashboard */}
      {!isLoading && leads && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: "Total Leads", value: leads.length, icon: Users, gradient: "from-blue-500 to-indigo-600" },
            { title: "New Leads", value: leads.filter(l => l.status === "New").length, icon: UserPlus, gradient: "from-amber-500 to-orange-600" },
            { title: "Converted", value: leads.filter(l => l.status === "Converted").length, icon: UserCheck, gradient: "from-emerald-500 to-teal-600" },
            { title: "Conversion Rate", value: `${leads.length > 0 ? Math.round((leads.filter(l => l.status === "Converted").length / leads.length) * 100) : 0}%`, icon: TrendingUp, gradient: "from-violet-500 to-purple-600" },
          ].map((kpi, i) => (
            <div key={i} className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3.5 pb-4 flex flex-col justify-between hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300 overflow-hidden">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${kpi.gradient} blur-3xl scale-150`} style={{ opacity: 0 }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br from-current to-transparent" />
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-sm`}>
                  <kpi.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{kpi.title}</span>
              </div>
              <div className="flex items-end justify-between relative z-10 mt-auto">
                <span className="text-[20px] font-black text-slate-900 tracking-tight leading-none">{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-2">
        {isLoading ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-slate-400">
            <UserPlus className="h-8 w-8 mb-3 opacity-20 animate-pulse" />
            <p className="text-[13px] font-bold">Loading leads...</p>
          </div>
        ) : (
          <div className="[&_.rounded-md]:border-none [&_.rounded-md]:shadow-none [&_th]:bg-slate-50/50 [&_th]:text-[11px] [&_th]:font-extrabold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-slate-500 [&_td]:py-3 [&_tr:hover]:bg-slate-50/80 [&_tr]:border-slate-100/80">
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center">Loading Table...</div>}>
              <DataTable 
                columns={columns} 
                data={leads} 
                searchKey="leadName" 
                searchPlaceholder="Search leads by name..."
                facetedFilters={[
                  {
                    column: "status",
                    title: "Status",
                    options: LEAD_STATUSES.map(s => ({ label: s, value: s }))
                  },
                  {
                    column: "source",
                    title: "Source",
                    options: LEAD_SOURCES.map(s => ({ label: s, value: s }))
                  }
                ]}
              />
            </Suspense>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
