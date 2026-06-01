import { ArticleGenerator } from "@/components/ArticleGenerator";
import { getProducts } from "@/lib/queries";

export default async function GenerateArticlePage() {
  const products = await getProducts().catch(() => []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">比較記事を作成</h1>
      <p className="mt-2 text-sm text-stone-600">
        登録済み商品から下書きを生成します。生成後は必ず独自メモ・体験談を追記し、確認してから公開してください。
      </p>
      <div className="mt-8">
        <ArticleGenerator products={products} />
      </div>
    </div>
  );
}
