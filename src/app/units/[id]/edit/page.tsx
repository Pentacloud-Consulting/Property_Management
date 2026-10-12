"use client";

import { useUnit } from "@/hooks/use-units";
import { UnitForm } from "@/components/forms/unit-form";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Suspense, use } from "react";
import { BoxSelect, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EditUnitContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { unit, isLoading, isError } = useUnit(id);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 ">
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !unit) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <BoxSelect className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Error Loading Unit</h2>
        <Link href="/units" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Units
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      <Link href="/units" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Units
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-400/20">
          <BoxSelect className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Unit: {unit.unitNumber}</h1>
          <p className="text-[13px] font-medium text-slate-500">Update configuration and details for this unit.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 ">
        <UnitForm initialData={unit} isEdit />
      </div>
    </div>
  );
}

export default function EditUnitPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><FormSkeleton /></div>}>
      <EditUnitContent params={params} />
    </Suspense>
  );
}
