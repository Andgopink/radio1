import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Mic2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_SONGS } from "@/lib/mockData";

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const [currentSong] = useState(MOCK_SONGS[0]);

  // Fake progress animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-24 border-t border-border bg-background/80 backdrop-blur-md flex items-center px-6 gap-6 fixed bottom-0 left-0 right-0 z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-[300px]">
        <div className="h-14 w-14 rounded-md overflow-hidden relative group">
          <img src={currentSong.cover} alt={currentSong.title} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
            <Button size="icon" variant="ghost" className="text-white h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="font-medium text-sm text-foreground truncate">{currentSong.title}</h4>
          <span className="text-xs text-muted-foreground truncate">{currentSong.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground h-10 w-10">
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>
          <Button 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20",
              isPlaying && "animate-pulse"
            )}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground h-10 w-10">
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-full flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>1:24</span>
          <Slider 
            value={[progress]} 
            max={100} 
            step={1} 
            className="w-full cursor-pointer"
            onValueChange={(v) => setProgress(v[0])}
          />
          <span>{currentSong.duration}</span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="flex items-center gap-4 w-[300px] justify-end">
        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
          <Mic2 className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
        </div>
      </div>
    </div>
  );
}
