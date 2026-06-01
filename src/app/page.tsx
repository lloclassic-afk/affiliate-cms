import { ButtonLink } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-stone-900">
        アフィリエイト記事管理
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        商品を登録し、比較記事の下書きを作成。内容を確認してから公開できます。
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/admin">管理画面へ</ButtonLink>
      </div>
    </main>
  );
}
