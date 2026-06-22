/**
 * Browser-only JavaScript execution (Web Worker sandbox).
 * No backend compiler — optional @babel/standalone for TS/JSX.
 */

export const JS_EXECUTION_TIMEOUT_MS = 30000;

function formatConsoleArgs(args) {
  return args
    .map((value) => {
      try {
        if (value === undefined) return "undefined";
        if (value === null) return "null";
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
      } catch {
        return String(value);
      }
    })
    .join(" ");
}

const IMPORT_EXPORT_MESSAGE = [
  "⚠️  Import/Export statements are not supported in browser mode.",
  "",
  "💡 This playground runs in your browser without a bundler.",
  "Use standalone scripts, built-in APIs, or CDN links in HTML.",
  "",
  "✅ Works great: functions, classes, async/await, console output",
  "❌ Not supported: import ... from '...' or export statements",
].join("\n");

/**
 * Run user JavaScript in an isolated worker with a generous timeout.
 */
export function runJavaScriptInWorker(code, options = {}) {
  const timeoutMs = options.timeoutMs ?? JS_EXECUTION_TIMEOUT_MS;

  return new Promise((resolve) => {
    if (/^\s*import\s+/m.test(code) || /^\s*export\s+/m.test(code)) {
      resolve({
        stdout: "",
        stderr: IMPORT_EXPORT_MESSAGE,
        error: null,
      });
      return;
    }

    if (!code.trim()) {
      resolve({ stdout: "(no output)", stderr: "", error: null });
      return;
    }

    const workerSource = `
      const formatArgs = ${formatConsoleArgs.toString()};
      self.onmessage = async (event) => {
        const logs = [];
        const errors = [];
        const console = {
          log: (...args) => logs.push(formatArgs(args)),
          info: (...args) => logs.push(formatArgs(args)),
          warn: (...args) => logs.push("⚠ " + formatArgs(args)),
          error: (...args) => errors.push(formatArgs(args)),
          debug: (...args) => logs.push(formatArgs(args)),
          table: (...args) => logs.push(formatArgs(args)),
        };

        try {
          const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
          const runner = new AsyncFunction("console", event.data);
          const result = await runner(console);
          if (result !== undefined) {
            logs.push(formatArgs([result]));
          }
        } catch (error) {
          errors.push(error?.message || String(error));
        }

        self.postMessage({ done: true, logs, errors });
      };
    `;

    let settled = false;
    const blob = new Blob([workerSource], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({
        stdout: "",
        stderr: [
          `Timed out (${Math.round(timeoutMs / 1000)}s).`,
          "",
          "Tips:",
          "• Check for infinite loops (while(true), heavy recursion)",
          "• Large Pyodide/matplotlib loads can take longer — try Python again after first load",
          "• Break long work into smaller steps",
        ].join("\n"),
        error: `Timed out (${Math.round(timeoutMs / 1000)}s)`,
      });
    }, timeoutMs);

    worker.onmessage = (event) => {
      const { done, logs, errors } = event.data || {};
      if (!done) return;
      const stderr = (errors || []).join("\n");
      finish({
        stdout: (logs || []).join("\n"),
        stderr,
        error: stderr || null,
      });
    };

    worker.onerror = (event) => {
      finish({
        stdout: "",
        stderr: event.message || "JavaScript worker error",
        error: event.message || "JavaScript worker error",
      });
    };

    worker.postMessage(`"use strict";\n${code}`);
  });
}

export function loadBabel() {
  if (window.Babel) return Promise.resolve(window.Babel);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-polycode-babel]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Babel));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Babel")),
      );
      if (window.Babel) resolve(window.Babel);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@babel/standalone/babel.min.js";
    script.dataset.polycodeBabel = "true";
    script.onload = () => resolve(window.Babel);
    script.onerror = () => reject(new Error("Failed to load Babel"));
    document.head.appendChild(script);
  });
}

export async function compileWithBabel(code, presets, filename = "snippet.js") {
  const babel = await loadBabel();
  return babel.transform(code, { presets, filename }).code;
}

export function looksLikeJsx(code = "") {
  return (
    /return\s*\(\s*</.test(code) ||
    /<\s*[A-Za-z][\w.-]*[\s/>]/.test(code) ||
    /<\/[A-Za-z]/.test(code)
  );
}
