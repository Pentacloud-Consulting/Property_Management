import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "Up" | "Down" | "Neutral";
  color?: "indigo" | "emerald" | "blue" | "orange" | "amber" | "red";
}

export function MetricCard({ title, value, icon: Icon, trend, color = "indigo" }: MetricCardProps) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  const bgStyle = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.06)] p-5 relative overflow-hidden group hover:border-slate-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bgStyle}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className="flex items-center text-[11px] font-bold">
            {trend === "Up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
            {trend === "Down" && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
            {trend === "Neutral" && <Minus className="h-3.5 w-3.5 text-slate-400" />}
          </div>
        )}
      </div>
      <div>
        <p className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
