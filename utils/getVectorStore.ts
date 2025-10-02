import type { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { initStore } from "./initStore";

export default class VectorStore {
  private static instance: Promise<PGVectorStore> | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = initStore();
    }
    return this.instance;
  }
}
