import { signIn } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-950">
      <form action={signIn} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Sign in to InventoryLab</h1>
        <p className="mt-2 text-sm text-slate-600">Use your Supabase Auth credentials to continue.</p>
        {params.error ? <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{params.error}</p> : null}
        <input name="next" type="hidden" value={params.next ?? "/dashboard"} />
        <label className="mt-6 block text-sm font-medium" htmlFor="email">Email</label>
        <input className="mt-2 w-full rounded border border-slate-300 px-3 py-2" id="email" name="email" required type="email" />
        <label className="mt-4 block text-sm font-medium" htmlFor="password">Password</label>
        <input className="mt-2 w-full rounded border border-slate-300 px-3 py-2" id="password" name="password" required type="password" />
        <button className="mt-6 w-full rounded bg-slate-950 px-4 py-2 font-medium text-white" type="submit">Sign in</button>
      </form>
    </main>
  );
}
