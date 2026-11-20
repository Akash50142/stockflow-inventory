import Nav from "@/components/Nav";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { saveSettings } from "@/lib/actions";
import { inputCls, btnCls } from "@/components/ui";

export default async function SettingsPage({ searchParams }) {
  const user = await requireUser();
  const { error, saved } = await searchParams;
  const res = await query(
    "SELECT default_low_stock FROM organizations WHERE id=$1",
    [user.orgId]
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-md p-4">
        <div className="mt-6 rounded bg-white p-6 shadow">
          <h1 className="mb-4 text-2xl font-bold">Settings</h1>
          {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
          {saved && <p className="mb-4 rounded bg-green-100 p-3 text-green-700">Saved!</p>}
          <form action={saveSettings} className="space-y-4">
            <label className="block text-sm">Default Low Stock Threshold</label>
            <input name="threshold" type="number" min="0" step="1" defaultValue={res.rows[0].default_low_stock} required className={inputCls} />
            <button className={btnCls}>Save</button>
          </form>
        </div>
      </main>
    </>
  );
}