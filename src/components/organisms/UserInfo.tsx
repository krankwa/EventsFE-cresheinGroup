import { User, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

interface UserInfoProps {
  showEmail?: boolean;
  showBadge?: boolean;
  className?: string;
  avatarSize?: string;
}

export function UserInfo({ 
  showEmail = true, 
  showBadge = true, 
  className,
  avatarSize = "w-10 h-10"
}: UserInfoProps) {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-background shadow-sm",
          avatarSize
        )}>
          <User className="w-5 h-5 shadow-inner" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate leading-none mb-1">{user.name}</p>
          {showEmail && (
            <p className="text-[10px] text-muted-foreground truncate leading-none">{user.email}</p>
          )}
        </div>
      </div>
      {showBadge && (
        <div className="flex items-center gap-2">
          <Badge 
            variant={isAdmin ? "default" : "secondary"} 
            className="h-5 text-[10px] uppercase font-bold tracking-widest gap-1 py-0 px-2 leading-none"
          >
            {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
            {user.role}
          </Badge>
        </div>
      )}
    </div>
  );
}
