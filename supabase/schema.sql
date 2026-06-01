-- アフィリエイト記事管理システム MVP
-- Supabase SQL Editor で実行してください

create extension if not exists "pgcrypto";

-- 商品
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_url text not null,
  affiliate_url text not null,
  price numeric(12, 2),
  category text,
  recommended_reason text,
  disadvantages text,
  target_users text,
  affiliate_button_label text not null default '公式サイトで見る',
  created_at timestamptz not null default now()
);

-- 記事
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null default '',
  meta_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 記事と商品の関連
create table if not exists article_products (
  article_id uuid not null references articles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  sort_order int not null default 0,
  primary key (article_id, product_id)
);

create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_status on articles(status);
create index if not exists idx_article_products_article on article_products(article_id);

-- updated_at 自動更新
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on articles;
create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at_column();

-- RLS
alter table products enable row level security;
alter table articles enable row level security;
alter table article_products enable row level security;

-- 公開記事・関連商品は誰でも閲覧可
create policy "products_public_read" on products
  for select using (true);

create policy "articles_public_read_published" on articles
  for select using (status = 'published');

create policy "article_products_public_read" on article_products
  for select using (
    exists (
      select 1 from articles
      where articles.id = article_products.article_id
        and articles.status = 'published'
    )
  );

-- MVP: 管理操作は service_role キー経由（サーバー側のみ）で行う想定
-- 開発時に anon で管理する場合は以下のポリシーを一時的に有効化してください
-- create policy "products_admin_all" on products for all using (true) with check (true);
-- create policy "articles_admin_all" on articles for all using (true) with check (true);
-- create policy "article_products_admin_all" on article_products for all using (true) with check (true);
