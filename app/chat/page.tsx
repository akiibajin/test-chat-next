import Chat from "./_components/chat";

export default function ChatPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-4 h-[100dvh]">
      <h1 className="text-2xl font-semibold">Software Dev Chat (RAG)</h1>
      <Chat />
    </div>
  );
}
