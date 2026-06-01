export type ArticleStatus = "draft" | "published";

export type Product = {
  id: string;
  name: string;
  product_url: string;
  affiliate_url: string;
  price: number | null;
  category: string | null;
  recommended_reason: string | null;
  disadvantages: string | null;
  target_users: string | null;
  affiliate_button_label: string;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  body: string;
  meta_description: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
};

export type ArticleWithProducts = Article & {
  products: Product[];
};

export type ProductFormData = {
  name: string;
  product_url: string;
  affiliate_url: string;
  price: string;
  category: string;
  recommended_reason: string;
  disadvantages: string;
  target_users: string;
  affiliate_button_label: string;
};

export type ArticleFormData = {
  title: string;
  slug: string;
  body: string;
  meta_description: string;
  status: ArticleStatus;
  product_ids: string[];
};
