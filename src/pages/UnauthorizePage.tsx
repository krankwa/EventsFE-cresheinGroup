import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShieldAlert } from "lucide-react";

export function UnauthorizePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 p-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        You do not have the necessary permissions to access this page. Please contact your system administrator if you believe this is an error.
      </p>
      <Button asChild>
        <Link to="/">Back to Safety</Link>
      </Button>
    </div>
  );
}
