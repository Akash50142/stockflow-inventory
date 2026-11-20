import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ProductForm from "@/components/ProductForm";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { updateProduct } from "@/lib/actions";

export default async function EditProduct({ params, searchParams }) {
  const user = await requireUser();
  const { id } = await params;
  const { error } = await searchParams;
  const pid = Number(id);
  if (!Number.isInteger(pid)) notFound();

  const res = await query(
    "SELECT * FROM products WHERE id=$1 AND organization_id=$2",
    [pid, user.orgId]
  );
  if (!res.rows.length) notFound();

  return (
    <>
      <Nav />
      <main className="p-4">
        <ProductForm action={updateProduct} product={res.rows[0]} error={error} title="Edit Product" />
      </main>
    </>
  );
}