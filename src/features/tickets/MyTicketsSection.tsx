import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { Ticket, Search, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";
import { useMyTickets } from "./useMyTickets";
import { TicketCard } from "../../components/organisms/TicketCard";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
`;

const fadeInSlideUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  gap: 1rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeInSlideUp} 0.5s ease-out;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const TitleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: hsl(var(--foreground));
`;

const Subtitle = styled.p`
  color: hsl(var(--muted-foreground));
`;

const TicketCountBadge = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--primary));
  background-color: hsl(var(--primary) / 0.1);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const EmptyStateIconWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background-color: hsl(var(--muted) / 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${bounce} 3s infinite;
`;

// Context
interface MyTicketsContextType {
  tickets: ReturnType<typeof useMyTickets>["tickets"];
  isLoading: boolean;
  isCancelling: number | null;
  handleCancel: (id: number) => void;
}

const MyTicketsContext = createContext<MyTicketsContextType | undefined>(
  undefined,
);

const useMyTicketsContext = () => {
  const context = useContext(MyTicketsContext);
  if (!context) throw new Error("Must be used within MyTicketsSection");
  return context;
};

export function MyTicketsSection({ children }: { children: ReactNode }) {
  const { tickets, isLoading, isCancelling, handleCancel } = useMyTickets();

  if (isLoading) {
    return (
      <LoadingContainer>
        <Loader2
          style={{
            width: "2.5rem",
            height: "2.5rem",
            color: "hsl(var(--primary))",
            animation: `${spin} 1s linear infinite`,
          }}
        />
        <p style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>
          Fetching your tickets...
        </p>
      </LoadingContainer>
    );
  }

  return (
    <MyTicketsContext.Provider
      value={{ tickets, isLoading, isCancelling, handleCancel }}
    >
      <Container>{children}</Container>
    </MyTicketsContext.Provider>
  );
}

MyTicketsSection.Header = function MyTicketsSectionHeader() {
  const { tickets } = useMyTicketsContext();
  return (
    <HeaderContainer>
      <TitleContent>
        <Title>My Tickets</Title>
        <Subtitle>
          Manage your event registrations and upcoming experiences.
        </Subtitle>
      </TitleContent>
      <TicketCountBadge>{tickets.length} Active Tickets</TicketCountBadge>
    </HeaderContainer>
  );
};

MyTicketsSection.Content = function MyTicketsSectionContent() {
  const { tickets, isCancelling, handleCancel } = useMyTicketsContext();

  if (tickets.length === 0) {
    return (
      <Card className="py-20 bg-muted/10 border-2 border-dashed border-muted/60 rounded-3xl">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
          <EmptyStateIconWrapper>
            <Ticket className="w-10 h-10 text-muted-foreground/60" />
          </EmptyStateIconWrapper>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">No tickets yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Discover amazing experiences and start your journey today.
            </p>
          </div>
          <Link to="/events">
            <Button
              size="lg"
              className="rounded-full px-8 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Search className="w-5 h-5" />
              Explore Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.ticketId}
          ticket={ticket}
          onCancel={handleCancel}
          isCancelling={isCancelling === ticket.ticketId}
        />
      ))}
    </Grid>
  );
};
