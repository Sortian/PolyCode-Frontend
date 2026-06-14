import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Boxes,
  Layers3,
  Grid3x3,
  Table2,
  FileText,
} from "lucide-react";
import { getLanguages } from "../../docs/services/api";

const NAV_LINKS = [
  { href: "#modules", label: "Features" },
  { href: "/hub", label: "Docs" },
];

const COURSES = [
  {
    label: "OOPs C++",
    sub: "Classes · Inheritance · Polymorphism",
    href: "/learn/oops-cpp",
    icon: Boxes,
    accent: "#ffe566",
  },
  {
    label: "Pointers C++",
    sub: "Memory · Smart Pointers · Safety",
    href: "/learn/pointers-cpp",
    icon: Layers3,
    accent: "#00d4ff",
  },
  {
    label: "NumPy · Python",
    sub: "Arrays · Vector Math · Data",
    href: "/learn/numpy-py",
    icon: Grid3x3,
    accent: "#4dabdc",
  },
  {
    label: "Pandas · Python",
    sub: "DataFrames · Groupby · CSV",
    href: "/learn/pandas-py",
    icon: Table2,
    accent: "#059669",
  },
  {
    label: "JS Fundamentals",
    sub: "Variables · Functions · Arrays",
    href: "/learn/js-fundamentals",
    icon: FileText,
    accent: "#f59e0b",
  },
];

export default function Navbar() {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const coursesRef = useRef(null);
  const langRef = useRef(null);
  const navigate = useNavigate();

  // Frosted glass on scroll
  useEffect(() => {
    const nav = document.querySelector(".landing-navbar");
    const onScroll = () =>
      nav?.classList.toggle("landing-navbar--scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch languages from API
  useEffect(() => {
    getLanguages()
      .then(({ data }) => {
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
      })
      .catch(() => setLanguages([]));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!coursesRef.current?.contains(e.target)) setCoursesOpen(false);
      if (!langRef.current?.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNav = (href) => {
    setCoursesOpen(false);
    setLangOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <header className="landing-navbar">
      <div className="landing-container">
        <div className="landing-navbar-inner">
          {/* Brand */}
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

          {/* Nav */}
          <nav className="landing-nav-links">
            {/* Static links */}
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                className="landing-nav-link"
                onClick={() => handleNav(link.href)}
              >
                {link.label}
              </button>
            ))}

            {/* Courses dropdown */}
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
                            {course.label}
                          </span>
                          <span className="ln-dropdown-sub">{course.sub}</span>
                        </div>
                        <ArrowRight size={13} className="ln-dropdown-arrow" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Languages dropdown */}
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

          {/* CTA */}
          <a href="#get-started" className="landing-btn-primary">
            Start Learning
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </header>
  );
}
