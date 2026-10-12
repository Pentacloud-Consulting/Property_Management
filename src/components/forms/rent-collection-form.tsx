"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, UserCheck, Receipt, Wallet, Banknote } from "lucide-react";
import { format } from "date-fns";

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
import { rentCollectionSchema, RentCollectionFormValues } from "@/validators/rent-collection.validator";
import { IRentCollectionDocument } from "@/models/RentCollection";
import { useTenants } from "@/hooks/use-tenants";

interface RentCollectionFormProps {
  initialData?: IRentCollectionDocument;
  isEdit?: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export function RentCollectionForm({ initialData, isEdit }: RentCollectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenants({ page: 1, limit: 1000, status: "Active" });

  const form = useForm<RentCollectionFormValues>({
    resolver: zodResolver(rentCollectionSchema) as any,
    defaultValues: {
      tenantId: initialData?.tenantId?._id?.toString() || initialData?.tenantId?.toString() || "",
      unitId: initialData?.unitId?._id?.toString() || initialData?.unitId?.toString() || "",
      propertyId: initialData?.propertyId?._id?.toString() || initialData?.propertyId?.toString() || "",
      amountDue: initialData?.amountDue || 0,
      amountPaid: initialData?.amountPaid || 0,
      lateFee: initialData?.lateFee || 0,
      dueDate: initialData?.dueDate 
        ? format(new Date(initialData.dueDate), "yyyy-MM-dd") 
        : format(new Date(), "yyyy-MM-dd"),
      paymentDate: initialData?.paymentDate 
        ? format(new Date(initialData.paymentDate), "yyyy-MM-dd") 
        : "",
      paymentMethod: initialData?.paymentMethod as any || "",
      transactionId: initialData?.transactionId || "",
      receiptUrl: initialData?.receiptUrl || "",
      status: initialData?.status as any || "Pending",
      month: initialData?.month || new Date().getMonth() + 1,
      year: initialData?.year || new Date().getFullYear(),
      notes: initialData?.notes || "",
    },
  });

  const selectedTenantId = form.watch("tenantId");
  
  const handleTenantChange = (tenantId: string | null) => {
    if (!tenantId) return;
    form.setValue("tenantId", tenantId);
    
    const tenant = tenants.find(t => t._id.toString() === tenantId);
    if (tenant) {
      const unit = tenant.unitId as any;
      const prop = tenant.propertyId as any;
      
      if (unit) form.setValue("unitId", unit._id || unit);
      if (prop) form.setValue("propertyId", prop._id || prop);
      if (unit && unit.rentAmount) form.setValue("amountDue", unit.rentAmount);
    }
  };

  async function onSubmit(data: RentCollectionFormValues) {
    setIsLoading(true);
    try {
      const url = isEdit 
        ? `/api/rent-collection/${initialData?._id}` 
        : "/api/rent-collection";
        
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Record updated successfully!" : "Record created successfully!");
      router.push("/rent-collection");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Tenant & Billing */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><UserCheck className="h-4 w-4 text-blue-500" />Tenant & Billing Period</div>
            
            <FormField control={form.control} name="tenantId" render={({ field }) => {
              const selectedTenant = tenants.find((t: any) => t._id?.toString() === field.value) ||
                (initialData?.tenantId && typeof initialData.tenantId === 'object' ? initialData.tenantId : null);
              const st = selectedTenant as any;
              const tenantLabel = st 
                ? `${st.contactId?.firstName || st.name || "Tenant"} ${st.contactId?.lastName || ""}`.trim()
                : (field.value ? "Loading..." : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Tenant *</FormLabel>
                  <Select disabled={isLoadingTenants || isEdit || isLoading} onValueChange={handleTenantChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder={isLoadingTenants ? "Loading..." : "Select Tenant"}>
                          {tenantLabel}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants.map((tenant: any) => (
                        <SelectItem key={tenant._id.toString()} value={tenant._id.toString()} className="text-[12px] font-medium">
                          {tenant.contactId?.firstName || "Tenant"} {tenant.contactId?.lastName || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="month" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Month *</FormLabel>
                  <Select disabled={isLoading} onValueChange={(val) => field.onChange(parseInt(val || "0"))} defaultValue={field.value.toString()}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Month" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {MONTHS.map((m, i) => <SelectItem key={i} value={(i + 1).toString()} className="text-[12px] font-medium">{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Year *</FormLabel><FormControl><Input type="number" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Due Date *</FormLabel><FormControl><Input type="date" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Payment Status *</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Pending" className="text-[12px] font-medium">Pending</SelectItem>
                    <SelectItem value="Partial" className="text-[12px] font-medium">Partial</SelectItem>
                    <SelectItem value="Paid" className="text-[12px] font-medium">Paid</SelectItem>
                    <SelectItem value="Overdue" className="text-[12px] font-medium">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
          </div>

          {/* Col 2: Financial Details */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Receipt className="h-4 w-4 text-emerald-500" />Financial Details</div>
            
            <FormField control={form.control} name="amountDue" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Amount Due *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] font-extrabold text-slate-400">₹</span>
                    <Input type="number" className={`${inputClasses} pl-7`} disabled={isLoading} min={1} {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="lateFee" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Late Fee</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] font-extrabold text-slate-400">₹</span>
                    <Input type="number" className={`${inputClasses} pl-7`} disabled={isLoading} min={0} {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="amountPaid" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Amount Paid</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[12px] font-extrabold text-emerald-500">₹</span>
                    <Input type="number" className={`${inputClasses} pl-7 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/10`} disabled={isLoading} min={0} {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />
          </div>
          
          {/* Col 3: Payment Information */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Banknote className="h-4 w-4 text-indigo-500" />Payment Information</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="paymentDate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Payment Date</FormLabel><FormControl><Input type="date" disabled={isLoading} className={inputClasses} {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Method</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Method" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Bank Transfer" className="text-[12px] font-medium">Bank Transfer</SelectItem>
                      <SelectItem value="UPI" className="text-[12px] font-medium">UPI</SelectItem>
                      <SelectItem value="Online" className="text-[12px] font-medium">Online</SelectItem>
                      <SelectItem value="Cheque" className="text-[12px] font-medium">Cheque</SelectItem>
                      <SelectItem value="Cash" className="text-[12px] font-medium">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="transactionId" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Transaction ID</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="TXN123456" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="receiptUrl" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Receipt URL</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="https://..." {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading || (!selectedTenantId && !isEdit)} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#1E5EFF] to-[#1442C4] text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-[0_4px_12px_rgba(30,94,255,0.25)] border border-blue-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Record Rent"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
