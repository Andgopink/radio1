import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSettings, useUpdateSettings, useTestNavidrome, useImportArtist, usePlaylists, useCreatePlaylist, useDeletePlaylist } from "@/hooks/useApi";
import { Loader2, Check, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Admin Panel</h1>
        
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="connection">Navidrome Connection</TabsTrigger>
            <TabsTrigger value="playlists">Playlist Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6 mt-6">
            <ConnectionTab />
          </TabsContent>

          <TabsContent value="playlists" className="space-y-6 mt-6">
            <PlaylistsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function ConnectionTab() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const testConnection = useTestNavidrome();
  const importArtist = useImportArtist();
  const { toast } = useToast();

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [artistName, setArtistName] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");

  useState(() => {
    if (settings) {
      setUrl(settings.navidromeUrl || "");
      setUsername(settings.navidromeUsername || "");
      setToken(settings.navidromeToken || "");
    }
  });

  const handleTestConnection = async () => {
    if (!url || !username || !token) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all connection details",
        variant: "destructive",
      });
      return;
    }

    const result = await testConnection.mutateAsync({ url, username, token });
    
    if (result.success) {
      setTestStatus("success");
      toast({
        title: "Connection Successful",
        description: result.message,
      });
    } else {
      setTestStatus("error");
      toast({
        title: "Connection Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        navidromeUrl: url,
        navidromeUsername: username,
        navidromeToken: token,
      });
      
      toast({
        title: "Settings Saved",
        description: "Navidrome connection settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const handleImportArtist = async () => {
    if (!artistName.trim()) {
      toast({
        title: "Artist Name Required",
        description: "Please enter an artist name to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await importArtist.mutateAsync(artistName);
      
      toast({
        title: "Import Successful",
        description: `Imported ${result.count} tracks from ${artistName}`,
      });
      
      setArtistName("");
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Make sure Navidrome is configured correctly",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navidrome Server Configuration</CardTitle>
          <CardDescription>
            Connect to your Navidrome server to stream music and import tracks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Server URL</Label>
            <Input
              id="url"
              placeholder="https://navidrome.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              data-testid="input-navidrome-url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-navidrome-username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">API Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Your Navidrome API token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              data-testid="input-navidrome-token"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleTestConnection}
              variant="outline"
              disabled={testConnection.isPending}
              data-testid="button-test-connection"
            >
              {testConnection.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : testStatus === "success" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : testStatus === "error" ? (
                <X className="h-4 w-4 mr-2 text-red-500" />
              ) : null}
              Test Connection
            </Button>

            <Button 
              onClick={handleSave}
              disabled={updateSettings.isPending}
              data-testid="button-save-settings"
            >
              {updateSettings.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Artist Tracks</CardTitle>
          <CardDescription>
            Import all tracks from specific artists (Boards of Canada, Aphex Twin, Funki Porcini, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="artist">Artist Name</Label>
            <Input
              id="artist"
              placeholder="e.g. Boards of Canada"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImportArtist()}
              data-testid="input-artist-name"
            />
          </div>

          <div className="flex gap-2">
            {["Boards of Canada", "Aphex Twin", "Funki Porcini"].map((artist) => (
              <Button
                key={artist}
                variant="outline"
                size="sm"
                onClick={() => setArtistName(artist)}
                data-testid={`button-preset-${artist.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {artist}
              </Button>
            ))}
          </div>

          <Button 
            onClick={handleImportArtist}
            disabled={importArtist.isPending}
            className="w-full"
            data-testid="button-import-artist"
          >
            {importArtist.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Import Tracks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlaylistsTab() {
  const { data: playlists, isLoading } = usePlaylists();
  const createPlaylist = useCreatePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const { toast } = useToast();

  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPlaylist.mutateAsync({
        name: newPlaylistName,
        description: "Radio station playlist",
      });
      
      setNewPlaylistName("");
      
      toast({
        title: "Playlist Created",
        description: `${newPlaylistName} has been created`,
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await deletePlaylist.mutateAsync(id);
      
      toast({
        title: "Playlist Deleted",
        description: `${name} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Playlist</CardTitle>
          <CardDescription>
            Create a new radio station playlist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              data-testid="input-playlist-name"
            />
            <Button 
              onClick={handleCreate}
              disabled={createPlaylist.isPending}
              data-testid="button-create-playlist"
            >
              {createPlaylist.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Playlists</CardTitle>
          <CardDescription>
            Manage your radio station playlists
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !playlists || playlists.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No playlists yet. Create one above!
            </p>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  data-testid={`playlist-item-${playlist.id}`}
                >
                  <div>
                    <h4 className="font-medium">{playlist.name}</h4>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground">{playlist.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(playlist.id, playlist.name)}
                    data-testid={`button-delete-${playlist.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
