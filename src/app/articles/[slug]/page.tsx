import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { markdownToHtml } from "@/lib/markdown";
import {
  getArticleCategory,
  getArticleExcerpt,
  SITE_NAME,
  SITE_URL,
} from "@/lib/media";
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
  const description = getArticleExcerpt(article);
  const url = `${SITE_URL}/articles/${article.slug}`;
  return {
    title: article.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${article.title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "article",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | ${SITE_NAME}`,
      description,
    },
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
  const category = getArticleCategory(article);

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
          <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
            {category}
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

      <main className="mx-auto max-w-5xl px-4 py-8">
        <aside className="mx-auto mb-8 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {AFFILIATE_DISCLOSURE}
        </aside>

        <article
  className="article-content prose-article mx-auto"
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: 1.9,
  }}
  dangerouslySetInnerHTML={{ __html: html }}
/>

        {article.products.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-stone-900">
              紹介しているAIツール
            </h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              この記事内で紹介している商品・サービスへのリンクです。
            </p>
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
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
