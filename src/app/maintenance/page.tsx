"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, MoreHorizontal, Pencil, Trash2, Wrench, Building, BoxSelect, Activity, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

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
import { useMaintenanceRequests } from "@/hooks/use-maintenance";
import { IMaintenanceRequestDocument } from "@/models/MaintenanceRequest";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function MaintenancePage() {
  const { data: requests = [], isLoading, mutate } = useMaintenanceRequests({ page: 1, limit: 100 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/maintenance/${deleteId}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete ticket");
      }
      
      toast.success("Ticket deleted successfully");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<IMaintenanceRequestDocument>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket",
      cell: ({ row }) => (
        <div className="font-extrabold text-[12px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md max-w-fit border border-indigo-200">
          {row.getValue("ticketNumber")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="font-extrabold text-[12px] text-slate-700">{row.getValue("category")}</span>
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-bold text-[13px] text-slate-900 truncate max-w-[200px] block">{row.getValue("title")}</span>
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const prop = row.original.propertyId as any;
        const unit = row.original.unitId as any;
        return (
          <div className="flex flex-col gap-1 py-1">
            <span className="font-bold text-[12px] text-slate-700 flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-slate-400" /> {prop?.propertyName || "—"}</span>
            <span className="font-medium text-[11px] text-slate-500 flex items-center gap-1.5"><BoxSelect className="h-3.5 w-3.5 text-slate-400" /> Unit {unit?.unitNumber || "—"}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "priority",
      header: "Priority",
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        let style = "bg-slate-50 text-slate-600 border-slate-200";
        if (priority === "Emergency") style = "bg-red-600 text-white border-red-700 shadow-[0_2px_10px_rgba(220,38,38,0.3)]";
        if (priority === "High") style = "bg-orange-100 text-orange-700 border-orange-200";
        if (priority === "Medium") style = "bg-amber-50 text-amber-700 border-amber-200";
        
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${style}`}>
            {priority}
          </span>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let style = "bg-slate-50 text-slate-600 border-slate-200";
        if (status === "Resolved" || status === "Closed") style = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "In Progress") style = "bg-blue-50 text-blue-700 border-blue-200";
        if (status === "On Hold") style = "bg-amber-50 text-amber-700 border-amber-200";
        if (status === "Open") style = "bg-indigo-50 text-indigo-700 border-indigo-200";
        
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold border shadow-sm uppercase tracking-wider ${style}`}>
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      cell: ({ row }) => <span className="text-[12px] font-semibold text-slate-600">{format(new Date(row.getValue("createdAt")), "MMM do, yyyy")}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-1.5">
              <DropdownMenuLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 mb-1" />
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-[12px] font-bold text-slate-700">
                <Link href={`/maintenance/${ticket._id}/edit`} className="flex w-full items-center px-2 py-1.5">
                  <Pencil className="mr-2 h-3.5 w-3.5 text-slate-400" />
                  Edit Ticket
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 text-[12px] font-bold text-red-600 px-2 py-1.5"
                onClick={() => setDeleteId(ticket._id.toString())}
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_4px_12px_rgba(239,68,68,0.3)] border border-red-400/20">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance</h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500 ml-12">Track and resolve property issues and repair tickets.</p>
        </div>
        
        <Link href="/maintenance/new" className="h-10 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#1E5EFF] to-[#1442C4] text-white hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-[0_4px_15px_rgba(30,94,255,0.25)] border border-blue-500/20 px-5 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          New Ticket
        </Link>
      </div>

      {/* Mini Dashboard */}
      {!isLoading && requests && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          {[
            { title: "Total Tickets", value: requests.length, icon: Wrench, gradient: "from-blue-500 to-indigo-600" },
            { title: "Open", value: requests.filter(r => r.status === "Open" || r.status === "In Progress").length, icon: Activity, gradient: "from-amber-500 to-orange-600" },
            { title: "Resolved", value: requests.filter(r => r.status === "Resolved" || r.status === "Closed").length, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600" },
            { title: "Urgent", value: requests.filter(r => r.priority === "Emergency" || r.priority === "High").length, icon: AlertTriangle, gradient: "from-rose-500 to-red-600" },
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
            <Wrench className="h-8 w-8 mb-3 opacity-20 animate-pulse" />
            <p className="text-[13px] font-bold">Loading requests...</p>
          </div>
        ) : (
          <div className="[&_.rounded-md]:border-none [&_.rounded-md]:shadow-none [&_th]:bg-slate-50/50 [&_th]:text-[11px] [&_th]:font-extrabold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-slate-500 [&_td]:py-3 [&_tr:hover]:bg-slate-50/80 [&_tr]:border-slate-100/80">
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center">Loading Table...</div>}>
              <DataTable 
                columns={columns} 
                data={requests} 
                searchKey="ticketNumber"
                searchPlaceholder="Search tickets..."
                facetedFilters={[
                  {
                    column: "status",
                    title: "Status",
                    options: [
                      { label: "Open", value: "Open" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "On Hold", value: "On Hold" },
                      { label: "Resolved", value: "Resolved" },
                      { label: "Closed", value: "Closed" },
                    ]
                  },
                  {
                    column: "priority",
                    title: "Priority",
                    options: [
                      { label: "Low", value: "Low" },
                      { label: "Medium", value: "Medium" },
                      { label: "High", value: "High" },
                      { label: "Emergency", value: "Emergency" },
                    ]
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
        title="Delete Ticket"
        description="Are you sure you want to delete this maintenance ticket? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
