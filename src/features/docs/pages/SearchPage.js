import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getDocuments } from "../services/api";
import DocCard from "../components/DocCard";

export default function SearchPage({ selectedLanguage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [fileType, setFileType] = useState(searchParams.get("fileType") || "");
  const [docs, setDocs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = (q, ft, pg = 1) => {
    if (!q && !ft) return;
    setLoading(true);
    setSearched(true);
    const params = { page: pg, limit: 40 };
    if (q) params.search = q;
    if (ft) params.fileType = ft;
    if (selectedLanguage) params.category = selectedLanguage;

    getDocuments(params)
      .then((r) => {
        setDocs(r.data.documents);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const ft = searchParams.get("fileType") || "";
    setQuery(q);
    setFileType(ft);
    if (q || ft) {
      doSearch(q, ft);
    }
  }, [searchParams, selectedLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/hub">home</Link>
        <span className="sep">/</span>
        <span className="active-path">search</span>
      </nav>

      <div className="page-header-block">
        <h1 className="page-title page-title-hero">Search Hub</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Scan the entire technical repository in real-time
        </p>
      </div>

      <form onSubmit={handleSubmit} className="search-page-form">
        <input
          type="text"
          className="search-page-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query topics, functions, snippets…"
          autoFocus
        />
        <select
          className="search-page-select"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="">All</option>
          <option value="md">.md</option>
          <option value="py">.py</option>
        </select>
        <button type="submit" className="btn-primary search-page-btn-round">
          Execute Search
        </button>
      </form>

      {loading && (
        <div className="loading-section">
          <div className="spinner" aria-hidden="true" />
        </div>
      )}

      {!loading && searched && (
        <>
          <div className="search-page-meta">
            Found <strong>{total}</strong> result{total !== 1 ? "s" : ""}
            {query && (
              <>
                {" "}
                for "<span className="query-text">{query}</span>"
              </>
            )}
          </div>
          {docs.length > 0 ? (
            <>
              <div className="grid grid-bento">
                {docs.map((doc) => (
                  <DocCard key={doc.path} doc={doc} />
                ))}
              </div>

              {total > 40 && (
                <div className="search-pagination">
                  {Array.from({ length: Math.ceil(total / 40) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`page-btn-num ${currentPage === page ? "active" : ""}`}
                        onClick={() => {
                          const q = searchParams.get("q") || "";
                          const ft = searchParams.get("fileType") || "";
                          doSearch(q, ft, page);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="search-page-empty">
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔎</div>
              <p>No documents found. Try a different search term.</p>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="search-page-empty">
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⌨️</div>
          <p>Type something to search across all documents.</p>
        </div>
      )}
    </div>
  );
}
