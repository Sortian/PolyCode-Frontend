import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AssistantCodeBlock from "./AssistantCodeBlock";

function prepareStreamingMarkdown(text) {
  if (!text) return "";
  const fenceCount = (text.match(/```/g) || []).length;
  if (fenceCount % 2 === 1) {
    return `${text}\n\`\`\``;
  }
  return text;
}

export default function AssistantMarkdown({ content }) {
  const markdown = useMemo(
    () => prepareStreamingMarkdown(content),
    [content],
  );

  return (
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
            return <AssistantCodeBlock language={lang || "code"} code={codeStr} />;
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
  );
}
