"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, UserCircle, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConvertLeadFormValues, convertLeadSchema } from "@/validators/lead.validator";
import { ILeadDocument } from "@/models/Lead";

interface ConvertLeadFormProps {
  initialData: ILeadDocument;
}

export function ConvertLeadForm({ initialData }: ConvertLeadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ConvertLeadFormValues>({
    resolver: zodResolver(convertLeadSchema),
    defaultValues: {
      accountName: initialData?.companyName || initialData?.leadName || "",
      contactName: initialData?.leadName || "",
      phone: initialData?.mobileNumber || "",
      email: initialData?.email || "",
      address: initialData?.locality || "",
      city: initialData?.city || "",
      state: "",
      country: "",
    },
  });

  async function onSubmit(data: ConvertLeadFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leads/${initialData._id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to convert lead");
      }

      toast.success("Lead successfully converted to Property Owner!");
      if (result.data?.newOwnerId) {
        router.push(`/accounts/${result.data.newOwnerId}`);
      } else {
        router.push("/accounts");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 2-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Col 1: Personal Info */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><UserCircle className="h-4 w-4 text-emerald-500" />Personal Information</div>
            
            <FormField control={form.control} name="accountName" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Account / Company Name *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="Account Name" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="contactName" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Primary Contact Name *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="John Doe" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Phone Number *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="+1..." {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Email Address</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="email@..." type="email" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>
          </div>

          {/* Col 2: Address Info */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><MapPin className="h-4 w-4 text-indigo-500" />Address Information</div>
            
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Full Address</FormLabel><FormControl><Textarea disabled={isLoading} placeholder="123 Main St..." className={`${inputClasses} h-[84px] pt-2 resize-none`} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>City</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="City" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              
              <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>State / Prov</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="State" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Country</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="Country" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#10B981] to-[#047857] text-white hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Conversion
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
