"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, MoreHorizontal, Pencil, Trash2, Contact, Phone, Mail, Building2, Users, UserCheck, TrendingUp, Activity } from "lucide-react";
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
import { useContacts } from "@/hooks/use-contacts";
import { IContactDocument } from "@/models/Contact";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ContactsPage() {
  const { data: contacts = [], isLoading, mutate } = useContacts({ page: 1, limit: 500 });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contacts/${deleteId}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete contact");
      }
      
      toast.success("Contact deleted successfully");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<IContactDocument>[] = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200/50 flex items-center justify-center text-[11px] font-bold text-indigo-700 shadow-sm">
            {row.original.firstName.charAt(0)}{row.original.lastName?.charAt(0) || ''}
          </div>
          <span className="font-extrabold text-slate-900 text-[13px] tracking-tight">{row.original.firstName} {row.original.lastName || ""}</span>
        </div>
      ),
    },
    {
      accessorKey: "contactType",
      header: "Type",
      cell: ({ row }) => {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border bg-slate-50 text-slate-600 border-slate-200 shadow-sm uppercase tracking-wider">
            {row.getValue("contactType")}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
      )
    },
    {
      accessorKey: "accountId",
      header: "Associated Account",
      cell: ({ row }) => {
        const account = row.original.accountId as any;
        return account ? (
          <Link href={`/accounts/${account._id}`} className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-[12px] font-bold transition-colors">
             <Building2 className="h-3.5 w-3.5" />
             {account.accountName}
          </Link>
        ) : <span className="text-slate-400 font-medium text-[12px]">—</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] p-1.5">
              <DropdownMenuLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1.5">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 mb-1" />
              <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 text-[12px] font-bold text-slate-700">
                <Link href={`/contacts/${contact._id}/edit`} className="flex w-full items-center px-2 py-1.5">
                  <Pencil className="mr-2 h-3.5 w-3.5 text-slate-400" />
                  Edit Contact
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 text-[12px] font-bold text-red-600 px-2 py-1.5"
                onClick={() => setDeleteId(contact._id.toString())}
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-400/20">
              <Contact className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contacts</h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500 ml-12">Manage all individual contacts across your accounts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/accounts" className="h-10 gap-2 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 px-5 text-[13px] font-bold transition-all hover:shadow-md">
            <Building2 className="h-4 w-4 text-slate-400" />
            Add via Account
          </Link>
          <Link href="/contacts/new" className="h-10 gap-2 inline-flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 px-5 text-[13px] font-bold transition-all hover:shadow-md hover:shadow-indigo-300">
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </div>
      </div>

      {/* Mini Dashboard */}
      {!isLoading && contacts && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
          {[
            { title: "Total Contacts", value: contacts.length, icon: Users, gradient: "from-blue-500 to-indigo-600" },
            { title: "Active", value: contacts.length, icon: Activity, gradient: "from-emerald-500 to-teal-600" },
            { title: "Recent", value: contacts.slice(0, 5).length, icon: UserCheck, gradient: "from-amber-500 to-orange-600" },
            { title: "Growth Rate", value: "+12%", icon: TrendingUp, gradient: "from-violet-500 to-purple-600" },
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
            <Contact className="h-8 w-8 mb-3 opacity-20 animate-pulse" />
            <p className="text-[13px] font-bold">Loading contacts...</p>
          </div>
        ) : (
          <div className="[&_.rounded-md]:border-none [&_.rounded-md]:shadow-none [&_th]:bg-slate-50/50 [&_th]:text-[11px] [&_th]:font-extrabold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-slate-500 [&_td]:py-3 [&_tr:hover]:bg-slate-50/80 [&_tr]:border-slate-100/80">
            <Suspense fallback={<div className="h-96 w-full flex items-center justify-center">Loading Table...</div>}>
              <DataTable 
                columns={columns} 
                data={contacts} 
                searchKey="firstName"
                searchPlaceholder="Search contacts by name..."
                facetedFilters={[
                  {
                    column: "contactType",
                    title: "Contact Type",
                    options: [
                      { label: "Property Owner", value: "Property Owner" },
                      { label: "Tenant", value: "Tenant" },
                      { label: "Vendor", value: "Vendor" },
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
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
