import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { Search, RefreshCcw, ShieldAlert } from "lucide-react";
import {
  AdminSectionContainer,
  AdminHeaderContainer,
  AdminHeaderText,
  AdminTitle,
  AdminSubtitle,
} from "./adminSectionStyles";
import { userService } from "../../services/userService";
import type { UserResponse } from "../../interface/Auth.interface";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { UsersTable } from "../../components/organisms/UsersTable";
import { toast } from "react-hot-toast";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CardHeaderInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.5rem;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 768px) {
    width: 16rem;
  }
`;

const SearchInput = styled.input`
  height: 2.5rem;
  width: 100%;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  font-size: 0.875rem;
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
`;

const BottomGrid = styled.div`
  display: grid;
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SecurityNote = styled.div`
  border-radius: var(--radius);
  border: 2px dashed hsl(var(--border) / 0.6);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: hsl(var(--muted) / 0.2);

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    background-color: hsl(var(--primary) / 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--primary));
  }

  .content {
    flex: 1;

    h3 {
      font-size: 0.875rem;
      font-weight: 600;
    }

    p {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }
  }
`;

interface UsersManagementContextType {
  users: UserResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  loadUsers: (showRefresh?: boolean) => Promise<void>;
  handlePromote: (user: UserResponse) => Promise<void>;
}

const UsersManagementContext = createContext<
  UsersManagementContextType | undefined
>(undefined);

const useUsersContext = () => {
  const context = useContext(UsersManagementContext);
  if (!context) throw new Error("Must be used within UsersManagementSection");
  return context;
};

export function UsersManagementSection({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUsers = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("Failed to load the user list.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (user: UserResponse) => {
    const confirmed = window.confirm(
      `Are you sure you want to appoint ${user.name} as an administrator? This grants full management permissions.`,
    );

    if (!confirmed) return;

    try {
      await userService.update(user.userId, { role: "Admin" });
      toast.success(`${user.name} is now an administrator.`);
      loadUsers(); // Refresh list
    } catch (error) {
      console.error("Failed to promote user", error);
      toast.error("Failed to update user role.");
    }
  };

  return (
    <UsersManagementContext.Provider
      value={{ users, isLoading, isRefreshing, loadUsers, handlePromote }}
    >
      <AdminSectionContainer>{children}</AdminSectionContainer>
    </UsersManagementContext.Provider>
  );
}

UsersManagementSection.Header = function UsersManagementSectionHeader() {
  const { loadUsers, isRefreshing } = useUsersContext();
  return (
    <AdminHeaderContainer>
      <AdminHeaderText>
        <AdminTitle>System Users</AdminTitle>
        <AdminSubtitle>
          Manage user accounts and administrative permissions.
        </AdminSubtitle>
      </AdminHeaderText>
      <Button
        variant="outline"
        className="gap-2 focus-visible:ring-offset-2"
        onClick={() => loadUsers(true)}
        disabled={isRefreshing}
      >
        <RefreshCcw
          style={{
            width: "1rem",
            height: "1rem",
            animation: isRefreshing ? `${spin} 1s linear infinite` : "none",
          }}
        />
        Refresh
      </Button>
    </AdminHeaderContainer>
  );
};

UsersManagementSection.Content = function UsersManagementSectionContent() {
  const { users, isLoading, handlePromote } = useUsersContext();
  return (
    <>
      <Card>
        <CardHeaderInner
          style={{ padding: "1.5rem 1.5rem 1.5rem", paddingBottom: "1.5rem" }}
        >
          <div className="space-y-1">
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Total of {users.length} registered accounts.
            </CardDescription>
          </div>
          <SearchInputWrapper>
            <Search
              style={{
                position: "absolute",
                left: "0.625rem",
                top: "0.625rem",
                height: "1rem",
                width: "1rem",
                color: "hsl(var(--muted-foreground))",
              }}
            />
            <SearchInput
              type="search"
              placeholder="Search by name or email..."
            />
          </SearchInputWrapper>
        </CardHeaderInner>
        <CardContent>
          <UsersTable
            users={users || []}
            onPromote={handlePromote}
            onEdit={async () => {}}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      <BottomGrid>
        <SecurityNote>
          <div className="icon">
            <ShieldAlert style={{ width: "1.25rem", height: "1.25rem" }} />
          </div>
          <div className="content">
            <h3>Security Note</h3>
            <p>
              Promoted users will have full access to database records, events,
              and ticket management.
            </p>
          </div>
        </SecurityNote>
      </BottomGrid>
    </>
  );
};
