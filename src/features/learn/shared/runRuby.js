import { getApiBase } from "../../../config/apiBase";

const RUBY_WASM_LOADER =
  "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.9.4/dist/browser/+esm";
const RUBY_WASM_BINARY =
  "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.9.4/dist/ruby+stdlib.wasm";

let rubyVmPromise = null;

/**
 * Lesson snippets often assign variables without puts/print. Append display lines
 * so learners still see computed values in the output panel.
 */
export function prepareRubyLearnCode(code = "") {
  if (/\b(puts|print|pp)\b/.test(code)) {
    return code;
  }

  const names = [];
  const re = /^\s*([A-Za-z_][\w]*)\s*=/gm;
  let match;
  while ((match = re.exec(code)) !== null) {
    names.push(match[1]);
  }

  const unique = [...new Set(names)];
  if (!unique.length) return code;

  const trailer = unique.map((name) => `puts "${name} = #{${name}}"`).join("\n");
  return `${code.replace(/\s*$/, "")}\n\n${trailer}\n`;
}

function buildRubyCaptureScript(source) {
  const encoded = JSON.stringify(source);
  return `
require "stringio"
__polycode_out = StringIO.new
__polycode_err = StringIO.new
$stdout = __polycode_out
$stderr = __polycode_err
__polycode_exit = 0
begin
  eval(${encoded}, binding, "(polycode)")
rescue Exception => e
  __polycode_err.puts("#{e.class}: #{e.message}")
  if e.backtrace
    e.backtrace.first(8).each { |line| __polycode_err.puts(line) }
  end
  __polycode_exit = 1
end
[__polycode_out.string, __polycode_err.string, __polycode_exit]
`;
}

async function initRubyVM() {
  if (!rubyVmPromise) {
    rubyVmPromise = (async () => {
      const { DefaultRubyVM } = await import(
        /* webpackIgnore: true */
        RUBY_WASM_LOADER
      );
      const response = await fetch(RUBY_WASM_BINARY);
      if (!response.ok) {
        throw new Error("Could not load the in-browser Ruby runtime.");
      }
      const module = await WebAssembly.compileStreaming(response);
      const { vm } = await DefaultRubyVM(module);
      return vm;
    })();
  }

  return rubyVmPromise;
}

async function runRubyInBrowser(source) {
  const vm = await initRubyVM();
  const result = vm.eval(buildRubyCaptureScript(source));
  const stdout = result?.[0]?.toString?.() ?? String(result?.[0] ?? "");
  const stderr = result?.[1]?.toString?.() ?? String(result?.[1] ?? "");
  const exitCode = Number(result?.[2] ?? 0);

  return {
    stdout: stdout.trimEnd(),
    stderr: stderr.trimEnd(),
    error:
      exitCode === 0
        ? null
        : stderr.trimEnd() || `Ruby exited with code ${exitCode}`,
    exitCode,
  };
}

async function readJsonResponse(response) {
  const text = await response.text();
  const trimmed = text.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("<")) {
    throw new Error(
      `Server returned HTML instead of JSON (HTTP ${response.status}).`,
    );
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error("Ruby API returned invalid JSON.");
  }
}

async function runRubyOnServer(source) {
  const endpoints = ["/challenges/run-ruby", "/documents/run-ruby"];
  let lastError = null;

  for (const path of endpoints) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(`${getApiBase()}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: source }),
        signal: controller.signal,
      });

      const payload = await readJsonResponse(response);
      if (!response.ok) {
        lastError = new Error(
          payload.message || payload.error || `Ruby API failed (${path})`,
        );
        if (response.status !== 404) {
          break;
        }
        continue;
      }
      return payload;
    } catch (error) {
      lastError = error;
      if (error.message?.includes("HTML instead of JSON")) {
        break;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Ruby API unavailable");
}

export async function runRubyCode(code, { learn = false } = {}) {
  const source = learn ? prepareRubyLearnCode(code) : code;

  try {
    const result = await runRubyOnServer(source);
    const runtimeError = getRubyRuntimeError(result);
    if (runtimeError) {
      throw new Error(runtimeError);
    }
    return { result, runtime: "server" };
  } catch (serverError) {
    if (serverError.name === "AbortError") {
      throw new Error("Ruby run timed out. Try shorter code.");
    }

    try {
      const result = await runRubyInBrowser(source);
      const runtimeError = getRubyRuntimeError(result);
      if (runtimeError) {
        throw new Error(runtimeError);
      }
      return { result, runtime: "browser" };
    } catch (browserError) {
      throw new Error(
        browserError.message ||
          serverError.message ||
          "Could not run Ruby. Check your connection or try again.",
      );
    }
  }
}

export function formatRubyOutput(result = {}) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

export function getRubyRuntimeError(runResult) {
  return (
    runResult?.error ||
    (runResult?.exitCode != null && runResult.exitCode !== 0
      ? runResult.stderr || "Ruby exited with an error"
      : "")
  );
}
