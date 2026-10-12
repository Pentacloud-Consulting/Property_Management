"use client";

import { useProperty } from "@/hooks/use-properties";
import { useUnits } from "@/hooks/use-units";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Edit, MapPin, Building, Calendar, BoxSelect, Users, Briefcase, Grid, DoorClosed, AlertCircle, Camera } from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";

function PropertyDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { property, isLoading, isError } = useProperty(id);
  const { data: units = [], isLoading: unitsLoading } = useUnits({ page: 1, propertyId: id, limit: 100 });

  if (isLoading || unitsLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <Building className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Property Not Found</h2>
        <Link href="/properties" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
        </Link>
      </div>
    );
  }

  const formatAddress = () => {
    const parts = [property.address?.line1, property.address?.line2, property.address?.city, property.address?.state, property.address?.pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  const owner = property.accountId as any;
  const occupiedCount = units.filter(u => u.currentStatus === "Occupied").length;
  const vacantCount = units.filter(u => u.currentStatus === "Vacant").length;
  const maintenanceCount = units.filter(u => u.currentStatus === "Under Maintenance").length;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Breadcrumb / Back */}
      <Link href="/properties" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Properties
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-100 border border-slate-200/50 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            {property.media && property.media.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={property.media[property.coverImageIndex || 0]?.url || property.media[0]?.url} 
                alt={property.propertyName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_8px_16px_rgba(59,130,246,0.25)] border border-blue-400/20">
                <Building className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">{property.propertyName}</h1>
            <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                {property.propertyType}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {property.address?.city || "Unknown Location"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <Link href={`/properties/${property._id}/edit`} className="h-10 px-4 gap-2 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-[13px] font-bold transition-all hover:shadow-md">
            <Edit className="h-4 w-4 text-slate-400" />
            Edit Property
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Units" value={property.totalUnits || 0} icon={Grid} trend="Up" color="indigo" />
        <MetricCard title="Occupied Units" value={occupiedCount} icon={DoorClosed} trend="Neutral" color="emerald" />
        <MetricCard title="Vacant Units" value={vacantCount} icon={BoxSelect} trend="Down" color="blue" />
        <MetricCard title="Total Floors" value={property.totalFloors || 0} icon={Building} trend="Neutral" color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Property Details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                Property Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Property Type</p>
                  <p className="text-[14px] font-bold text-slate-900">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Location</p>
                  <p className="text-[14px] font-bold text-slate-900 leading-snug">{formatAddress()}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Property Owner</p>
                  {owner ? (
                    <Link href={`/accounts/${owner._id}`} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <Briefcase className="h-4 w-4" />
                      {owner.accountName}
                    </Link>
                  ) : (
                    <p className="text-[14px] font-medium text-slate-400">Unknown Owner</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Added To System</p>
                  <p className="text-[14px] font-bold text-slate-900">{format(new Date(property.createdAt), "MMM do, yyyy")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Photos Gallery */}
          {property.media && property.media.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Camera className="h-4 w-4 text-violet-600" />
                  Property Photos
                </h2>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{property.media.length} Photos</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {property.media.map((img: any, idx: number) => {
                    const isCover = idx === (property.coverImageIndex || 0);
                    return (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/80 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={`Property image ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold shadow-sm uppercase tracking-wider">
                            ★ Cover
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Property Notes</h2>
            </div>
            <div className="p-6">
              {property.notes ? (
                <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  {property.notes}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-[13px] font-medium">No notes available for this property.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Units List */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BoxSelect className="h-4 w-4 text-indigo-600" />
                Units Directory
              </h2>
              <span className="bg-indigo-100 text-indigo-700 text-[11px] font-extrabold px-2 py-0.5 rounded-full">{units.length} Units</span>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3">
              {units.length > 0 ? (
                units.map((unit) => {
                  let style = "bg-slate-50 text-slate-600 border-slate-200";
                  if (unit.currentStatus === "Occupied") style = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (unit.currentStatus === "Vacant") style = "bg-blue-50 text-blue-700 border-blue-200";
                  if (unit.currentStatus === "Under Maintenance") style = "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <div key={unit._id.toString()} className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          {property.media && property.media.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={property.media[property.coverImageIndex || 0]?.url || property.media[0]?.url} 
                              alt={`Unit ${unit.unitNumber}`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <BoxSelect className="h-4 w-4 text-indigo-500" />
                          )}
                        </div>
                        <div>
                          <Link href={`/units/${unit._id}`} className="text-[13px] font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors block">
                            Unit {unit.unitNumber}
                          </Link>
                          <span className="text-[11px] font-medium text-slate-500">${unit.rentAmount}/mo</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold border uppercase tracking-wider ${style}`}>
                        {unit.currentStatus}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                  <BoxSelect className="h-10 w-10 text-slate-200 mb-3" />
                  <p className="text-[13px] font-bold text-slate-500">No units added yet</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <Link href={`/units?propertyId=${property._id}`} className="h-10 w-full inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-[13px] font-bold transition-all hover:shadow-md">
                Manage All Units
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>}>
      <PropertyDetailContent params={params} />
    </Suspense>
  );
}
