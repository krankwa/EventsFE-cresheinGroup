import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { CalendarDays } from "lucide-react";
import { LoginForm } from "../components/organisms/LoginForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <Card className="w-full max-w-md border-2 shadow-2xl relative z-10 bg-background/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
             <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <CalendarDays className="text-primary-foreground w-7 h-7" />
             </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">EventTix</CardTitle>
          <CardDescription>
            Sign in to manage your events and tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have access? <span className="text-primary font-medium hover:underline cursor-pointer">Contact system administrator</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}