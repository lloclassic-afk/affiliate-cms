import { createProduct } from "@/app/actions/products";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">新規商品登録</h1>
      <ProductForm action={createProduct} />
    </div>
  );
}
