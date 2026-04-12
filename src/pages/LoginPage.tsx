import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CalendarDays } from "lucide-react";
import { LoginForm } from "../components/organisms/LoginForm";
import { RegisterForm } from "../components/organisms/RegisterForm";
import { cn } from "../lib/utils";

type Tab = "login" | "register";

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <Card className="w-full max-w-md border-2 shadow-2xl relative z-10 bg-background/80 backdrop-blur-sm">
        {/* Header — always shown */}
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <CalendarDays className="text-primary-foreground w-7 h-7" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">EventTix</CardTitle>
          <CardDescription>
            {activeTab === "login"
              ? "Sign in to manage your events and tickets"
              : "Create your free account and start booking tickets"}
          </CardDescription>
        </CardHeader>

        {/* Tab switcher */}
        <div className="px-6 pb-2">
          <div className="flex rounded-lg bg-muted p-1 gap-1">
            <button
              className={cn(
                "flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200",
                activeTab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("login")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={cn(
                "flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200",
                activeTab === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab("register")}
              type="button"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form content */}
        <CardContent className="pt-4">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>

        {/* Footer hint */}
        <CardFooter className="flex flex-col space-y-2 text-center pt-0">
          {activeTab === "login" ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setActiveTab("register")}
              >
                Sign up for free
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setActiveTab("login")}
              >
                Sign in
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
