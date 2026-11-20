import Link from "next/link";
import Nav from "@/components/Nav";
import DeleteButton from "@/components/DeleteButton";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { deleteProduct } from "@/lib/actions";
import { inputCls, btnCls } from "@/components/ui";

export default async function ProductsPage({ searchParams }) {
  const user = await requireUser();
  const { q } = await searchParams;
  const search = `%${q || ""}%`;

  const res = await query(
    `SELECT p.id, p.name, p.sku, p.quantity, p.selling_price,
            (p.quantity <= COALESCE(p.low_stock_threshold, o.default_low_stock)) AS is_low
     FROM products p JOIN organizations o ON o.id = p.organization_id
     WHERE p.organization_id=$1 AND (p.name ILIKE $2 OR p.sku ILIKE $2)
     ORDER BY p.created_at DESC`,
    [user.orgId, search]
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl p-4">
        <div className="my-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/products/new" className={btnCls}>Add Product</Link>
        </div>

        <form className="mb-4 flex gap-2">
          <input name="q" defaultValue={q || ""} placeholder="Search by name or SKU" className={inputCls} />
          <button className={btnCls}>Search</button>
        </form>

        <div className="rounded bg-white shadow">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.length === 0 && (
                <tr><td colSpan="6" className="p-3 text-gray-500">No products found.</td></tr>
              )}
              {res.rows.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">
                    {p.is_low ? (
                      <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">Low</span>
                    ) : (
                      <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">OK</span>
                    )}
                  </td>
                  <td className="p-3">{p.selling_price ?? "-"}</td>
                  <td className="flex gap-4 p-3">
                    <Link href={`/products/${p.id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}