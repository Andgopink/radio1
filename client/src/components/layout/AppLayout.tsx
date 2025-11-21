import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Player } from "./Player";
import { ChatSidebar } from "./ChatSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col relative z-10 pb-24">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
      <ChatSidebar />
      <Player />
    </div>
  );
}
