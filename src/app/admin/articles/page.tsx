import Link from "next/link";
import { deleteArticle } from "@/app/actions/articles";
import { DeleteButton } from "@/components/DeleteButton";
import { StatusBadge } from "@/components/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";
import { getArticles } from "@/lib/queries";

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  let loadError: string | null = null;

  try {
    articles = await getArticles();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "読み込みに失敗しました";
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-stone-900">記事一覧</h1>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin/articles/generate" variant="secondary">
            比較記事を作成
          </ButtonLink>
          <ButtonLink href="/admin/articles/new">新規記事作成</ButtonLink>
        </div>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {loadError}
        </p>
      ) : null}

      {articles.length === 0 && !loadError ? (
        <p className="text-stone-600">記事がまだありません。</p>
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-stone-900">{a.title}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-stone-500">
                    /articles/{a.slug} · 更新 {formatDate(a.updated_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.status === "published" ? (
                    <Link
                      href={`/articles/${a.slug}`}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
                      target="_blank"
                    >
                      公開ページ
                    </Link>
                  ) : null}
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50"
                  >
                    編集
                  </Link>
                  <DeleteButton
                    label={a.title}
                    onDelete={deleteArticle.bind(null, a.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
