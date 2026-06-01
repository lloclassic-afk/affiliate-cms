import { AffiliateButton } from "@/components/AffiliateButton";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{product.name}</h3>
      {product.category ? (
        <p className="mt-1 text-sm text-stone-500">{product.category}</p>
      ) : null}
      <p className="mt-2 text-base font-medium text-stone-800">
        {formatPrice(product.price)}
      </p>
      {product.recommended_reason ? (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-stone-800">おすすめ理由</h4>
          <p className="mt-1 text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
            {product.recommended_reason}
          </p>
        </div>
      ) : null}
      {product.disadvantages ? (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-stone-800">デメリット</h4>
          <p className="mt-1 text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
            {product.disadvantages}
          </p>
        </div>
      ) : null}
      {product.target_users ? (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-stone-800">対象ユーザー</h4>
          <p className="mt-1 text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
            {product.target_users}
          </p>
        </div>
      ) : null}
      <AffiliateButton product={product} />
    </article>
  );
}
