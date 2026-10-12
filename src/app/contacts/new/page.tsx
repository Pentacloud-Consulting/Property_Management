"use client";

import { ContactForm } from "@/components/forms/contact-form";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NewContactPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      <Link href="/contacts" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Contacts
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] border border-indigo-400/20">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create New Contact</h1>
          </div>
          <p className="text-[13px] font-medium text-slate-500 ml-12">Add a standalone contact and associate it with an account if needed.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
