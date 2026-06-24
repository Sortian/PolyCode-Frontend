/** Detect programs that read interactive stdin. */
export function codeNeedsStdin(code = "", language = "") {
  const lang = String(language).toLowerCase();
  const source = String(code);

  if (lang === "python" || lang === "py") {
    return /\binput\s*\(/.test(source);
  }
  if (lang === "cpp" || lang === "c++" || lang === "c") {
    return /\bcin\s*>>/.test(source) || /\bscanf\s*\(/.test(source);
  }
  if (lang === "java") {
    return /\bScanner\b/.test(source) || /\bSystem\.in\b/.test(source);
  }
  if (lang === "javascript" || lang === "js") {
    return /\bprompt\s*\(/.test(source);
  }
  return false;
}

/** Count likely interactive reads to pre-fill the stdin panel. */
export function suggestStdinSample(code = "", language = "") {
  const lang = String(language).toLowerCase();
  const source = String(code);
  let count = 0;

  if (lang === "python" || lang === "py") {
    count = (source.match(/\binput\s*\(/g) || []).length;
  } else if (lang === "cpp" || lang === "c++" || lang === "c") {
    count = (source.match(/\bcin\s*>>/g) || []).length;
  } else if (count === 0 && /\bscanf\s*\(/.test(source)) {
    count = 1;
  }

  if (count <= 0) return "10\n20\n30\n";
  return `${Array.from({ length: count }, (_, i) => String((i + 1) * 10)).join("\n")}\n`;
}
