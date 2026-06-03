"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import { slugify } from "@/lib/slug";
import { formatSupabaseError } from "@/lib/supabase/errors";
import { createAdminClient } from "@/lib/supabase/server";
import type { ArticleFormData, ArticleStatus } from "@/types/database";

function ensureDisclosure(body: string): string {
  if (body.includes(AFFILIATE_DISCLOSURE)) return body;
  return `${AFFILIATE_DISCLOSURE}\n\n${body}`;
}

async function syncArticleProducts(
  articleId: string,
  productIds: string[],
) {
  const supabase = createAdminClient();
  await supabase.from("article_products").delete().eq("article_id", articleId);

  if (productIds.length === 0) return;

  const rows = productIds.map((product_id, index) => ({
    article_id: articleId,
    product_id,
    sort_order: index,
  }));

  const { error } = await supabase.from("article_products").insert(rows);
  if (error) throw new Error(formatSupabaseError(error));
}

export async function createArticle(data: ArticleFormData) {
  const supabase = createAdminClient();
  const slug = data.slug.trim() || slugify(data.title);

  const { data: row, error } = await supabase
    .from("articles")
    .insert({
      title: data.title.trim(),
      slug,
      body: ensureDisclosure(data.body),
      meta_description: data.meta_description.trim() || null,
      status: data.status as ArticleStatus,
    })
    .select("id")
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  await syncArticleProducts(row.id, data.product_ids);

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${row.id}/edit`);
}

export async function updateArticle(id: string, data: ArticleFormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("articles")
    .update({
      title: data.title.trim(),
      slug: data.slug.trim(),
      body: ensureDisclosure(data.body),
      meta_description: data.meta_description.trim() || null,
      status: data.status as ArticleStatus,
    })
    .eq("id", id);

  if (error) throw new Error(formatSupabaseError(error));
  await syncArticleProducts(id, data.product_ids);

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath(`/admin/articles/${id}/edit`);
  revalidatePath(`/articles/${data.slug.trim()}`);
}

export async function deleteArticle(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) throw new Error(formatSupabaseError(error));
  revalidatePath("/admin/articles");
}

export async function createDraftFromGeneration(input: {
  title: string;
  slug: string;
  body: string;
  meta_description: string;
  product_ids: string[];
}) {
  const supabase = createAdminClient();
  const slug = input.slug.trim() || slugify(input.title);

  const { data: row, error } = await supabase
    .from("articles")
    .insert({
      title: input.title.trim(),
      slug,
      body: ensureDisclosure(input.body),
      meta_description: input.meta_description.trim() || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(formatSupabaseError(error));
  await syncArticleProducts(row.id, input.product_ids);

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${row.id}/edit`);
}
