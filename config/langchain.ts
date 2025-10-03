import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

const chat = new ChatOpenAI({
  temperature: 0.4,
  model: "gpt-3.5-turbo",
});

export { embeddings, chat };
