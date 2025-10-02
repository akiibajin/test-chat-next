import { embeddings } from "@/config/langchain";
import { softwareDocs } from "@/docs/softwareDocs";
import { pool } from "@/lib/db";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";

export async function initStore(): Promise<PGVectorStore> {
  console.log({ pool });
  await pool.connect();
  await pool.query("CREATE EXTENSION IF NOT EXISTS vector;");
  const tableName = "software_docs";

  // Create table if missing
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id text PRIMARY KEY,
      content text,
      metadata jsonb,
      embedding vector(1536)
    );
  `);

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM ${tableName};`
  );

  const store = await PGVectorStore.initialize(embeddings, {
    pool,
    tableName,
    columns: {
      idColumnName: "id",
      vectorColumnName: "embedding",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  });

  if (rows[0].count === 0) {
    const newDocs = softwareDocs.map(
      (d) =>
        new Document({
          pageContent: d.text,
          metadata: { topic: d.topic, source: d.source },
        })
    );
    const docIds = softwareDocs.map((d) => d.id);
    await store.addDocuments(newDocs, { ids: docIds });
  }

  return store;
}
