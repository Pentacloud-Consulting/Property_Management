"use client";

import { useLead } from "@/hooks/use-leads";
import { PageHeader } from "@/components/shared/page-header";
import { ConvertLeadForm } from "@/components/forms/convert-lead-form";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import { Suspense, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ConvertLeadContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lead, isLoading, isError } = useLead(id);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
        <PageHeader title="Convert Lead" description="Loading data..." />
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <FormSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader title="Error" description="Failed to load lead." />
      </div>
    );
  }

  if (lead.status === "Converted") {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
        <Link href="/leads" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 -ml-2 mb-2 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
        </Link>
        <PageHeader title="Lead Already Converted" description="This lead has already been converted to a property owner." />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <Link href="/leads" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-3 -ml-2 mb-2 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
      </Link>
      
      <PageHeader 
        title={`Convert Lead: ${lead.leadName}`}
        description="Fill in the additional information required to create a Property Owner profile."
      />

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <ConvertLeadForm initialData={lead} />
      </div>
    </div>
  );
}

export default function ConvertLeadPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8"><FormSkeleton /></div>}>
      <ConvertLeadContent params={params} />
    </Suspense>
  );
}
