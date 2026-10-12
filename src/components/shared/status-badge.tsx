import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] || "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border-transparent", colorClass, className)}
    >
      {status}
    </Badge>
  );
}
