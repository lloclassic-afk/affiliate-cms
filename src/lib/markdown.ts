function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertInlineMarkdown(text: string) {
  return text
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

export function markdownToHtml(markdown: string | null | undefined) {
  if (!markdown) return "";

  const normalized = markdown.replace(/\r\n/g, "\n").trim();

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const escaped = escapeHtml(block);
      const withLinks = convertInlineMarkdown(escaped);
      const withLineBreaks = withLinks.replace(/\n/g, "<br />");

         (withLineBreaks.startsWith("## ")) {
        return `<h2>${withLineBreaks.replace(/^##\s+/, "")}</h2>`;
                      hLineBreaks.startsWith("# ")) {
                               re                       )}</h1>`;
      }

      if (withLineBreaks.startsWith("-      if (wi   const items =      if (withLineBreaks.startsWith("-               if (withLineBreaks.startsWith("-      if (wi   const item  .filter(Boo      if            if (withLineBreaks.star</      if (withLineBreaks.startsWith("-      if (wi   const items =    }

      return `<p>${withLineBreaks}</p>`;
    })
    .join("\n");
}
