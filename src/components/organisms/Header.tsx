import { Menu } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-10 border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
{/* 
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-[10px]">
            12
          </Badge>
        </div>

        <Link to="/admin/settings">
          <Button variant="ghost" size="icon" className="rounded-full border border-border/50">
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div> */}
    </header>
  );
}
