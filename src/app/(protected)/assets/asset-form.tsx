import { AssetStatus, type Asset, type AssetGroup, type User } from "@prisma/client";

export function AssetForm({
  action,
  asset,
  groups,
  users,
}: {
  action: (formData: FormData) => void | Promise<void>;
  asset?: Asset;
  groups: AssetGroup[];
  users: User[];
}) {
  return (
    <form action={action} className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
      <Field defaultValue={asset?.assetTag} label="Asset tag" name="assetTag" />
      <Field defaultValue={asset?.name} label="Name" name="name" />
      <Field defaultValue={asset?.type} label="Type" name="type" />
      <Field defaultValue={asset?.serialNumber} label="Serial number" name="serialNumber" />
      <Field defaultValue={asset?.location} label="Location" name="location" />
      <label className="block text-sm font-medium text-slate-700">
        Status
        <select className="mt-2 w-full rounded border border-slate-300 px-3 py-2" defaultValue={asset?.status ?? AssetStatus.AVAILABLE} name="status">
          {Object.values(AssetStatus).map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Group
        <select className="mt-2 w-full rounded border border-slate-300 px-3 py-2" defaultValue={asset?.groupId ?? ""} name="groupId">
          <option value="">No group</option>
          {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Owner
        <select className="mt-2 w-full rounded border border-slate-300 px-3 py-2" defaultValue={asset?.ownerId ?? ""} name="ownerId">
          <option value="">No owner</option>
          {users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
        </select>
      </label>
      <div className="md:col-span-2">
        <button className="rounded bg-slate-950 px-4 py-2 font-medium text-white" type="submit">Save asset</button>
      </div>
    </form>
  );
}

function Field({ defaultValue, label, name }: { defaultValue?: string; label: string; name: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input className="mt-2 w-full rounded border border-slate-300 px-3 py-2" defaultValue={defaultValue} name={name} required />
    </label>
  );
}
