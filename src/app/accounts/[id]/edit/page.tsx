"use client";

import { useAccount } from "@/hooks/use-accounts";
import { AccountForm } from "@/components/forms/account-form";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Suspense, use } from "react";
import { Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EditAccountContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { account, isLoading, isError } = useAccount(id);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 ">
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Error Loading Account</h2>
        <Link href="/accounts" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      {/* Breadcrumb / Back */}
      <Link href="/accounts" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Accounts
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-400/20">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Owner: {account.accountName}</h1>
          <p className="text-[13px] font-medium text-slate-500">Update the property owner's information.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 ">
        <AccountForm initialData={account} isEdit />
      </div>
    </div>
  );
}

export default function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><FormSkeleton /></div>}>
      <EditAccountContent params={params} />
    </Suspense>
  );
}
