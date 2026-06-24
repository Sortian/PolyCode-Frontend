import { getApiBase } from "../../../config/apiBase";
import {
  executeCode as executeBrowserCode,
  codeNeedsStdin,
} from "./BrowserExecutor";

const COMPILED_BACKEND_LANGS = new Set(["cpp", "c++", "c", "java"]);

async function executeViaBackend(code, language, stdin = "") {
  const res = await fetch(`${getApiBase()}/playground`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, stdin }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.stderr || `Server execution failed (${res.status})`);
  }
  return data;
}

/**
 * Run playground code: compiled languages prefer the backend; Python uses
 * browser Pyodide with optional stdin, or backend when stdin-heavy.
 */
export async function runPlaygroundCode(code, language, { stdin = "" } = {}) {
  const lang = String(language).toLowerCase();
  const needsStdin = codeNeedsStdin(code, lang);
  const preferBackend =
    COMPILED_BACKEND_LANGS.has(lang) || (needsStdin && (lang === "python" || lang === "py"));

  if (preferBackend) {
    try {
      const result = await executeViaBackend(code, language, stdin);
      const note = COMPILED_BACKEND_LANGS.has(lang)
        ? "ℹ Compiled and ran on PolyCode server."
        : "ℹ Ran Python on PolyCode server.";
      const stdout = [note, result.stdout].filter(Boolean).join("\n\n");
      return { ...result, stdout: stdout || note };
    } catch (error) {
      if (COMPILED_BACKEND_LANGS.has(lang)) {
        if (!needsStdin) {
          const sim = await executeBrowserCode(code, language, stdin);
          const note =
            "⚠️ Server compiler unavailable — showing print-line simulation only (not real execution).";
          const stdout = sim.stdout ? `${note}\n\n${sim.stdout}` : note;
          return { ...sim, stdout, stderr: sim.stderr || sim.error || "" };
        }
        return {
          stdout: "",
          stderr: [
            `⚠️  Could not compile ${language} on the server: ${error.message}`,
            "",
            "• Start the backend locally (port 5000) or check your API URL",
            "• Fill the Program input (stdin) panel if your code uses cin",
            "• Or hard-code test values instead of cin >> for browser-only practice",
          ].join("\n"),
          error: error.message,
        };
      }
      // Python: fall back to in-browser Pyodide with stdin
    }
  }

  return executeBrowserCode(code, language, stdin);
}

export { codeNeedsStdin };
