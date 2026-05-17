import React, { useEffect, useState, useCallback, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTree, getLanguages } from "../../docs/services/api";
import { formatName } from "../../../shared/utils/format";

// ── Icons ────────────────────────────────────────────────────────────────────
const FolderIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FileIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const DocIcon = ({ color = "currentColor" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const languageLogos = {
  javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  c: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
  rust: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
  sql: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  powershell: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg",
  r: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg",
  csharp: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  "c#": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
};

function getFileIcon(ext) {
  const e = ext.toLowerCase();
  const logoMap = {
    ".py": "python", ".go": "go", ".js": "javascript", ".jsx": "javascript",
    ".java": "java", ".rs": "rust", ".cpp": "cpp", ".c++": "cpp",
    ".c": "c", ".php": "php", ".rb": "ruby", ".sql": "sql", ".cs": "csharp",
  };
  const logoKey = logoMap[e];
  if (logoKey) return <img src={languageLogos[logoKey]} alt="" className="tree-logo-icon" />;
  if (e === ".md") return <span className="tree-icon"><DocIcon color="var(--cyan)" /></span>;
  if (e === ".html") return <span className="tree-icon">🌐</span>;
  if (e === ".css") return <span className="tree-icon">🎨</span>;
  return <span className="tree-icon"><FileIcon color="var(--txt-3)" /></span>;
}

// ── Tree node ─────────────────────────────────────────────────────────────────
const SidebarTreeNode = memo(function SidebarTreeNode({
  node, depth = 0, selectedLanguage, onItemClick, activePath,
}) {
  const [expanded, setExpanded] = useState(depth === 0);

  if (node.type === "folder") {
    const hasChildren = node.children && node.children.length > 0;
    return (
      <div className="tree-folder">
        <button
          className="tree-folder-btn"
          style={{ paddingLeft: `${16 + depth * 14}px` }}
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="tree-caret">{expanded ? "▾" : "▸"}</span>
          <span className="tree-icon"><FolderIcon color="var(--violet)" /></span>
          <span className="tree-label">{formatName(node.name)}</span>
        </button>
        {expanded && hasChildren && (
          <div className="tree-children">
            {node.children.map((child, i) => (
              <SidebarTreeNode
                key={i}
                node={child}
                depth={depth + 1}
                selectedLanguage={selectedLanguage}
                onItemClick={onItemClick}
                activePath={activePath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const to = `/doc/${node.path}${selectedLanguage ? `?language=${selectedLanguage}` : ""}`;
  const active = activePath === `/doc/${node.path}`;

  return (
    <Link
      to={to}
      className={`tree-file ${active ? "active" : ""}`}
      style={{ paddingLeft: `${16 + depth * 14}px` }}
      onClick={onItemClick}
    >
      {getFileIcon(node.ext)}
      <span className="tree-label">{formatName(node.name)}</span>
    </Link>
  );
});

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function Sidebar({
  isOpen,
  onClose,
  selectedLanguage,
  onLanguageSelect,
  onGoToStackPicker,
}) {
  const [tree, setTree] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = selectedLanguage ? { language: selectedLanguage } : {};

    getTree(params)
      .then((r) => {
        if (r.data && Array.isArray(r.data.tree)) setTree(r.data.tree);
        else if (r.data && Array.isArray(r.data)) setTree(r.data);
      })
      .catch(() => setTree([]));

    getLanguages()
      .then((r) => {
        if (r.data && Array.isArray(r.data.languages)) setLanguages(r.data.languages);
        else if (r.data && Array.isArray(r.data)) setLanguages(r.data);
      })
      .catch(() => setLanguages([]));
  }, [selectedLanguage]);

  const handleItemClick = useCallback(() => onClose(), [onClose]);

  const handleSelectLanguage = useCallback(
    (lang) => {
      setShowLangMenu(false);
      onLanguageSelect(lang);
      navigate("/hub");
      onClose();
    },
    [onLanguageSelect, navigate, onClose],
  );

  const currentLogo = languageLogos[selectedLanguage?.toLowerCase()];
  const isActive = (p) => location.pathname === p;

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close button */}
      <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Language selector */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Current Stack</div>
        <div className="sidebar-language-box">
          <button className="language-display-btn" onClick={() => setShowLangMenu((v) => !v)}>
            <div className="current-lang-info">
              {currentLogo && <img src={currentLogo} alt="" className="lang-icon-mini" />}
              <span className="current-language-name">{selectedLanguage}</span>
            </div>
            <span className="chevron">{showLangMenu ? "▴" : "▾"}</span>
          </button>

          {showLangMenu && (
            <div className="language-dropdown-menu">
              {Array.isArray(languages) && languages.length > 0 ? (
                languages.map((lang) => {
                  const logo = languageLogos[lang.toLowerCase()];
                  return (
                    <button
                      key={lang}
                      className={`lang-option ${lang === selectedLanguage ? "active" : ""}`}
                      onClick={() => handleSelectLanguage(lang)}
                    >
                      {logo && <img src={logo} alt="" className="lang-icon-tiny" />}
                      <span>{lang}</span>
                    </button>
                  );
                })
              ) : (
                <div className="lang-option" style={{ opacity: 0.5 }}>No languages found</div>
              )}
            </div>
          )}

          {onGoToStackPicker && (
            <button
              type="button"
              className="change-stack-btn"
              onClick={() => {
                setShowLangMenu(false);
                onGoToStackPicker();
                onClose();
              }}
            >
              View all stacks
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-sep" />

      {/* Quick nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Navigate</div>
        <button
          type="button"
          className={`sidebar-item sidebar-item-btn ${location.pathname === "/select-language" ? "active" : ""}`}
          onClick={() => {
            onGoToStackPicker?.();
            onClose();
          }}
        >
          <span className="icon">⊞</span>
          <span className="sidebar-text">All stacks</span>
        </button>
        <Link to="/hub" className={`sidebar-item ${isActive("/hub") ? "active" : ""}`} onClick={handleItemClick}>
          <span className="icon">⌂</span>
          <span className="sidebar-text">Docs hub</span>
        </Link>
        <Link to="/search" className={`sidebar-item ${isActive("/search") ? "active" : ""}`} onClick={handleItemClick}>
          <span className="icon">⌕</span>
          <span className="sidebar-text">Search</span>
        </Link>
        <Link to="/playground" className={`sidebar-item ${isActive("/playground") ? "active" : ""}`} onClick={handleItemClick}>
          <span className="icon">▶</span>
          <span className="sidebar-text">Playground</span>
        </Link>
        <Link to="/daily-challenge" className={`sidebar-item ${isActive("/daily-challenge") ? "active" : ""}`} onClick={handleItemClick}>
          <span className="icon">🏆</span>
          <span className="sidebar-text">Daily Challenge</span>
        </Link>
      </div>

      <div className="sidebar-sep" />

      {/* File tree */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Files</div>
        <div className="sidebar-tree">
          {!Array.isArray(tree) || tree.length === 0 ? (
            <div className="tree-empty">
              {tree === null ? "Loading files…" : "No files found"}
            </div>
          ) : (
            tree.map((node, i) => (
              <SidebarTreeNode
                key={i}
                node={node}
                depth={0}
                selectedLanguage={selectedLanguage}
                onItemClick={handleItemClick}
                activePath={location.pathname}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}