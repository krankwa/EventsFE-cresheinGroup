import { Button } from "../../components/ui/button";
import type { LucideIcon } from "lucide-react";

interface TableEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function TableEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-2xl bg-muted/5 transition-colors hover:bg-muted/10">
      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group transition-transform duration-500 hover:rotate-12">
        <Icon className="w-8 h-8 text-primary/40 group-hover:text-primary/60 transition-colors" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          variant="outline" 
          className="font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-all px-6 py-2 h-auto"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
