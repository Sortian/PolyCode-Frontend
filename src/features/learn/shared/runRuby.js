import { getApiBase } from "../../../config/apiBase";

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

async function readJsonResponse(response) {
  const text = await response.text();
  const trimmed = text.trim();
  if (!trimmed) return {};
  if (trimmed.startsWith("<")) {
    throw new Error(
      "Server returned HTML instead of JSON. Start the PolyCode backend on port 5000.",
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
        continue;
      }
      return payload;
    } catch (error) {
      lastError = error;
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
    return { result, runtime: "server" };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Ruby run timed out. Try shorter code.");
    }
    throw new Error(
      error.message ||
        "Could not run Ruby. Start the PolyCode backend on port 5000.",
    );
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
