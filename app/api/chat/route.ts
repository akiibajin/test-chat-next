import { type NextRequest, NextResponse } from "next/server";
import { handleChat } from "@/utils/chat/handleChat";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const result = await handleChat({ message, history: history || [] });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Invalid request", message: String(error) },
      { status: 400 },
    );
  }
}
