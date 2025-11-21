import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Music, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INITIAL_CHAT, Message } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've queued up some similar tracks based on that request. The acoustic properties match your current mood profile.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      // Basic scroll to bottom
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if(scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <aside className="w-80 border-l border-border bg-background flex flex-col h-full shadow-xl shadow-black/20">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">AI Curator</h3>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-mono uppercase">Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] gap-1",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-2xl text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none border border-border/50"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground/50 font-mono">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1 p-2 bg-muted/50 rounded-lg w-fit">
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-background">
        <div className="relative">
          <Input
            placeholder="Ask to play something..."
            className="pr-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSend}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button className="whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 transition-colors flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Play something chill
          </button>
          <button className="whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 transition-colors flex items-center gap-1">
            <Music className="h-3 w-3" />
            Find similar to this
          </button>
        </div>
      </div>
    </aside>
  );
}
