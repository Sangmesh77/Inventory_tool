-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "supabaseUserId" UUID;
ALTER TABLE "users" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

-- Backfill deterministic placeholder auth ids for existing non-production seed/dev rows.
UPDATE "users" SET "supabaseUserId" = gen_random_uuid() WHERE "supabaseUserId" IS NULL;

-- Enforce auth id once backfilled.
ALTER TABLE "users" ALTER COLUMN "supabaseUserId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseUserId_key" ON "users"("supabaseUserId");
CREATE INDEX "users_role_idx" ON "users"("role");
