"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Phone, Briefcase } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactSchema } from "@/validators/contact.validator";
import { useAccounts } from "@/hooks/use-accounts";

export function ContactForm({ initialData, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const { data: accounts } = useAccounts({ page: 1, limit: 500 });

  const form = useForm<any>({
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      mobileNumber: initialData?.mobileNumber || "",
      alternateMobile: initialData?.alternateMobile || "",
      email: initialData?.email || "",
      designation: initialData?.designation || "",
      contactType: initialData?.contactType || "Other",
      accountId: initialData?.accountId?._id || initialData?.accountId || "",
      status: initialData?.status || "Active",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: any) {
    try {
      const url = isEdit && initialData ? `/api/contacts/${initialData._id}` : "/api/contacts";
      const method = isEdit ? "PUT" : "POST";
      
      const payload = { ...data };
      if (!payload.accountId) {
        delete payload.accountId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      toast.success(isEdit ? "Contact updated successfully" : "Contact created successfully");
      router.push("/contacts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save contact");
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Col 1: Core Info */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><User className="h-4 w-4 text-indigo-500" />Personal Info</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control as any} name="firstName" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>First Name *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control as any} name="lastName" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Last Name</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control as any} name="mobileNumber" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Mobile Number *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control as any} name="alternateMobile" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Alternate Mobile</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField control={form.control as any} name="email" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Email Address</FormLabel><FormControl><Input type="email" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 2: Role & Account */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Briefcase className="h-4 w-4 text-emerald-500" />Role & Assignment</div>
            
            <FormField control={form.control as any} name="contactType" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Contact Type *</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Property Owner" className="text-[12px] font-medium">Property Owner</SelectItem>
                    <SelectItem value="Tenant" className="text-[12px] font-medium">Tenant</SelectItem>
                    <SelectItem value="Vendor" className="text-[12px] font-medium">Vendor</SelectItem>
                    <SelectItem value="Broker" className="text-[12px] font-medium">Broker</SelectItem>
                    <SelectItem value="Emergency Contact" className="text-[12px] font-medium">Emergency Contact</SelectItem>
                    <SelectItem value="Other" className="text-[12px] font-medium">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control as any} name="designation" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Designation (Optional)</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <FormField control={form.control as any} name="accountId" render={({ field }) => {
              const selectedAcc = accounts?.find((acc: any) => (acc._id?.toString() || acc._id) === field.value) ||
                (initialData?.accountId && typeof initialData.accountId === 'object' ? initialData.accountId : null);
              const accLabel = selectedAcc
                ? `${selectedAcc.accountName} ${selectedAcc.accountType === 'Company' ? '(Company)' : ''}`.trim()
                : (field.value ? (initialData?.accountId?.accountName || "Loading...") : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Associated Account (Company/Owner)</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Select Account...">
                          {accLabel}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="" className="text-[12px] font-medium text-slate-400">No Account</SelectItem>
                      {accounts?.map((acc: any) => (
                        <SelectItem key={acc._id} value={acc._id} className="text-[12px] font-medium">
                          {acc.accountName} {acc.accountType === 'Company' ? '(Company)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }} />
            
            <FormField control={form.control as any} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Status</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Active" className="text-[12px] font-medium">Active</SelectItem>
                    <SelectItem value="Inactive" className="text-[12px] font-medium">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold shadow-sm">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : isEdit ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
