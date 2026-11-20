import Nav from "@/components/Nav";
import ProductForm from "@/components/ProductForm";
import { requireUser } from "@/lib/auth";
import { createProduct } from "@/lib/actions";

export default async function NewProduct({ searchParams }) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <>
      <Nav />
      <main className="p-4">
        <ProductForm action={createProduct} error={error} title="Add Product" />
      </main>
    </>
  );
}