"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, User, Home, TrendingUp } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { LEAD_SOURCES, LEAD_STATUSES, OWNER_TYPES, PROPERTY_TYPES, SERVICES } from "@/lib/constants";
import { leadSchema, LeadFormValues } from "@/validators/lead.validator";
import { ILeadDocument } from "@/models/Lead";

interface LeadFormProps {
  initialData?: ILeadDocument;
  isEdit?: boolean;
}

export function LeadForm({ initialData, isEdit = false }: LeadFormProps) {
  const router = useRouter();

  const form = useForm<any>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      leadName: initialData?.leadName || "",
      ownerType: (initialData?.ownerType as any) || "Individual",
      companyName: initialData?.companyName || "",
      mobileNumber: initialData?.mobileNumber || "",
      alternateMobile: initialData?.alternateMobile || "",
      email: initialData?.email || "",
      source: (initialData?.source as any) || "Other",
      status: (initialData?.status as any) || "New",
      city: initialData?.city || "",
      locality: initialData?.locality || "",
      propertyType: (initialData?.propertyType as any) || "",
      propertyName: initialData?.propertyName || "",
      state: initialData?.state || "",
      pincode: initialData?.pincode || "",
      servicesInterested: initialData?.servicesInterested || [],
      expectedStartDate: initialData?.expectedStartDate ? new Date(initialData.expectedStartDate).toISOString().split('T')[0] : "",
      nextFollowUpDate: initialData?.nextFollowUpDate ? new Date(initialData.nextFollowUpDate).toISOString().split('T')[0] : "",
      lostReason: initialData?.lostReason || "",
      notes: initialData?.notes || "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const ownerType = form.watch("ownerType");
  const status = form.watch("status");

  async function onSubmit(data: any) {
    try {
      const url = isEdit && initialData 
        ? `/api/leads/${initialData._id}` 
        : "/api/leads";
      
      const formattedData = { ...data };
      if (formattedData.propertyType === "") delete formattedData.propertyType;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Lead updated successfully" : "Lead created successfully");
      router.push("/leads");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save lead");
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Grid for Density */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Contact Info */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}>
              <User className="h-4 w-4 text-blue-500" />
              Contact Information
            </div>
            
            <FormField
              control={form.control}
              name="leadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Lead Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isLoading} className={inputClasses} {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="ownerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Owner Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OWNER_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="text-[12px] font-medium">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {ownerType === 'Company' ? (
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" disabled={isLoading} className={inputClasses} {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              ) : <div />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternateMobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Alt Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" disabled={isLoading} className={inputClasses} {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          {/* Column 2: Property Requirements */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}>
              <Home className="h-4 w-4 text-emerald-500" />
              Property & Requirements
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Property Type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROPERTY_TYPES.map((pt) => (
                          <SelectItem key={pt} value={pt} className="text-[12px] font-medium">{pt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Bangalore" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Locality</FormLabel>
                    <FormControl>
                      <Input placeholder="Indiranagar" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Karnataka" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="560001" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="servicesInterested"
              render={() => (
                <FormItem className="pt-1">
                  <FormLabel className={`${labelClasses} mb-2 block`}>Services Interested In</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICES.map((service) => (
                      <FormField
                        key={service}
                        control={form.control}
                        name="servicesInterested"
                        render={({ field }) => (
                          <FormItem key={service} className="flex flex-row items-center space-x-2 space-y-0 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <FormControl>
                              <Checkbox
                                className="w-3.5 h-3.5 rounded-[3px]"
                                checked={field.value?.includes(service)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), service])
                                    : field.onChange(field.value?.filter((value: string) => value !== service))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-[11px] font-bold text-slate-600 leading-none cursor-pointer truncate">{service}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          {/* Column 3: Pipeline Details */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}>
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Pipeline Details
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Source</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}><SelectValue placeholder="Source" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEAD_SOURCES.map((source) => (
                          <SelectItem key={source} value={source} className="text-[12px] font-medium">{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Status</FormLabel>
                    <Select disabled={isLoading || (isEdit && initialData?.status === "Converted")} onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}><SelectValue placeholder="Status" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEAD_STATUSES.filter(s => s !== "Converted" || (isEdit && initialData?.status === "Converted")).map((s) => (
                          <SelectItem key={s} value={s} className="text-[12px] font-medium">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="expectedStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextFollowUpDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Follow-Up</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {status === 'Unqualified' && (
              <FormField
                control={form.control}
                name="lostReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Reason for Unqualifying</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Too expensive" disabled={isLoading} className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>General Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information..." className={`${inputClasses} resize-none h-[116px] pt-2`} disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#1E5EFF] to-[#1442C4] text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-[0_4px_12px_rgba(30,94,255,0.25)] border border-blue-400/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Lead" : "Create Lead"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
