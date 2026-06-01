import { ButtonLink } from "@/components/ui/Button";
import { getArticles, getProducts } from "@/lib/queries";

export default async function AdminDashboardPage() {
  let productCount = 0;
  let articleCount = 0;
  let draftCount = 0;

  try {
    const [products, articles] = await Promise.all([
      getProducts(),
      getArticles(),
    ]);
    productCount = products.length;
    articleCount = articles.length;
    draftCount = articles.filter((a) => a.status === "draft").length;
  } catch {
    // Supabase 未設定時
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">ダッシュボード</h1>
      <p className="mt-2 text-sm text-stone-600">
        記事は下書きで保存し、内容を確認してから公開してください。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">登録商品</p>
          <p className="mt-1 text-3xl font-bold">{productCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">記事数</p>
          <p className="mt-1 text-3xl font-bold">{articleCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">下書き</p>
          <p className="mt-1 text-3xl font-bold">{draftCount}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/admin/products/new">新規商品登録</ButtonLink>
        <ButtonLink href="/admin/articles/generate" variant="secondary">
          比較記事を作成
        </ButtonLink>
        <ButtonLink href="/admin/articles/new" variant="secondary">
          新規記事作成
        </ButtonLink>
      </div>
    </div>
  );
}
