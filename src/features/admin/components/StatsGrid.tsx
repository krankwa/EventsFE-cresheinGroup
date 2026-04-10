import { 
  ArrowUpRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

import { ADMIN_STATS } from "../constants";

export function StatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {ADMIN_STATS.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
