import { notFound } from "next/navigation";
import { updateArticle } from "@/app/actions/articles";
import { ArticleForm } from "@/components/ArticleForm";
import { getArticle, getProducts } from "@/lib/queries";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, products] = await Promise.all([
    getArticle(id),
    getProducts().catch(() => []),
  ]);

  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, id);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-stone-900">記事編集</h1>
      {article.status === "published" ? (
        <p className="mb-6 text-sm text-stone-600">
          公開中:{" "}
          <a
            href={`/articles/${article.slug}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            /articles/{article.slug}
          </a>
        </p>
      ) : (
        <p className="mb-6 text-sm text-amber-800">
          現在は下書きです。公開するにはステータスを「公開済み」に変更し、内容を保存してください。
        </p>
      )}
      <ArticleForm
        article={article}
        allProducts={products}
        action={boundUpdate}
      />
    </div>
  );
}
