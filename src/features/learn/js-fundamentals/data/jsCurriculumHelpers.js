export const JS_ACCENT = "#f59e0b";

export function quiz(question, options, answer, explanation) {
  return { type: "quiz", question, options, answer, explanation };
}

export function callout(variant, content) {
  return { type: "callout", variant, content };
}

export function text(content, codeBlock = null) {
  if (codeBlock) {
    return {
      type: "text",
      content,
      code: { lang: "javascript", ...codeBlock },
    };
  }
  return { type: "text", content };
}

export function diagram(title, nodes) {
  return { type: "diagram", title, nodes };
}

export function table(title, headers, rows, options = {}) {
  return {
    type: "table",
    title,
    columns: headers.slice(1),
    rows: rows.map((row) => ({
      label: row[0],
      values: row.slice(1),
    })),
    showTotals: false,
    ...options,
  };
}

export function objectives(items) {
  return { type: "objectives", items };
}
