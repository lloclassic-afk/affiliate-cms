import { notFound } from "next/navigation";
import { updateProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/ProductForm";
import { getProduct } from "@/lib/queries";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">商品編集</h1>
      <ProductForm product={product} action={boundUpdate} />
    </div>
  );
}
