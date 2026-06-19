import Link from "next/link";
import { createAsset } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function NewAssetPage() {
  await requireRole("ADMIN");
  const groups = await prisma.assetGroup.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Asset</CardTitle>
          <CardDescription>
            Add a new inventory asset. The asset tag is generated automatically and the asset starts as available.
          </CardDescription>
        </CardHeader>
        <form action={createAsset}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input id="name" name="name" placeholder="MacBook Pro 14-inch" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" name="type" placeholder="Laptop, scanner, monitor" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" placeholder="SN-000123" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groupId">Group</Label>
              <Select id="groupId" name="groupId">
                <option value="">No group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="HQ - Equipment Cage" required />
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Button type="submit">Save asset</Button>
            <Link className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100" href="/dashboard">Cancel</Link>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
