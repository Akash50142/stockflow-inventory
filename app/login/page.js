import Link from "next/link";
import { login } from "@/lib/actions";
import { inputCls, btnCls } from "@/components/ui";

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto mt-20 max-w-sm rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
      <form action={login} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required className={inputCls} />
        <input name="password" type="password" placeholder="Password" required className={inputCls} />
        <button className={btnCls + " w-full"}>Login</button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link href="/signup" className="text-blue-600 underline">Sign up</Link>
      </p>
    </div>
  );
}