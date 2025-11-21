import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_SONGS } from "@/lib/mockData";
import { Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Library() {
  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">Your Library</h1>
          <div className="flex gap-2">
            <Button variant="outline">Artists</Button>
            <Button variant="outline">Albums</Button>
            <Button variant="default" className="bg-primary text-primary-foreground">Songs</Button>
          </div>
        </div>

        <div className="bg-card/50 border border-border rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-[48px_1fr_1fr_1fr_48px] gap-4 p-4 border-b border-border text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <span className="text-center">#</span>
            <span>Title</span>
            <span>Artist</span>
            <span className="hidden md:block">Album</span>
            <span className="text-right">Time</span>
          </div>
          
          <div className="divide-y divide-border/50">
            {[...MOCK_SONGS, ...MOCK_SONGS, ...MOCK_SONGS].map((song, i) => (
              <div key={`${song.id}-${i}`} className="grid grid-cols-[48px_1fr_1fr_1fr_48px] gap-4 p-4 items-center hover:bg-white/5 group transition-colors">
                <div className="flex justify-center">
                  <span className="text-muted-foreground font-mono text-sm group-hover:hidden">{i + 1}</span>
                  <Play className="h-4 w-4 hidden group-hover:block text-primary fill-current cursor-pointer" />
                </div>
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={song.cover} alt="" className="h-10 w-10 rounded object-cover" />
                  <span className="font-medium truncate">{song.title}</span>
                </div>
                <span className="text-muted-foreground truncate">{song.artist}</span>
                <span className="text-muted-foreground truncate hidden md:block">{song.album}</span>
                <span className="text-muted-foreground font-mono text-right">{song.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
