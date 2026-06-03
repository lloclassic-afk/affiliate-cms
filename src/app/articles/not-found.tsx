import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f0e8] px-4 text-center">
      <h1 className="text-2xl font-bold text-stone-900">記事が見つかりません</h1>
      <p className="mt-3 text-sm text-stone-600">
        指定された URL の記事は存在しないか、まだ公開されていません。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/articles" className="underline text-stone-800">
          記事一覧へ
        </Link>
        <Link href="/" className="underline text-stone-800">
          トップへ
        </Link>
      </div>
    </div>
  );
}
