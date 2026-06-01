"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { AFFILIATE_BUTTON_OPTIONS } from "@/lib/constants";
import type { Product, ProductFormData } from "@/types/database";

const empty: ProductFormData = {
  name: "",
  product_url: "",
  affiliate_url: "",
  price: "",
  category: "",
  recommended_reason: "",
  disadvantages: "",
  target_users: "",
  affiliate_button_label: AFFILIATE_BUTTON_OPTIONS[0],
};

function toForm(product?: Product): ProductFormData {
  if (!product) return empty;
  return {
    name: product.name,
    product_url: product.product_url,
    affiliate_url: product.affiliate_url,
    price: product.price != null ? String(product.price) : "",
    category: product.category ?? "",
    recommended_reason: product.recommended_reason ?? "",
    disadvantages: product.disadvantages ?? "",
    target_users: product.target_users ?? "",
    affiliate_button_label: product.affiliate_button_label,
  };
}

export function ProductForm({
  product,
  action,
}: {
  product?: Product;
  action: (data: ProductFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductFormData>(() => toForm(product));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await action(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <Field label="商品名 *">
        <Input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </Field>
      <Field label="商品URL *" hint="公式サイトなどの参照用URL">
        <Input
          required
          type="url"
          value={form.product_url}
          onChange={(e) => update("product_url", e.target.value)}
        />
      </Field>
      <Field label="アフィリエイトURL *">
        <Input
          required
          type="url"
          value={form.affiliate_url}
          onChange={(e) => update("affiliate_url", e.target.value)}
        />
      </Field>
      <Field label="価格（円）">
        <Input
          type="number"
          min="0"
          step="1"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />
      </Field>
      <Field label="カテゴリ">
        <Input
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        />
      </Field>
      <Field label="おすすめ理由" hint="独自の体験・比較ポイントを記入">
        <Textarea
          value={form.recommended_reason}
          onChange={(e) => update("recommended_reason", e.target.value)}
        />
      </Field>
      <Field label="デメリット" hint="読者の信頼のため、弱点も正直に">
        <Textarea
          value={form.disadvantages}
          onChange={(e) => update("disadvantages", e.target.value)}
        />
      </Field>
      <Field label="対象ユーザー">
        <Textarea
          value={form.target_users}
          onChange={(e) => update("target_users", e.target.value)}
        />
      </Field>
      <Field label="ボタン文言 *">
        <select
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
          value={form.affiliate_button_label}
          onChange={(e) => update("affiliate_button_label", e.target.value)}
        >
          {AFFILIATE_BUTTON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
