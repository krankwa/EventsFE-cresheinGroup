import { Calendar, MapPin, Users, ArrowRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import type { EventResponse } from "../../../interface/Event.interface";

interface LandingEventCardProps {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
  isLoggedIn: boolean;
  isRecommended?: boolean;
}

export function LandingEventCard({
  event,
  onBook,
  isLoggedIn,
  isRecommended = false,
}: LandingEventCardProps) {
  const capacity = event.capacity && event.capacity > 0 ? event.capacity : 1;
  const sold = event.ticketsSold || 0;
  const isSoldOut = sold >= capacity;
  const fillPct = Math.min((sold / capacity) * 100, 100);

  return (
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-700 border-none bg-white/40 backdrop-blur-md ring-1 ring-blue-950/5 hover:-translate-y-2 active:scale-[0.98] ${isRecommended ? 'w-[280px] xs:w-[300px] md:w-[400px] shrink-0' : 'w-full'}`}>
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-950/20 to-blue-950/5 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-blue-950/20" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isRecommended && (
            <Badge className="bg-blue-600 text-white border-none shadow-lg text-[10px] uppercase tracking-widest font-bold py-1 px-2 animate-pulse">
              ✨ For You
            </Badge>
          )}
          <Badge className="bg-white/90 backdrop-blur-md text-blue-950 border-none shadow-sm text-[10px] uppercase tracking-widest font-bold py-1 px-2">
            Upcoming
          </Badge>
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
            <Badge
              variant="destructive"
              className="px-6 py-2 text-xs font-black uppercase tracking-[0.2em]"
            >
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base md:text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <span className="text-blue-900 font-black text-xs md:text-base whitespace-nowrap">
            ₱999+
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          </div>
          <span className="font-medium tracking-tight">
            {format(new Date(event.date), "MMMM d, yyyy")}
          </span>
        </div>
        
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.venueAddress}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 text-sm text-gray-500 hover:text-blue-700 transition-colors group/map"
        >
          <div className="p-1.5 rounded-full bg-blue-50 group-hover/map:bg-blue-100 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover/map:animate-bounce" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 leading-tight">
              {event.venue || "TBA"}
            </span>
            <span className="text-xs text-gray-400 line-clamp-1 mt-0.5">
              {event.venueAddress}
            </span>
          </div>
        </a>

        {/* Capacity bar */}
        <div className="pt-3 md:pt-4 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              {sold} / {capacity} ATTENDEES
            </span>
            <span>{Math.round(fillPct)}%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${fillPct > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4">
        <Button
          className={`w-full py-6 gap-3 font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 group/btn rounded-xl shadow-sm ${isSoldOut ? 'bg-gray-100 text-gray-400' : 'bg-blue-950 hover:bg-blue-900 text-white shadow-blue-950/10 hover:shadow-blue-950/30'}`}
          disabled={isSoldOut}
          onClick={() => onBook(event)}
        >
          {isSoldOut ? (
            "Fully Booked"
          ) : !isLoggedIn ? (
            <>
              Explore Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
            </>
          ) : (
            <>
              Reserve Seat
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
