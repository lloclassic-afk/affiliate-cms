export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatPrice(price: number | null): string {
  if (price == null) return "価格未設定";
  return `¥${Number(price).toLocaleString("ja-JP")}`;
}
