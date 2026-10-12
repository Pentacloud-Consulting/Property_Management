"use client";

import { useUnit } from "@/hooks/use-units";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, MapPin, Building, BoxSelect, Users, BedDouble, Ruler, IndianRupee } from "lucide-react";

function UnitDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { unit, isLoading, isError } = useUnit(id);

  if (isLoading) {
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
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !unit) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <BoxSelect className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Unit Not Found</h2>
        <Link href="/units" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Units
        </Link>
      </div>
    );
  }

  const prop = unit.propertyId as any;
  const tenant = unit.currentTenantId as any;
  const propCoverImg = prop?.media && prop.media.length > 0
    ? prop.media[prop.coverImageIndex || 0]?.url || prop.media[0]?.url
    : null;

  const formatAddress = () => {
    if (!prop || !prop.address) return "—";
    const parts = [prop.address.line1, prop.address.line2, prop.address.locality, prop.address.city, prop.address.state, prop.address.pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };
  
  let statusStyle = "bg-slate-100 text-slate-700 border-slate-200";
  if (unit.currentStatus === "Occupied") statusStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (unit.currentStatus === "Under Maintenance") statusStyle = "bg-amber-50 text-amber-700 border-amber-200";
  if (unit.currentStatus === "Vacant") statusStyle = "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      <Link href="/units" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Units
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-slate-200/50 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            {propCoverImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={propCoverImg} alt={prop?.propertyName || "Unit"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <BoxSelect className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Unit {unit.unitNumber}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${statusStyle}`}>
                {unit.currentStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500">
              {prop ? (
                <Link href={`/properties/${prop._id}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-bold">
                  <Building className="h-3.5 w-3.5" />
                  {prop.propertyName}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> No Property</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <Link href={`/units/${unit._id}/edit`} className="h-10 px-4 gap-2 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-[13px] font-bold transition-all hover:shadow-md">
            <Edit className="h-4 w-4 text-slate-400" />
            Edit Unit
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BoxSelect className="h-4 w-4 text-indigo-600" />
                Unit Specifications
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><BedDouble className="h-3 w-3" /> Unit Type</p>
                  <p className="text-[14px] font-bold text-slate-900">{unit.unitType || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Ruler className="h-3 w-3" /> Size (Sq.Ft)</p>
                  <p className="text-[14px] font-bold text-slate-900">{unit.sizeSqFt ? `${unit.sizeSqFt} sq.ft` : "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Building className="h-3 w-3" /> Floor</p>
                  <p className="text-[14px] font-bold text-slate-900">{unit.floorNumber !== undefined ? unit.floorNumber : "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><BoxSelect className="h-3 w-3" /> Furnishing</p>
                  <p className="text-[14px] font-bold text-slate-900">{unit.furnishingStatus || "—"}</p>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 text-emerald-600"><IndianRupee className="h-3 w-3" /> Monthly Rent</p>
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{unit.rentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Security Deposit</p>
                  <p className="text-[18px] font-bold text-slate-700">₹{(unit.securityDeposit || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-600" />
                Location Context
              </h2>
            </div>
            <div className="p-6">
              {prop ? (
                <div className="flex flex-col gap-4">
                  {propCoverImg && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={propCoverImg} 
                        alt={prop.propertyName} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                      <Building className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">Part of Property</p>
                      <Link href={`/properties/${prop._id}`} className="text-[15px] font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors">
                        {prop.propertyName}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[13px] font-medium text-slate-600">{formatAddress()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] font-medium text-slate-400">No property linked to this unit.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                Current Tenant
              </h2>
            </div>
            <div className="p-6">
              {tenant ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-sm">
                      {tenant.contactId?.firstName?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-extrabold text-slate-900">{tenant.contactId?.firstName || 'Tenant'} {tenant.contactId?.lastName || ''}</h3>
                      <p className="text-[13px] font-medium text-slate-500">{tenant.contactId?.mobileNumber || 'No Phone'}</p>
                    </div>
                  </div>
                  <Link href={`/tenants/${tenant._id}`} className="block">
                    <button className="w-full h-10 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-[13px] font-bold transition-all">
                      View Tenant Profile
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-900 mb-1">Unit is Vacant</p>
                  <p className="text-[13px] text-slate-500 mb-6">No active tenant is assigned to this unit currently.</p>
                  <Link href="/tenants/new" className="block">
                    <button className="w-full h-10 inline-flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-[13px] transition-colors border border-indigo-200">
                      Assign Tenant
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>}>
      <UnitDetailContent params={params} />
    </Suspense>
  );
}
