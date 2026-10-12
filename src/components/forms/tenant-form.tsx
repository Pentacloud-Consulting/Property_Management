"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, UserPlus, FileSignature, Wallet, ShieldCheck, Camera, FileText, X, UploadCloud } from "lucide-react";
import useSWR from "swr";
import { z } from "zod";

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
import { tenantSchema } from "@/validators/tenant.validator";
import { ITenantDocument } from "@/models/Tenant";

// We extend the schema for the form to include personal details directly
const localTenantSchema = z.object({
  ...tenantSchema.shape,
  contactId: z.string().optional(), // Will be created automatically
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  mobileNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  maintenanceAmount: z.coerce.number().min(0).optional().default(0),
});

type LocalTenantFormValues = z.infer<typeof localTenantSchema>;

export function TenantForm({ initialData, isEdit = false }: { initialData?: ITenantDocument, isEdit?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUnitId = searchParams.get("unitId");
  
  const { data: unitsRes } = useSWR("/api/units?limit=100", (url: string) => fetch(url).then(r => r.json()));
  const units = unitsRes?.data || [];
  
  // Document uploads state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState<string>("KYC Verification");
  const [documents, setDocuments] = useState<{ url: string; publicId: string; name: string; type: string; file?: File }[]>(
    initialData?.documents?.map((d: any) => ({
      url: d.url,
      publicId: d.publicId,
      name: d.name || "Document",
      type: d.type || "KYC"
    })) || []
  );

  const contactObj = initialData?.contactId as any;

  const form = useForm<LocalTenantFormValues>({
    resolver: zodResolver(localTenantSchema) as any,
    defaultValues: {
      propertyId: initialData?.propertyId?._id?.toString() || initialData?.propertyId?.toString() || "",
      unitId: initialData?.unitId?._id?.toString() || initialData?.unitId?.toString() || defaultUnitId || "",
      contactId: contactObj?._id?.toString() || "",
      firstName: contactObj?.firstName || "",
      lastName: contactObj?.lastName || "",
      mobileNumber: contactObj?.mobileNumber || "",
      email: contactObj?.email || "",
      leaseStartDate: initialData?.leaseStartDate 
        ? new Date(initialData.leaseStartDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      leaseEndDate: initialData?.leaseEndDate 
        ? new Date(initialData.leaseEndDate).toISOString().split('T')[0] 
        : "",
      rentAmount: initialData?.rentAmount || 0,
      securityDeposit: initialData?.securityDeposit || 0,
      maintenanceAmount: 0,
      rentPaymentCycle: initialData?.rentPaymentCycle as any || "Monthly",
      rentDueDate: initialData?.rentDueDate || "",
      policeVerificationStatus: initialData?.policeVerificationStatus as any || "Pending",
      status: initialData?.status as any || "Active",
      notes: initialData?.notes || "",
    },
  });

  const triggerUpload = (category: string) => {
    setUploadCategory(category);
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newDocs = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      publicId: `local-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: uploadCategory,
      file,
    }));
    
    setDocuments([...documents, ...newDocs]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeDocument = (index: number) => {
    setDocuments(docs => docs.filter((_, i) => i !== index));
  };

  async function onSubmit(data: LocalTenantFormValues) {
    setIsLoading(true);
    try {
      // 1. Process files (fallback to Base64)
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const uploadedDocs: any[] = [];
      for (const doc of documents) {
        if (doc.file) {
          const base64Str = await fileToBase64(doc.file);
          uploadedDocs.push({
            url: base64Str,
            publicId: doc.publicId,
            name: doc.name,
            type: doc.type,
          });
        } else {
          uploadedDocs.push(doc);
        }
      }

      // 2. Create or Update Contact automatically
      let contactId = data.contactId;
      if (!isEdit || !contactId) {
        const contactData = {
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          email: data.email,
          contactType: "Tenant", // Automatically classify as Tenant
        };
        const contactRes = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });
        const contactResult = await contactRes.json();
        if (!contactRes.ok) throw new Error(contactResult.error || "Failed to create contact");
        contactId = contactResult.data._id;
      }

      // 3. Create or Update Tenant
      const tenantPayload = {
        ...data,
        contactId: contactId,
        documents: uploadedDocs,
      };

      const url = isEdit ? `/api/tenants/${initialData?._id}` : "/api/tenants";
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenantPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Tenant updated successfully!" : "Tenant created successfully!");
      router.push(`/tenants/${result.data._id}`);
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

  const selectedUnitId = form.watch("unitId");
  const selectedUnitObj = units.find((u: any) => u._id === selectedUnitId);
  const selectedPropObj = selectedUnitObj?.propertyId;
  const coverImage = selectedPropObj?.media?.[selectedPropObj?.coverImageIndex || 0]?.url || selectedPropObj?.media?.[0]?.url;

  const selectedPropertyId = form.watch("propertyId");
  const filteredUnits = units.filter((u: any) => {
    const pId = u.propertyId?._id || u.propertyId;
    return pId === selectedPropertyId;
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Placement & Personal Details */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><UserPlus className="h-4 w-4 text-emerald-500" />Placement & Profile</div>
            
            <FormField control={form.control} name="propertyId" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Property *</FormLabel>
                <Select disabled={!units.length || (!!defaultUnitId && !isEdit) || isLoading} onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("unitId", "");
                  form.setValue("rentAmount", 0);
                  form.setValue("securityDeposit", 0);
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select Property">
                        {field.value 
                          ? (units.find((x:any) => (x.propertyId?._id?.toString() || x.propertyId?.toString()) === field.value)?.propertyId?.propertyName || ((initialData?.propertyId as any)?.propertyName || "Loading..."))
                          : "Select Property"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(new Set(units.map((u:any) => u.propertyId?._id?.toString() || u.propertyId?.toString() || ""))).filter(Boolean).map((pidStr: any) => {
                      const u = units.find((x:any) => (x.propertyId?._id?.toString() || x.propertyId?.toString()) === pidStr);
                      const propName = u?.propertyId?.propertyName || "Property";
                      return <SelectItem key={pidStr} value={pidStr} className="text-[12px] font-medium">{propName}</SelectItem>
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="unitId" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Unit *</FormLabel>
                <Select disabled={!units.length || (!!defaultUnitId && !isEdit) || isLoading} onValueChange={(val) => {
                  field.onChange(val);
                  const selectedUnit = units.find((u: any) => u._id === val);
                  if (selectedUnit) {
                    form.setValue("rentAmount", selectedUnit.rentAmount || 0);
                    form.setValue("securityDeposit", selectedUnit.securityDeposit || 0);
                  }
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select Unit">
                        {field.value 
                          ? (() => {
                              const u = units.find((x:any) => x._id === field.value);
                              return u ? `Unit ${u.unitNumber}${u.unitType ? ` — ${u.unitType}` : ''}` : ((initialData?.unitId as any)?.unitNumber ? `Unit ${(initialData?.unitId as any)?.unitNumber}` : "Loading...");
                            })()
                          : "Select Unit"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[320px] w-full max-w-[90vw]">
                    {filteredUnits.map((u: any) => {
                      const unitIdStr = u._id?.toString();
                      return (
                      <SelectItem key={unitIdStr} value={unitIdStr} className="text-[12px] font-medium py-2.5 h-auto items-start [&_[data-slot=select-item]]:h-auto [&_[data-slot=select-item-text]]:whitespace-normal">
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span className="font-bold text-slate-800 leading-none">Unit {u.unitNumber} {u.unitType ? `— ${u.unitType}` : ''}</span>
                          <span className="text-[10.5px] text-slate-500 font-medium leading-tight whitespace-normal">
                            Rent: ₹{u.rentAmount?.toLocaleString() || 0} • Dep: ₹{u.securityDeposit?.toLocaleString() || 0} {u.floorNumber ? `• Floor: ${u.floorNumber}` : ''}
                          </span>
                        </div>
                      </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            {coverImage && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="Property Cover" className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>First Name *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Last Name</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="mobileNumber" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Phone Number *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Email Address</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className={`${sectionTitleClasses} mt-6`}><FileSignature className="h-4 w-4 text-indigo-500" />Lease Details</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="leaseStartDate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Move-In Date *</FormLabel><FormControl><Input type="date" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="leaseEndDate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Lease Expiry</FormLabel><FormControl><Input type="date" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>
          </div>

          {/* Col 2: Financials & Admin */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Wallet className="h-4 w-4 text-amber-500" />Financials</div>
            
            <FormField control={form.control} name="rentAmount" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Monthly Rent (₹) *</FormLabel><FormControl><Input type="number" min={0} disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="securityDeposit" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Advance Deposit (₹)</FormLabel><FormControl><Input type="number" min={0} disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <FormField control={form.control} name="maintenanceAmount" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Maintenance Charges (₹)</FormLabel><FormControl><Input type="number" min={0} disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="rentPaymentCycle" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Payment Cycle</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Monthly" className="text-[12px] font-medium">Monthly</SelectItem>
                      <SelectItem value="Quarterly" className="text-[12px] font-medium">Quarterly</SelectItem>
                      <SelectItem value="Annually" className="text-[12px] font-medium">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control} name="rentDueDate" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Rent Due Date</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} placeholder="e.g. 5th" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <div className={`${sectionTitleClasses} mt-6`}><ShieldCheck className="h-4 w-4 text-blue-500" />Administration</div>
            
            <div className="grid grid-cols-1 gap-3">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Tenant Status</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Active" className="text-[12px] font-medium">Active</SelectItem>
                      <SelectItem value="Notice" className="text-[12px] font-medium">Notice Period</SelectItem>
                      <SelectItem value="Past" className="text-[12px] font-medium">Past Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem className="pt-2"><FormLabel className={labelClasses}>Notes</FormLabel><FormControl><Textarea className={`${inputClasses} resize-none h-[60px] pt-2`} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 3: Document Storage */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><FileText className="h-4 w-4 text-violet-500" />Document Storage</div>
            
            <div className="flex flex-col gap-4">
              {/* KYC */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-slate-800">KYC Verification (Aadhaar/PAN)</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => triggerUpload("KYC Verification")} className="h-7 text-[10px]">
                    <UploadCloud className="h-3 w-3 mr-1" /> Upload
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {documents.filter(d => d.type === "KYC Verification").map((doc, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-md border bg-slate-50 overflow-hidden">
                      {doc.url.startsWith("data:image") || doc.url.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FileText className="h-6 w-6 text-slate-400" /></div>
                      )}
                      <button type="button" onClick={() => removeDocument(documents.indexOf(doc))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {documents.filter(d => d.type === "KYC Verification").length === 0 && <p className="text-[10px] text-slate-400">No documents uploaded.</p>}
                </div>
              </div>

              {/* Agreement */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-slate-800">Rental Agreement</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => triggerUpload("Rental Agreement")} className="h-7 text-[10px]">
                    <UploadCloud className="h-3 w-3 mr-1" /> Upload
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {documents.filter(d => d.type === "Rental Agreement").map((doc, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-md border bg-slate-50 overflow-hidden">
                      {doc.url.startsWith("data:image") || doc.url.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FileText className="h-6 w-6 text-slate-400" /></div>
                      )}
                      <button type="button" onClick={() => removeDocument(documents.indexOf(doc))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {documents.filter(d => d.type === "Rental Agreement").length === 0 && <p className="text-[10px] text-slate-400">No documents uploaded.</p>}
                </div>
              </div>

              {/* Entry Photos & Videos */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-slate-800">Entry Photos & Videos</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => triggerUpload("Entry Photos")} className="h-7 text-[10px]">
                    <Camera className="h-3 w-3 mr-1" /> Upload
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {documents.filter(d => d.type === "Entry Photos").map((doc, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-md border bg-slate-50 overflow-hidden">
                      {doc.url.startsWith("data:image") || doc.url.startsWith("blob:") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FileText className="h-6 w-6 text-slate-400" /></div>
                      )}
                      <button type="button" onClick={() => removeDocument(documents.indexOf(doc))} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  {documents.filter(d => d.type === "Entry Photos").length === 0 && <p className="text-[10px] text-slate-400">No photos uploaded.</p>}
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#10B981] to-[#047857] text-white hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.25)] border border-emerald-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Tenant" : "Register Tenant"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
