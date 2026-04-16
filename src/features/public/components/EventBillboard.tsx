import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { EventResponse } from "../../../interface/Event.interface";

interface EventBillboardProps {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
  isLoggedIn: boolean;
}

export function EventBillboard({
  event,
  onBook,
  isLoggedIn,
}: EventBillboardProps) {
  return (
    <div className="relative w-full rounded-[40px] overflow-hidden bg-blue-950 text-white shadow-2xl group animate-reveal">
      <div className="absolute inset-0">
        {event.coverImageUrl && (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-60 transition-transform duration-[3s] group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/60 to-transparent" />
      </div>

      <div className="relative z-10 p-8 md:p-16 max-w-2xl flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
        <Badge className="w-fit bg-blue-600 text-white border-none mb-6 px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">
          🔥 Spotlight Experience
        </Badge>
        
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
          {event.title}
        </h2>
        
        <div className="flex flex-wrap gap-6 mb-10 text-blue-100/80 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            {format(new Date(event.date), "MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            {event.venue}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-white text-blue-950 hover:bg-blue-50 px-10 py-7 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            onClick={() => onBook(event)}
          >
            {isLoggedIn ? "Secure Your Entry" : "Discover More"}
          </Button>
        </div>
      </div>
    </div>
  );
}
