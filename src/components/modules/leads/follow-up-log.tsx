"use client";

import { useState } from "react";
import useSWR from "swr";
import { format } from "date-fns";
import { Loader2, Plus, MessageSquare, PhoneCall, Calendar as CalendarIcon, User, Activity } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function FollowUpLog({ leadId }: { leadId: string }) {
  const { data, error, mutate } = useSWR(`/api/leads/${leadId}/follow-ups`, fetcher);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("Note");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const logs = data?.data || [];

  const handleAdd = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/follow-ups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, date }),
      });

      if (!res.ok) throw new Error("Failed to add follow-up");
      
      toast.success("Follow-up added");
      setDescription("");
      setIsAdding(false);
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (logAction: string, type?: string) => {
    if (logAction === 'created') return <User className="h-3.5 w-3.5 text-blue-600" />;
    if (logAction === 'converted') return <User className="h-3.5 w-3.5 text-emerald-600" />;
    if (type === 'Call') return <PhoneCall className="h-3.5 w-3.5 text-orange-600" />;
    if (type === 'Meeting') return <CalendarIcon className="h-3.5 w-3.5 text-purple-600" />;
    return <MessageSquare className="h-3.5 w-3.5 text-slate-600" />;
  };

  const getIconBg = (logAction: string, type?: string) => {
    if (logAction === 'created') return "bg-blue-100/80 border-blue-200/50";
    if (logAction === 'converted') return "bg-emerald-100/80 border-emerald-200/50";
    if (type === 'Call') return "bg-orange-100/80 border-orange-200/50";
    if (type === 'Meeting') return "bg-purple-100/80 border-purple-200/50";
    return "bg-slate-100 border-slate-200/60";
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-slate-100/80 bg-slate-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/50 flex items-center justify-center text-slate-700 shadow-sm">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Activity Log</h2>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Timeline & follow-ups</p>
          </div>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="h-8 gap-1.5 inline-flex items-center justify-center bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg shadow-sm border border-slate-200 px-3 text-[12px] font-bold transition-all">
            <Plus className="h-3.5 w-3.5" /> Add Activity
          </button>
        )}
      </div>

      <div className="p-6 flex-1">
        {isAdding && (
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-inner mb-6 animate-in fade-in zoom-in-95 duration-200">
            <h4 className="text-[13px] font-extrabold text-slate-900 mb-4">New Follow-up</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
                <Select value={type} onValueChange={(val) => setType(val as string)}>
                  <SelectTrigger className="h-9 bg-white border-slate-200 text-[13px] font-bold rounded-lg shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Note">Note</SelectItem>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 bg-white border-slate-200 text-[13px] font-bold rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="space-y-1.5 mb-5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Details</label>
              <Textarea 
                placeholder="What was discussed?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none bg-white border-slate-200 text-[13px] font-medium rounded-xl shadow-sm min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" variant="ghost" className="h-8 text-[12px] font-bold rounded-lg hover:bg-slate-100" onClick={() => setIsAdding(false)}>Cancel</Button>
              <button onClick={handleAdd} disabled={isLoading} className="h-8 gap-1.5 inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm border border-blue-700/20 px-4 text-[12px] font-bold transition-all disabled:opacity-50">
                {isLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Save Activity
              </button>
            </div>
          </div>
        )}

        {!data && !error && (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
        )}

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-slate-200 before:via-slate-100 before:to-transparent">
          {logs.map((log: any) => (
            <div key={log._id} className="relative flex items-start gap-4 group">
              <div className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform ${getIconBg(log.action, log.metadata?.type)}`}>
                {getIcon(log.action, log.metadata?.type)}
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all group-hover:border-slate-200">
                <div className="flex justify-between items-center mb-2.5">
                  <div className="font-extrabold text-[13px] text-slate-900 flex items-center gap-2 tracking-tight">
                    {log.action === 'follow_up' ? log.metadata?.type || 'Note' : log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                    {log.action === 'converted' && <span className="text-[9px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md shadow-sm">Success</span>}
                  </div>
                  <time className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {format(new Date(log.metadata?.date || log.createdAt), "MMM d, yyyy h:mm a")}
                  </time>
                </div>
                <p className="text-[12px] font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">{log.description}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && data && (
            <div className="text-center p-8 text-[13px] font-bold text-slate-400">No activity recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
