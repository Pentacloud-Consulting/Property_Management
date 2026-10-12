/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, User, Building, MapPin, FileText, CheckCircle2 } from "lucide-react";

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
import { accountSchema } from "@/validators/account.validator";

export function AccountForm({ initialData, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();

  const primaryContact = initialData?.contacts?.find((c: any) => c.isPrimary) || initialData?.contacts?.[0];
  const initialFirstName = initialData?.accountType === 'Company'
    ? (primaryContact?.firstName || "")
    : (initialData?.accountName ? initialData.accountName.split(' ')[0] : "");
  const initialLastName = initialData?.accountType === 'Company'
    ? (primaryContact?.lastName || "")
    : (initialData?.accountName ? initialData.accountName.split(' ').slice(1).join(' ') : "");

  const form = useForm<any>({
    resolver: zodResolver(accountSchema) as any,
    defaultValues: {
      accountName: initialData?.accountName || "",
      accountType: initialData?.accountType || "Individual",
      phone: initialData?.phone || primaryContact?.mobileNumber || "",
      email: initialData?.email || primaryContact?.email || "",
      PAN: initialData?.PAN || "",
      GSTIN: initialData?.GSTIN || "",
      address: {
        line1: initialData?.address?.line1 || "",
        line2: initialData?.address?.line2 || "",
        city: initialData?.address?.city || "",
        state: initialData?.address?.state || "",
        pincode: initialData?.address?.pincode || "",
      },
      bankDetails: {
        accountHolder: initialData?.bankDetails?.accountHolder || "",
        bankName: initialData?.bankDetails?.bankName || "",
        accountNumber: initialData?.bankDetails?.accountNumber || "",
        IFSC: initialData?.bankDetails?.IFSC || "",
        UPI_id: initialData?.bankDetails?.UPI_id || "",
      },
      servicesOpted: initialData?.servicesOpted || [],
      managementFeeType: initialData?.managementFeeType || "Percentage",
      managementFeeValue: initialData?.managementFeeValue || "",
      agreementStartDate: initialData?.agreementStartDate ? new Date(initialData.agreementStartDate).toISOString().split('T')[0] : "",
      agreementEndDate: initialData?.agreementEndDate ? new Date(initialData.agreementEndDate).toISOString().split('T')[0] : "",
      status: initialData?.status || "Active",
      notes: initialData?.notes || "",
      // Contact fields
      contact: {
        firstName: initialFirstName,
        lastName: initialLastName,
        mobileNumber: primaryContact?.mobileNumber || initialData?.phone || "",
        email: primaryContact?.email || initialData?.email || "",
      },
      // First Property (only for Create)
      property: {
        propertyName: "",
        propertyType: "Apartment",
        address: {
          line1: "",
          line2: "",
          locality: "",
          city: "",
          state: "",
          pincode: "",
        },
        builtUpArea: "",
        totalFloors: "",
        parkingSlots: "",
      }
    },
  });

  const isLoading = form.formState.isSubmitting;
  const accountType = useWatch({ control: form.control, name: "accountType" });
  const phone = useWatch({ control: form.control, name: "phone" });
  const email = useWatch({ control: form.control, name: "email" });

  const firstName = useWatch({ control: form.control, name: "contact.firstName" });
  const lastName = useWatch({ control: form.control, name: "contact.lastName" });

  useEffect(() => {
    if (accountType !== 'Company') {
      const full = `${firstName || ''} ${lastName || ''}`.trim();
      if (full && full !== form.getValues('accountName')) {
        form.setValue('accountName', full, { shouldValidate: !!full });
      }
    }
    
    form.setValue("contact.mobileNumber", phone || "");
    form.setValue("contact.email", email || "");
  }, [accountType, firstName, lastName, phone, email, form]);

  async function onSubmit(data: any) {
    try {
      // Ensure contact phone and email match account phone/email
      if (data.contact) {
        data.contact.mobileNumber = data.phone || data.contact.mobileNumber;
        data.contact.email = data.email || data.contact.email;
        data.contact.contactType = "Property Owner";
      }

      // If creating and property address is filled while account address is not, inherit it
      if (!isEdit && data.property?.address?.city && (!data.address?.city || !data.address?.line1)) {
        data.address = {
          line1: data.property.address.line1 || "",
          line2: data.property.address.line2 || "",
          city: data.property.address.city || "",
          state: data.property.address.state || "",
          pincode: data.property.address.pincode || "",
        };
      }

      const url = isEdit && initialData ? `/api/accounts/${initialData._id}` : "/api/accounts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Something went wrong");

      toast.success(isEdit ? "Account updated successfully" : "Account created successfully");
      router.push(isEdit && initialData ? `/accounts/${initialData._id}` : "/accounts");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save account");
    }
  }

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Col 1: Core Information & Primary Contact */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}>
              <User className="h-4 w-4 text-indigo-500" />
              Core Information
            </div>
            
            <FormField control={form.control as any} name="accountType" render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClasses}>Account Type *</FormLabel>
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Individual" className="text-[12px] font-medium">Individual</SelectItem>
                    <SelectItem value="Company" className="text-[12px] font-medium">Company</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )} />

            {accountType === 'Company' ? (
              <FormField control={form.control as any} name="accountName" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Company Name *</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="e.g. Acme Properties Ltd" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control as any} name="contact.firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>First Name *</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="First name" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control as any} name="contact.lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Last Name</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Last name" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>
            )}

            {accountType === 'Company' ? (
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control as any} name="PAN" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Company PAN *</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="e.g. ABCDE1234F" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control as any} name="GSTIN" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>GSTIN</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="GST Number" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>
            ) : (
              <FormField control={form.control as any} name="PAN" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>PAN Number</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="e.g. ABCDE1234F" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            )}

            {/* Primary Contact Details for Company (Visible in both Create and Edit) */}
            {accountType === 'Company' && (
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[12px] font-bold text-emerald-600 mb-3 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Primary Contact Person
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <FormField control={form.control as any} name="contact.firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Contact First Name *</FormLabel>
                      <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="First name" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="contact.lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Contact Last Name</FormLabel>
                      <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Last name" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <FormField control={form.control as any} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>{accountType === 'Company' ? 'Contact Phone *' : 'Primary Phone *'}</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="10-digit mobile" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              <FormField control={form.control as any} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>{accountType === 'Company' ? 'Contact Email' : 'Email Address'}</FormLabel>
                  <FormControl><Input type="email" disabled={isLoading} className={inputClasses} {...field} placeholder="name@domain.com" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Col 2: Contextual Right Column */}
          {isEdit ? (
            /* EDIT MODE: Address, Status & Notes */
            <div className="space-y-4">
              <div className={sectionTitleClasses}>
                <MapPin className="h-4 w-4 text-indigo-500" />
                Address & Location
              </div>

              <FormField control={form.control as any} name="address.line1" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Address Line 1</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Street address, building, suite" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              <FormField control={form.control as any} name="address.line2" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Address Line 2 (Optional)</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Area, landmark" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              <div className="grid grid-cols-3 gap-3">
                <FormField control={form.control as any} name="address.city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>City</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="City" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control as any} name="address.state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>State</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="State" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control as any} name="address.pincode" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Pincode</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Pincode" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className={sectionTitleClasses}>
                  <FileText className="h-4 w-4 text-indigo-500" />
                  Status & Notes
                </div>

                <FormField control={form.control as any} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Account Status</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Active" className="text-[12px] font-medium">Active</SelectItem>
                        <SelectItem value="Inactive" className="text-[12px] font-medium">Inactive</SelectItem>
                        <SelectItem value="On Hold" className="text-[12px] font-medium">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                <FormField control={form.control as any} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Notes</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Additional notes or reference details..." /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>
            </div>
          ) : (
            /* CREATE MODE: First Property Onboarding */
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 h-fit space-y-4">
              <div className={sectionTitleClasses}>
                <Building className="h-4 w-4 text-blue-500" />
                First Property (Optional)
              </div>
              
              <FormField control={form.control as any} name="property.propertyName" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Property Name</FormLabel>
                  <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="e.g. Pentacloud Heights" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              <FormField control={form.control as any} name="property.propertyType" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Property Type</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Apartment" className="text-[12px] font-medium">Apartment</SelectItem>
                      <SelectItem value="Villa" className="text-[12px] font-medium">Villa</SelectItem>
                      <SelectItem value="Independent House" className="text-[12px] font-medium">Independent House</SelectItem>
                      <SelectItem value="Commercial" className="text-[12px] font-medium">Commercial</SelectItem>
                      <SelectItem value="Plot" className="text-[12px] font-medium">Plot</SelectItem>
                      <SelectItem value="PG" className="text-[12px] font-medium">PG</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              <div className="space-y-3 pt-2">
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Address & Location</p>
                <FormField control={form.control as any} name="property.address.line1" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClasses}>Address Line 1</FormLabel>
                    <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Street address / building" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <div className="grid grid-cols-3 gap-3">
                  <FormField control={form.control as any} name="property.address.city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>City</FormLabel>
                      <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="City" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="property.address.state" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>State</FormLabel>
                      <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="State" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control as any} name="property.address.pincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClasses}>Pincode</FormLabel>
                      <FormControl><Input disabled={isLoading} className={inputClasses} {...field} placeholder="Pincode" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#4F46E5] to-[#4338CA] text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-[0_4px_12px_rgba(79,70,229,0.25)] border border-indigo-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Account" : "Create Account & Onboard"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
