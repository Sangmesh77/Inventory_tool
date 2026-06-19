import { AssetStatus } from "@prisma/client";
import Link from "next/link";
import { acquireAsset, releaseAsset } from "./actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function AssetsPage() {
  const user = await requireUser();
  const assets = await prisma.asset.findMany({
    include: { group: true, owner: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="mt-2 text-slate-600">Admins can create and edit assets. Users can acquire available assets and release assets they own.</p>
        </div>
        {user.role === "ADMIN" ? <Link className="rounded bg-slate-950 px-4 py-2 font-medium text-white" href="/assets/new">Create asset</Link> : null}
      </div>
      <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {assets.map((asset) => {
              const canAcquire = user.role === "USER" && asset.status === AssetStatus.AVAILABLE;
              const canRelease = user.role === "USER" && asset.ownerId === user.id;

              return (
                <tr key={asset.id}>
                  <td className="px-4 py-3 font-medium">{asset.assetTag}</td>
                  <td className="px-4 py-3">{asset.name}</td>
                  <td className="px-4 py-3">{asset.type}</td>
                  <td className="px-4 py-3">{asset.location}</td>
                  <td className="px-4 py-3">{asset.status}</td>
                  <td className="px-4 py-3">{asset.owner?.name ?? "—"}</td>
                  <td className="flex gap-2 px-4 py-3">
                    {user.role === "ADMIN" ? <Link className="rounded border border-slate-300 px-3 py-1" href={`/assets/${asset.id}/edit`}>Edit</Link> : null}
                    {canAcquire ? <form action={acquireAsset.bind(null, asset.id)}><button className="rounded bg-emerald-600 px-3 py-1 text-white" type="submit">Acquire</button></form> : null}
                    {canRelease ? <form action={releaseAsset.bind(null, asset.id)}><button className="rounded bg-amber-600 px-3 py-1 text-white" type="submit">Release</button></form> : null}
                  </td>
                </tr>
              );
            })}
            {assets.length === 0 ? <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={7}>No assets found.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
