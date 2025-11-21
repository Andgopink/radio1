import { Music, Disc, Heart, Radio, Mic2, User, Settings, Home } from "lucide-react";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
    duration: "4:03"
  },
  {
    id: "2",
    title: "Nightcall",
    artist: "Kavinsky",
    album: "OutRun",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
    duration: "4:18"
  },
  {
    id: "3",
    title: "Resonance",
    artist: "HOME",
    album: "Odyssey",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
    duration: "3:32"
  },
  {
    id: "4",
    title: "After Dark",
    artist: "Mr. Kitty",
    album: "Time",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop",
    duration: "4:11"
  },
  {
    id: "5",
    title: "Space Song",
    artist: "Beach House",
    album: "Depression Cherry",
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    duration: "5:21"
  }
];

export const NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Disc, label: "Library", path: "/library" },
  { icon: Radio, label: "Radio", path: "/radio" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
];

export const INITIAL_CHAT: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello. I am your AI music curator. I can generate playlists based on your mood, find similar tracks, or control the playback. What shall we listen to?",
    timestamp: new Date()
  }
];
