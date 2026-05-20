import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { executeCode } from "../../../playground/services/BrowserExecutor";
import {
  definePolycodeMonacoTheme,
  getVSCodeEditorOptions,
  POLYCODE_VSCODE_THEME,
} from "../../../../shared/utils/monacoTheme";

const apiBase = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(
  /\/$/,
  "",
);

function normalizeWhitespace(value = "") {
  return value.replace(/\s+/g, "");
}

function testPasses(test, code, solutionCode) {
  const keywords =
    test.keywords || extractKeywords(solutionCode, test.id, [test]);
  if (!keywords.length) return true;

  return keywords.every((keyword) => {
    if (typeof keyword === "string") {
      return (
        code.includes(keyword) ||
        normalizeWhitespace(code).includes(normalizeWhitespace(keyword))
      );
    }
    if (keyword?.pattern) {
      return new RegExp(keyword.pattern, keyword.flags || "").test(code);
    }
    return true;
  });
}

function extractKeywords(solutionCode, testId, tests) {
  const explicit = tests.find((test) => test.id === testId)?.keywords;
  if (explicit?.length) return explicit;

  const lines = solutionCode
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  switch (testId) {
    case 1:
      if (lines.some((line) => /import\s+numpy/.test(line))) {
        return [{ pattern: "import\\s+numpy\\s+as\\s+np" }];
      }
      return [{ pattern: "np\\.array\\s*\\(" }];
    case 2:
      if (lines.some((line) => /\+\s*100/.test(line))) {
        return [{ pattern: "\\+\\s*100" }];
      }
      return [{ pattern: "np\\.array\\s*\\(" }];
    case 3:
      return [{ pattern: "print\\s*\\(" }];
    default:
      return lines[testId - 1] ? [lines[testId - 1]] : [];
  }
}

async function runPythonOnServer(source) {
  const endpoints = ["/challenges/run-python", "/documents/run-python"];
  let lastError = null;

  for (const path of endpoints) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(`${apiBase}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: source }),
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        lastError = new Error(
          payload.message || payload.error || `Python API failed (${path})`,
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

  throw lastError || new Error("Python API unavailable");
}

async function runPythonInBrowser(source) {
  return executeCode(source, "python");
}

async function runPythonCode(source) {
  try {
    return { result: await runPythonOnServer(source), runtime: "server" };
  } catch (serverError) {
    try {
      return { result: await runPythonInBrowser(source), runtime: "browser" };
    } catch (browserError) {
      throw new Error(
        serverError.message ||
          browserError.message ||
          "Could not run Python. Start the backend or check your network for Pyodide.",
      );
    }
  }
}

export default function PythonCodeChallenge({
  challenge,
  accentColor,
  isCompleted,
  onComplete,
  initialCode,
  onCodeChange,
}) {
  const [code, setCode] = useState(initialCode || challenge.starterCode);
  const [results, setResults] = useState(null);
  const [output, setOutput] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const activeChallengeId = useRef(challenge.id);
  const runTestsRef = useRef(null);

  useEffect(() => {
    const challengeChanged = activeChallengeId.current !== challenge.id;
    if (challengeChanged) {
      activeChallengeId.current = challenge.id;
      setCode(initialCode || challenge.starterCode);
      setResults(null);
      setOutput(null);
      setShowSolution(false);
      return;
    }

    if (typeof initialCode === "string") {
      setCode((currentCode) =>
        currentCode === challenge.starterCode ? initialCode : currentCode,
      );
    }
  }, [challenge.id, challenge.starterCode, initialCode]);

  function runTests() {
    if (running || showSolution) return;

    setRunning(true);
    setResults(null);
    setOutput({
      status: "running",
      stdout: "Running Python checks…",
    });

    window.setTimeout(async () => {
      let expectedOutput = "";
      try {
        const expectedRun = await runPythonCode(challenge.solutionCode);
        expectedOutput = formatOutput(expectedRun.result);
      } catch {
        expectedOutput = "";
      }

      let runPayload;
      try {
        runPayload = await runPythonCode(code);
      } catch (error) {
        setResults({
          passed: false,
          tests: [
            {
              id: "runtime",
              label: "Python runs without errors",
              passed: false,
              hint: error.message || "Could not run Python.",
            },
            ...challenge.tests.map((test) => ({ ...test, passed: false })),
          ],
        });
        setOutput({
          status: "fail",
          stdout: error.message || "Run failed",
          expected: expectedOutput,
        });
        setRunning(false);
        return;
      }

      const { result: runResult, runtime } = runPayload;
      const runtimeError =
        runResult?.error ||
        (runResult?.exitCode != null && runResult.exitCode !== 0
          ? runResult.stderr || "Python exited with an error"
          : "");

      const stdout = formatOutput(runResult);

      if (runtimeError) {
        setResults({
          passed: false,
          tests: [
            {
              id: "runtime",
              label: "Python runs without errors",
              passed: false,
              hint: "Fix the error in Output, then run again.",
            },
            ...challenge.tests.map((test) => ({ ...test, passed: false })),
          ],
        });
        setOutput({
          status: "fail",
          stdout: runtimeError,
          expected: expectedOutput,
        });
        setRunning(false);
        return;
      }

      const testResults = challenge.tests.map((test) => ({
        ...test,
        passed: testPasses(test, code, challenge.solutionCode),
      }));

      const acceptanceTests = testResults.filter(
        (test) => test.id !== "runtime",
      );
      const allPassed = acceptanceTests.every((test) => test.passed);

      setResults({ passed: allPassed, tests: testResults });
      setOutput({
        status: allPassed ? "pass" : "fail",
        stdout:
          stdout ||
          (runtime === "server"
            ? "Program ran on server (no printed output)."
            : "Program ran in browser (no printed output)."),
        expected: expectedOutput,
      });

      if (allPassed && !isCompleted) {
        Promise.resolve(onComplete()).catch((error) => {
          console.error("Unable to save lesson progress:", error);
        });
      }

      setRunning(false);
    }, 600);
  }

  useEffect(() => {
    runTestsRef.current = runTests;
  });

  function handleEditorMount(editor, monaco) {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runTestsRef.current?.();
    });
  }

  function resetCode() {
    setCode(challenge.starterCode);
    onCodeChange?.(challenge.starterCode);
    setResults(null);
    setOutput(null);
    setShowSolution(false);
  }

  return (
    <div className="oops-challenge">
      <div className="oops-problem-panel">
        <div className="oops-problem-header">
          <h3 className="oops-problem-title">{challenge.title}</h3>
          {isCompleted && (
            <span className="oops-problem-solved" style={{ color: accentColor }}>
              ✓ Solved
            </span>
          )}
        </div>
        <p className="oops-problem-desc">{challenge.description}</p>

        <div className="oops-test-cases">
          <div className="oops-test-cases-label">Acceptance Tests</div>
          {(results ? results.tests : challenge.tests).map((t) => (
            <div
              key={t.id}
              className={`oops-test-row ${
                results ? (t.passed ? "oops-test-pass" : "oops-test-fail") : ""
              }`}
            >
              <span className="oops-test-icon">
                {results ? (t.passed ? "✓" : "✗") : "○"}
              </span>
              <span className="oops-test-label">{t.label}</span>
              {results && !t.passed && t.hint && (
                <span className="oops-test-hint">Hint: {t.hint}</span>
              )}
            </div>
          ))}
        </div>

        <div
          className={`oops-output-panel ${
            output?.status ? `oops-output-${output.status}` : ""
          }`}
        >
          <div className="oops-output-head">
            <span>Output</span>
            <small>{output ? "after last run" : "waiting for run"}</small>
          </div>
          <pre className="oops-output-body">
            {output?.stdout || "Run your code to see output here."}
          </pre>
          {output?.expected && (
            <div className="oops-expected-output">
              <span>Expected</span>
              <code>{output.expected}</code>
            </div>
          )}
        </div>
      </div>

      <div className="oops-editor-panel">
        <div className="oops-editor-topbar">
          <span className="oops-editor-lang">Python · lesson.py</span>
          <div className="oops-editor-actions">
            <button type="button" className="oops-editor-action" onClick={resetCode}>
              ↺ Reset
            </button>
            <button
              type="button"
              className="oops-editor-action"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? "Hide Solution" : "💡 Solution"}
            </button>
          </div>
        </div>

        <div className="oops-editor">
          <Editor
            height="100%"
            language="python"
            value={showSolution ? challenge.solutionCode : code}
            beforeMount={definePolycodeMonacoTheme}
            onMount={handleEditorMount}
            theme={POLYCODE_VSCODE_THEME}
            onChange={(value) => {
              if (!showSolution) {
                const next = value || "";
                setCode(next);
                onCodeChange?.(next);
              }
            }}
            options={getVSCodeEditorOptions({
              fontSize: 14,
              readOnly: showSolution,
            })}
          />
        </div>

        <div className="oops-run-bar">
          {results && (
            <div
              className={`oops-verdict ${results.passed ? "oops-verdict-pass" : "oops-verdict-fail"}`}
            >
              {results.passed
                ? "✓ All tests passed!"
                : `${results.tests.filter((t) => t.passed && t.id !== "runtime").length}/${challenge.tests.length} tests passed`}
            </div>
          )}
          <button
            type="button"
            className="oops-run-btn"
            style={{ "--accent": accentColor }}
            onClick={runTests}
            disabled={running || showSolution}
          >
            {running ? "⟳ Running…" : "▶ Run & Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatOutput(result = {}) {
  return [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
}
