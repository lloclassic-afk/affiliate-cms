-- products テーブル作成済みのプロジェクト向け
-- Supabase SQL Editor でこのファイルを実行してください。
--
-- 作成対象:
--   public.articles         記事
--   public.article_products 記事と商品の関連（比較記事の保存に必須）

-- ---------------------------------------------------------------------------
-- articles
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null default '',
  meta_description text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.articles is 'アフィリエイト記事（下書き・公開）';
comment on column public.articles.title is '記事タイトル';
comment on column public.articles.slug is '公開 URL 用スラッグ（/articles/[slug]）';
comment on column public.articles.body is '本文（Markdown 風テキスト）';
comment on column public.articles.meta_description is 'SEO 用メタディスクリプション';
comment on column public.articles.status is 'draft | published';

create index if not exists idx_articles_slug on public.articles (slug);
create index if not exists idx_articles_status on public.articles (status);

-- ---------------------------------------------------------------------------
-- article_products（比較記事で選択した商品の紐づけ）
-- ---------------------------------------------------------------------------
create table if not exists public.article_products (
  article_id uuid not null references public.articles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  sort_order int not null default 0,
  primary key (article_id, product_id)
);

comment on table public.article_products is '記事と商品の多対多（sort_order で表示順）';

create index if not exists idx_article_products_article
  on public.article_products (article_id);

-- ---------------------------------------------------------------------------
-- updated_at 自動更新
-- ---------------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row
  execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- API ロールへの権限（PostgREST / service_role / anon）
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.articles to service_role;
grant select, insert, update, delete on public.article_products to service_role;
grant select on public.articles to anon, authenticated;
grant select on public.article_products to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.articles enable row level security;
alter table public.article_products enable row level security;

-- 公開済み記事のみ anon で閲覧可（公開ページ用）
drop policy if exists "articles_public_read_published" on public.articles;
create policy "articles_public_read_published"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

-- 公開済み記事に紐づく商品関連のみ閲覧可
drop policy if exists "article_products_public_read" on public.article_products;
create policy "article_products_public_read"
  on public.article_products
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.articles
      where articles.id = article_products.article_id
        and articles.status = 'published'
    )
  );

-- CMS の CRUD は SUPABASE_SERVICE_ROLE_KEY（サーバー）が RLS をバイパスするため
-- 管理用ポリシーは不要。anon キーだけで管理する場合は以下を有効化:
-- drop policy if exists "articles_admin_all" on public.articles;
-- create policy "articles_admin_all" on public.articles for all using (true) with check (true);
-- drop policy if exists "article_products_admin_all" on public.article_products;
-- create policy "article_products_admin_all" on public.article_products for all using (true) with check (true);

-- PostgREST のスキーマキャッシュを即時反映（任意）
notify pgrst, 'reload schema';
