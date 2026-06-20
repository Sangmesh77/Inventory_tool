import type { ReactNode } from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link className="text-lg font-semibold" href="/dashboard">InventoryLab</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/assets">Assets</Link>
            <span className="rounded-full bg-slate-100 px-3 py-1">{user.role}</span>
            <form action="/auth/logout" method="post"><button className="text-slate-600" type="submit">Sign out</button></form>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </main>
  );
}
