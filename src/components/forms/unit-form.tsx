"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowRight, DoorOpen, LayoutDashboard, IndianRupee } from "lucide-react";
import useSWR from "swr";

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
import { unitSchema, UnitFormValues } from "@/validators/unit.validator";
import { IUnitDocument } from "@/models/Unit";

interface UnitFormProps {
  initialData?: IUnitDocument;
  isEdit?: boolean;
}

export function UnitForm({ initialData, isEdit }: UnitFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPropertyId = searchParams.get("propertyId");
  
  const { data: propertiesRes } = useSWR("/api/properties?limit=500", (url: string) => fetch(url).then(r => r.json()));
  const properties = propertiesRes?.data || [];

  const getDerivedBedrooms = (type?: string) => {
    switch (type) {
      case "1BHK": return 1;
      case "2BHK": return 2;
      case "3BHK": return 3;
      case "4BHK": return 4;
      case "Studio": return 1;
      case "Shop":
      case "Office": return 0;
      default: return 0;
    }
  };

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema) as any,
    defaultValues: {
      propertyId: initialData?.propertyId?._id?.toString() || initialData?.propertyId?.toString() || defaultPropertyId || "",
      unitNumber: initialData?.unitNumber || "",
      unitType: initialData?.unitType as any || "1BHK",
      floorNumber: initialData?.floorNumber || 0,
      sizeSqFt: initialData?.sizeSqFt || 0,
      bedRooms: initialData?.bedRooms ?? getDerivedBedrooms(initialData?.unitType || "1BHK"),
      bathRooms: initialData?.bathRooms || 0,
      hasBalcony: initialData?.hasBalcony || false,
      furnishingStatus: initialData?.furnishingStatus as any || "Unfurnished",
      rentAmount: initialData?.rentAmount || 0,
      maintenanceAmount: initialData?.maintenanceAmount || 0,
      securityDeposit: initialData?.securityDeposit || 0,
      currentStatus: initialData?.currentStatus as any || "Vacant",
      amenities: initialData?.amenities || [],
      notes: initialData?.notes || "",
    },
  });

  const propertyId = form.watch("propertyId");
  const selectedUnitType = form.watch("unitType");
  const selectedProperty = properties.find((p: any) => p._id === propertyId);
  const maxFloors = selectedProperty?.totalFloors > 0 ? selectedProperty.totalFloors : undefined;

  const { data: unitsRes } = useSWR(propertyId ? `/api/units?propertyId=${propertyId}&limit=500` : null, (url: string) => fetch(url).then(r => r.json()));
  const existingUnits = unitsRes?.data || [];

  // Automatically synchronize bedRooms based on unitType (1BHK -> 1, 2BHK -> 2, etc.)
  useEffect(() => {
    if (selectedUnitType && selectedUnitType !== "Other") {
      form.setValue("bedRooms", getDerivedBedrooms(selectedUnitType));
    }
  }, [selectedUnitType, form]);

  useEffect(() => {
    if (!isEdit && selectedProperty && unitsRes) {
      const currentUnitValue = form.getValues("unitNumber");
      const nextUnitNum = existingUnits.length + 1;
      const propNameStr = selectedProperty.propertyName;
      
      if (!currentUnitValue || currentUnitValue.includes(" - U")) {
        form.setValue("unitNumber", `${propNameStr} - U${nextUnitNum}`);
      }
    }
  }, [propertyId, selectedProperty, existingUnits.length, isEdit, unitsRes, form]);

  async function onSubmit(data: UnitFormValues) {
    setIsLoading(true);
    try {
      const derivedBedrooms = data.unitType !== "Other" 
        ? getDerivedBedrooms(data.unitType) 
        : (data.bedRooms ?? 0);

      const payload = {
        ...data,
        bedRooms: derivedBedrooms,
      };

      const url = isEdit 
        ? `/api/units/${initialData?._id}` 
        : "/api/units";
        
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(isEdit ? "Unit updated successfully!" : "Unit created successfully!");
      router.push(`/units/${result.data._id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const AMENITIES_LIST = ['AC', 'Heater', 'Internet', 'TV', 'Washing Machine', 'Refrigerator', 'Microwave', 'Purifier'];

  const inputClasses = "h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-[12px] font-medium rounded-lg transition-all shadow-sm placeholder:text-slate-400";
  const labelClasses = "text-[11px] font-extrabold text-slate-700 mb-1";
  const sectionTitleClasses = "text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-2 border-b border-slate-100";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* 3-Column Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Col 1: Core Info */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><DoorOpen className="h-4 w-4 text-indigo-500" />Basic Information</div>
            
            {isEdit && (
              <FormField control={form.control} name="unitNumber" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Unit Number *</FormLabel><FormControl><Input className={inputClasses} disabled={isLoading || true} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            )}
            
            <FormField control={form.control} name="propertyId" render={({ field }) => {
              const initProp = initialData?.propertyId as any;
              const selectedProp = properties.find((p: any) => (p._id?.toString() || p._id) === field.value) ||
                (initProp && (initProp._id?.toString() === field.value || initProp.toString() === field.value) && typeof initProp === 'object' ? initProp : null);
              const propLabel = selectedProp?.propertyName || (field.value ? (initProp?.propertyName || "Loading...") : undefined);

              return (
                <FormItem>
                  <FormLabel className={labelClasses}>Property *</FormLabel>
                  <Select disabled={isLoading || (!!defaultPropertyId && !isEdit)} onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Select Property">
                          {propLabel}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((p: any) => <SelectItem key={p._id} value={p._id} className="text-[12px] font-medium">{p.propertyName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              );
            }} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="unitType" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Unit Type</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Shop', 'Office', 'Other'].map(v => <SelectItem key={v} value={v} className="text-[12px] font-medium">{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              <FormField control={form.control} name="currentStatus" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Status</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Vacant', 'Occupied', 'Under Maintenance', 'Notice Period'].map(v => <SelectItem key={v} value={v} className="text-[12px] font-medium">{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="floorNumber" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Floor {maxFloors ? `(Max: ${maxFloors})` : ""}</FormLabel><FormControl><Input type="number" max={maxFloors} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

          {/* Col 2: Specifications */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><LayoutDashboard className="h-4 w-4 text-emerald-500" />Specifications</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="sizeSqFt" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Size (Sq.Ft)</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="bathRooms" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Bathrooms</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="furnishingStatus" render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClasses}>Furnishing</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className={inputClasses}><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Unfurnished" className="text-[12px] font-medium">Unfurnished</SelectItem>
                      <SelectItem value="Semi" className="text-[12px] font-medium">Semi</SelectItem>
                      <SelectItem value="Fully" className="text-[12px] font-medium">Fully</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )} />

              {selectedUnitType === 'Other' ? (
                <FormField control={form.control} name="bedRooms" render={({ field }) => (
                  <FormItem><FormLabel className={labelClasses}>Bedrooms (Custom)</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
                )} />
              ) : (
                <div className="flex flex-col justify-end">
                  <FormField control={form.control} name="hasBalcony" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-slate-200 px-2.5 shadow-sm h-9 bg-slate-50">
                      <FormControl><Checkbox className="data-[state=checked]:bg-indigo-600 w-3.5 h-3.5 data-[state=checked]:border-indigo-600 rounded-[3px]" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} /></FormControl>
                      <FormLabel className="text-[11px] font-bold text-slate-700 cursor-pointer mb-0">Unit has balcony</FormLabel>
                    </FormItem>
                  )} />
                </div>
              )}
            </div>

            {selectedUnitType === 'Other' && (
              <FormField control={form.control} name="hasBalcony" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-slate-200 px-2.5 shadow-sm h-9 bg-slate-50">
                  <FormControl><Checkbox className="data-[state=checked]:bg-indigo-600 w-3.5 h-3.5 data-[state=checked]:border-indigo-600 rounded-[3px]" checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} /></FormControl>
                  <FormLabel className="text-[11px] font-bold text-slate-700 cursor-pointer mb-0">Unit has balcony</FormLabel>
                </FormItem>
              )} />
            )}

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
                          <FormItem key={item} className="flex flex-row items-center space-x-2 space-y-0 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                            <FormControl>
                              <Checkbox
                                className="w-3.5 h-3.5 rounded-[3px] data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                checked={field.value?.includes(item)}
                                disabled={isLoading}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item])
                                    : field.onChange(field.value?.filter((val: string) => val !== item))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-bold text-[11px] text-slate-600 cursor-pointer truncate leading-none mb-0">{item}</FormLabel>
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

          {/* Col 3: Financials & Notes */}
          <div className="space-y-4">
            <div className={sectionTitleClasses}><IndianRupee className="h-4 w-4 text-amber-500" />Financial Details</div>
            
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="rentAmount" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Rent (₹) *</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
              <FormField control={form.control} name="maintenanceAmount" render={({ field }) => (
                <FormItem><FormLabel className={labelClasses}>Maintenance (₹)</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
              )} />
            </div>
            
            <FormField control={form.control} name="securityDeposit" render={({ field }) => (
              <FormItem><FormLabel className={labelClasses}>Security Deposit (₹)</FormLabel><FormControl><Input type="number" min={0} className={inputClasses} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
            
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem className="pt-2"><FormLabel className={labelClasses}>Notes</FormLabel><FormControl><Textarea className={`${inputClasses} resize-none h-[150px] pt-2`} disabled={isLoading} {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>
            )} />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" disabled={isLoading} onClick={() => router.back()} className="h-10 px-5 rounded-lg text-[12px] font-bold text-slate-600 hover:bg-slate-100">
            Cancel
          </Button>
          <button type="submit" disabled={isLoading} className="h-10 px-6 gap-2 inline-flex items-center justify-center bg-gradient-to-b from-[#4F46E5] to-[#4338CA] text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-[0_4px_12px_rgba(79,70,229,0.25)] border border-indigo-500/20 text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Unit" : "Create Unit"}
            {!isLoading && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
          </button>
        </div>
      </form>
    </Form>
  );
}
