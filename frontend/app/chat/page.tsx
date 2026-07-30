"use client";
import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm **Otto**, your AI business automation assistant. I can help you create campaigns, generate content, find contacts, build workflows, and much more.\n\nWhat would you like to automate today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);
    textareaRef.current?.blur();
    try {
      const res = await sendChatMessage({
        message: userInput,
        conversation_id: convId,
      });
      if (res.conversation_id && !convId) setConvId(res.conversation_id);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.response || "I couldn't process that. Please try again.",
        timestamp: new Date(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e: unknown) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Error: ${(e as Error).message}. Make sure the API backend is running.`,
        timestamp: new Date(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Create a marketing campaign for my eco-friendly water bottle",
    "Generate 5 Instagram post ideas for my dog accessories brand",
    "Find influencers for my fitness app launch",
    "Write a product description for handmade candles",
  ];

  return (
    <div
      className="flex flex-col animate-fade-in"
      style={{ height: "calc(100dvh - 60px - 1.5rem)" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="glass-card p-3 sm:p-4 mb-3 flex items-center gap-3 flex-shrink-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          }}
        >
          🤖
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate">
            Otto AI Assistant
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Hyperintelligent business AI · LLaMA 3
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="badge badge-success text-xs">● Online</span>
        </div>
      </div>

      {/* ── Messages — scrollable ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 sm:gap-3 animate-fade-in ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm flex-shrink-0 mt-0.5"
              style={{
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #6366f1, #a78bfa)"
                    : "rgba(22,28,45,0.9)",
                border:
                  msg.role === "assistant"
                    ? "1px solid rgba(99,102,241,0.2)"
                    : "none",
              }}
            >
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user" ? "text-white" : "text-slate-300"
              }`}
              style={{
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(167,139,250,0.3))"
                    : "rgba(22,28,45,0.7)",
                border:
                  msg.role === "assistant"
                    ? "1px solid rgba(99,102,241,0.12)"
                    : "none",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
              <div
                className="text-xs text-slate-600 mt-1"
                suppressHydrationWarning
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-2 sm:gap-3 animate-fade-in">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{
                background: "rgba(22,28,45,0.9)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              🤖
            </div>
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(22,28,45,0.7)",
                border: "1px solid rgba(99,102,241,0.12)",
              }}
            >
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-400"
                    style={{
                      animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ────────────────────────────────────── */}
      {messages.length <= 1 && (
        <>
          {/* Mobile: horizontal scroll */}
          <div
            className="flex sm:hidden gap-2 mb-3 overflow-x-auto flex-shrink-0 pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                className="btn-secondary text-left flex-shrink-0 text-xs p-2.5 leading-snug"
                style={{ minWidth: "155px", maxWidth: "200px", whiteSpace: "normal" }}
                onClick={() => {
                  setInput(s);
                  textareaRef.current?.focus();
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Desktop: 2-col grid */}
          <div className="hidden sm:grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
            {suggestions.map((s) => (
              <button
                key={s}
                className="btn-secondary text-left text-xs p-3 leading-snug"
                onClick={() => setInput(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Input bar — always visible, never clipped ────────── */}
      <div
        className="glass-card flex gap-2 sm:gap-3 items-end flex-shrink-0"
        style={{
          padding: "0.625rem",
          paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))",
        }}
      >
        <textarea
          ref={textareaRef}
          className="input-field flex-1 resize-none"
          rows={2}
          placeholder="Ask Otto anything… (Enter to send)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          style={{ fontSize: "1rem" }}
        />
        <button
          className="btn-primary flex-shrink-0"
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            height: "52px",
            minWidth: "68px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            alignSelf: "flex-end",
          }}
        >
          {loading ? "⏳" : "Send ›"}
        </button>
      </div>
    </div>
  );
}
