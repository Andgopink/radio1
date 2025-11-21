import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/mockData";
import { Link, useLocation } from "wouter";
import { Settings, LogOut, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar/50 backdrop-blur-xl h-full">
      <div className="p-6 flex items-center gap-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Command className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">Navidrome AI</span>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground transition-all",
                location === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
        
        <div className="pt-8 px-3 text-xs font-mono text-muted-foreground/50 uppercase tracking-wider mb-2">
          Your Collection
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Synthwave Essentials
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Cyberpunk 2077
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Coding Focus
        </Button>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
