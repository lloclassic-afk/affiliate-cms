import Link from "next/link";

const links = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/products", label: "商品一覧" },
  { href: "/admin/articles", label: "記事一覧" },
  { href: "/admin/articles/generate", label: "比較記事を作成" },
];

export function AdminNav() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin" className="text-lg font-semibold text-stone-900">
          アフィリエイト記事管理
        </Link>
        <nav className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
