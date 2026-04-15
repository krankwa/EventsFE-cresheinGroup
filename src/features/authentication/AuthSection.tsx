import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.png";

type Tab = "login" | "register";

interface AuthContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth components must be used within an AuthSection provider");
  return context;
};

export function AuthSection({
  children,
  initialTab = "login",
}: {
  children: ReactNode;
  initialTab?: Tab;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const teamMembers = [
    { name: "Creishen", github: "https://github.com/creishen" },
    { name: "Kyle", github: "https://github.com/KyleBorja/KyleBorja" },
    { name: "Kent", github: "https://github.com/krankwa" },
    { name: "Kurt", github: "https://github.com/keken2021" },
  ];

  return (
    <AuthContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48 animate-pulse delay-1000" />

        {/* Auth Card */}
        <div className="w-full max-w-md bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl z-10 transition-transform hover:scale-[1.02] duration-300">
          {children}
        </div>

        {/* Centered Footer */}
        <footer className="w-full max-w-md mt-6 z-10">
          <div className="bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl px-6 py-3 text-center transition-all hover:bg-background/95 hover:border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-2">
              © 2026 RBT INTERN GROUP 3 — EventTix
            </p>
            <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
              <span className="text-muted-foreground">Developed by:</span>
              {teamMembers.map((member, idx) => (
                <span key={member.name}>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary font-semibold transition-colors hover:underline underline-offset-2"
                  >
                    {member.name}
                  </a>
                  {idx < teamMembers.length - 1 && (
                    <span className="text-border mx-1">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}

AuthSection.Header = function AuthSectionHeader() {
  const { activeTab } = useAuthContext();
  return (
    <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center">

      <div className=" flex items-center justify-center mb-4 transition-transform hover:scale-105 overflow-hidden p-2">
        <img
          src={logo}
          alt="EventTix Logo"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
        EventTix
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-[80%]">
        {activeTab === "login"
          ? "Sign in to manage your events and tickets"
          : "Create your free account and start booking tickets"}
      </p>
    </div>
  );
};

AuthSection.Tabs = function AuthSectionTabs() {
  const { activeTab, setActiveTab } = useAuthContext();
  return (
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
  );
};

AuthSection.Content = function AuthSectionContent({
  loginComponent,
  registerComponent,
}: {
  loginComponent: ReactNode;
  registerComponent: ReactNode;
}) {
  const { activeTab } = useAuthContext();
  return (
    <div className="px-6 pt-4 pb-6">
      {activeTab === "login" ? loginComponent : registerComponent}
    </div>
  );
};