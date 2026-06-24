import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { getDocument } from "../services/api";
import MarkdownRenderer from "../components/MarkdownRenderer";
import {
  getCategoryMeta,
  formatCategory,
} from "../../../shared/utils/categories";
import { formatName } from "../../../shared/utils/format";

// Memoised so it only re-renders when props actually change
const DocumentView = memo(function DocumentView({ doc, theme }) {
  const meta = getCategoryMeta(doc.category);
  const isPython = doc.fileType === "python" || doc.fileType === "py";

  return (
    <article
      className={`fade-up doc-container ${isPython ? "code-mode" : "reading-mode"}`}
    >
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">root</Link>
        <span className="sep">/</span>
        <Link to={`/category/${doc.category}`}>{doc.category}</Link>
        <span className="sep">/</span>
        <span className="active-path">
          {formatName(doc.title)}
          {isPython ? ".py" : ".md"}
        </span>
      </nav>

      {/* Header - Only for Non-Python/Documentation files */}
      {!isPython && (
        <div className="doc-header">
          <div className="doc-badge-row">
            <span className="cat-pill" style={{ "--color": meta.color }}>
              {meta.icon} {formatCategory(doc.category)}
            </span>
            <span className="type-pill markdown">📝 Documentation</span>
          </div>
          <h1>{formatName(doc.title)}</h1>
          <div className="doc-stats">
            {doc.wordCount > 0 && (
              <span>{doc.wordCount.toLocaleString()} words</span>
            )}
            {doc.lines > 0 && <span>{doc.lines} lines</span>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="doc-content-wrapper">
        <MarkdownRenderer
          content={doc.content}
          fileType={doc.fileType}
          title={doc.title}
          relatedCode={doc.relatedCode}
          theme={theme}
        />
      </div>
    </article>
  );
});

export default function DocumentPage({ selectedLanguage, theme }) {
  const paramsUrl = useParams();
  const id = paramsUrl["*"];
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getDocument(id, selectedLanguage)
      .then((r) => setDoc(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, selectedLanguage]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <div className="loading-overlay">
        <div className="spinner-container">
          <div className="spinner" />
          <div className="spinner-inner" />
        </div>
        <p>Loading document…</p>
      </div>
    );

  if (error) return <div className="error-box">⚠ {error}</div>;
  if (!doc) return null;

  return <DocumentView doc={doc} theme={theme} />;
}
