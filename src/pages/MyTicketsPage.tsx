import { Ticket, Calendar, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";

export function MyTicketsPage() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground">Manage and view your event registrations and upcoming attendances.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Empty State */}
        <Card className="col-span-full py-20 bg-muted/20 border-2 border-dashed border-muted/60">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Ticket className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">No tickets yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                You haven't registered for any events. Start exploring to find amazing experiences!
              </p>
            </div>
            <Button className="mt-4 gap-2" variant="default">
              <Search className="w-4 h-4" />
              Browse Events
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Events Section (Placeholder for aesthetic) */}
      <div className="space-y-6 pt-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Recommended for you
        </h2>
        <div className="grid gap-6 md:grid-cols-3 opacity-40 grayscale pointer-events-none">
           {[1, 2, 3].map(i => (
             <Card key={i}>
                <div className="h-32 bg-muted transition-pulse animate-pulse" />
                <CardHeader>
                  <CardTitle className="text-sm">Sample Event {i}</CardTitle>
                  <CardDescription>Loading suggestions...</CardDescription>
                </CardHeader>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
