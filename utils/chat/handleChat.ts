import VectorStore from "@/utils/getVectorStore";
import { chat } from "@/config/langchain";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { fetchQuizQuestionTool } from "../tools";
import { AnswerToolParams } from "../tools/types";

type HistItem = { role: string; content: string };

interface HandleChatParams {
  message: string;
  history: HistItem[];
}

interface HandleChatResult {
  reply: string;
  history: HistItem[];
  sources: { source: string; topic: string; snippet: string }[];
  meta?: Record<string, unknown>;
}

export async function handleChat({
  message,
  history,
}: HandleChatParams): Promise<HandleChatResult> {
  const chatHistory = history.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
  );

  const store = await VectorStore.getInstance();
  const retrieved = await store.similaritySearch(message, 3);

  const contextBlock = retrieved.length
    ? retrieved
        .map(
          (r, i) =>
            `# Source ${i + 1}\nSource: ${r.metadata?.source}\nTopic: ${
              r.metadata?.topic
            }\nContent: ${r.pageContent}`,
        )
        .join("\n\n")
    : "No domain documents matched.";

  const system = new SystemMessage(
    "You are a helpful software development assistant. Use only the provided context for authoritative details.\n\nContext:\n" +
      contextBlock,
  );

  const modelWithTools = chat.bindTools([fetchQuizQuestionTool]);

  const baseMessages = [system, ...chatHistory, new HumanMessage(message)];
  const first = await modelWithTools.invoke(baseMessages);
  const toolCalls = first.tool_calls;

  let finalMessage = first;
  const toolExecutionMeta: {
    id: string;
    name: string;
    args: AnswerToolParams;
    success: boolean;
  }[] = [];

  if (toolCalls?.length) {
    const toolResults: ToolMessage[] = [];
    const toolMap: Record<string, unknown> = {
      [fetchQuizQuestionTool.name]: fetchQuizQuestionTool,
    };

    for (const call of toolCalls) {
      const callId = call.id || crypto.randomUUID();
      const name = call.name || call.type || "unknown";

      const rawArgs = call.args || "{}";

      let parsedArgs: Record<string, unknown>;
      try {
        if (typeof rawArgs === "string") {
          parsedArgs = JSON.parse(rawArgs);
        } else {
          parsedArgs = rawArgs;
        }
      } catch {
        parsedArgs = {};
      }

      const tool = toolMap[name];
      let toolOutput: string;

      if (!tool) {
        toolOutput = `Tool "${name}" not found.`;
      } else {
        try {
          toolOutput = await tool?.invoke(parsedArgs);
        } catch (e) {
          toolOutput = `Error executing tool "${name}": ${String(e)}`;
        }
      }

      toolResults.push(
        new ToolMessage({
          content: toolOutput,
          tool_call_id: callId,
        }),
      );

      toolExecutionMeta.push({
        id: callId,
        name,
        args: parsedArgs,
        success: !toolOutput.startsWith("Error"),
      });
    }

    finalMessage = await chat.invoke([...baseMessages, first, ...toolResults]);
  }

  const reply = finalMessage.content as string;

  const newHistory: HistItem[] = [
    ...history,
    { role: "assistant", content: reply },
  ];

  return {
    reply,
    history: newHistory,
    sources: toolCalls?.length
      ? []
      : retrieved.map((r) => ({
          source: r.metadata?.source,
          topic: r.metadata?.topic,
          snippet:
            r.pageContent.slice(0, 160) +
            (r.pageContent.length > 160 ? "..." : ""),
        })),
    meta: {
      toolCalls: toolExecutionMeta.length ? toolExecutionMeta : undefined,
      usedTools: toolExecutionMeta.length
        ? toolExecutionMeta.map((t) => t.name)
        : [],
    },
  };
}
