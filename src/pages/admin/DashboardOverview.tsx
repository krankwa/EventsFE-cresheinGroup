import { DashboardSection } from "../../features/admin/DashboardSection";

export function DashboardOverview() {
  return (
    <DashboardSection>
      <DashboardSection.Header />
      <DashboardSection.Stats />
      <DashboardSection.Content />
    </DashboardSection>
  );
}
