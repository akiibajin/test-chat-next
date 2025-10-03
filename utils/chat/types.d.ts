export interface HandleChatParams {
  message: string;
  history: HistItem[];
}

export interface InvokableTool {
  invoke: (args: Record<string, unknown>) => Promise<string> | string;
}

export interface HandleChatResult {
  reply: string;
  history: HistItem[];
  sources: { source: string; topic: string; snippet: string }[];
  meta?: Record<string, unknown>;
}
