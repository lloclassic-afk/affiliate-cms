import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { markdownToHtml } from "@/lib/markdown";
import { getPublishedArticleBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: article.title,
    description: article.meta_description ?? undefined,
  };
}

export default async function PublicArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const html = markdownToHtml(article.body);

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-xs text-stone-500">
            <Link href="/articles" className="hover:underline">
              記事一覧
            </Link>
            <span className="mx-2">/</span>
            更新日: {formatDate(article.updated_at)}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
            {article.title}
          </h1>
          {article.meta_description ? (
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {article.meta_description}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <aside className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {AFFILIATE_DISCLOSURE}
        </aside>

        <article
          className="prose-article rounded-xl border border-stone-200 bg-white p-6 text-stone-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {article.products.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-stone-900">
              紹介商品
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {article.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <Link href="/articles" className="hover:underline">
          記事一覧へ
        </Link>
        <span className="mx-2">·</span>
        <Link href="/" className="hover:underline">
          トップへ
        </Link>
      </footer>
    </div>
  );
}
