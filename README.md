# アフィリエイト記事管理システム（MVP）

Next.js + TypeScript + Supabase + Tailwind CSS で、商品登録とアフィリエイト記事の下書き・公開を行う管理アプリです。

## 機能概要

| 機能 | 説明 |
|------|------|
| 商品登録 | 名前・URL・価格・カテゴリ・おすすめ理由・デメリット・対象ユーザーなど |
| 記事管理 | タイトル・スラッグ・本文・メタ・関連商品・下書き/公開 |
| 比較記事生成 | 複数商品から下書きを生成（テンプレートベース）→ 人が編集してから保存 |
| 公開ページ | `/articles/[slug]` — 公開済み記事のみ表示 |
| 管理画面 | `/admin` 配下 |

**重要:** デフォルトはすべて「下書き」。ステータスを「公開済み」に変更するまで一般公開されません。

## セットアップ

### 1. Supabase プロジェクト作成

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で DB をセットアップ
   - 新規: `supabase/schema.sql` を丸ごと実行
   - **products のみ作成済み:** `supabase/migrations/002_articles.sql` を実行（`articles` / `article_products`）
3. Settings → API から URL / anon key / service_role key を取得

### 2. 環境変数

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> **セキュリティ:** `SUPABASE_SERVICE_ROLE_KEY` はサーバー側のみで使用します。Git にコミットしないでください。

### 3. 起動

```bash
npm install
npm run dev
```

- トップ: http://localhost:3000
- 管理画面: http://localhost:3000/admin

## ファイル構成

```
affiliate-cms/
├── supabase/schema.sql      # DB テーブル・RLS
├── src/
│   ├── app/
│   │   ├── actions/         # Server Actions（CRUD）
│   │   ├── admin/           # 管理画面
│   │   ├── articles/[slug]/ # 公開記事
│   │   └── page.tsx         # トップ
│   ├── components/          # UI・フォーム
│   ├── lib/                 # Supabase・記事生成・Markdown
│   └── types/database.ts
└── .env.local.example
```

## テーブル設計

### `products`

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| name | text | 商品名 |
| product_url | text | 商品URL |
| affiliate_url | text | アフィリエイトURL |
| price | numeric | 価格 |
| category | text | カテゴリ |
| recommended_reason | text | おすすめ理由 |
| disadvantages | text | デメリット |
| target_users | text | 対象ユーザー |
| affiliate_button_label | text | ボタン文言 |
| created_at | timestamptz | 登録日 |

### `articles`

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| title | text | タイトル |
| slug | text | URL 用（ユニーク） |
| body | text | 本文（Markdown 風） |
| meta_description | text | メタ |
| status | text | `draft` / `published` |
| created_at | timestamptz | 作成日 |
| updated_at | timestamptz | 更新日 |

### `article_products`

記事と商品の多対多（`sort_order` で並び順）。

## 運用フロー（スパム対策・広告表記）

1. 商品を登録し、**おすすめ理由・デメリット・対象ユーザー**を具体的に記入
2. 「比較記事を作成」で下書き生成
3. 「独自メモ」セクションに体験・比較・結論を追記
4. 記事編集画面で確認し、問題なければ **公開済み** に変更
5. 公開ページでは冒頭と各アフィリエイトボタン付近に広告表記を表示

## MVP の制限（今後の拡張）

- 管理画面にログイン認証なし（本番では Supabase Auth 等を追加推奨）
- 記事生成は AI ではなく商品データからのテンプレート
- Markdown レンダラーは簡易実装

## 技術スタック

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL)
