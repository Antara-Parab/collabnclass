import { useState, useRef, useEffect } from "react";
import { Send, Bot, Minimize2, Maximize2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatbotMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  embedded?: boolean;
  onClose?: () => void;
}

const QUICK_PROMPTS = [
  "💡 Summarize lecture key points",
  "📝 List action items",
  "💻 Explain current code",
  "❓ Generate a quick quiz",
];

const Chatbot = ({ embedded = false }: ChatbotProps) => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Add welcome message on mount
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI Meeting Tutor. How can I assist you with code, notes, or explanations today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendPrompt = (promptText: string) => {
    sendMessage(promptText);
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) {
      setInput("");
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            conversationHistory: messages.slice(-5).map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.text,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text:
          data.response || "I apologize, but I couldn't process that request.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      const errorMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const embeddedContent = (
    <div className="flex flex-col h-full w-full min-h-0 bg-transparent">
      {/* AI Header Sub-bar */}
      <div className="px-3.5 py-2.5 border-b border-[rgba(0,180,255,0.12)] bg-[#020b16]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">AI Study Assistant</p>
            <p className="text-[10px] text-cyan-300/80">Real-time session assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 no-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isUser && (
              <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                message.isUser
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-[0_2px_10px_rgba(0,180,255,0.2)]"
                  : "bg-[#0c1a2e]/90 text-neutral-100 rounded-tl-none border border-[rgba(0,180,255,0.14)] shadow-sm"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center text-xs text-neutral-400">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            </div>
            <div className="px-3 py-2 rounded-2xl bg-[#0c1a2e]/80 border border-[rgba(0,180,255,0.14)] text-cyan-300 text-xs flex items-center gap-1.5">
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        {messages.length <= 2 && !isLoading && (
          <div className="pt-2 pb-1 space-y-1.5">
            <p className="text-[11px] font-medium text-neutral-400 px-1">Suggested prompts:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendPrompt(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/30 text-neutral-300 hover:text-cyan-300 transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[rgba(0,180,255,0.12)] bg-[#020b16]/70">
        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI anything about this class..."
            disabled={isLoading}
            className="flex-1 h-9 text-xs rounded-xl bg-[#061527]/90 border-[rgba(0,180,255,0.2)] text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-cyan-400"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-9 w-9 p-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:opacity-40 shadow-[0_0_12px_rgba(0,180,255,0.25)] flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return embeddedContent;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-12" : "w-80 h-96"
      }`}
    >
      <div className="glassmorphism-card rounded-xl border border-white/10 shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-cyan-400" />
            <span className="text-sm font-medium text-white">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-white/60 hover:text-white"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </Button>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      message.isUser
                        ? "bg-blue-500 text-white ml-2"
                        : "bg-gray-700 text-white mr-2"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about the meeting..."
                  disabled={isLoading}
                  className="flex-1 glassmorphism-button border-white/10 bg-white/5 text-white placeholder:text-white/50"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="glassmorphism-button-active hover:glassmorphism-button-hover"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Send size={14} />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
