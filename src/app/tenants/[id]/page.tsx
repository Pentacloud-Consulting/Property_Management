"use client";

import { useTenant } from "@/hooks/use-tenants";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, differenceInDays, isPast } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, Edit, Phone, Mail, Building, Briefcase, Calendar,
  MapPin, ShieldAlert, IndianRupee, Users, RefreshCw, LogOut,
  AlertTriangle, CheckCircle, ClipboardCheck, X, History,
  Loader2, FileText, Minus, Plus,
} from "lucide-react";

// ─── Renewal Modal ───
function RenewModal({ tenant, onClose, onSuccess }: { tenant: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    newLeaseStart: format(new Date(), "yyyy-MM-dd"),
    newLeaseEnd: "",
    newRentAmount: tenant.rentAmount || 0,
    newSecurityDeposit: tenant.securityDeposit || 0,
    notes: "",
  });
  const [agreementFile, setAgreementFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAgreementFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.newLeaseStart || !form.newRentAmount) {
      toast.error("Lease start date and rent amount are required");
      return;
    }
    setLoading(true);
    try {
      let agreementBase64 = null;
      let agreementName = null;
      if (agreementFile) {
        agreementBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(agreementFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        agreementName = agreementFile.name;
      }

      const res = await fetch(`/api/tenants/${tenant._id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          newRentalAgreement: agreementBase64,
          agreementName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to renew");
      toast.success("Lease renewed successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">Renew Lease</h2>
              <p className="text-[11px] font-medium text-slate-400">Set new lease terms for {tenant.tenantNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Previous lease info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Current Lease</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400">Start</p>
                <p className="text-[13px] font-bold text-slate-700">
                  {tenant.leaseStartDate ? format(new Date(tenant.leaseStartDate), "MMM dd, yyyy") : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">End</p>
                <p className="text-[13px] font-bold text-slate-700">
                  {tenant.leaseEndDate ? format(new Date(tenant.leaseEndDate), "MMM dd, yyyy") : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">Rent</p>
                <p className="text-[13px] font-bold text-slate-700">₹{tenant.rentAmount?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* New lease form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">New Lease Start *</label>
              <input
                type="date"
                value={form.newLeaseStart}
                onChange={e => setForm({ ...form, newLeaseStart: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">New Lease End</label>
              <input
                type="date"
                value={form.newLeaseEnd}
                onChange={e => setForm({ ...form, newLeaseEnd: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">New Monthly Rent (₹) *</label>
              <input
                type="number"
                value={form.newRentAmount}
                onChange={e => setForm({ ...form, newRentAmount: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">New Security Deposit (₹)</label>
              <input
                type="number"
                value={form.newSecurityDeposit}
                onChange={e => setForm({ ...form, newSecurityDeposit: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">New Rental Agreement (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="w-full h-10 px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="e.g. 10% rent increase, 11 month agreement..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-10 px-5 gap-2 inline-flex items-center rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Renew Lease
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Exit Modal ───
function ExitModal({ tenant, onClose, onSuccess }: { tenant: any; onClose: () => void; onSuccess: () => void }) {
  const isNotice = tenant.status === "Notice";
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"initiate" | "complete">(isNotice ? "complete" : "initiate");

  // Initiate fields
  const [exitRequestDate, setExitRequestDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Complete fields
  const [exitInspectionDate, setExitInspectionDate] = useState(
    tenant.exitProcess?.exitInspectionDate ? format(new Date(tenant.exitProcess.exitInspectionDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );
  const [exitInspectionNotes, setExitInspectionNotes] = useState(tenant.exitProcess?.exitInspectionNotes || "");
  const [damageAssessment, setDamageAssessment] = useState(tenant.exitProcess?.damageAssessment || "");
  const [moveOutDate, setMoveOutDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [deductions, setDeductions] = useState<{ type: string; description: string; amount: number }[]>(
    tenant.exitProcess?.deductions?.length
      ? tenant.exitProcess.deductions
      : []
  );

  const [agreementClosed, setAgreementClosed] = useState(tenant.exitProcess?.agreementClosed || false);
  const [exitPhotos, setExitPhotos] = useState<File[]>([]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setExitPhotos(Array.from(e.target.files));
    }
  };

  const totalDeductions = deductions.reduce((s, d) => s + (d.amount || 0), 0);
  const depositRefund = Math.max((tenant.securityDeposit || 0) - totalDeductions, 0);

  const addDeduction = () => {
    setDeductions([...deductions, { type: "Painting", description: "", amount: 0 }]);
  };

  const removeDeduction = (idx: number) => {
    setDeductions(deductions.filter((_, i) => i !== idx));
  };

  const updateDeduction = (idx: number, field: string, value: any) => {
    const updated = [...deductions];
    (updated[idx] as any)[field] = value;
    setDeductions(updated);
  };

  const handleInitiate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${tenant._id}/exit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "initiate", exitRequestDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Exit process initiated! Tenant moved to Notice.");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      let photosBase64 = [];
      if (exitPhotos.length > 0) {
        for (const file of exitPhotos) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          photosBase64.push({ url: base64, name: file.name });
        }
      }

      const res = await fetch(`/api/tenants/${tenant._id}/exit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          exitInspectionDate,
          exitInspectionNotes,
          damageAssessment,
          deductions,
          moveOutDate,
          agreementClosed,
          exitPhotos: photosBase64,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Exit completed! Unit is now vacant.");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
              <LogOut className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                {step === "initiate" ? "Initiate Exit Process" : "Complete Exit & Settlement"}
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                {step === "initiate" ? "Move tenant to Notice period" : "Finalize deductions, settle deposit, vacate unit"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === "initiate" ? (
            <>
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-bold text-amber-800">This will move the tenant to Notice status</p>
                  <p className="text-[11px] font-medium text-amber-600 mt-1">The unit will be marked as "Notice Period". You can still complete the exit later with full settlement details.</p>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Exit Request Date</label>
                <input
                  type="date"
                  value={exitRequestDate}
                  onChange={e => setExitRequestDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all"
                />
              </div>
            </>
          ) : (
            <>
              {/* Inspection */}
              <div>
                <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-indigo-500" /> Exit Inspection
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Inspection Date</label>
                    <input
                      type="date"
                      value={exitInspectionDate}
                      onChange={e => setExitInspectionDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Move-Out Date</label>
                    <input
                      type="date"
                      value={moveOutDate}
                      onChange={e => setMoveOutDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Inspection Notes</label>
                  <textarea
                    value={exitInspectionNotes}
                    onChange={e => setExitInspectionNotes(e.target.value)}
                    rows={2}
                    placeholder="Note any damage, missing items, etc..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-900 outline-none transition-all resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>

                <div className="mt-3">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Damage Assessment</label>
                  <textarea
                    value={damageAssessment}
                    onChange={e => setDamageAssessment(e.target.value)}
                    rows={2}
                    placeholder="Describe property damage if any..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-900 outline-none transition-all resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-extrabold text-slate-900 flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-rose-500" /> Deductions from Deposit
                  </h3>
                  <button
                    onClick={addDeduction}
                    className="h-8 px-3 gap-1.5 inline-flex items-center rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {deductions.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-[12px] font-medium text-slate-400">No deductions added. Full deposit will be refunded.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {deductions.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <select
                          value={d.type}
                          onChange={e => updateDeduction(idx, "type", e.target.value)}
                          className="h-9 px-2 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-700 outline-none bg-white"
                        >
                          {["Painting", "Service", "Utility", "Damage", "Other"].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={d.description}
                          onChange={e => updateDeduction(idx, "description", e.target.value)}
                          className="flex-1 h-9 px-2 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-700 outline-none"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-[12px] font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            value={d.amount}
                            onChange={e => updateDeduction(idx, "amount", Number(e.target.value))}
                            className="w-24 h-9 px-2 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-900 outline-none"
                          />
                        </div>
                        <button onClick={() => removeDeduction(idx)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Minus className="h-3.5 w-3.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settlement Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200/80">
                <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" /> Security Deposit Settlement
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-500">Security Deposit</span>
                    <span className="text-[14px] font-extrabold text-slate-900">₹{(tenant.securityDeposit || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-rose-500">Total Deductions</span>
                    <span className="text-[14px] font-extrabold text-rose-600">- ₹{totalDeductions.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-extrabold text-emerald-700">Refund to Tenant</span>
                    <span className="text-[18px] font-black text-emerald-700">₹{depositRefund.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-4">
                <h3 className="text-[13px] font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Final Tasks
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="agreementClosed"
                    checked={agreementClosed}
                    onChange={e => setAgreementClosed(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300"
                  />
                  <label htmlFor="agreementClosed" className="text-[12px] font-bold text-slate-700 cursor-pointer">Confirm Agreement Handover</label>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 block">Final Property Photos & Videos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handlePhotoSelect}
                    className="w-full h-10 px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 outline-none bg-white"
                  />
                  {exitPhotos.length > 0 && <p className="text-[10px] text-slate-500 mt-1 font-medium">{exitPhotos.length} file(s) selected.</p>}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          {step === "complete" && !isNotice && (
            <button onClick={() => setStep("initiate")} className="text-[12px] font-bold text-slate-500 hover:text-slate-700">
              ← Back to Initiate
            </button>
          )}
          {step === "initiate" && (
            <button onClick={() => setStep("complete")} className="text-[12px] font-bold text-indigo-600 hover:text-indigo-700">
              Skip to Full Exit →
            </button>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={onClose} className="h-10 px-4 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            {step === "initiate" ? (
              <button
                onClick={handleInitiate}
                disabled={loading}
                className="h-10 px-5 gap-2 inline-flex items-center rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Initiate Exit
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="h-10 px-5 gap-2 inline-flex items-center rounded-xl bg-gradient-to-b from-rose-600 to-red-700 text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:from-rose-700 hover:to-red-800 transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Complete Exit & Vacate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
function TenantDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tenant, isLoading, isError, mutate } = useTenant(id);
  const [showRenew, setShowRenew] = useState(false);
  const [showExit, setShowExit] = useState(false);

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

  if (isError || !tenant) {
    return (
      <div className="flex-1 space-y-4 p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] text-center flex flex-col items-center justify-center">
        <Users className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tenant Not Found</h2>
        <Link href="/tenants" className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tenants
        </Link>
      </div>
    );
  }

  const unit = tenant.unitId as any;
  const prop = tenant.propertyId as any;
  const contact = tenant.contactId as any;

  let statusStyle = "bg-slate-100 text-slate-700 border-slate-200";
  if (tenant.status === "Active") statusStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (tenant.status === "Notice") statusStyle = "bg-amber-50 text-amber-700 border-amber-200";
  if (tenant.status === "Past") statusStyle = "bg-red-50 text-red-700 border-red-200";

  let policeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  if (tenant.policeVerificationStatus === "Verified") policeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (tenant.policeVerificationStatus === "Pending") policeStyle = "bg-amber-50 text-amber-700 border-amber-200";
  if (tenant.policeVerificationStatus === "Rejected") policeStyle = "bg-red-50 text-red-700 border-red-200";

  // Lease expiry warning
  const leaseEndDate = tenant.leaseEndDate ? new Date(tenant.leaseEndDate) : null;
  const daysRemaining = leaseEndDate ? differenceInDays(leaseEndDate, new Date()) : null;
  const leaseExpired = leaseEndDate ? isPast(leaseEndDate) : false;
  const leaseExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 30;

  const renewalHistory = (tenant as any).renewalHistory || [];
  const exitProcess = (tenant as any).exitProcess || null;

  const handleSuccess = () => {
    setShowRenew(false);
    setShowExit(false);
    mutate();
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#F4F6FA] min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
      <Link href="/tenants" className="inline-flex items-center text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors group">
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Tenants
      </Link>

      {/* Lease Expiry Alert */}
      {tenant.status !== "Past" && (leaseExpired || leaseExpiringSoon) && (
        <div className={`rounded-2xl p-4 flex items-center justify-between border ${leaseExpired ? 'bg-red-50 border-red-200/60' : 'bg-amber-50 border-amber-200/60'}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 ${leaseExpired ? 'text-red-600' : 'text-amber-600'}`} />
            <div>
              <p className={`text-[13px] font-bold ${leaseExpired ? 'text-red-800' : 'text-amber-800'}`}>
                {leaseExpired ? "Lease has expired!" : `Lease expiring in ${daysRemaining} days`}
              </p>
              <p className={`text-[11px] font-medium mt-0.5 ${leaseExpired ? 'text-red-600' : 'text-amber-600'}`}>
                Lease end: {format(leaseEndDate!, "MMM dd, yyyy")} — Please renew or initiate exit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRenew(true)}
              className="h-9 px-4 gap-1.5 inline-flex items-center rounded-lg bg-emerald-600 text-white text-[12px] font-bold hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Renew
            </button>
            <button
              onClick={() => setShowExit(true)}
              className="h-9 px-4 gap-1.5 inline-flex items-center rounded-lg bg-red-600 text-white text-[12px] font-bold hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Exit
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_8px_16px_rgba(16,185,129,0.25)] border border-emerald-400/20 text-white font-bold text-xl">
            {contact?.firstName?.charAt(0) || 'T'}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{contact?.firstName || ''} {contact?.lastName || ''}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${statusStyle}`}>
                {tenant.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-bold">
                {tenant.tenantNumber}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Registered {format(new Date(tenant.createdAt), "MMM do, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative flex-wrap">
          {tenant.status !== "Past" && (
            <>
              <button
                onClick={() => setShowRenew(true)}
                className="h-10 px-4 gap-2 inline-flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 text-[13px] font-bold transition-all"
              >
                <RefreshCw className="h-4 w-4" /> Renew
              </button>
              <button
                onClick={() => setShowExit(true)}
                className="h-10 px-4 gap-2 inline-flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60 text-[13px] font-bold transition-all"
              >
                <LogOut className="h-4 w-4" /> {tenant.status === "Notice" ? "Complete Exit" : "Exit"}
              </button>
            </>
          )}
          <Link href={`/tenants/${tenant._id}/edit`} className="h-10 px-4 gap-2 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-[13px] font-bold transition-all hover:shadow-md">
            <Edit className="h-4 w-4 text-slate-400" />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Personal Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Phone className="h-3 w-3" /> Mobile Number</p>
                  <p className="text-[14px] font-bold text-slate-900">{contact?.mobileNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Mail className="h-3 w-3" /> Email Address</p>
                  <p className="text-[14px] font-bold text-slate-900">{contact?.email || "—"}</p>
                </div>

              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                Lease & Financials
              </h2>
              {leaseEndDate && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${leaseExpired ? 'bg-red-50 text-red-700 border-red-200' : leaseExpiringSoon ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {leaseExpired ? 'EXPIRED' : leaseExpiringSoon ? `${daysRemaining}d LEFT` : `${daysRemaining}d LEFT`}
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Lease Start Date</p>
                  <p className="text-[14px] font-bold text-slate-900">{tenant.leaseStartDate ? format(new Date(tenant.leaseStartDate), "MMM do, yyyy") : "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Lease End Date</p>
                  <p className={`text-[14px] font-bold ${leaseExpired ? 'text-red-600' : 'text-slate-900'}`}>
                    {tenant.leaseEndDate ? format(new Date(tenant.leaseEndDate), "MMM do, yyyy") : "—"}
                  </p>
                </div>
                
                {tenant.rentDueDate && (
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Rent Due Date</p>
                    <p className="text-[14px] font-bold text-slate-900">{tenant.rentDueDate} of every month</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 text-emerald-600"><IndianRupee className="h-3 w-3" /> Rent Amount ({tenant.rentPaymentCycle})</p>
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">₹{tenant.rentAmount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Security Deposit</p>
                  <p className="text-[18px] font-bold text-slate-700 mt-1">₹{tenant.securityDeposit?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IndianRupee className="h-3 w-3" /> Maintenance</p>
                  <p className="text-[18px] font-bold text-slate-700 mt-1">₹{tenant.maintenanceAmount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Calendar className="h-3 w-3" /> Payment Cycle</p>
                  <p className="text-[18px] font-bold text-slate-700 mt-1">{tenant.rentPaymentCycle || "Monthly"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Storage */}
          {tenant.documents && tenant.documents.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-600" />
                  Document Storage
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {['KYC Verification', 'Rental Agreement', 'Entry Photos'].map(docType => {
                    const docs = tenant.documents.filter((d: any) => d.type === docType);
                    if (docs.length === 0) return null;
                    return (
                      <div key={docType}>
                        <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">{docType}</p>
                        <div className="flex gap-3 flex-wrap">
                          {docs.map((doc: any, idx: number) => (
                            <a key={idx} href={doc.url} target="_blank" rel="noreferrer" className="block relative group w-20 h-20 rounded-xl border bg-slate-50 overflow-hidden shadow-sm hover:border-indigo-300 transition-colors">
                              {doc.url.startsWith("data:image") || doc.url.startsWith("blob:") || doc.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                  <FileText className="h-6 w-6 text-slate-400 group-hover:text-indigo-500 transition-colors mb-1" />
                                  <span className="text-[8px] font-bold text-slate-400 truncate w-full text-center">{doc.name || 'Doc'}</span>
                                </div>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Exit Process Summary — only show if exists */}
          {exitProcess && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-rose-50/50 flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-rose-600" />
                  Exit Process
                </h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${exitProcess.agreementClosed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {exitProcess.agreementClosed ? "COMPLETED" : "IN PROGRESS"}
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Exit Request</p>
                    <p className="text-[13px] font-bold text-slate-900">{exitProcess.exitRequestDate ? format(new Date(exitProcess.exitRequestDate), "MMM dd, yyyy") : "—"}</p>
                  </div>
                  {exitProcess.exitInspectionDate && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Inspection</p>
                      <p className="text-[13px] font-bold text-slate-900">{format(new Date(exitProcess.exitInspectionDate), "MMM dd, yyyy")}</p>
                    </div>
                  )}
                  {exitProcess.moveOutDate && (
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Move-Out</p>
                      <p className="text-[13px] font-bold text-slate-900">{format(new Date(exitProcess.moveOutDate), "MMM dd, yyyy")}</p>
                    </div>
                  )}
                </div>

                {exitProcess.deductions && exitProcess.deductions.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Deductions</p>
                    <div className="space-y-1.5">
                      {exitProcess.deductions.map((d: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-red-50/50 rounded-lg px-3 py-2 border border-red-100/60">
                          <span className="text-[12px] font-bold text-slate-700">{d.type}{d.description ? ` — ${d.description}` : ''}</span>
                          <span className="text-[12px] font-extrabold text-red-600">₹{d.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exitProcess.agreementClosed && (
                  <div className="mt-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-[13px] font-extrabold text-emerald-800">Deposit Refunded</span>
                      </div>
                      <span className="text-[18px] font-black text-emerald-700">₹{exitProcess.depositRefundAmount?.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-600 mt-1">
                      Settled on {exitProcess.depositSettlementDate ? format(new Date(exitProcess.depositSettlementDate), "MMM dd, yyyy") : "—"}
                      {exitProcess.totalDeductions > 0 && ` • ₹${exitProcess.totalDeductions.toLocaleString()} deducted`}
                    </p>
                  </div>
                )}

                {exitProcess.exitInspectionNotes && (
                  <div className="mt-4">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Inspection Notes</p>
                    <p className="text-[12px] font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{exitProcess.exitInspectionNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Renewal History */}
          {renewalHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-600" />
                  Renewal History
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {renewalHistory.length} RENEWAL{renewalHistory.length > 1 ? 'S' : ''}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {renewalHistory.map((r: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="text-[13px] font-extrabold text-slate-900">
                            Renewed on {format(new Date(r.renewedAt), "MMM dd, yyyy")}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400">#{renewalHistory.length - i}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="font-bold text-slate-400">Previous: </span>
                            <span className="font-extrabold text-slate-600">₹{r.previousRent?.toLocaleString()}/mo</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400">New: </span>
                            <span className="font-extrabold text-emerald-700">₹{r.newRent?.toLocaleString()}/mo</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400">Old Lease: </span>
                            <span className="font-extrabold text-slate-600">
                              {format(new Date(r.previousLeaseStart), "MMM yy")} → {r.previousLeaseEnd ? format(new Date(r.previousLeaseEnd), "MMM yy") : "—"}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-400">New Lease: </span>
                            <span className="font-extrabold text-slate-600">
                              {format(new Date(r.newLeaseStart), "MMM yy")} → {r.newLeaseEnd ? format(new Date(r.newLeaseEnd), "MMM yy") : "—"}
                            </span>
                          </div>
                        </div>
                        {r.notes && <p className="text-[11px] font-medium text-slate-500 mt-2 italic">{r.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Current Placement
              </h2>
            </div>
            <div className="p-6">
              {unit && prop ? (
                <div className="space-y-4">
                  {prop.media && prop.media.length > 0 && (
                    <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={prop.media[prop.coverImageIndex || 0]?.url || prop.media[0]?.url} 
                        alt={prop.propertyName} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Property</p>
                    <Link href={`/properties/${prop._id}`} className="flex items-center gap-2 text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <Building className="h-4 w-4" /> {prop.propertyName}
                    </Link>
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div>
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Unit Details</p>
                    <Link href={`/units/${unit._id}`} className="flex items-center gap-2 text-[14px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      <MapPin className="h-4 w-4" /> Unit {unit.unitNumber}
                    </Link>
                    <p className="text-[12px] font-medium text-slate-500 mt-1.5 ml-6">{unit.unitType} • ₹{unit.rentAmount?.toLocaleString()}/mo</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-[13px] font-medium">No active placement assigned.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Notes</h2>
            </div>
            <div className="p-6">
              {tenant.notes ? (
                <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {tenant.notes}
                </p>
              ) : (
                <p className="text-[13px] text-slate-400 text-center py-4">No notes available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRenew && <RenewModal tenant={tenant} onClose={() => setShowRenew(false)} onSuccess={handleSuccess} />}
      {showExit && <ExitModal tenant={tenant} onClose={() => setShowExit(false)} onSuccess={handleSuccess} />}
    </div>
  );
}

export default function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 bg-[#F4F6FA] min-h-screen"><Skeleton className="h-[400px] w-full rounded-2xl" /></div>}>
      <TenantDetailContent params={params} />
    </Suspense>
  );
}
