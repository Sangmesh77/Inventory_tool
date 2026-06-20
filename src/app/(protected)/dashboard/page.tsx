import { AssetStatus } from "@prisma/client";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireUser();
  const [totalAssets, availableAssets, myAssets] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: AssetStatus.AVAILABLE } }),
    prisma.asset.findMany({ where: { ownerId: user.id }, orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  return (
    <section>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome back, {user.name}. Your role is {user.role}.</p>
        </div>
        <Link className="rounded bg-slate-950 px-4 py-2 font-medium text-white" href="/assets">View assets</Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Metric label="Total assets" value={totalAssets} />
        <Metric label="Available assets" value={availableAssets} />
        <Metric label="My assets" value={myAssets.length} />
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Recently acquired by you</h2>
        <ul className="mt-4 divide-y divide-slate-200">
          {myAssets.map((asset) => <li className="py-3" key={asset.id}>{asset.assetTag} — {asset.name}</li>)}
          {myAssets.length === 0 ? <li className="py-3 text-slate-500">No assets acquired yet.</li> : null}
        </ul>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>;
}
