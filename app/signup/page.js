import Link from "next/link";
import { signup } from "@/lib/actions";
import { inputCls, btnCls } from "@/components/ui";

export default async function SignupPage({ searchParams }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto mt-16 max-w-sm rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Sign up</h1>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
      <form action={signup} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required className={inputCls} />
        <input name="password" type="password" placeholder="Password (min 6 chars)" required className={inputCls} />
        <input name="confirm" type="password" placeholder="Confirm Password" required className={inputCls} />
        <input name="orgName" placeholder="Organization name" required className={inputCls} />
        <button className={btnCls + " w-full"}>Create account</button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link>
      </p>
    </div>
  );
}