"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "What's the largest power plant in the US?",
  "How does nuclear energy work?",
  "What's the difference between coal and gas plants?",
  "Why is solar growing so fast?",
  "What is a balancing authority?",
  "How do transmission lines work?",
];

export default function AIAssistant({ selectedPlant }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Ohm, your US grid guide. Ask me about any power plant on the map, energy types, grid operations, or electricity prices. Click a plant marker to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const prevPlantId = useRef(null);

  // Auto-message when a plant is selected
  useEffect(() => {
    if (!selectedPlant || selectedPlant.id === prevPlantId.current) return;
    prevPlantId.current = selectedPlant.id;
    if (!open) setOpen(true);
    const msg = `Tell me about ${selectedPlant.name}.`;
    sendMessage(msg);
  }, [selectedPlant]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: selectedPlant
            ? `The user is currently viewing ${selectedPlant.name} (${selectedPlant.fuel} plant, ${selectedPlant.capacityMW} MW, ${selectedPlant.state}).`
            : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Sorry, I couldn't connect right now. Make sure ANTHROPIC_API_KEY is set in your .env.local file. (${e.message})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute bottom-6 right-4 z-30 flex flex-col items-end gap-2">
      {/* Chat window */}
      {open && (
        <div className="w-80 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "420px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b] bg-[#0a0f1e]">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Ohm</p>
                <p className="text-slate-500 text-xs">Grid AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-[#1e293b] text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1e293b] rounded-xl rounded-bl-none px-3 py-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs bg-[#1e293b] hover:bg-[#334155] text-slate-300 rounded-full px-2 py-1 transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#1e293b] p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about the grid..."
              className="flex-1 bg-[#1e293b] text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white text-xl transition-all hover:scale-105 active:scale-95"
        title="Ask Ohm"
      >
        {open ? "×" : "⚡"}
      </button>
    </div>
  );
}
