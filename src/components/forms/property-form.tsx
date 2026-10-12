"use client";

import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowRight, Building, MapPin, Layers, ImagePlus, Star, X, Camera } from "lucide-react";

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
import { propertySchema } from "@/validators/property.validator";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";

export function PropertyForm({ initialData, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  
  const { data: accountsRes } = useSWR("/api/accounts", (url: string) => fetch(url).then(r => r.json()));
  const accounts = accountsRes?.data || [];

  const form = useForm<any>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      propertyName: initialData?.propertyName || "",
      accountId: initialData?.accountId?._id || initialData?.accountId || "",
      primaryContactId: initialData?.primaryContactId?._id || initialData?.primaryContactId || "",
      propertyType: initialData?.propertyType || "Apartment",
      address: {
        line1: initialData?.address?.line1 || "",
        line2: initialData?.address?.line2 || "",
        landmark: initialData?.address?.landmark || "",
        locality: initialData?.address?.locality || "",
        city: initialData?.address?.city || "",
        state: initialData?.address?.state || "",
        pincode: initialData?.address?.pincode || "",
      },
      geoLocation: {
        lat: initialData?.geoLocation?.lat || "",
        lng: initialData?.geoLocation?.lng || "",
        googleMapsLink: initialData?.geoLocation?.googleMapsLink || "",
      },
      totalFloors: initialData?.totalFloors || "",
      builtUpArea: initialData?.builtUpArea || "",
      yearBuilt: initialData?.yearBuilt || "",
      amenities: initialData?.amenities || [],
      parkingSlots: initialData?.parkingSlots || "",
      ownershipType: initialData?.ownershipType || "",
      surveyNumber: initialData?.surveyNumber || "",
      taxAccountNumber: initialData?.taxAccountNumber || "",
      registrationNumber: initialData?.registrationNumber || "",
      status: initialData?.status || "Draft",
      notes: initialData?.notes || "",
      media: initialData?.media || [],
      coverImageIndex: initialData?.coverImageIndex ?? 0,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<{ url: string; file?: File; publicId?: string }[]>(
    initialData?.media?.map((m: any) => ({ url: m.url, publicId: m.publicId })) || []
  );
  const [coverIndex, setCoverIndex] = useState<number>(initialData?.coverImageIndex ?? 0);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 3 - previewImages.length;
    if (remaining <= 0) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    const newImages = selected.map(file => ({
      url: URL.createObjectURL(file),
      file,
    }));
    const updated = [...previewImages, ...newImages];
    setPreviewImages(updated);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex(coverIndex - 1);
  };

  const selectedAccountId = useWatch({ control: form.control, name: 'accountId' });
  const { data: contactsRes } = useSWR(selectedAccountId ? `/api/contacts?accountId=${selectedAccountId}&limit=100` : null, (url: string) => fetch(url).then(r => r.json()));
  const contacts = contactsRes?.data || [];

  async function onSubmit(data: any) {
    try {
      setUploading(true);

      // Upload new images that have File objects (not yet on server)
      const uploadedMedia: { url: string; publicId: string; type: string }[] = [];
      
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      for (const img of previewImages) {
        if (img.file) {
          const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== "your-cloud-name" &&
            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== "";

          if (isCloudinaryConfigured) {
            try {
              const formData = new FormData();
              formData.append("file", img.file);
              formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset");
              const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
              );
              const cloudData = await cloudRes.json();
              if (cloudData.secure_url) {
                uploadedMedia.push({ url: cloudData.secure_url, publicId: cloudData.public_id || `cloud-${Date.now()}`, type: "photo" });
                continue;
              }
            } catch (err) {
              console.warn("Cloudinary upload failed, falling back to base64", err);
            }
          }

          // Direct local/base64 storage (works reliably without external Cloudinary setup)
          const base64Str = await fileToBase64(img.file);
          uploadedMedia.push({ url: base64Str, publicId: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, type: "photo" });
        } else if (img.url) {
          uploadedMedia.push({ url: img.url, publicId: img.publicId || `existing-${Date.now()}`, type: "photo" });
        }
      }

      const url = isEdit && initialData ? `/api/properties/${initialData._id}` : "/api/properties";
      const method = isEdit ? "PUT" : "POST";

      const formattedData: any = {
        ...data,
        media: uploadedMedia,
        coverImageIndex: coverIndex,
      };
      if (!formattedData.ownershipType) delete formattedData.ownershipType;
      if (!formattedData.primaryContactId) delete formattedData.primaryContactId;
      if (!formattedData.propertyManager) delete formattedData.propertyManager;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Something went wrong");

      setUploading(false);
      toast.success(isEdit ? "Property updated successfully" : "Property created successfully");
      router.push("/properties");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save property");
      setUploading(false);
    }
  }

  const AMENITIES_LIST = ['Lift', 'Parking', 'Power Backup', 'Gym', 'Pool', 'Security', 'Water', 'Garden'];

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Basic Info & Legal */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Building className="h-4 w-4 text-indigo-500" />Basic Information</div>
            
            <FormField control={form.control} name="propertyName" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Property Name *</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="accountId" render={({ field }) => {
                const selectedAccount = accounts.find((a: any) => (a._id?.toString() || a._id) === field.value) ||
                  (initialData?.accountId && (initialData.accountId._id?.toString() === field.value || initialData.accountId === field.value) && typeof initialData.accountId === 'object' ? initialData.accountId : null);
                const accountLabel = selectedAccount?.accountName || (field.value ? (initialData?.accountId?.accountName || "Loading...") : undefined);

                return (
                  <FormItem>
                    <FormLabel className={labelClasses}>Owner / Account *</FormLabel>
                    <Select disabled={isLoading} onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("primaryContactId", ""); // Reset contact when account changes
                    }} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}>
                          <SelectValue placeholder="Select Owner">
                            {accountLabel}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((a: any) => <SelectItem key={a._id} value={a._id} className="text-[12px] font-medium">{a.accountName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                );
              }} />

              <FormField control={form.control} name="primaryContactId" render={({ field }) => {
                const selectedContact = contacts.find((c: any) => (c._id?.toString() || c._id) === field.value) ||
                  (initialData?.primaryContactId && (initialData.primaryContactId._id?.toString() === field.value || initialData.primaryContactId === field.value) && typeof initialData.primaryContactId === 'object' ? initialData.primaryContactId : null);
                const contactLabel = selectedContact
                  ? `${selectedContact.firstName} ${selectedContact.lastName || ''}${selectedContact.contactType ? ` (${selectedContact.contactType})` : ''}`.trim()
                  : (field.value ? (initialData?.primaryContactId?.firstName ? `${initialData.primaryContactId.firstName} ${initialData.primaryContactId.lastName || ''}${initialData.primaryContactId.contactType ? ` (${initialData.primaryContactId.contactType})` : ''}`.trim() : "Loading...") : undefined);

                return (
                  <FormItem>
                    <FormLabel className={labelClasses}>Primary Contact</FormLabel>
                    <Select disabled={isLoading || !selectedAccountId} onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className={inputClasses}>
                          <SelectValue placeholder={selectedAccountId ? "Select Contact" : "Select Account first"}>
                            {contactLabel}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts.length === 0 ? (
                          <SelectItem value="none" disabled className="text-[12px] font-medium text-slate-400">No contacts found</SelectItem>
                        ) : (
                          contacts.map((c: any) => (
                            <SelectItem key={c._id} value={c._id} className="text-[12px] font-medium">
                              {c.firstName} {c.lastName || ''} ({c.contactType})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                );
              }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="propertyType" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Property Type</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Plot', 'PG'].map(t => <SelectItem key={t} value={t} className="text-[12px] font-medium">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Status</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Draft', 'Active', 'Inactive', 'Under Maintenance'].map(t => <SelectItem key={t} value={t} className="text-[12px] font-medium">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>



          </div>

          {/* Col 2: Address & Location */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><MapPin className="h-4 w-4 text-emerald-500" />Address & Location</div>
            
            <FormField control={form.control} name="address.line1" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Address Line 1</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="address.city" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>City</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="address.state" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>State</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="address.pincode" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Pincode</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="geoLocation.googleMapsLink" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Google Maps Link</FormLabel><FormControl><Input disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Notes</FormLabel><FormControl><Textarea className={`${inputClasses} resize-none h-[64px] pt-2`} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 3: Specifications */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><Layers className="h-4 w-4 text-amber-500" />Specifications</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="totalFloors" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Total Floors</FormLabel><FormControl><Input type="number" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="builtUpArea" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Built-Up Area (sqft)</FormLabel><FormControl><Input type="number" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="yearBuilt" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Year Built</FormLabel><FormControl><Input type="number" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="parkingSlots" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Parking Slots</FormLabel><FormControl><Input type="number" disabled={isLoading} className={inputClasses} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem className="pt-2">
                  <FormLabel className={`${labelClasses} mb-2 block`}>Amenities</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES_LIST.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem key={item} className="flex flex-row items-center space-x-2 space-y-0 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <FormControl>
                              <Checkbox
                                className="w-3.5 h-3.5 rounded-[3px]"
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(field.value?.filter((val: string) => val !== item))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-[11px] font-bold text-slate-600 leading-none cursor-pointer truncate">{item}</FormLabel>
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

        </div>

        {/* Image Upload Section */}
        <div className="mt-6">
          <div className={sectionTitleClasses}><Camera className="h-4 w-4 text-violet-500" />Property Images <span className="text-[10px] font-semibold text-slate-400 ml-1">(Max 3)</span></div>
          
          <div className="flex gap-4 flex-wrap">
            {previewImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative group w-[140px] h-[100px] rounded-xl overflow-hidden border-2 transition-all ${
                  coverIndex === idx ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                
                {/* Cover badge */}
                {coverIndex === idx && (
                  <div className="absolute top-1.5 left-1.5 bg-amber-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                    <Star className="h-2.5 w-2.5 fill-current" /> COVER
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {coverIndex !== idx && (
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className="p-1.5 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors shadow-sm"
                      title="Set as cover"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {previewImages.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[140px] h-[100px] rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
              >
                <div className="p-2 bg-slate-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                  <ImagePlus className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">Add Image</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          {previewImages.length > 0 && (
            <p className="text-[10px] font-medium text-slate-400 mt-2">💡 Click the ⭐ button on hover to set a cover image.</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#4F46E5] to-[#4338CA] text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-[0_4px_12px_rgba(79,70,229,0.25)] border border-indigo-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Property" : "Create Property"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
