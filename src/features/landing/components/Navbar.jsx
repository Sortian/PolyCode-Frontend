import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { getLanguages } from "../../docs/services/api";
import { ALL_COURSES as COURSES } from "../../learn/shared/allCourses";
import ThemeSettingsMenu from "../../../shared/theme/ThemeSettingsMenu";

const NAV_LINKS = [
  { href: "#modules", label: "Features" },
  { href: "/hub", label: "Docs" },
];

export default function Navbar({ theme = "dark", onThemeChange }) {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const coursesRef = useRef(null);
  const langRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const nav = document.querySelector(".landing-navbar");
    const onScroll = () =>
      nav?.classList.toggle("landing-navbar--scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getLanguages()
      .then(({ data }) => {
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
      })
      .catch(() => setLanguages([]));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!coursesRef.current?.contains(e.target)) setCoursesOpen(false);
      if (!langRef.current?.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCoursesOpen(false);
    setMobileLangOpen(false);
  };

  const handleNav = (href) => {
    setCoursesOpen(false);
    setLangOpen(false);
    closeMobile();
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <header className="landing-navbar">
        <div className="landing-container">
          <div className="landing-navbar-inner">
            <button
              type="button"
              className="landing-mobile-menu-btn"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <a href="#top" className="landing-brand">
              <div className="landing-brand-mark">
                <img
                  src="/images/polycode-logo.png"
                  alt="PolyCode Logo"
                  className="landing-logo"
                />
              </div>
              <div className="landing-brand-text">
                <span className="landing-logo-text">PolyCode</span>
                <span className="landing-logo-sub">AI Learning Platform</span>
              </div>
            </a>

            <nav className="landing-nav-links">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className="landing-nav-link"
                  onClick={() => handleNav(link.href)}
                >
                  {link.label}
                </button>
              ))}

              <div className="ln-dropdown-wrap" ref={coursesRef}>
                <button
                  className={`landing-nav-link ln-dropdown-trigger${coursesOpen ? " ln-dropdown-trigger--open" : ""}`}
                  onClick={() => {
                    setCoursesOpen((o) => !o);
                    setLangOpen(false);
                  }}
                  aria-expanded={coursesOpen}
                >
                  Courses
                  <ChevronDown size={13} className="ln-chevron" />
                </button>

                {coursesOpen && (
                  <div className="ln-dropdown">
                    <p className="ln-dropdown-label">Available Courses</p>
                    {COURSES.map((course) => {
                      const Icon = course.icon;
                      return (
                        <button
                          key={course.label}
                          className="ln-dropdown-item"
                          style={{ "--lang-accent": course.accent }}
                          onClick={() => handleNav(course.href)}
                        >
                          <div className="ln-dropdown-icon">
                            <Icon size={16} />
                          </div>
                          <div className="ln-dropdown-text">
                            <span className="ln-dropdown-name">
                              {course.title}
                            </span>
                          </div>
                          <ArrowRight size={13} className="ln-dropdown-arrow" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="ln-dropdown-wrap" ref={langRef}>
                <button
                  className={`landing-nav-link ln-dropdown-trigger${langOpen ? " ln-dropdown-trigger--open" : ""}`}
                  onClick={() => {
                    setLangOpen((o) => !o);
                    setCoursesOpen(false);
                  }}
                  aria-expanded={langOpen}
                >
                  Languages
                  <ChevronDown size={13} className="ln-chevron" />
                </button>

                {langOpen && (
                  <div className="ln-dropdown ln-dropdown--languages">
                    <p className="ln-dropdown-label">Pick a Language</p>
                    {languages.length === 0 ? (
                      <p className="ln-dropdown-empty">Loading…</p>
                    ) : (
                      <div className="ln-lang-grid">
                        {languages.map((lang) => (
                          <button
                            key={lang}
                            className="ln-lang-item"
                            onClick={() =>
                              handleNav(`/language/${encodeURIComponent(lang)}`)
                            }
                          >
                            <span className="ln-lang-name">{lang}</span>
                            <ArrowRight size={11} className="ln-lang-arrow" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>

            <div className="landing-navbar-actions">
              <ThemeSettingsMenu
                theme={theme}
                onThemeChange={onThemeChange}
                buttonClassName="landing-theme-settings-btn"
                panelClassName="landing-theme-settings-panel"
              />
              <a href="#get-started" className="landing-btn-primary">
                Start Learning
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="landing-mobile-backdrop"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={`landing-mobile-drawer${mobileOpen ? " landing-mobile-drawer--open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="landing-mobile-drawer-head">
          <span className="landing-mobile-drawer-title">Menu</span>
          <button
            type="button"
            className="landing-mobile-drawer-close"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="landing-mobile-nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              className="landing-mobile-nav-link"
              onClick={() => handleNav(link.href)}
            >
              {link.label}
            </button>
          ))}

          <button
            type="button"
            className="landing-mobile-nav-link landing-mobile-nav-link--accordion"
            aria-expanded={mobileCoursesOpen}
            onClick={() => setMobileCoursesOpen((o) => !o)}
          >
            Courses
            <ChevronDown
              size={16}
              className={`landing-mobile-chevron${mobileCoursesOpen ? " landing-mobile-chevron--open" : ""}`}
            />
          </button>
          {mobileCoursesOpen ? (
            <div className="landing-mobile-subnav">
              {COURSES.map((course) => {
                const Icon = course.icon;
                return (
                  <button
                    key={course.label}
                    type="button"
                    className="landing-mobile-subnav-link"
                    style={{ "--lang-accent": course.accent }}
                    onClick={() => handleNav(course.href)}
                  >
                    <Icon size={15} />
                    {course.title}
                  </button>
                );
              })}
            </div>
          ) : null}

          <button
            type="button"
            className="landing-mobile-nav-link landing-mobile-nav-link--accordion"
            aria-expanded={mobileLangOpen}
            onClick={() => setMobileLangOpen((o) => !o)}
          >
            Languages
            <ChevronDown
              size={16}
              className={`landing-mobile-chevron${mobileLangOpen ? " landing-mobile-chevron--open" : ""}`}
            />
          </button>
          {mobileLangOpen ? (
            <div className="landing-mobile-subnav landing-mobile-subnav--grid">
              {languages.length === 0 ? (
                <p className="ln-dropdown-empty">Loading…</p>
              ) : (
                languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className="landing-mobile-subnav-link"
                    onClick={() =>
                      handleNav(`/language/${encodeURIComponent(lang)}`)
                    }
                  >
                    {lang}
                  </button>
                ))
              )}
            </div>
          ) : null}

          <button
            type="button"
            className="landing-mobile-cta"
            onClick={() => handleNav("#get-started")}
          >
            Start Learning
            <ArrowRight size={16} />
          </button>
        </nav>
      </aside>
    </>
  );
}
