import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AssistantCodeBlock from "./AssistantCodeBlock";

function partitionStreamingMarkdown(text, isStreaming) {
  if (!text || !isStreaming) return { markdown: text || "", pending: null };

  const parts = text.split("```");
  if (parts.length % 2 === 1) {
    return { markdown: text, pending: null };
  }

  const markdown = parts.slice(0, -1).join("```");
  const pending = parts[parts.length - 1] || "";
  const newlineIndex = pending.indexOf("\n");
  const lang = newlineIndex === -1 ? pending.trim() : pending.slice(0, newlineIndex).trim();
  const code =
    newlineIndex === -1 ? "" : pending.slice(newlineIndex + 1);

  return { markdown, pending: { lang, code } };
}

export default function AssistantMarkdown({ content, streaming = false }) {
  const { markdown, pending } = useMemo(
    () => partitionStreamingMarkdown(content, streaming),
    [content, streaming],
  );

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        code({ className, children, ...props }) {
          const match = /language-([a-zA-Z0-9#+-]+)/.exec(className || "");
          const lang = match ? match[1] : "";
          const codeStr = String(children).replace(/\n$/, "");
          const isBlock =
            Boolean(match) || codeStr.includes("\n") || codeStr.length > 60;

          if (isBlock) {
            return (
              <AssistantCodeBlock
                language={lang || "code"}
                code={codeStr}
                streaming={streaming}
              />
            );
          }

          return (
            <code className="assistant-inline-code" {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        p({ children }) {
          return <p className="assistant-md-p">{children}</p>;
        },
        ul({ children }) {
          return <ul className="assistant-md-ul">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="assistant-md-ol">{children}</ol>;
        },
        li({ children }) {
          return <li className="assistant-md-li">{children}</li>;
        },
        strong({ children }) {
          return <strong className="assistant-md-strong">{children}</strong>;
        },
        a({ href, children, ...props }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="assistant-md-link"
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
      >
        {markdown}
      </ReactMarkdown>
      {pending ? (
        <div className="assistant-code-block assistant-code-block--streaming">
          <div className="assistant-code-header">
            <div className="assistant-code-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="assistant-code-lang">
              {pending.lang ? pending.lang.toUpperCase() : "Code"}
            </span>
          </div>
          <div className="assistant-code-body">
            <pre className="assistant-code-pre">{pending.code}</pre>
          </div>
        </div>
      ) : null}
    </>
  );
}
