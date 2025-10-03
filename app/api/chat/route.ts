import { type NextRequest, NextResponse } from "next/server";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";
import VectorStore from "@/utils/getVectorStore";
import { chat } from "@/config/langchain";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const chatHistory = (history || []).map(
      (m: { role: string; content: string }) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
    );
    const store = await VectorStore.getInstance();
    const retrieved = await store.similaritySearch(message, 3);
    const contextBlock = retrieved.length
      ? retrieved
          .map(
            (r, i) =>
              `# Source ${i + 1}\nSource: ${r.metadata?.source}\nTopic: ${
                r.metadata?.topic
              }\nContent: ${r.pageContent}`
          )
          .join("\n\n")
      : "No domain documents matched.";

    const system = new SystemMessage(
      "You are a helpful software development assistant. Use only the provided context for authoritative details.\n\nContext:\n" +
        contextBlock
    );

    const result = await chat.invoke([
      system,
      ...chatHistory,
      new HumanMessage(message),
    ]);

    const reply = result.content;
    const newHistory = [
      ...(history || []),
      { role: "user", content: message },
      { role: "assistant", content: reply },
    ];

    return NextResponse.json({
      reply,
      history: newHistory,
      sources: retrieved.map((r) => ({
        source: r.metadata?.source,
        topic: r.metadata?.topic,
        snippet:
          r.pageContent.slice(0, 160) +
          (r.pageContent.length > 160 ? "..." : ""),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", message: error },
      { status: 400 }
    );
  }
}
