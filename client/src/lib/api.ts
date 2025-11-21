import type { 
  Playlist, 
  InsertPlaylist, 
  Track, 
  InsertTrack,
  Settings,
  InsertSettings 
} from "@shared/schema";

// Playlist API
export async function getPlaylists(): Promise<Playlist[]> {
  const res = await fetch("/api/playlists");
  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
}

export async function getPlaylist(id: number): Promise<Playlist> {
  const res = await fetch(`/api/playlists/${id}`);
  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json();
}

export async function createPlaylist(data: InsertPlaylist): Promise<Playlist> {
  const res = await fetch("/api/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create playlist");
  return res.json();
}

export async function updatePlaylist(id: number, data: Partial<InsertPlaylist>): Promise<Playlist> {
  const res = await fetch(`/api/playlists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update playlist");
  return res.json();
}

export async function deletePlaylist(id: number): Promise<void> {
  const res = await fetch(`/api/playlists/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete playlist");
}

export async function getPlaylistTracks(playlistId: number): Promise<Track[]> {
  const res = await fetch(`/api/playlists/${playlistId}/tracks`);
  if (!res.ok) throw new Error("Failed to fetch playlist tracks");
  return res.json();
}

export async function addTrackToPlaylist(playlistId: number, trackId: number, position?: number): Promise<void> {
  const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackId, position }),
  });
  if (!res.ok) throw new Error("Failed to add track to playlist");
}

export async function removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<void> {
  const res = await fetch(`/api/playlists/${playlistId}/tracks/${trackId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove track from playlist");
}

// Track API
export async function getTracks(): Promise<Track[]> {
  const res = await fetch("/api/tracks");
  if (!res.ok) throw new Error("Failed to fetch tracks");
  return res.json();
}

export async function createTrack(data: InsertTrack): Promise<Track> {
  const res = await fetch("/api/tracks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create track");
  return res.json();
}

export async function deleteTrack(id: number): Promise<void> {
  const res = await fetch(`/api/tracks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete track");
}

// Settings API
export async function getSettings(): Promise<Settings | null> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  const data = await res.json();
  return data.id ? data : null;
}

export async function updateSettings(data: InsertSettings): Promise<Settings> {
  const res = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

// Navidrome API
export async function testNavidromeConnection(
  url: string, 
  username: string, 
  token: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch("/api/navidrome/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      navidromeUrl: url, 
      navidromeUsername: username, 
      navidromeToken: token 
    }),
  });
  return res.json();
}

export async function searchNavidrome(query: string): Promise<InsertTrack[]> {
  const res = await fetch("/api/navidrome/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to search Navidrome");
  return res.json();
}

export async function importArtist(artist: string): Promise<{ success: boolean; count: number; tracks: Track[] }> {
  const res = await fetch("/api/navidrome/import-artist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artist }),
  });
  if (!res.ok) throw new Error("Failed to import artist");
  return res.json();
}
