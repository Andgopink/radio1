import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_SONGS } from "@/lib/mockData";
import { Play, Plus, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import generatedImage from '@assets/generated_images/abstract_dark_digital_sound_wave_album_art.png';

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-muted/30 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img 
          src={generatedImage} 
          alt="Featured" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-0 left-0 p-8 z-20 w-full max-w-3xl">
          <span className="px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
            Featured Mix
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight tracking-tight">
            Neon Nights <br/> <span className="text-muted-foreground">Collection</span>
          </h1>
          <p className="text-muted-foreground mb-6 max-w-lg text-lg">
            A curated selection of synthwave and dark electronic beats for your late night coding sessions.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group-hover:translate-y-[-2px] transition-all">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white/5 backdrop-blur-sm">
              <Plus className="h-5 w-5 mr-2" />
              Add to Library
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tracks, artists, or albums..." 
            className="pl-10 bg-muted/30 border-white/5 focus-visible:ring-primary/50 rounded-full h-12"
          />
        </div>

        {/* Section: Recently Played */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Recently Played</h2>
            <Button variant="link" className="text-muted-foreground hover:text-primary">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {MOCK_SONGS.map((song) => (
              <div key={song.id} className="group space-y-3 cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted relative shadow-lg">
                  <img 
                    src={song.cover} 
                    alt={song.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Button size="icon" className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl scale-90 group-hover:scale-100 transition-transform delay-75">
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium leading-none truncate group-hover:text-primary transition-colors">{song.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Trending */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Trending Now</h2>
          </div>
          <div className="space-y-2">
            {MOCK_SONGS.slice(0, 4).map((song, i) => (
              <div key={song.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 group transition-colors border border-transparent hover:border-white/5">
                <span className="w-6 text-center text-muted-foreground font-mono text-sm">{i + 1}</span>
                <div className="h-12 w-12 rounded bg-muted overflow-hidden relative">
                  <img src={song.cover} alt={song.title} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                    <Play className="h-5 w-5 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate group-hover:text-primary transition-colors">{song.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                </div>
                <div className="hidden md:block text-sm text-muted-foreground w-48 truncate">
                  {song.album}
                </div>
                <div className="hidden sm:block text-sm font-mono text-muted-foreground">
                  {song.duration}
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
