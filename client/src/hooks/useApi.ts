import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import type { InsertPlaylist, InsertTrack, InsertSettings } from "@shared/schema";

// Playlist Hooks
export function usePlaylists() {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: api.getPlaylists,
  });
}

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: () => api.getPlaylist(id),
    enabled: !!id,
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertPlaylist) => api.createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function useUpdatePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertPlaylist> }) =>
      api.updatePlaylist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}

export function usePlaylistTracks(playlistId: number) {
  return useQuery({
    queryKey: ["playlist", playlistId, "tracks"],
    queryFn: () => api.getPlaylistTracks(playlistId),
    enabled: !!playlistId,
  });
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId, position }: { playlistId: number; trackId: number; position?: number }) =>
      api.addTrackToPlaylist(playlistId, trackId, position),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId, "tracks"] });
    },
  });
}

export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, trackId }: { playlistId: number; trackId: number }) =>
      api.removeTrackFromPlaylist(playlistId, trackId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId, "tracks"] });
    },
  });
}

// Track Hooks
export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: api.getTracks,
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertTrack) => api.createTrack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteTrack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}

// Settings Hooks
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertSettings) => api.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

// Navidrome Hooks
export function useTestNavidrome() {
  return useMutation({
    mutationFn: ({ url, username, token }: { url: string; username: string; token: string }) =>
      api.testNavidromeConnection(url, username, token),
  });
}

export function useSearchNavidrome() {
  return useMutation({
    mutationFn: (query: string) => api.searchNavidrome(query),
  });
}

export function useImportArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artist: string) => api.importArtist(artist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}
