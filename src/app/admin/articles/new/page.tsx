import { createArticle } from "@/app/actions/articles";
import { ArticleForm } from "@/components/ArticleForm";
import { getProducts } from "@/lib/queries";

export default async function NewArticlePage() {
  const products = await getProducts().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">新規記事作成</h1>
      <ArticleForm allProducts={products} action={createArticle} />
    </div>
  );
}
