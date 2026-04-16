import React from "react";
import { Ticket, Clock, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface TicketStatsProps {
  total: number;
  upcoming: number;
  redeemed: number;
  past: number;
}

export function TicketStats({
  total,
  upcoming,
  redeemed,
  past,
}: TicketStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Tickets"
        value={total}
        icon={Ticket}
        color="bg-primary/10 text-primary"
      />
      <StatCard
        label="Upcoming"
        value={upcoming}
        icon={Clock}
        color="bg-blue-500/10 text-blue-500"
      />
      <StatCard
        label="Redeemed"
        value={redeemed}
        icon={CheckCircle2}
        color="bg-green-500/10 text-green-600"
      />
      <StatCard
        label="Past (Unredeemed)"
        value={past}
        icon={Users}
        color="bg-muted text-muted-foreground"
      />
    </div>
  );
}
