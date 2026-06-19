import { AssetForm } from "../asset-form";
import { createAsset } from "../actions";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function NewAssetPage() {
  await requireRole("ADMIN");
  const [groups, users] = await Promise.all([
    prisma.assetGroup.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <section>
      <h1 className="text-3xl font-bold">Create asset</h1>
      <p className="mt-2 text-slate-600">Administrators can create tracked assets.</p>
      <div className="mt-8"><AssetForm action={createAsset} groups={groups} users={users} /></div>
    </section>
  );
}
