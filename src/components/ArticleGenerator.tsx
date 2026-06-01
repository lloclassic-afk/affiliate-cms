"use client";

import { useMemo, useState } from "react";
import { createDraftFromGeneration } from "@/app/actions/articles";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { generateComparisonArticle } from "@/lib/article-generator";
import { slugify } from "@/lib/slug";
import type { Product } from "@/types/database";

export function ArticleGenerator({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [generated, setGenerated] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProducts = useMemo(
    () => products.filter((p) => selected.includes(p.id)),
    [products, selected],
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleGenerate() {
    if (selectedProducts.length < 2) {
      setError("比較記事には2件以上の商品を選択してください。");
      return;
    }
    const result = generateComparisonArticle(selectedProducts, {
      title: title || undefined,
    });
    setTitle(result.title);
    setSlug(slugify(result.title));
    setBody(result.body);
    setMetaDescription(result.metaDescription);
    setGenerated(true);
    setError(null);
  }

  async function handleSaveDraft() {
    setPending(true);
    setError(null);
    try {
      await createDraftFromGeneration({
        title,
        slug,
        body,
        meta_description: metaDescription,
        product_ids: selected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
      setPending(false);
    }
  }

  if (products.length === 0) {
    return (
      <p className="text-stone-600">
        商品が未登録です。先に
        <a href="/admin/products/new" className="underline">
          商品を登録
        </a>
        してください。
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">1. 商品を選択</h2>
        <ul className="space-y-2 rounded-lg border border-stone-200 bg-white p-4">
          {products.map((p) => (
            <li key={p.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                id={`gen-${p.id}`}
                checked={selected.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="mt-1"
              />
              <label htmlFor={`gen-${p.id}`} className="text-sm">
                <span className="font-medium">{p.name}</span>
                {p.category ? (
                  <span className="text-stone-500"> — {p.category}</span>
                ) : null}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button type="button" onClick={handleGenerate}>
            比較記事を作成
          </Button>
          <p className="mt-2 text-xs text-stone-500">
            商品情報から下書きを生成します。公開前に必ず独自のメモ・体験を追記してください。
          </p>
        </div>
      </section>

      {generated ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">2. 下書きを編集</h2>
          <Field label="タイトル">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="スラッグ">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
          <Field label="メタディスクリプション">
            <Textarea
              className="min-h-[80px]"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </Field>
          <Field label="本文（編集可能）">
            <Textarea
              className="min-h-[480px] font-mono text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Field>
          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
          <Button type="button" onClick={handleSaveDraft} disabled={pending}>
            {pending ? "保存中..." : "下書きとして保存して編集画面へ"}
          </Button>
        </section>
      ) : null}

      {error && !generated ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
