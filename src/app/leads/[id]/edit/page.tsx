"use client";

import { useLead } from "@/hooks/use-leads";
import { LeadForm } from "@/components/forms/lead-form";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Suspense, use } from "react";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EditLeadContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lead, isLoading, isError } = useLead(id);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 ">
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <UserPlus className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Error Loading Lead</h2>
        <Link href="/leads" className="mt-6 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      {/* Breadcrumb / Back */}
      <Link href="/leads" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Leads
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-blue-400/20">
          <UserPlus className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Lead: {lead.leadName}</h1>
          <p className="text-[13px] font-medium text-slate-500">Update the lead's information.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6">
        <LeadForm initialData={lead} isEdit />
      </div>
    </div>
  );
}

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><FormSkeleton /></div>}>
      <EditLeadContent params={params} />
    </Suspense>
  );
}
