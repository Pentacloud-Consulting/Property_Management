"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Edit, Phone, Mail, Globe, MapPin, Calendar, Clock, UserPlus, CheckCircle2, ChevronRight } from "lucide-react";

import { useLead } from "@/hooks/use-leads";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState } from "react";
import { ConvertLeadDialog } from "@/components/modules/leads/convert-dialog";
import { FollowUpLog } from "@/components/modules/leads/follow-up-log";

function LeadDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { lead, isLoading, isError, mutate } = useLead(id);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)]">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-12 w-[300px] mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[400px] md:col-span-2 rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <UserPlus className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Not Found</h2>
        <p className="text-slate-500 mt-2">The lead you're looking for doesn't exist or has been removed.</p>
        <Link href="/leads" className="mt-6 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
        </Link>
      </div>
    );
  }

  const isConverted = lead.status === "Converted";

  const PremiumCard = "bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden";

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Breadcrumb / Back */}
      <Link href="/leads" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lead.leadName}</h1>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${isConverted ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-700 border-slate-200/50'}`}>
              {lead.status}
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Lead added on <strong className="text-slate-700">{format(new Date(lead.createdAt), "MMMM do, yyyy")}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isConverted && (
            <>
              <Link href={`/leads/${lead._id}/edit`} className="h-10 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 px-4 text-[13px] font-bold transition-all hover:shadow-md">
                <Edit className="mr-2 h-4 w-4 text-slate-400" />
                Edit Lead
              </Link>
              {lead.status === 'Qualified' && (
                <button onClick={() => setIsConvertOpen(true)} className="h-10 inline-flex items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-400/20 px-5 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Convert to Owner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </>
          )}
          {isConverted && lead.convertedAccountId && (
              <Link href={`/accounts/${typeof lead.convertedAccountId === 'object' ? (lead.convertedAccountId as any)._id : lead.convertedAccountId}`} className="h-10 inline-flex items-center justify-center bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] px-5 text-[13px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                View Owner Profile
                <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
              </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Details */}
        <div className={`${PremiumCard} md:col-span-2 flex flex-col`}>
          <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 flex items-center justify-center text-blue-600 shadow-sm">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Lead Information</h2>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Contact details and source tracking</p>
            </div>
          </div>
          
          <div className="p-6 space-y-8 flex-1 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </p>
                <p className="text-[18px] font-extrabold text-slate-900">{lead.mobileNumber}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </p>
                <p className="text-[14px] font-bold text-slate-700">{lead.email || "—"}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Source
                </p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[12px] font-bold border border-slate-200/60">
                  {lead.source}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Last Updated
                </p>
                <p className="text-[13px] font-bold text-slate-700">{format(new Date(lead.updatedAt), "MMM do, yyyy 'at' h:mm a")}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Internal Notes</p>
              <div className="bg-slate-50/80 border border-slate-100/80 p-4 rounded-xl min-h-[100px] text-[13px] font-medium text-slate-700 whitespace-pre-wrap shadow-inner">
                {lead.notes || <span className="text-slate-400 italic">No notes added.</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className={`${PremiumCard} flex flex-col`}>
          {/* We'll let FollowUpLog render its own header/content, but wrap it cleanly */}
          <div className="flex-1 bg-white">
            <FollowUpLog leadId={String(lead._id)} />
          </div>
        </div>
      </div>

      <ConvertLeadDialog
        lead={lead}
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        onSuccess={() => {
          setIsConvertOpen(false);
          mutate(); // Refresh the lead details
        }}
      />
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>}>
      <LeadDetailContent params={params} />
    </Suspense>
  );
}
