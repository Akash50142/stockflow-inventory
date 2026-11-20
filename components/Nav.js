import Link from "next/link";
import { logout } from "@/lib/actions";

export default function Nav() {
  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-blue-600">StockFlow</span>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
        </div>
        <form action={logout}>
          <button className="text-red-600 hover:underline">Logout</button>
        </form>
      </div>
    </nav>
  );
}