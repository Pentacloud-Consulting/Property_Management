"use client";

import { useAccount } from "@/hooks/use-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Pencil, Building, Users, Home, IndianRupee, Briefcase, MapPin, Contact, FileText, Plus, ShieldCheck, Phone, Mail, ArrowUpRight, Hash } from "lucide-react";
import { Suspense, use } from "react";
import { format } from "date-fns";

function MetricCard({ title, value, icon: Icon, description, colorClass, borderClass }: any) {
  return (
    <div className={`bg-white rounded-2xl border ${borderClass} p-6 flex flex-col justify-between shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group overflow-hidden relative`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[28px] font-extrabold text-slate-900 leading-none tracking-tight">{value}</p>
        {description && <p className="text-[11px] font-bold text-slate-400 mt-2">{description}</p>}
      </div>
    </div>
  );
}

function AccountDetailsContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { account, isLoading, isError } = useAccount(id);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)]">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-12 w-[300px] mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Not Found</h2>
        <Link href="/accounts" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts
        </Link>
      </div>
    );
  }

  const m = (account as any).metrics || {};
  const contacts = (account as any).contacts || [];
  const properties = (account as any).properties || [];
  const PremiumCard = "bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col";

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      
      {/* Breadcrumb / Back */}
      <Link href="/accounts" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Accounts
      </Link>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{account.accountName}</h1>
            
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-sm">
              {account.status || "Active Owner"}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold border bg-indigo-50 text-indigo-700 border-indigo-200/50 shadow-sm">
              {account.accountType === "Company" ? <Building className="h-3 w-3" /> : <Users className="h-3 w-3" />}
              {account.accountType || "Individual"}
            </span>

            {account.accountNumber && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold border bg-slate-50 text-slate-600 border-slate-200 shadow-sm">
                <Hash className="h-3 w-3 text-slate-400" />
                {account.accountNumber}
              </span>
            )}
          </div>
          <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Account created <strong className="text-slate-700">{format(new Date(account.createdAt), "MMMM d, yyyy")}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/properties/new?accountId=${account._id}`} className="h-10 inline-flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-200/60 px-4 text-[13px] font-bold transition-all">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Property
          </Link>
          <Link href={`/accounts/${account._id}/edit`} className="h-10 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 px-5 text-[13px] font-bold transition-all hover:shadow-md">
            <Pencil className="mr-2 h-4 w-4 text-slate-400" />
            Edit Account
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Properties" 
          value={m.totalProperties || properties.length || 0} 
          icon={Building} 
          description="Properties under management"
          colorClass="bg-blue-50 text-blue-600 border-blue-100"
          borderClass="border-slate-200/60"
        />
        <MetricCard 
          title="Total Units" 
          value={m.totalUnits || 0} 
          icon={Home} 
          description="Total physical units"
          colorClass="bg-purple-50 text-purple-600 border-purple-100"
          borderClass="border-slate-200/60"
        />
        <MetricCard 
          title="Occupancy" 
          value={m.occupiedUnits || 0} 
          icon={Users} 
          description={`${m.vacantUnits || 0} vacant units`}
          colorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
          borderClass="border-slate-200/60"
        />
        <MetricCard 
          title="Monthly Revenue" 
          value={`₹${(m.monthlyRevenueEstimate || 0).toLocaleString()}`} 
          icon={IndianRupee} 
          description="Estimated gross rent"
          colorClass="bg-amber-50 text-amber-600 border-amber-100"
          borderClass="border-slate-200/60"
        />
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Properties Owned & Key Contacts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Properties Owned Card */}
          <div className={PremiumCard}>
            <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/50 flex items-center justify-center text-blue-600 shadow-sm">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Properties Owned</h2>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{properties.length} registered properties</p>
                </div>
              </div>

              <Link href={`/properties/new?accountId=${account._id}`} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Property
              </Link>
            </div>
            
            <div className="p-5 bg-white space-y-3">
              {properties.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-slate-100 rounded-xl space-y-2">
                  <Building className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-[13px] font-bold text-slate-500">No properties assigned to this owner yet.</p>
                  <Link href={`/properties/new?accountId=${account._id}`} className="inline-flex items-center text-[12px] font-bold text-indigo-600 hover:text-indigo-800">
                    + Add first property
                  </Link>
                </div>
              ) : (
                properties.map((prop: any) => (
                  <Link
                    key={prop._id}
                    href={`/properties/${prop._id}`}
                    className="flex items-center justify-between p-4 border border-slate-100/80 rounded-xl hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.06)] transition-all group hover:border-slate-200 hover:bg-slate-50/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/40 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-[14px] text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                          {prop.propertyName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-medium text-slate-500">
                          <span className="text-slate-600 font-semibold">{prop.propertyType || "Residential"}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {prop.address?.city || prop.address?.state ? `${prop.address?.city || ''}, ${prop.address?.state || ''}`.replace(/^, | , $/g, '') : "No location"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        {prop.totalUnits || 0} units
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${prop.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {prop.status || "Draft"}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Key Contacts Card */}
          <div className={PremiumCard}>
            <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Contact className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Key Contacts</h2>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{contacts.length} registered contacts</p>
                </div>
              </div>

              <Link href={`/contacts/new?accountId=${account._id}`} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Contact
              </Link>
            </div>
            
            <div className="p-5 bg-white space-y-3">
              {contacts.length === 0 ? (
                <div className="text-center p-8 text-[13px] font-bold text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                  No contacts found for this account.
                </div>
              ) : (
                contacts.map((contact: any) => (
                  <div key={contact._id} className="flex items-center justify-between p-4 border border-slate-100/80 rounded-xl hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all group hover:border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-600 shadow-sm">
                        {contact.firstName?.charAt(0) || ''}{contact.lastName?.charAt(0) || ''}
                      </div>
                      <div>
                        <p className="font-extrabold text-[14px] text-slate-900 tracking-tight">{contact.firstName} {contact.lastName || ""}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-slate-500">{contact.contactType || "Property Owner"}</span>
                          {contact.isPrimary && <span className="text-[9px] font-extrabold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">Primary</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-slate-900 flex items-center justify-end gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {contact.mobileNumber || "—"}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center justify-end gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {contact.email || "No email"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Identification, Address, Notes */}
        <div className="space-y-6">
          
          {/* Business & Tax Identification Card */}
          <div className={PremiumCard}>
            <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/50 flex items-center justify-center text-amber-600 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Tax & Identification</h2>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Legal and registry records</p>
              </div>
            </div>
            
            <div className="p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Type</span>
                <span className="text-[13px] font-extrabold text-slate-900">{account.accountType || "Individual"}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {account.accountType === "Company" ? "Company PAN" : "PAN Number"}
                </span>
                <span className="text-[13px] font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200/60">
                  {account.PAN || "Not provided"}
                </span>
              </div>

              {account.accountType === "Company" && (
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">GSTIN</span>
                  <span className="text-[13px] font-mono font-bold bg-slate-50 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200/60">
                    {account.GSTIN || "Not provided"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primary Phone</span>
                <span className="text-[13px] font-bold text-slate-800">{account.phone || "—"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primary Email</span>
                <span className="text-[13px] font-bold text-slate-800 truncate max-w-[180px]">{account.email || "—"}</span>
              </div>
            </div>
          </div>

          {/* Account Address & Notes Card */}
          <div className={PremiumCard}>
            <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-600 shadow-sm">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Address & Notes</h2>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Location details</p>
              </div>
            </div>
            
            <div className="p-5 bg-white space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> City & State
                </p>
                <p className="text-[14px] font-bold text-slate-800">
                  {account.address?.city || account.address?.state ? (
                    `${account.address?.city || ''}, ${account.address?.state || ''}`.replace(/^, | , $/g, '')
                  ) : "No location specified"}
                </p>
              </div>
              
              {account.address?.line1 && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5" /> Address
                  </p>
                  <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                    {account.address?.line1}
                    {account.address?.line2 && <><br/>{account.address?.line2}</>}
                    {account.address?.pincode && <> - {account.address?.pincode}</>}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
                <div className="bg-slate-50/80 border border-slate-100/80 p-3.5 rounded-xl min-h-[70px] text-[13px] font-medium text-slate-700 whitespace-pre-wrap shadow-inner">
                  {account.notes || <span className="text-slate-400 italic">No notes added.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>}>
      <AccountDetailsContent params={params} />
    </Suspense>
  );
}