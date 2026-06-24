/**
 * Repairs clipboard text copied from syntax-highlighted DOM where each token
 * ends up on its own line (common with react-syntax-highlighter tables).
 */
export function normalizeBrokenCodePaste(text) {
  if (!text || typeof text !== "string") return text;

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  const nonEmpty = lines.filter((line) => line.trim().length > 0);

  if (nonEmpty.length < 4) return text;

  const singleTokenLines = nonEmpty.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed || /\s/.test(trimmed)) return false;
    return trimmed.length <= 48;
  });

  if (singleTokenLines.length / nonEmpty.length < 0.5) return text;

  const joined = nonEmpty.map((line) => line.trim()).join(" ");

  const repaired = joined
    .replace(/\s*;\s*/g, ";\n")
    .replace(/\s*\{\s*/g, " {\n")
    .replace(/\s*\}\s*/g, "}\n")
    .replace(/\s*#include\s+/g, "\n#include ")
    .replace(/\s*using\s+/g, "\nusing ")
    .replace(/\s*int\s+main\s*\(/g, "\nint main(")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "");

  if (!repaired.trim()) return text;
  return repaired.endsWith("\n") ? repaired : `${repaired}\n`;
}

export function attachMonacoPasteNormalizer(editor) {
  if (!editor?.getDomNode) return () => {};

  const domNode = editor.getDomNode();
  if (!domNode) return () => {};

  const onPaste = (event) => {
    const raw = event.clipboardData?.getData("text/plain") ?? "";
    const fixed = normalizeBrokenCodePaste(raw);
    if (fixed === raw) return;

    event.preventDefault();
    event.stopPropagation();

    const selection = editor.getSelection();
    if (!selection) return;

    editor.executeEdits("normalize-paste", [
      {
        range: selection,
        text: fixed,
        forceMoveMarkers: true,
      },
    ]);
  };

  domNode.addEventListener("paste", onPaste, true);
  return () => domNode.removeEventListener("paste", onPaste, true);
}
