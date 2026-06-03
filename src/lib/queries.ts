import { createAdminClient, createPublicClient } from "@/lib/supabase/server";
import type { Article, ArticleWithProducts, Product } from "@/types/database";

export async function getProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getArticles(): Promise<Article[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getArticle(id: string): Promise<ArticleWithProducts | null> {
  const supabase = createAdminClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) return null;

  const { data: links } = await supabase
    .from("article_products")
    .select("product_id, sort_order")
    .eq("article_id", id)
    .order("sort_order", { ascending: true });

  const productIds = (links ?? []).map((l) => l.product_id);
  let products: Product[] = [];

  if (productIds.length > 0) {
    const { data: productRows } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    const byId = new Map(
      ((productRows ?? []) as Product[]).map((p) => [p.id, p]),
    );
    products = productIds
      .map((pid) => byId.get(pid))
      .filter((p): p is Product => Boolean(p));
  }

  return { ...(article as Article), products };
}

type SupabaseServerClient = ReturnType<typeof createPublicClient>;

/** 公開ページ用: public.articles の published のみ */
export async function getPublishedArticles(): Promise<Article[]> {
  const publicClient = createPublicClient();
  const { data, error } = await publicClient
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (!error && data && data.length > 0) {
    return data as Article[];
  }

  const admin = createAdminClient();
  const { data: adminData, error: adminError } = await admin
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (adminError) throw adminError;
  return (adminData ?? []) as Article[];
}

async function loadPublishedArticleProducts(
  supabase: SupabaseServerClient,
  articleId: string,
): Promise<Product[]> {
  const { data: links } = await supabase
    .from("article_products")
    .select("product_id, sort_order")
    .eq("article_id", articleId)
    .order("sort_order", { ascending: true });

  const productIds = (links ?? []).map((l) => l.product_id);
  if (productIds.length === 0) return [];

  const { data: productRows } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const byId = new Map(
    ((productRows ?? []) as Product[]).map((p) => [p.id, p]),
  );
  return productIds
    .map((pid) => byId.get(pid))
    .filter((p): p is Product => Boolean(p));
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<ArticleWithProducts | null> {
  const normalizedSlug = decodeURIComponent(slug).trim();
  if (!normalizedSlug) return null;

  const publicClient = createPublicClient();
  const { data: publicArticle, error: publicError } = await publicClient
    .from("articles")
    .select("*")
    .eq("slug", normalizedSlug)
    .eq("status", "published")
    .maybeSingle();

  let article = !publicError && publicArticle ? (publicArticle as Article) : null;
  let client: SupabaseServerClient = publicClient;

  if (!article) {
    const admin = createAdminClient();
    const { data: adminArticle, error: adminError } = await admin
      .from("articles")
      .select("*")
      .eq("slug", normalizedSlug)
      .eq("status", "published")
      .maybeSingle();

    if (adminError || !adminArticle) return null;
    article = adminArticle as Article;
    client = admin;
  }

  const products = await loadPublishedArticleProducts(client, article.id);
  return { ...article, products };
}
