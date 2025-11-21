import type { InsertTrack } from "@shared/schema";

interface NavidromeConfig {
  url: string;
  username: string;
  token: string;
}

interface NavidromeSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId: string;
  coverArt: string;
  duration: number;
}

interface NavidromeResponse {
  'subsonic-response': {
    status: string;
    version: string;
    song?: NavidromeSong[];
    searchResult3?: {
      song?: NavidromeSong[];
    };
  };
}

export class NavidromeService {
  private config: NavidromeConfig;

  constructor(config: NavidromeConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    return `${this.config.url}/rest`;
  }

  private getAuthParams(): URLSearchParams {
    const params = new URLSearchParams();
    params.append('u', this.config.username);
    params.append('t', this.config.token);
    params.append('s', 'navichatradio');
    params.append('v', '1.16.1');
    params.append('c', 'NavichatRadio');
    params.append('f', 'json');
    return params;
  }

  async testConnection(): Promise<boolean> {
    try {
      const params = this.getAuthParams();
      const response = await fetch(`${this.getBaseUrl()}/ping?${params.toString()}`);
      const data = await response.json() as NavidromeResponse;
      return data['subsonic-response']?.status === 'ok';
    } catch (error) {
      console.error('Navidrome connection test failed:', error);
      return false;
    }
  }

  async searchTracks(query: string, limit: number = 20): Promise<InsertTrack[]> {
    try {
      const params = this.getAuthParams();
      params.append('query', query);
      params.append('songCount', limit.toString());
      
      const response = await fetch(`${this.getBaseUrl()}/search3?${params.toString()}`);
      const data = await response.json() as NavidromeResponse;
      
      const songs = data['subsonic-response']?.searchResult3?.song || [];
      
      return songs.map(song => ({
        title: song.title,
        artist: song.artist,
        album: song.album,
        coverUrl: this.getCoverArtUrl(song.coverArt),
        duration: this.formatDuration(song.duration),
        navidromeId: song.id,
        streamUrl: this.getStreamUrl(song.id),
      }));
    } catch (error) {
      console.error('Navidrome search failed:', error);
      return [];
    }
  }

  async getArtistTracks(artist: string): Promise<InsertTrack[]> {
    return this.searchTracks(artist, 50);
  }

  getCoverArtUrl(coverArtId: string): string {
    const params = this.getAuthParams();
    params.append('id', coverArtId);
    params.append('size', '300');
    return `${this.getBaseUrl()}/getCoverArt?${params.toString()}`;
  }

  getStreamUrl(songId: string): string {
    const params = this.getAuthParams();
    params.append('id', songId);
    return `${this.getBaseUrl()}/stream?${params.toString()}`;
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export async function createNavidromeService(config: NavidromeConfig): Promise<NavidromeService | null> {
  if (!config.url || !config.username || !config.token) {
    return null;
  }
  
  const service = new NavidromeService(config);
  const isConnected = await service.testConnection();
  
  if (!isConnected) {
    throw new Error('Failed to connect to Navidrome server');
  }
  
  return service;
}
