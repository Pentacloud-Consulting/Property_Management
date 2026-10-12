import { ReactNode } from "react";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = <FolderSearch className="w-12 h-12 text-muted-foreground/50" />,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center border-2 border-dashed rounded-xl bg-muted/10",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-sm mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
