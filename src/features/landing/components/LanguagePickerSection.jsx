import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLanguages } from "../../docs/services/api";

const languageMeta = {
  javascript: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", color: "#f7df1e" },
  python: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", color: "#3776ab" },
  java: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", color: "#b07219" },
  cpp: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", color: "#f34b7d" },
  "c++": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", color: "#f34b7d" },
  c: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg", color: "#555555" },
  rust: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg", color: "#dea584" },
  go: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg", color: "#00add8" },
  php: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg", color: "#777bb4" },
  ruby: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg", color: "#701516" },
  sql: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", color: "#e38c00" },
  batchfile: { icon: "⌨️", color: "#4d4d4d" },
  powershell: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/powershell/powershell-original.svg", color: "#012456" },
  "q#": { icon: "⚛️", color: "#0078d4" },
  r: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg", color: "#276dc3" },
  csharp: { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg", color: "#239120" },
  "c#": { icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg", color: "#239120" },
};

const fallbackLanguages = [
  "Batchfile",
  "C",
  "C#",
  "C++",
  "Go",
  "Java",
  "JavaScript",
  "PHP",
  "Powershell",
  "Python",
  "Q#",
  "R",
  "Ruby",
  "Rust",
  "SQL",
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function LanguagePickerSection({ onLanguageSelect, continueLanguage }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      getLanguages()
        .then(({ data }) => {
          const apiLanguages = Array.isArray(data.languages) ? data.languages : [];
          setLanguages(apiLanguages.length > 0 ? apiLanguages : fallbackLanguages);
        })
        .catch((err) => {
          const status = err.response?.status;
          const detail = err.response?.data?.error || err.message;
          console.error(
            "Error loading languages:",
            status ? `${status}: ${detail}` : detail,
          );
          setLanguages(fallbackLanguages);
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setTimeout(() => {
      onLanguageSelect(language);
    }, 300);
  };

  if (loading) {
    return (
      <section id="get-started" className="landing-get-started">
        <div className="landing-container">
          <div className="loading">
            <div className="spinner-container">
              <div className="spinner" />
              <div className="spinner-inner" />
            </div>
            <p>Discovering available languages…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="get-started" className="landing-get-started">
      <div className="landing-container">
        <p className="landing-section-label">Get started</p>
        <h2>Choose your programming language</h2>
        <p className="landing-section-desc">
          Pick a stack to open docs, courses, playground, and daily challenges.
        </p>

        {continueLanguage ? (
          <button
            type="button"
            className="btn-secondary continue-stack-btn"
            onClick={() =>
              navigate(`/language/${encodeURIComponent(continueLanguage)}`)
            }
            style={{ marginBottom: "1.5rem" }}
          >
            Continue with {continueLanguage} →
          </button>
        ) : null}

        <div className="lang-grid">
          {languages.map((language, i) => {
            const meta =
              languageMeta[language.toLowerCase()] || { icon: "💻", color: "#64748b" };
            const rgba = meta.color.startsWith("#")
              ? hexToRgba(meta.color, 0.2)
              : "rgba(255,255,255,0.1)";
            const isHovered = hoveredLanguage === language;
            const isSelected = selectedLanguage === language;

            return (
              <div
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`lang-card fade-up ${isSelected ? "selected" : ""}`}
                style={{
                  "--lang-color": meta.color,
                  "--lang-color-alpha": rgba,
                  animationDelay: `${i * 0.1}s`,
                  transform: isHovered
                    ? "translateY(-12px) scale(1.03)"
                    : "translateY(0) scale(1)",
                  opacity: isSelected ? 0.8 : 1,
                }}
                onMouseEnter={() => setHoveredLanguage(language)}
                onMouseLeave={() => setHoveredLanguage(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                }}
              >
                <div
                  className="lang-icon-wrapper"
                  style={{
                    transform: isHovered
                      ? "scale(1.15) rotate(8deg)"
                      : "scale(1) rotate(0deg)",
                  }}
                >
                  {meta.icon.startsWith("http") ? (
                    <img src={meta.icon} alt={language} />
                  ) : (
                    <span style={{ fontSize: "2.5rem" }}>{meta.icon}</span>
                  )}
                </div>
                <span
                  className="lang-name"
                  style={{
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    color: isHovered ? meta.color : "#fff",
                  }}
                >
                  {language}
                </span>
                <span
                  className="lang-explorer"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateY(0)" : "translateY(10px)",
                    color: isHovered ? meta.color : "var(--txt-3)",
                  }}
                >
                  {isSelected ? "Loading..." : "Explore Docs →"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
