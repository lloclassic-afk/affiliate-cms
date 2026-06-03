import type { Metadata } from "next";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import { getPublishedArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "公開済みのアフィリエイト記事",
};

export default async function ArticlesIndexPage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  try {
    articles = await getPublishedArticles();
  } catch {
    articles = [];
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold text-stone-900">記事一覧</h1>
          <p className="mt-2 text-sm text-stone-600">公開済みの記事</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {articles.length === 0 ? (
          <p className="text-stone-600">公開中の記事はまだありません。</p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li
                key={article.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <h2 className="text-lg font-semibold">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-stone-900 hover:underline"
                  >
                    {article.title}
                  </Link>
                </h2>
                {article.meta_description ? (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {article.meta_description}
                  </p>
                ) : null}
                <p className="mt-3 text-sm">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="text-stone-700 underline decoration-stone-300 hover:decoration-stone-600"
                  >
                    /articles/{article.slug}
                  </Link>
                  <span className="text-stone-400"> · 更新 {formatDate(article.updated_at)}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <Link href="/" className="hover:underline">
          トップへ
        </Link>
      </footer>
    </div>
  );
}
