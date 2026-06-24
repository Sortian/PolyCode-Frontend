import { executeCode } from "../../playground/services/BrowserExecutor";
import { getApiBase } from "../../../config/apiBase";
import {
  mergePythonRunResult,
  codeUsesMatplotlib,
} from "./pythonPlotOutput";

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
    throw new Error("Python API returned invalid JSON.");
  }
}

async function runPythonOnServer(source) {
  const endpoints = ["/challenges/run-python", "/documents/run-python"];
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
          payload.message || payload.error || `Python API failed (${path})`,
        );
        continue;
      }
      return mergePythonRunResult(payload);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Python API unavailable");
}

async function runPythonInBrowser(source) {
  return mergePythonRunResult(await executeCode(source, "python"));
}

async function runPythonWithServerFirst(source) {
  try {
    const result = await runPythonOnServer(source);
    const runtimeError = getPythonRuntimeError(result);
    if (runtimeError) {
      throw new Error(runtimeError);
    }
    return { result, runtime: "server" };
  } catch (serverError) {
    try {
      const browserResult = await runPythonInBrowser(source);
      const browserError = getPythonRuntimeError(browserResult);
      if (browserError) {
        throw new Error(browserError);
      }
      return { result: browserResult, runtime: "browser" };
    } catch (browserError) {
      throw new Error(
        browserError.message ||
          serverError.message ||
          "Could not run Python. Start the backend on port 5000 or check your network for Pyodide.",
      );
    }
  }
}

async function runPythonWithBrowserFirst(source) {
  try {
    return { result: await runPythonInBrowser(source), runtime: "browser" };
  } catch (browserError) {
    try {
      const result = await runPythonOnServer(source);
      const runtimeError = getPythonRuntimeError(result);
      if (runtimeError) {
        throw new Error(runtimeError);
      }
      return { result, runtime: "server" };
    } catch (serverError) {
      throw new Error(
        browserError.message ||
          serverError.message ||
          "Could not run Python. Matplotlib needs the in-browser runtime (Pyodide) or matplotlib installed on the server.",
      );
    }
  }
}

export async function runPythonCode(source) {
  if (codeUsesMatplotlib(source)) {
    return runPythonWithBrowserFirst(source);
  }
  return runPythonWithServerFirst(source);
}

export function formatPythonOutput(result = {}) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}

export function getPythonRuntimeError(runResult) {
  return (
    runResult?.error ||
    (runResult?.exitCode != null && runResult.exitCode !== 0
      ? runResult.stderr || "Python exited with an error"
      : "")
  );
}
