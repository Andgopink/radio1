import { AppLayout } from "@/components/layout/AppLayout";
import { Radio as RadioIcon, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Radio() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
          <RadioIcon className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">AI Radio Stations</h1>
        <p className="text-muted-foreground max-w-md mb-8 text-lg">
          Tune in to procedurally generated stations based on your listening habits and mood analysis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {["Neon City", "Code Flow", "Deep Focus", "Midnight Drive"].map((station) => (
            <div key={station} className="p-6 rounded-xl border border-border bg-card/50 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group text-left">
              <div className="flex items-center justify-between mb-2">
                <Signal className="h-5 w-5 text-primary" />
                <span className="text-xs font-mono text-green-500 uppercase">Live</span>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{station}</h3>
              <p className="text-sm text-muted-foreground">Curated by AI for optimal vibe.</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
