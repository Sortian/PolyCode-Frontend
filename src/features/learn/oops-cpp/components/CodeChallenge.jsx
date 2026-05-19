import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  definePolycodeMonacoTheme,
  getVSCodeEditorOptions,
  POLYCODE_VSCODE_THEME,
} from "../../../../shared/utils/monacoTheme";

export default function CodeChallenge({
  challenge,
  accentColor,
  isCompleted,
  onComplete,
  initialCode,
  onCodeChange,
}) {
  const [code, setCode] = useState(initialCode || challenge.starterCode);
  const [results, setResults] = useState(null); // null | { passed, tests }
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const activeChallengeId = useRef(challenge.id);

  useEffect(() => {
    const challengeChanged = activeChallengeId.current !== challenge.id;

    if (challengeChanged) {
      activeChallengeId.current = challenge.id;
      setCode(initialCode || challenge.starterCode);
      setResults(null);
      setShowSolution(false);
      return;
    }

    if (typeof initialCode === "string") {
      setCode((currentCode) =>
        currentCode === challenge.starterCode ? initialCode : currentCode,
      );
    }
  }, [challenge.id, challenge.starterCode, initialCode]);

  // Simulated test runner — checks code string heuristically
  // In production: hook into your backend compiler (BrowserExecutor / Piston API)
  function runTests() {
    setRunning(true);
    setResults(null);

    setTimeout(() => {
      const testResults = challenge.tests.map((test) => {
        // Heuristic checks based on solution keywords
        const solutionKeywords = extractKeywords(
          challenge.solutionCode,
          test.id,
        );
        const passed = solutionKeywords.every((kw) => code.includes(kw));
        return { ...test, passed };
      });

      const allPassed = testResults.every((t) => t.passed);
      setResults({ passed: allPassed, tests: testResults });
      if (allPassed && !isCompleted) {
        Promise.resolve(onComplete()).catch((error) => {
          console.error("Unable to save lesson progress:", error);
        });
      }
      setRunning(false);
    }, 800);
  }

  function extractKeywords(sol, testId) {
    const explicit = challenge.tests.find((test) => test.id === testId)
      ?.keywords;
    if (explicit) return explicit;

    // Per-test keyword extraction from solution code
    // Maps test index → structural signals to look for in user code
    const lines = sol.split("\n").filter(Boolean);
    switch (testId) {
      case 1:
        return [
          lines
            .find((l) => l.includes("class"))
            ?.trim()
            .split(" ")[1]
            ?.replace("{", "") || "class",
        ].filter(Boolean);
      case 2:
        return [
          lines
            .find((l) => l.includes("(") && !l.includes("//"))
            ?.match(/\w+\s*\(/)?.[0]
            .trim() || "",
        ].filter(Boolean);
      case 3:
        return [
          lines.find((l) => l.includes("cout"))?.includes("cout") ? "cout" : "",
        ].filter(Boolean);
      case 4:
        return ["cout"].filter(Boolean);
      default:
        return [];
    }
  }

  function resetCode() {
    setCode(challenge.starterCode);
    onCodeChange?.(challenge.starterCode);
    setResults(null);
    setShowSolution(false);
  }

  return (
    <div className="oops-challenge">
      {/* Problem statement */}
      <div className="oops-problem-panel">
        <div className="oops-problem-header">
          <h3 className="oops-problem-title">{challenge.title}</h3>
          {isCompleted && (
            <span
              className="oops-problem-solved"
              style={{ color: accentColor }}
            >
              ✓ Solved
            </span>
          )}
        </div>
        <p className="oops-problem-desc">{challenge.description}</p>

        {/* Test cases */}
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
      </div>

      {/* Editor panel */}
      <div className="oops-editor-panel">
        <div className="oops-editor-topbar">
          <span className="oops-editor-lang">C++ · main.cpp</span>
          <div className="oops-editor-actions">
            <button
              className="oops-editor-action"
              onClick={resetCode}
              title="Reset"
            >
              ↺ Reset
            </button>
            <button
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
            language="cpp"
            value={showSolution ? challenge.solutionCode : code}
            beforeMount={definePolycodeMonacoTheme}
            theme={POLYCODE_VSCODE_THEME}
            onChange={(value) => {
              if (!showSolution) {
                const nextCode = value || "";
                setCode(nextCode);
                onCodeChange?.(nextCode);
              }
            }}
            options={getVSCodeEditorOptions({
              fontSize: 14,
              readOnly: showSolution,
            })}
          />
        </div>

        {/* Run bar */}
        <div className="oops-run-bar">
          {results && (
            <div
              className={`oops-verdict ${results.passed ? "oops-verdict-pass" : "oops-verdict-fail"}`}
            >
              {results.passed
                ? `✓ All tests passed!`
                : `${results.tests.filter((t) => t.passed).length}/${results.tests.length} tests passed`}
            </div>
          )}
          <button
            className="oops-run-btn"
            style={{ "--accent": accentColor }}
            onClick={runTests}
            disabled={running || showSolution}
          >
            {running ? (
              <span className="oops-run-spinner">⟳ Running…</span>
            ) : (
              "▶ Run & Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
