import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 3001),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "test",
  database: process.env.PGDATABASE || "vectordb",
});
