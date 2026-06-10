import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import RunnableCodeBlock from "../../shared/RunnableCodeBlock";

// Minimal markdown bold + inline code renderer
function InlineText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`"))
          return (
            <code key={i} className="oops-inline-code">
              {p.slice(1, -1)}
            </code>
          );
        return p;
      })}
    </>
  );
}

function CodeSnippet({ code, language = "cpp" }) {
  return (
    <div className="oops-pre">
      <SyntaxHighlighter
        language={language === "c++" ? "cpp" : language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "20px",
          background: "transparent",
          fontSize: "0.86rem",
          lineHeight: 1.72,
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono, 'Fira Code', monospace)",
          },
        }}
        lineNumberStyle={{
          color: "rgba(184, 255, 0, 0.28)",
          fontSize: "0.72rem",
          minWidth: "2.4em",
          paddingRight: "1em",
          userSelect: "none",
        }}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function ConceptCard({
  block,
  accentColor,
  runnableCodeLangs = [],
}) {
  const [copied, setCopied] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeNode, setActiveNode] = useState(0);

  function copyCode(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  // ── Text block ──────────────────────────────────────────
  if (block.type === "text") {
    return (
      <p className="oops-concept-text">
        <InlineText text={block.content} />
      </p>
    );
  }

  // ── Callout block ────────────────────────────────────────
  if (block.type === "callout") {
    const icons = { info: "💡", tip: "✨", warning: "⚠️" };
    const colors = { info: "#00d4ff", tip: "#b8ff00", warning: "#f59e0b" };
    return (
      <div
        className={`oops-callout oops-callout-${block.variant}`}
        style={{ "--callout-color": colors[block.variant] || accentColor }}
      >
        <span className="oops-callout-icon">
          {icons[block.variant] || "💡"}
        </span>
        <span>
          <InlineText text={block.content} />
        </span>
      </div>
    );
  }

  // ── Code block ───────────────────────────────────────────
  if (block.type === "code") {
    const lang = (block.lang || "cpp").toLowerCase();
    if (runnableCodeLangs.map((l) => l.toLowerCase()).includes(lang)) {
      return (
        <RunnableCodeBlock
          block={block}
          accentColor={accentColor}
          language={lang}
        />
      );
    }

    return (
      <div className="oops-code-block">
        {block.label && (
          <div className="oops-code-label">
            <span className="oops-code-lang">
              {block.lang?.toUpperCase() || "C++"}
            </span>
            <span className="oops-code-file">{block.label}</span>
            <button
              className="oops-copy-btn"
              onClick={() => copyCode(block.content)}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        )}
        <CodeSnippet code={block.content} language={block.lang || "cpp"} />
      </div>
    );
  }

  // ── Table block ──────────────────────────────────────────
  if (block.type === "table") {
    const headers = block.headers || block.columns || [];
    const bodyRows = Array.isArray(block.rows?.[0])
      ? block.rows
      : (block.rows || []).map((row) =>
          Array.isArray(row) ? row : [row.label, ...(row.values || [])],
        );

    if (!headers.length || !bodyRows.length) {
      return null;
    }

    return (
      <div className="oops-table-wrap">
        <table className="oops-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <InlineText text={String(cell)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Interactive diagram block ───────────────────────────
  if (block.type === "diagram") {
    const currentNode = block.nodes[activeNode] || block.nodes[0];

    return (
      <div className="oops-diagram-card">
        <div className="oops-interactive-head">
          <span className="oops-interactive-label">Interactive Diagram</span>
          <h3>{block.title}</h3>
        </div>
        <div className="oops-diagram-grid">
          <div className="oops-diagram-node-list">
            {block.nodes.map((node, index) => (
              <button
                key={node.id}
                className={`oops-diagram-node ${index === activeNode ? "active" : ""}`}
                style={{ "--node-color": node.color || accentColor }}
                onClick={() => setActiveNode(index)}
              >
                <span className="oops-diagram-node-dot" />
                <span>{node.label}</span>
                {node.parent && <small>extends {node.parent}</small>}
              </button>
            ))}
          </div>
          <div
            className="oops-diagram-detail"
            style={{ "--node-color": currentNode.color || accentColor }}
          >
            <div className="oops-diagram-detail-title">
              {currentNode.label}
            </div>
            <ul>
              {currentNode.items.map((item) => (
                <li key={item}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Stepthrough block ───────────────────────────────────
  if (block.type === "stepthrough") {
    const step = block.steps[activeStep] || block.steps[0];

    return (
      <div className="oops-step-card">
        <div className="oops-interactive-head">
          <span className="oops-interactive-label">Step Through</span>
          <h3>{block.title}</h3>
        </div>
        <div className="oops-step-tabs">
          {block.steps.map((s, index) => (
            <button
              key={s.label}
              className={`oops-step-tab ${index === activeStep ? "active" : ""}`}
              onClick={() => setActiveStep(index)}
            >
              <span>{index + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="oops-step-detail">
          <CodeSnippet code={step.code} language="cpp" />
          <p>
            <InlineText text={step.desc} />
          </p>
        </div>
        <div className="oops-step-actions">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveStep(Math.min(block.steps.length - 1, activeStep + 1))
            }
            disabled={activeStep === block.steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz block ──────────────────────────────────────────
  if (block.type === "quiz") {
    const answered = selectedQuiz !== null;
    const correct = selectedQuiz === block.answer;

    return (
      <div
        className={`oops-quiz-card ${answered ? (correct ? "correct" : "incorrect") : ""}`}
      >
        <div className="oops-interactive-head">
          <span className="oops-interactive-label">Quick Check</span>
          <h3>
            <InlineText text={block.question} />
          </h3>
        </div>
        <div className="oops-quiz-options">
          {block.options.map((option, index) => {
            const isSelected = selectedQuiz === index;
            const isAnswer = block.answer === index;
            return (
              <button
                key={option}
                type="button"
                className={`oops-quiz-option ${
                  answered && isAnswer ? "answer" : ""
                } ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedQuiz(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                <InlineText text={option} />
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="oops-quiz-feedback">
            <strong>{correct ? "Correct." : "Not quite."}</strong>{" "}
            <InlineText text={block.explanation} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
