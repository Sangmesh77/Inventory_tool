import { notFound } from "next/navigation";
import { AssetForm } from "../../asset-form";
import { updateAsset } from "../../actions";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("ADMIN");
  const { id } = await params;
  const [asset, groups, users] = await Promise.all([
    prisma.asset.findUnique({ where: { id } }),
    prisma.assetGroup.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!asset) {
    notFound();
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Edit asset</h1>
      <p className="mt-2 text-slate-600">Administrators can update asset details, ownership, and status.</p>
      <div className="mt-8"><AssetForm action={updateAsset.bind(null, asset.id)} asset={asset} groups={groups} users={users} /></div>
    </section>
  );
}
