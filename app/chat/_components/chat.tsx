"use client";
import { useState, useRef } from "react";
export default function Chat() {
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<
    { source: string; topic: string; snippet: string }[]
  >([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  async function send() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setHistory((h) => [...h, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHistory(data.history);
      setSources(data.sources || []);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    } catch (e) {
      setHistory((h) => [
        ...h,
        { role: "assistant", content: "Error: could not get response." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
  return (
    <>
      <div
        ref={listRef}
        className="flex-1 overflow-auto border rounded p-4 space-y-4 bg-white/5"
      >
        {history.length === 0 && (
          <p className="text-sm text-gray-500">
            Ask about software architecture, testing, performance, security, or
            code reviews.
          </p>
        )}
        {history.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                "inline-block rounded px-3 py-2 max-w-[85%] whitespace-pre-wrap " +
                (m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 bg-transparent outline-none focus:ring"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type your question..."
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      {sources.length > 0 && (
        <div className="border rounded p-3 text-xs space-y-2">
          <div className="font-semibold">Sources</div>
          {sources.map((s, i) => (
            <div key={i} className="border-t pt-2 first:border-t-0 first:pt-0">
              <div className="font-medium">
                {s.source} ({s.topic})
              </div>
              <div className="opacity-80">{s.snippet}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
