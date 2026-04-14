import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { Plus, TrendingUp, CalendarDays, Loader2 } from "lucide-react";
import {
  AdminSectionContainer,
  DashboardHeaderContainer,
  AdminHeaderText,
  AdminTitle,
  AdminSubtitle,
} from "./adminSectionStyles";
import { NotFound } from "../../components/molecules/NotFound";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatsGrid } from "../../components/organisms/StatsGrid";
import {
  dashboardService,
  type DashboardStats,
} from "../../services/dashboardService";
import { format } from "date-fns";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
  border: 2px dashed hsl(var(--border) / 0.6);
  border-radius: var(--radius);
  background-color: hsl(var(--muted) / 0.05);

  > svg {
    opacity: 0.2;
    margin-bottom: 1rem;
    width: 3rem;
    height: 3rem;
  }
  > p:first-of-type {
    font-size: 0.875rem;
    font-weight: 500;
  }
  > p:last-of-type {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 0;
  color: hsl(var(--primary) / 0.4);
  > svg {
    animation: ${spin} 1s linear infinite;
  }
`;

const EventRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: default;

  .image-wrapper {
    width: 3rem;
    height: 3rem;
    border-radius: 0.25rem;
    overflow: hidden;
    background-color: hsl(var(--muted));
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }
  }

  &:hover .image-wrapper img {
    transform: scale(1.1);
  }

  .content {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }
  }

  .stats {
    text-align: right;

    .revenue {
      font-size: 0.875rem;
      font-weight: 700;
      color: rgb(5 150 105); /* emerald-600 */
    }

    .sold {
      font-size: 10px;
      font-weight: 500;
      color: hsl(var(--muted-foreground));
    }
  }
`;


interface DashboardContextType {
  stats: DashboardStats | null;
  loading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("Must be used within DashboardSection");
  return context;
};

export function DashboardSection({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <DashboardContext.Provider value={{ stats, loading }}>
      <AdminSectionContainer>{children}</AdminSectionContainer>
    </DashboardContext.Provider>
  );
}

DashboardSection.Header = function DashboardSectionHeader() {
  return (
    <DashboardHeaderContainer>
      <AdminHeaderText>
        <AdminTitle>Dashboard</AdminTitle>
        <AdminSubtitle>
          Welcome back! Here's what's happening with your events today.
        </AdminSubtitle>
      </AdminHeaderText>
      <Button className="gap-2 shadow-lg shadow-primary/20">
        <Plus style={{ width: "1rem", height: "1rem" }} />
        Create Event
      </Button>
    </DashboardHeaderContainer>
  );
};

DashboardSection.Stats = function DashboardSectionStats() {
  return <StatsGrid />;
};

DashboardSection.Content = function DashboardSectionContent() {
  const { stats, loading } = useDashboardContext();

  return (
    <GridContainer>
      <Card className="col-span-4" style={{ gridColumn: "span 4 / span 4" }}>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            {stats
              ? `You have sold ${stats.totalTicketsSold.toLocaleString()} tickets in total.`
              : "Loading sales data..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder>
            <TrendingUp />
            <p>Sales Charting coming soon</p>
            <p>Visualizing your growth trends</p>
          </ChartPlaceholder>
        </CardContent>
      </Card>

      <Card className="col-span-3" style={{ gridColumn: "span 3 / span 3" }}>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
          <CardDescription>Based on ticket conversion rates.</CardDescription>
        </CardHeader>
        <CardContent
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {loading ? (
            <LoadingWrapper>
              <Loader2 style={{ width: "2rem", height: "2rem" }} />
            </LoadingWrapper>
          ) : stats?.topEvents && stats.topEvents.length > 0 ? (
            stats.topEvents.map((event) => (
              <EventRow key={event.eventID}>
                <div className="image-wrapper">
                  {event.coverImageUrl ? (
                    <img src={event.coverImageUrl} alt={event.title} />
                  ) : (
                    <CalendarDays
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        color: "hsl(var(--muted-foreground) / 0.4)",
                      }}
                    />
                  )}
                </div>
                <div className="content">
                  <p className="title">{event.title}</p>
                  <p className="date">
                    {format(new Date(event.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="stats">
                  <div className="revenue">
                    ₱
                    {(
                      event.tiers?.reduce(
                        (acc, t) => acc + t.ticketsSold * t.price,
                        0,
                      ) ?? 0
                    ).toLocaleString()}
                  </div>
                  <p className="sold">{event.ticketsSold} sold</p>
                </div>
              </EventRow>
            ))
          ) : (
            <NotFound>No event data available yet.</NotFound>
          )}
        </CardContent>
      </Card>
    </GridContainer>
  );
};
