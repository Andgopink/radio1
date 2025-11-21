import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Command } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import generatedImage from '@assets/generated_images/abstract_dark_digital_sound_wave_album_art.png';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      
      toast({
        title: "Login Successful",
        description: "Welcome to Navichat Radio Admin",
      });

      navigate("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left side - Background image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img 
          src={generatedImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <div className="h-20 w-20 bg-primary/20 rounded-lg flex items-center justify-center mb-6 backdrop-blur-md border border-primary/30">
            <Command className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4">Navichat Radio</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            AI-powered music streaming with Navidrome integration
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4 lg:hidden">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Command className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">Navichat</span>
            </div>
            <CardTitle className="text-3xl">Admin Login</CardTitle>
            <CardDescription>
              Access the Navichat Radio admin panel to manage playlists and configure Navidrome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-login-username"
                  className="bg-muted/30 border-white/5 focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-login-password"
                  className="bg-muted/30 border-white/5 focus-visible:ring-primary/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
                <p>Demo: Use any username/password to test</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
