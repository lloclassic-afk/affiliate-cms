"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import { slugify } from "@/lib/slug";
import type { ArticleFormData, ArticleWithProducts, Product } from "@/types/database";

function toForm(article?: ArticleWithProducts, products: Product[] = []): ArticleFormData {
  if (!article) {
    return {
      title: "",
      slug: "",
      body: `${AFFILIATE_DISCLOSURE}\n\n`,
      meta_description: "",
      status: "draft",
      product_ids: [],
    };
  }
  return {
    title: article.title,
    slug: article.slug,
    body: article.body,
    meta_description: article.meta_description ?? "",
    status: article.status,
    product_ids: article.products.map((p) => p.id),
  };
}

export function ArticleForm({
  article,
  allProducts,
  action,
}: {
  article?: ArticleWithProducts;
  allProducts: Product[];
  action: (data: ArticleFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<ArticleFormData>(() =>
    toForm(article, allProducts),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleProduct(id: string) {
    setForm((prev) => {
      const exists = prev.product_ids.includes(id);
      return {
        ...prev,
        product_ids: exists
          ? prev.product_ids.filter((pid) => pid !== id)
          : [...prev.product_ids, id],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await action(form);
      setPending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        公開前に必ず内容を確認してください。下書きのままでは一般公開されません。
      </div>

      <Field label="タイトル *">
        <Input
          required
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            update("title", title);
            if (!article) update("slug", slugify(title));
          }}
        />
      </Field>
      <Field label="スラッグ *" hint="URL: /articles/[スラッグ]">
        <Input
          required
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
        />
      </Field>
      <Field label="メタディスクリプション">
        <Textarea
          className="min-h-[80px]"
          value={form.meta_description}
          onChange={(e) => update("meta_description", e.target.value)}
        />
      </Field>
      <Field label="公開ステータス *">
        <select
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
          value={form.status}
          onChange={(e) =>
            update("status", e.target.value as ArticleFormData["status"])
          }
        >
          <option value="draft">下書き（非公開）</option>
          <option value="published">公開済み</option>
        </select>
      </Field>
      <Field label="関連商品">
        {allProducts.length === 0 ? (
          <p className="text-sm text-stone-500">先に商品を登録してください。</p>
        ) : (
          <ul className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
            {allProducts.map((p) => (
              <li key={p.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id={`product-${p.id}`}
                  checked={form.product_ids.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="mt-1"
                />
                <label htmlFor={`product-${p.id}`} className="text-sm">
                  {p.name}
                  {p.category ? (
                    <span className="text-stone-500">（{p.category}）</span>
                  ) : null}
                </label>
              </li>
            ))}
          </ul>
        )}
      </Field>
      <Field
        label="本文 *"
        hint={`冒頭に「${AFFILIATE_DISCLOSURE}」が含まれている必要があります（保存時に自動付与）`}
      >
        <Textarea
          className="min-h-[400px] font-mono text-sm"
          required
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
        />
      </Field>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
