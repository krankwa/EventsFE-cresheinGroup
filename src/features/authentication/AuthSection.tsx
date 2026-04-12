import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils";

type Tab = "login" | "register";

interface AuthContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "Auth components must be used within an AuthSection provider",
    );
  }
  return context;
};

const SectionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--muted) / 0.3);
  padding: 1rem;
  position: relative;
  overflow: hidden;
`;

const BlobTopRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 24rem;
  height: 24rem;
  background-color: hsl(var(--primary) / 0.05);
  border-radius: 9999px;
  filter: blur(100px);
  margin-right: -12rem;
  margin-top: -12rem;
  pointer-events: none;
`;

const BlobBottomLeft = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  background-color: hsl(var(--primary) / 0.05);
  border-radius: 9999px;
  filter: blur(100px);
  margin-left: -12rem;
  margin-bottom: -12rem;
  pointer-events: none;
`;

const CardWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  border-width: 2px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  position: relative;
  z-index: 10;
  background-color: hsl(var(--background) / 0.8);
  backdrop-filter: blur(4px);
  border-radius: var(--radius);
`;

const HeaderContainer = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
`;

const IconWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px hsl(var(--primary) / 0.2);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

export function AuthSection({
  children,
  initialTab = "login",
}: {
  children: ReactNode;
  initialTab?: Tab;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <AuthContext.Provider value={{ activeTab, setActiveTab }}>
      <SectionContainer>
        <BlobTopRight />
        <BlobBottomLeft />
        <CardWrapper>{children}</CardWrapper>
      </SectionContainer>
    </AuthContext.Provider>
  );
}

AuthSection.Header = function AuthSectionHeader() {
  const { activeTab } = useAuthContext();
  return (
    <HeaderContainer>
      <IconWrapper>
        <CalendarDays
          style={{
            width: "1.75rem",
            height: "1.75rem",
            color: "hsl(var(--primary-foreground))",
          }}
        />
      </IconWrapper>
      <Title>EventTix</Title>
      <Description>
        {activeTab === "login"
          ? "Sign in to manage your events and tickets"
          : "Create your free account and start booking tickets"}
      </Description>
    </HeaderContainer>
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
              : "text-muted-foreground hover:text-foreground",
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
              : "text-muted-foreground hover:text-foreground",
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

AuthSection.Footer = function AuthSectionFooter() {
  const { activeTab, setActiveTab } = useAuthContext();
  return (
    <div className="flex flex-col space-y-2 text-center px-6 pb-6 pt-0">
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
    </div>
  );
};
