import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AccountHeaderProps {
    user: { name: string; email: string };
    isAdmin: boolean;
}

export function AccountHeader({ user, isAdmin }: AccountHeaderProps) {
    const navigate = useNavigate();

    return (
        <div>
            <Button
                variant="ghost"
                size="sm"
                className="gap-2 mb-4 -ml-2 text-muted-foreground"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {isAdmin ? <ShieldCheck className="w-7 h-7" /> : <User className="w-7 h-7" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                        <Badge variant={isAdmin ? "default" : "secondary"}>
                            {isAdmin ? "Admin" : "User"}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
        </div>
    );
}