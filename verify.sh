#!/bin/bash

set -e

echo "================================="
echo "InventoryLab Verification Script"
echo "================================="

echo ""
echo "[1/5] Installing dependencies..."
npm install

echo ""
echo "[2/5] Generating Prisma client..."
npx prisma generate

echo ""
echo "[3/5] Running TypeScript checks..."
npx tsc --noEmit

echo ""
echo "[4/5] Running ESLint..."
npm run lint

echo ""
echo "[5/5] Running production build..."
npm run build

echo ""
echo "================================="
echo "✅ ALL CHECKS PASSED"
echo "Ready to push to GitHub/Vercel"
echo "================================="

