import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPlaylistSchema, 
  insertTrackSchema, 
  insertPlaylistTrackSchema,
  insertSettingsSchema 
} from "@shared/schema";
import { createNavidromeService } from "./navidrome";
import { generateToken, verifyToken, extractTokenFromHeader } from "./auth";

// Middleware to check authentication
function requireAuth(req: any, res: any, next: any) {
  const token = extractTokenFromHeader(req.headers.authorization);
  
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Missing credentials" });
      }
      
      // For demo: accept any non-empty username/password
      // In production, verify against actual user database
      const token = generateToken(username);
      res.json({ token, username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Playlist Routes (protected)
  app.get("/api/playlists", requireAuth, async (req, res) => {
    try {
      const playlists = await storage.getAllPlaylists();
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  });

  app.get("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.getPlaylist(id);
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      res.json(playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ error: "Failed to fetch playlist" });
    }
  });

  app.post("/api/playlists", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(400).json({ error: "Invalid playlist data" });
    }
  });

  app.patch("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.updatePlaylist(id, req.body);
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
      
      res.json(playlist);
    } catch (error) {
      console.error("Error updating playlist:", error);
      res.status(500).json({ error: "Failed to update playlist" });
    }
  });

  app.delete("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlaylist(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      res.status(500).json({ error: "Failed to delete playlist" });
    }
  });

  // Playlist Tracks Routes (protected)
  app.get("/api/playlists/:id/tracks", requireAuth, async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const tracks = await storage.getPlaylistTracks(playlistId);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
      res.status(500).json({ error: "Failed to fetch playlist tracks" });
    }
  });

  app.post("/api/playlists/:id/tracks", requireAuth, async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const { trackId, position } = req.body;
      
      const validatedData = insertPlaylistTrackSchema.parse({
        playlistId,
        trackId,
        position: position || 0,
      });
      
      const playlistTrack = await storage.addTrackToPlaylist(validatedData);
      res.status(201).json(playlistTrack);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      res.status(400).json({ error: "Failed to add track to playlist" });
    }
  });

  app.delete("/api/playlists/:playlistId/tracks/:trackId", requireAuth, async (req, res) => {
    try {
      const playlistId = parseInt(req.params.playlistId);
      const trackId = parseInt(req.params.trackId);
      
      await storage.removeTrackFromPlaylist(playlistId, trackId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing track from playlist:", error);
      res.status(500).json({ error: "Failed to remove track from playlist" });
    }
  });

  // Track Routes (protected)
  app.get("/api/tracks", requireAuth, async (req, res) => {
    try {
      const tracks = await storage.getAllTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).json({ error: "Failed to fetch tracks" });
    }
  });

  app.post("/api/tracks", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTrackSchema.parse(req.body);
      const track = await storage.createTrack(validatedData);
      res.status(201).json(track);
    } catch (error) {
      console.error("Error creating track:", error);
      res.status(400).json({ error: "Invalid track data" });
    }
  });

  app.delete("/api/tracks/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTrack(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ error: "Failed to delete track" });
    }
  });

  // Settings Routes (protected)
  app.get("/api/settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  // Navidrome Integration Routes (protected)
  app.post("/api/navidrome/test", requireAuth, async (req, res) => {
    try {
      const { navidromeUrl, navidromeUsername, navidromeToken } = req.body;
      
      const service = await createNavidromeService({
        url: navidromeUrl,
        username: navidromeUsername,
        token: navidromeToken,
      });
      
      if (service) {
        res.json({ success: true, message: "Connected to Navidrome successfully" });
      } else {
        res.status(400).json({ success: false, message: "Failed to connect to Navidrome" });
      }
    } catch (error) {
      console.error("Error testing Navidrome connection:", error);
      res.status(500).json({ success: false, message: "Connection test failed" });
    }
  });

  app.post("/api/navidrome/search", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.navidromeUrl || !settings?.navidromeUsername || !settings?.navidromeToken) {
        return res.status(400).json({ error: "Navidrome not configured" });
      }
      
      const service = await createNavidromeService({
        url: settings.navidromeUrl,
        username: settings.navidromeUsername,
        token: settings.navidromeToken,
      });
      
      if (!service) {
        return res.status(500).json({ error: "Failed to connect to Navidrome" });
      }
      
      const { query } = req.body;
      const tracks = await service.searchTracks(query);
      res.json(tracks);
    } catch (error) {
      console.error("Error searching Navidrome:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.post("/api/navidrome/import-artist", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.navidromeUrl || !settings?.navidromeUsername || !settings?.navidromeToken) {
        return res.status(400).json({ error: "Navidrome not configured" });
      }
      
      const service = await createNavidromeService({
        url: settings.navidromeUrl,
        username: settings.navidromeUsername,
        token: settings.navidromeToken,
      });
      
      if (!service) {
        return res.status(500).json({ error: "Failed to connect to Navidrome" });
      }
      
      const { artist } = req.body;
      const navTracks = await service.getArtistTracks(artist);
      
      const importedTracks = [];
      for (const trackData of navTracks) {
        const track = await storage.createTrack(trackData);
        importedTracks.push(track);
      }
      
      res.json({ 
        success: true, 
        count: importedTracks.length,
        tracks: importedTracks 
      });
    } catch (error) {
      console.error("Error importing artist tracks:", error);
      res.status(500).json({ error: "Import failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
