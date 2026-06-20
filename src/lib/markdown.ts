export function markdownToHtml(markdown: string | null | undefined) {
  if (!markdown) return "";

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block) => {
      const escaped = escapeHtml(block.trim());

      const linked = escaped.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      const withBreaks = linked.replace(/\n/g, "<br />");

      return `<p>${withBreaks}</p>`;
    })
    .join("\n");
}
