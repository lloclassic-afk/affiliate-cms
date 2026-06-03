const SCHEMA_SETUP_HINT =
  "Supabase の SQL Editor で supabase/migrations/002_articles.sql を実行し、articles / article_products テーブルを作成してください。";

/** PostgREST / Supabase のエラーを CMS 向けメッセージに変換 */
export function formatSupabaseError(error: { message: string; code?: string }) {
  const msg = error.message ?? "データベースエラー";

  if (
    error.code === "PGRST205" ||
    /schema cache/i.test(msg) ||
    /Could not find the table/i.test(msg)
  ) {
    return `${msg}\n\n${SCHEMA_SETUP_HINT}`;
  }

  return msg;
}
