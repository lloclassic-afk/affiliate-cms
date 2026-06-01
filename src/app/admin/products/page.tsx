import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import { DeleteButton } from "@/components/DeleteButton";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/queries";

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let loadError: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "読み込みに失敗しました";
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900">商品一覧</h1>
        <ButtonLink href="/admin/products/new">新規商品登録</ButtonLink>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {loadError} — .env.local と Supabase の設定を確認してください。
        </p>
      ) : null}

      {products.length === 0 && !loadError ? (
        <p className="text-stone-600">商品がまだありません。</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-stone-200 bg-white p-4 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-stone-900">{p.name}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {p.category ?? "カテゴリ未設定"} · {formatPrice(p.price)} ·
                  登録 {formatDate(p.created_at)}
                </p>
              </div>
              <div className="mt-3 flex gap-2 sm:mt-0">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
                >
                  編集
                </Link>
                <DeleteButton
                  label={p.name}
                  onDelete={deleteProduct.bind(null, p.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
