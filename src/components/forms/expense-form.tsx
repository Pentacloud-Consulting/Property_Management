"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, MapPin, IndianRupee, FileText } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { expenseSchema, ExpenseFormValues } from "@/validators/expense.validator";
import { IPropertyExpenseDocument } from "@/models/PropertyExpense";
import { useProperties } from "@/hooks/use-properties";
import { useUnits } from "@/hooks/use-units";

interface ExpenseFormProps {
  initialData?: IPropertyExpenseDocument;
  isEdit?: boolean;
}

export function ExpenseForm({ initialData, isEdit }: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { data: properties = [], isLoading: isLoadingProperties } = useProperties({ page: 1, limit: 1000 });

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      propertyId: initialData?.propertyId?._id?.toString() || initialData?.propertyId?.toString() || "",
      unitId: initialData?.unitId?._id?.toString() || initialData?.unitId?.toString() || "",
      category: initialData?.category as any || "Repairs",
      amount: initialData?.amount || 0,
      date: initialData?.date 
        ? format(new Date(initialData.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      paidDate: initialData?.paidDate 
        ? format(new Date(initialData.paidDate), "yyyy-MM-dd")
        : "",
      paidTo: initialData?.paidTo || "",
      paymentMethod: initialData?.paymentMethod || "",
      referenceNumber: initialData?.referenceNumber || "",
      billUrl: initialData?.billUrl || "",
      approvedBy: initialData?.approvedBy || "",
      status: initialData?.status as any || "Pending",
      notes: initialData?.notes || "",
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  
  const { data: units = [], isLoading: isLoadingUnits } = useUnits({ 
    page: 1, 
    limit: 1000, 
    propertyId: selectedPropertyId || undefined 
  });

  async function onSubmit(data: ExpenseFormValues) {
    setIsLoading(true);
    try {
      const url = isEdit 
        ? `/api/expenses/${initialData?._id}` 
        : "/api/expenses";
        
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Expense updated successfully!" : "Expense recorded successfully!");
      router.push("/expenses");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Location & Category */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><MapPin className="h-4 w-4 text-emerald-500" />Location Details</div>
            
            <FormField control={form.control} name="propertyId" render={({ field }) => {
              const initProp = initialData?.propertyId as any;
              const selectedProp = properties.find((p) => p._id.toString() === field.value) ||
                (initProp && typeof initProp === 'object' ? initProp : null);
              const propLabel = selectedProp?.propertyName || (field.value ? "Loading..." : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Property *</FormLabel>
                  <Select disabled={isLoadingProperties || isEdit || isLoading} onValueChange={(val) => { field.onChange(val); form.setValue("unitId", ""); }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder={isLoadingProperties ? "Loading..." : "Select Property"}>
                          {propLabel}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property._id.toString()} value={property._id.toString()} className="text-[12px] font-medium">{property.propertyName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }} />
            
            <FormField control={form.control} name="unitId" render={({ field }) => {
              const initUnit = initialData?.unitId as any;
              const selectedUnit = units.find((u) => u._id.toString() === field.value) ||
                (initUnit && typeof initUnit === 'object' ? initUnit : null);
              const unitLabel = selectedUnit ? `Unit ${selectedUnit.unitNumber}` : (field.value ? "Loading..." : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Unit (Optional)</FormLabel>
                  <Select disabled={isLoadingUnits || !selectedPropertyId || isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder={!selectedPropertyId ? "N/A" : "Unit"}>
                          {unitLabel}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map((unit) => <SelectItem key={unit._id.toString()} value={unit._id.toString()} className="text-[12px] font-medium">Unit {unit.unitNumber}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }} />

            <div className={`${sectionTitleClasses} mt-6`}><IndianRupee className="h-4 w-4 text-amber-500" />Expense Info</div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Category *</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Repairs" className="text-[12px] font-medium">Repairs</SelectItem>
                      <SelectItem value="Taxes" className="text-[12px] font-medium">Taxes</SelectItem>
                      <SelectItem value="Insurance" className="text-[12px] font-medium">Insurance</SelectItem>
                      <SelectItem value="Utilities" className="text-[12px] font-medium">Utilities</SelectItem>
                      <SelectItem value="Salary" className="text-[12px] font-medium">Salary</SelectItem>
                      <SelectItem value="Other" className="text-[12px] font-medium">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[12px] font-extrabold text-slate-400">₹</span>
                      <Input disabled={isLoading} type="number" className={`${inputClasses} pl-7`} min={1} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Expense Date *</FormLabel><FormControl><Input disabled={isLoading} type="date" className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Status *</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Pending" className="text-[12px] font-medium">Pending</SelectItem>
                      <SelectItem value="Paid" className="text-[12px] font-medium">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Col 2: Vendor & Payment */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><FileText className="h-4 w-4 text-blue-500" />Vendor & Payment</div>
            
            <FormField control={form.control} name="paidTo" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Paid To (Vendor/Person)</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="Vendor Name" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="paidDate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Paid Date</FormLabel><FormControl><Input disabled={isLoading} type="date" className={inputClasses} {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Payment Method</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="E.g., Transfer" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="referenceNumber" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Reference / Invoice #</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="INV-12345" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <FormField control={form.control} name="approvedBy" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Approved By</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="Manager Name" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 3: Documentation & Notes */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><FileText className="h-4 w-4 text-indigo-500" />Documentation & Notes</div>
            
            <FormField control={form.control} name="billUrl" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Bill / Receipt URL</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="https://..." {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem className="pt-2"><FormLabel className={labelClasses}>Additional Notes</FormLabel><FormControl><Textarea disabled={isLoading} placeholder="Any details..." className={`${inputClasses} h-[166px] pt-2 resize-none`} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-white hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-[0_4px_12px_rgba(245,158,11,0.25)] border border-amber-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Record Expense"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
