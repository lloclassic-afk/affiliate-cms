/** MVP: 簡易 Markdown → HTML（見出し・リスト・リンク・テーブル・段落） */
export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const [header, , ...body] = tableRows;
    html.push("<div class='overflow-x-auto my-4'><table class='w-full text-sm border-collapse'>");
    if (header) {
      html.push("<thead><tr>");
      header.forEach((cell) =>
        html.push(`<th class='border border-stone-300 bg-stone-100 px-3 py-2 text-left'>${inline(cell)}</th>`),
      );
      html.push("</tr></thead>");
    }
    if (body.length) {
      html.push("<tbody>");
      body.forEach((row) => {
        html.push("<tr>");
        row.forEach((cell) =>
          html.push(`<td class='border border-stone-300 px-3 py-2'>${inline(cell)}</td>`),
        );
        html.push("</tr>");
      });
      html.push("</tbody>");
    }
    html.push("</table></div>");
    tableRows = [];
    inTable = false;
  }

  function inline(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-stone-800" rel="nofollow sponsored" target="_blank">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  for (const line of lines) {
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      inTable = true;
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (!cells.every((c) => /^-+$/.test(c))) {
        tableRows.push(cells);
      }
      continue;
    }
    if (inTable) flushTable();

    if (line.startsWith("### ")) {
      html.push(`<h3 class='text-lg font-semibold mt-6 mb-2'>${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2 class='text-xl font-semibold mt-8 mb-3'>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      html.push(`<h1 class='text-2xl font-bold mt-4 mb-4'>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ")) {
      html.push(`<li class='ml-4 list-disc'>${inline(line.slice(2))}</li>`);
    } else if (line.trim() === "---") {
      html.push("<hr class='my-6 border-stone-300' />");
    } else if (line.trim() === "") {
      html.push("<br />");
    } else {
      html.push(`<p class='my-3 leading-relaxed'>${inline(line)}</p>`);
    }
  }
  if (inTable) flushTable();

  return html.join("\n");
}
