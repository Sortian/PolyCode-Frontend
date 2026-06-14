import { executeCode } from "../../playground/services/BrowserExecutor";

export async function runJavaScriptCode(source) {
  const result = await executeCode(source, "javascript");
  return { result, runtime: "browser" };
}

export function formatJavaScriptOutput(result = {}) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

export function getJavaScriptRuntimeError(runResult) {
  return (
    runResult?.error ||
    (runResult?.stderr && String(runResult.stderr).trim()) ||
    ""
  );
}
