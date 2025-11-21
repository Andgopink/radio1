import { 
  type User, 
  type InsertUser,
  type Playlist,
  type InsertPlaylist,
  type Track,
  type InsertTrack,
  type PlaylistTrack,
  type InsertPlaylistTrack,
  type Settings,
  type InsertSettings,
  users,
  playlists,
  tracks,
  playlistTracks,
  settings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Playlist methods
  getAllPlaylists(): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: number, playlist: Partial<InsertPlaylist>): Promise<Playlist | undefined>;
  deletePlaylist(id: number): Promise<void>;
  
  // Track methods
  getAllTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;
  deleteTrack(id: number): Promise<void>;
  searchTracks(query: string): Promise<Track[]>;
  
  // Playlist-Track relationship methods
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<void>;
  
  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Playlist methods
  async getAllPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists).orderBy(desc(playlists.createdAt));
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db
      .insert(playlists)
      .values(insertPlaylist)
      .returning();
    return playlist;
  }

  async updatePlaylist(id: number, updateData: Partial<InsertPlaylist>): Promise<Playlist | undefined> {
    const [playlist] = await db
      .update(playlists)
      .set(updateData)
      .where(eq(playlists.id, id))
      .returning();
    return playlist || undefined;
  }

  async deletePlaylist(id: number): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  // Track methods
  async getAllTracks(): Promise<Track[]> {
    return await db.select().from(tracks).orderBy(desc(tracks.createdAt));
  }

  async getTrack(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track || undefined;
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values(insertTrack)
      .returning();
    return track;
  }

  async deleteTrack(id: number): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }

  async searchTracks(query: string): Promise<Track[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(tracks)
      .where(
        eq(tracks.title, searchTerm)
      );
  }

  // Playlist-Track relationship methods
  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const result = await db
      .select({
        track: tracks,
      })
      .from(playlistTracks)
      .innerJoin(tracks, eq(playlistTracks.trackId, tracks.id))
      .where(eq(playlistTracks.playlistId, playlistId))
      .orderBy(playlistTracks.position);
    
    return result.map(r => r.track);
  }

  async addTrackToPlaylist(insertPlaylistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const [playlistTrack] = await db
      .insert(playlistTracks)
      .values(insertPlaylistTrack)
      .returning();
    return playlistTrack;
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<void> {
    await db
      .delete(playlistTracks)
      .where(
        and(
          eq(playlistTracks.playlistId, playlistId),
          eq(playlistTracks.trackId, trackId)
        )
      );
  }

  // Settings methods
  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).limit(1);
    return setting || undefined;
  }

  async updateSettings(insertSettings: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ ...insertSettings, updatedAt: new Date() })
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(settings)
        .values(insertSettings)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
