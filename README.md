This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## RAG Chat

A basic retrieval-augmented chat is available at /chat.

1. Set OPENAI_API_KEY in your environment.
2. Run: npm run dev
3. Visit: http://localhost:3000/chat
4. Ask questions about software architecture, testing, performance, security, or code reviews.

The API endpoint: POST /api/chat
Body: { "message": "Your question", "history": [ { "role": "user"|"assistant", "content": "..." } ] }
Returns: { reply, history, sources }

## Vector Store (Postgres + pgvector)

This project can use Postgres with pgvector instead of Chroma.

1. Start services:
   docker compose up -d
2. Set environment variables (example):
   OPENAI_API_KEY=sk-***
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=test
   PGDATABASE=demo
3. Run dev:
   npm run dev
4. Open /chat and ask questions. The first request seeds documents into the software_docs table (if empty).

The code in config/langchain.ts:
- Ensures the vector extension exists.
- Creates table software_docs (vector dimension 1536).
- Seeds curated software development documents once.
- Performs similarity search via PGVectorStore.

To reset:
  psql -h localhost -U postgres -d demo -c "TRUNCATE software_docs;"
