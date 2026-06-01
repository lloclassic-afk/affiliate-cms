import { ARTICLE_STATUS_LABELS } from "@/lib/constants";
import type { ArticleStatus } from "@/types/database";

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const published = status === "published";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published
          ? "bg-stone-900 text-white"
          : "bg-amber-100 text-amber-900"
      }`}
    >
      {ARTICLE_STATUS_LABELS[status]}
    </span>
  );
}
