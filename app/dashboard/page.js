import Nav from "@/components/Nav";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export default async function Dashboard() {
  const user = await requireUser();

  const totals = await query(
    "SELECT COUNT(*)::int AS total, COALESCE(SUM(quantity),0)::int AS qty FROM products WHERE organization_id=$1",
    [user.orgId]
  );
  const low = await query(
    `SELECT p.name, p.sku, p.quantity,
            COALESCE(p.low_stock_threshold, o.default_low_stock) AS threshold
     FROM products p JOIN organizations o ON o.id = p.organization_id
     WHERE p.organization_id=$1
       AND p.quantity <= COALESCE(p.low_stock_threshold, o.default_low_stock)
     ORDER BY p.quantity ASC`,
    [user.orgId]
  );
  const { total, qty } = totals.rows[0];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl p-4">
        <h1 className="my-4 text-2xl font-bold">Dashboard</h1>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{total}</p>
          </div>
          <div className="rounded bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Quantity on Hand</p>
            <p className="text-3xl font-bold">{qty}</p>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-semibold">Low stock items</h2>
        <div className="rounded bg-white shadow">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity on Hand</th>
                <th className="p-3">Low Stock Threshold</th>
              </tr>
            </thead>
            <tbody>
              {low.rows.length === 0 && (
                <tr><td colSpan="4" className="p-3 text-gray-500">No low stock items.</td></tr>
              )}
              {low.rows.map((r) => (
                <tr key={r.sku} className="border-b">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.sku}</td>
                  <td className="p-3 font-semibold text-red-600">{r.quantity}</td>
                  <td className="p-3">{r.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}