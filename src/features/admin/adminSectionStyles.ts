import styled from "styled-components";

export const AdminSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const AdminHeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AdminTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.025em;
`;

export const AdminSubtitle = styled.p`
  color: hsl(var(--muted-foreground));
`;

// Used by EventsManagement and UsersManagement (column on mobile, row on sm+)
export const AdminHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

// Used by Dashboard (always flex-row)
export const DashboardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
