import { AFFILIATE_DISCLOSURE } from "@/lib/constants";
import type { Product } from "@/types/database";

function section(title: string, body: string | null | undefined): string {
  if (!body?.trim()) return "";
  return `## ${title}\n\n${body.trim()}\n\n`;
}

export function generateComparisonArticle(
  products: Product[],
  options?: { title?: string },
): { title: string; body: string; metaDescription: string } {
  const category =
    products.map((p) => p.category).find(Boolean) ?? "おすすめ商品";
  const title =
    options?.title ?? `【比較】${category}の選び方とおすすめ${products.length}選`;

  const intro = `以下は、登録済み商品の情報をもとに作成した比較記事の下書きです。
価格・仕様・体験談など、ご自身の調査結果を追記してから公開してください。

`;

  const productSections = products
    .map((p, i) => {
      const price =
        p.price != null ? `¥${Number(p.price).toLocaleString("ja-JP")}` : "要確認";
      return `### ${i + 1}. ${p.name}

- **カテゴリ**: ${p.category ?? "未設定"}
- **価格**: ${price}
- **対象ユーザー**: ${p.target_users?.trim() || "（追記してください）"}

${section("おすすめポイント", p.recommended_reason)}${section("デメリット・注意点", p.disadvantages)}

※ アフィリエイトリンク: [${p.affiliate_button_label}](${p.affiliate_url})

---
`;
    })
    .join("\n");

  const comparisonTable = `## 比較一覧（編集用）

| 商品名 | カテゴリ | 価格 | おすすめ理由（要約） |
|--------|----------|------|----------------------|
${products
  .map((p) => {
    const price =
      p.price != null ? `¥${Number(p.price).toLocaleString("ja-JP")}` : "-";
    const reason = (p.recommended_reason ?? "").replace(/\|/g, "／").slice(0, 40);
    return `| ${p.name} | ${p.category ?? "-"} | ${price} | ${reason || "追記"} |`;
  })
  .join("\n")}

`;

  const memo = `## 独自メモ（公開前に記入）

- 実際に使った感想:
- 他社製品との違い:
- こんな人には向かない:

## まとめ

（読者への結論を、体験に基づいて書いてください）

`;

  const body = `${AFFILIATE_DISCLOSURE}

${intro}${comparisonTable}
${productSections}
${memo}`;

  const metaDescription = `${category}の比較記事。${products.map((p) => p.name).join("、")}など${products.length}商品を、おすすめ理由・デメリット・対象ユーザーとともに解説します。`;

  return { title, body, metaDescription };
}
