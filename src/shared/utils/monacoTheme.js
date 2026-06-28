export const POLYCODE_VSCODE_THEME = "polycode-vscode-dark";
export const POLYCODE_VSCODE_LIGHT_THEME = "polycode-vscode-light";
export const POLYCODE_PLAYGROUND_DARK_THEME = "polycode-playground-dark";
export const POLYCODE_PLAYGROUND_LIGHT_THEME = "polycode-playground-light";

export function definePolycodeMonacoTheme(monaco) {
  if (!monaco) return;

  monaco.editor.defineTheme(POLYCODE_VSCODE_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "d4d4d4", background: "1e1e1e" },
      { token: "comment", foreground: "6a9955", fontStyle: "italic" },
      { token: "keyword", foreground: "569cd6" },
      { token: "number", foreground: "b5cea8" },
      { token: "string", foreground: "ce9178" },
      { token: "type", foreground: "4ec9b0" },
      { token: "class", foreground: "4ec9b0" },
      { token: "function", foreground: "dcdcaa" },
      { token: "variable", foreground: "9cdcfe" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
      "editorCursor.foreground": "#aeafad",
      "editor.selectionBackground": "#0ea5e980",
      "editor.selectionForeground": "#f8fbff",
      "editor.selectionHighlightBackground": "#0ea5e933",
      "editor.inactiveSelectionBackground": "#0ea5e94d",
      "editor.inactiveSelectionForeground": "#f8fbff",
      "editor.wordHighlightBackground": "#0ea5e926",
      "editor.wordHighlightStrongBackground": "#0ea5e940",
      "editor.lineHighlightBackground": "#2a2d2e",
      "editor.lineHighlightBorder": "#00000000",
      "editorBracketMatch.background": "#0064001a",
      "editorBracketMatch.border": "#888888",
      "editorIndentGuide.background1": "#404040",
      "editorIndentGuide.activeBackground1": "#707070",
      "editorGutter.background": "#1e1e1e",
      "editorWidget.background": "#252526",
      "editorSuggestWidget.background": "#252526",
      "editorSuggestWidget.border": "#454545",
      "editorSuggestWidget.selectedBackground": "#04395e",
      "input.background": "#3c3c3c",
      "focusBorder": "#007acc",
      "scrollbarSlider.background": "#79797966",
      "scrollbarSlider.hoverBackground": "#646464b3",
      "scrollbarSlider.activeBackground": "#bfbfbf66",
    },
  });
}

export function definePolycodeMonacoLightTheme(monaco) {
  if (!monaco) return;

  monaco.editor.defineTheme(POLYCODE_VSCODE_LIGHT_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "1e293b", background: "f8fafc" },
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "7c3aed" },
      { token: "number", foreground: "b45309" },
      { token: "string", foreground: "2563eb" },
      { token: "type", foreground: "2563eb" },
      { token: "class", foreground: "2563eb" },
      { token: "function", foreground: "4338ca" },
      { token: "variable", foreground: "0f172a" },
    ],
    colors: {
      "editor.background": "#f8fafc",
      "editor.foreground": "#1e293b",
      "editorLineNumber.foreground": "#94a3b8",
      "editorLineNumber.activeForeground": "#475569",
      "editorCursor.foreground": "#4f46e5",
      "editor.selectionBackground": "#2563eb30",
      "editor.selectionHighlightBackground": "#2563eb18",
      "editor.inactiveSelectionBackground": "#2563eb20",
      "editor.wordHighlightBackground": "#2563eb14",
      "editor.lineHighlightBackground": "#dbeafe",
      "editor.lineHighlightBorder": "#00000000",
      "editorGutter.background": "#f1f5f9",
      "editorWidget.background": "#ffffff",
      "editorSuggestWidget.background": "#ffffff",
      "editorSuggestWidget.border": "#e2e8f0",
      "focusBorder": "#4f46e5",
      "scrollbarSlider.background": "#cbd5e166",
      "scrollbarSlider.hoverBackground": "#94a3b899",
    },
  });
}

/** Cool slate editor for landing playground — avoids warm/brown VS Code tones. */
export function definePolycodePlaygroundThemes(monaco) {
  if (!monaco) return;

  monaco.editor.defineTheme(POLYCODE_PLAYGROUND_DARK_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "e2e8f0", background: "0d1117" },
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "7dd3fc" },
      { token: "number", foreground: "a5b4fc" },
      { token: "string", foreground: "93c5fd" },
      { token: "type", foreground: "67e8f9" },
      { token: "class", foreground: "67e8f9" },
      { token: "function", foreground: "c4b5fd" },
      { token: "variable", foreground: "e2e8f0" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#e2e8f0",
      "editorLineNumber.foreground": "#475569",
      "editorLineNumber.activeForeground": "#94a3b8",
      "editorCursor.foreground": "#818cf8",
      "editor.selectionBackground": "#6366f140",
      "editor.lineHighlightBackground": "#161b22",
      "editor.lineHighlightBorder": "#00000000",
      "editorGutter.background": "#0d1117",
      "editorIndentGuide.background1": "#1e293b",
      "editorIndentGuide.activeBackground1": "#334155",
      "focusBorder": "#00000000",
      "scrollbarSlider.background": "#33415580",
      "scrollbarSlider.hoverBackground": "#475569b3",
    },
  });

  monaco.editor.defineTheme(POLYCODE_PLAYGROUND_LIGHT_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "0f172a", background: "ffffff" },
      { token: "comment", foreground: "64748b", fontStyle: "italic" },
      { token: "keyword", foreground: "2563eb" },
      { token: "number", foreground: "4f46e5" },
      { token: "string", foreground: "0369a1" },
      { token: "type", foreground: "0891b2" },
      { token: "class", foreground: "0891b2" },
      { token: "function", foreground: "4338ca" },
      { token: "variable", foreground: "0f172a" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#0f172a",
      "editorLineNumber.foreground": "#94a3b8",
      "editorLineNumber.activeForeground": "#475569",
      "editorCursor.foreground": "#4f46e5",
      "editor.selectionBackground": "#4f46e528",
      "editor.lineHighlightBackground": "#f8fafc",
      "editor.lineHighlightBorder": "#00000000",
      "editorGutter.background": "#f8fafc",
      "editorIndentGuide.background1": "#e2e8f0",
      "editorIndentGuide.activeBackground1": "#cbd5e1",
      "focusBorder": "#00000000",
      "scrollbarSlider.background": "#cbd5e199",
    },
  });
}

export function getVSCodeEditorOptions({
  fontSize = 14,
  wordWrap = false,
  readOnly = false,
} = {}) {
  return {
    readOnly,
    fontSize,
    fontFamily: "'Cascadia Code','JetBrains Mono','Fira Code',Consolas,monospace",
    fontLigatures: true,
    lineHeight: 21,
    letterSpacing: 0,
    tabSize: 4,
    insertSpaces: true,
    detectIndentation: false,
    autoIndent: "full",
    formatOnType: true,
    formatOnPaste: true,
    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoSurround: "languageDefined",
    lineNumbers: "on",
    glyphMargin: false,
    folding: true,
    foldingHighlight: true,
    renderLineHighlight: "all",
    matchBrackets: "always",
    bracketPairColorization: { enabled: true },
    guides: {
      indentation: true,
      bracketPairs: true,
      bracketPairsHorizontal: true,
      highlightActiveIndentation: true,
    },
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    cursorWidth: 2,
    selectionHighlight: true,
    occurrencesHighlight: "singleFile",
    renderWhitespace: "selection",
    minimap: { enabled: false },
    wordWrap: wordWrap ? "on" : "off",
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    automaticLayout: true,
    padding: { top: 14, bottom: 14 },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
  };
}
