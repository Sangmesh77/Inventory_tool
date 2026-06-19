# InventoryLab

InventoryLab is a production-ready Next.js 15 foundation for tracking inventory assets, ownership, groups, and status history.

## Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Prisma ORM

## Getting started

1. Copy `.env.example` to `.env` and fill in your Supabase values.
2. Install dependencies with `npm install`.
3. Generate Prisma Client with `npm run prisma:generate`.
4. Apply migrations with `npm run prisma:migrate` during development or `npm run prisma:deploy` in production.
5. Seed development data with `npm run prisma:seed`.
6. Start the application with `npm run dev`.

No application UI has been implemented yet.
