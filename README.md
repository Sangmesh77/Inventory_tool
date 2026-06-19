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

## Authentication and authorization

InventoryLab uses Supabase Auth for sign-in and synchronizes authenticated users into Prisma-backed `users` rows. Roles are stored as `ADMIN` or `USER` in the application database.

- `ADMIN` users can create and edit assets.
- `USER` users can acquire available assets and release assets currently assigned to them.
- Middleware protects `/dashboard` and `/assets` routes from unauthenticated access.

Set the Supabase Auth user metadata role to `ADMIN` or `USER` before first sign-in, or update the role in the database after the user has signed in once.

