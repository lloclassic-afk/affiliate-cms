import type { Product } from "@/types/database";

export function AffiliateButton({
  product,
  showNotice = true,
}: {
  product: Product;
  showNotice?: boolean;
}) {
  return (
    <div className="mt-3">
      <a
        href={product.affiliate_url}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="inline-block w-full rounded-lg bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-stone-800 sm:w-auto"
      >
        {product.affiliate_button_label}
      </a>
      {showNotice ? (
        <p className="mt-2 text-xs text-stone-500">
          ※ 広告・アフィリエイトリンクです
        </p>
      ) : null}
    </div>
  );
}
