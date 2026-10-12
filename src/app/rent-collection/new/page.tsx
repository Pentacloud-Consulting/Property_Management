"use client";

import { RentCollectionForm } from "@/components/forms/rent-collection-form";
import { Banknote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function NewRentCollectionContent() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Breadcrumb / Back */}
      <Link href="/rent-collection" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Rent Collection
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)] border border-emerald-400/20">
          <Banknote className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Record Rent Payment</h1>
          <p className="text-[13px] font-medium text-slate-500">Create a new rent collection record.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 ">
        <RentCollectionForm />
      </div>
    </div>
  );
}

export default function NewRentCollectionPage() {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen">Loading...</div>}>
      <NewRentCollectionContent />
    </Suspense>
  );
}
