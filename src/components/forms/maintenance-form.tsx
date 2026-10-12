"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, MapPin, Wrench, FileCheck, IndianRupee } from "lucide-react";

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
import { maintenanceSchema, MaintenanceFormValues } from "@/validators/maintenance.validator";
import { IMaintenanceRequestDocument } from "@/models/MaintenanceRequest";
import { useProperties } from "@/hooks/use-properties";
import { useUnits } from "@/hooks/use-units";

interface MaintenanceFormProps {
  initialData?: IMaintenanceRequestDocument;
  isEdit?: boolean;
}

export function MaintenanceForm({ initialData, isEdit }: MaintenanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { data: properties = [], isLoading: isLoadingProperties } = useProperties({ page: 1, limit: 1000 });

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema) as any,
    defaultValues: {
      propertyId: initialData?.propertyId?._id?.toString() || initialData?.propertyId?.toString() || "",
      unitId: initialData?.unitId?._id?.toString() || initialData?.unitId?.toString() || "",
      tenantId: initialData?.tenantId?._id?.toString() || initialData?.tenantId?.toString() || "",
      reportedBy: initialData?.reportedBy as any || "Tenant",
      category: initialData?.category as any || "Other",
      priority: initialData?.priority as any || "Medium",
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status as any || "Open",
      assignedTo: initialData?.assignedTo || "",
      scheduledDate: initialData?.scheduledDate 
        ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
        : "",
      costEstimate: initialData?.costEstimate || 0,
      actualCost: initialData?.actualCost || 0,
      paidBy: initialData?.paidBy as any || "",
      notes: initialData?.notes || "",
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  
  const { data: units = [], isLoading: isLoadingUnits } = useUnits({ 
    page: 1, 
    limit: 1000, 
    propertyId: selectedPropertyId || undefined 
  });

  const handleUnitChange = (unitId: string | null) => {
    if (!unitId) return;
    form.setValue("unitId", unitId);
    
    const unit = units.find(u => u._id.toString() === unitId);
    if (unit && unit.currentTenantId) {
      const tenant = unit.currentTenantId as any;
      form.setValue("tenantId", tenant._id || tenant);
    } else {
      form.setValue("tenantId", "");
    }
  };

  async function onSubmit(data: MaintenanceFormValues) {
    setIsLoading(true);
    try {
      const url = isEdit 
        ? `/api/maintenance/${initialData?._id}` 
        : "/api/maintenance";
        
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Ticket updated successfully!" : "Ticket created successfully!");
      router.push("/maintenance");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Location & Issue */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><MapPin className="h-4 w-4 text-red-500" />Location Details</div>
            
            <FormField control={form.control} name="propertyId" render={({ field }) => {
              const initProp = initialData?.propertyId as any;
              const selectedProp = properties.find((p) => p._id.toString() === field.value) ||
                (initProp && typeof initProp === 'object' ? initProp : null);
              const propLabel = selectedProp?.propertyName || (field.value ? "Loading..." : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Property *</FormLabel>
                  <Select disabled={isLoadingProperties || isEdit || isLoading} onValueChange={(val) => { field.onChange(val); form.setValue("unitId", ""); form.setValue("tenantId", ""); }} value={field.value}>
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
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="unitId" render={({ field }) => {
                const initUnit = initialData?.unitId as any;
                const selectedUnit = units.find((u) => u._id.toString() === field.value) ||
                  (initUnit && typeof initUnit === 'object' ? initUnit : null);
                const unitLabel = selectedUnit ? `Unit ${selectedUnit.unitNumber}` : (field.value ? "Loading..." : undefined);

                return (
                  <FormItem>
                    <FormLabel className={labelClasses}>Unit *</FormLabel>
                    <Select disabled={isLoadingUnits || isEdit || !selectedPropertyId || isLoading} onValueChange={handleUnitChange} value={field.value}>
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
              
              <FormField control={form.control} name="reportedBy" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Reported By</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Tenant" className="text-[12px] font-medium">Tenant</SelectItem>
                      <SelectItem value="Manager" className="text-[12px] font-medium">Manager</SelectItem>
                      <SelectItem value="Owner" className="text-[12px] font-medium">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <div className={`${sectionTitleClasses} mt-6`}><Wrench className="h-4 w-4 text-orange-500" />Issue Information</div>

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Ticket Title *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="E.g., Leaking sink" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Category *</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Plumbing" className="text-[12px] font-medium">Plumbing</SelectItem>
                      <SelectItem value="Electrical" className="text-[12px] font-medium">Electrical</SelectItem>
                      <SelectItem value="Carpentry" className="text-[12px] font-medium">Carpentry</SelectItem>
                      <SelectItem value="Cleaning" className="text-[12px] font-medium">Cleaning</SelectItem>
                      <SelectItem value="Other" className="text-[12px] font-medium">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Priority *</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Priority" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Low" className="text-[12px] font-medium">Low</SelectItem>
                      <SelectItem value="Medium" className="text-[12px] font-medium">Medium</SelectItem>
                      <SelectItem value="High" className="text-[12px] font-medium">High</SelectItem>
                      <SelectItem value="Emergency" className="text-[12px] font-medium">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Detailed Description *</FormLabel><FormControl><Textarea disabled={isLoading} placeholder="Describe the issue..." className={`${inputClasses} h-[76px] pt-2 resize-none`} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 2: Status & Assignment */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><FileCheck className="h-4 w-4 text-emerald-500" />Assignment & Status</div>
            
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Ticket Status</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Open" className="text-[12px] font-medium">Open</SelectItem>
                    <SelectItem value="In Progress" className="text-[12px] font-medium">In Progress</SelectItem>
                    <SelectItem value="On Hold" className="text-[12px] font-medium">On Hold</SelectItem>
                    <SelectItem value="Resolved" className="text-[12px] font-medium">Resolved</SelectItem>
                    <SelectItem value="Closed" className="text-[12px] font-medium">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="assignedTo" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Assigned To</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="Vendor name" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="scheduledDate" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Scheduled Date</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} type="date" {...field} value={field.value || ""} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 3: Financials & Notes */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><IndianRupee className="h-4 w-4 text-blue-500" />Financials & Notes</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="costEstimate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Cost Estimate</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[12px] font-extrabold text-slate-400">₹</span>
                      <Input type="number" disabled={isLoading} className={`${inputClasses} pl-7`} min={0} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="actualCost" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Actual Cost</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-[12px] font-extrabold text-slate-400">₹</span>
                      <Input type="number" disabled={isLoading} className={`${inputClasses} pl-7`} min={0} {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="paidBy" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Paid By</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue placeholder="Who pays?" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Owner" className="text-[12px] font-medium">Owner</SelectItem>
                    <SelectItem value="Tenant" className="text-[12px] font-medium">Tenant</SelectItem>
                    <SelectItem value="Split" className="text-[12px] font-medium">Split</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem className="pt-2"><FormLabel className={labelClasses}>Internal Notes</FormLabel><FormControl><Textarea disabled={isLoading} placeholder="Any private notes..." className={`${inputClasses} h-[130px] pt-2 resize-none`} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#EF4444] to-[#B91C1C] text-white hover:from-red-600 hover:to-red-700 rounded-lg shadow-[0_4px_12px_rgba(239,68,68,0.25)] border border-red-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Ticket"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
