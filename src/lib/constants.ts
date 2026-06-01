export const AFFILIATE_DISCLOSURE =
  "この記事には広告・アフィリエイトリンクを含みます。";

export const AFFILIATE_BUTTON_OPTIONS = [
  "公式サイトで見る",
  "Amazonで見る",
  "楽天で見る",
] as const;

export const ARTICLE_STATUS_LABELS: Record<"draft" | "published", string> = {
  draft: "下書き",
  published: "公開済み",
};
