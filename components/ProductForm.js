import { inputCls, btnCls } from "@/components/ui";

export default function ProductForm({ action, product, error, title }) {
  const p = product || {};
  return (
    <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}
      <form action={action} className="space-y-4">
        {p.id && <input type="hidden" name="id" value={p.id} />}
        <div>
          <label className="mb-1 block text-sm">Name *</label>
          <input name="name" defaultValue={p.name || ""} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm">SKU *</label>
          <input name="sku" defaultValue={p.sku || ""} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Description</label>
          <textarea name="description" defaultValue={p.description || ""} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Quantity on Hand *</label>
          <input name="quantity" type="number" min="0" step="1" defaultValue={p.quantity ?? 0} required className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm">Cost Price</label>
            <input name="costPrice" type="number" min="0" step="0.01" defaultValue={p.cost_price ?? ""} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Selling Price</label>
            <input name="sellingPrice" type="number" min="0" step="0.01" defaultValue={p.selling_price ?? ""} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm">Low Stock Threshold (empty = default)</label>
          <input name="threshold" type="number" min="0" step="1" defaultValue={p.low_stock_threshold ?? ""} className={inputCls} />
        </div>
        <button className={btnCls}>Save</button>
      </form>
    </div>
  );
}