import React, { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Home,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ALL_COURSES,
  COURSE_GROUPS,
} from "../../learn/shared/allCourses";
import "./all-courses.css";

const STACK_ICONS = {
  cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  javascript:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  csharp:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
  php: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
};

const ORBIT_CHIPS = ["python", "cpp", "javascript", "csharp"];

export default function AllCoursesPage() {
  const [searchParams] = useSearchParams();
  const focusStack = searchParams.get("stack");

  const totalLessons = useMemo(
    () =>
      COURSE_GROUPS.reduce((sum, group) => sum + group.courses.length, 0),
    [],
  );

  useEffect(() => {
    if (!focusStack) return;
    const section = document.getElementById(`course-stack-${focusStack}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusStack]);

  return (
    <main className="all-courses-page">
      <div className="all-courses-page-inner">
        <div className="all-courses-topbar">
          <nav className="all-courses-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">
              <Home size={15} aria-hidden />
              Home
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page">All courses</span>
          </nav>
          <Link className="all-courses-topbar-link" to="/hub">
            <BookOpen size={15} aria-hidden />
            Docs hub
          </Link>
        </div>

        <header className="all-courses-hero">
          <div className="all-courses-hero-copy">
            <span className="all-courses-kicker">
              <Sparkles size={14} aria-hidden />
              Course catalog
            </span>
            <h1>Explore every PolyCode course</h1>
            <p className="all-courses-hero-lead">
              Interactive tracks across {COURSE_GROUPS.length} language stacks —
              from fundamentals to data science and systems programming. Pick a
              stack, choose a course, and start earning XP.
            </p>

            <div className="all-courses-hero-actions">
              <Link
                className="all-courses-hero-btn all-courses-hero-btn--primary"
                to="/select-language"
              >
                <Layers size={16} aria-hidden />
                Choose your stack
              </Link>
              <Link
                className="all-courses-hero-btn all-courses-hero-btn--secondary"
                to="/playground"
              >
                <Code2 size={16} aria-hidden />
                Open playground
              </Link>
            </div>

            <div className="all-courses-hero-stats">
              <div className="all-courses-stat">
                <strong>{COURSE_GROUPS.length}</strong>
                <span>Stacks</span>
              </div>
              <div className="all-courses-stat">
                <strong>{ALL_COURSES.length}</strong>
                <span>Unique courses</span>
              </div>
              <div className="all-courses-stat">
                <strong>{totalLessons}</strong>
                <span>Learning paths</span>
              </div>
            </div>
          </div>

          <div className="all-courses-hero-visual" aria-hidden>
            <div className="all-courses-hero-orbit">
              <div className="all-courses-orbit-ring" />
              <div className="all-courses-orbit-ring all-courses-orbit-ring--inner" />
              <div className="all-courses-orbit-core">
                <GraduationCap size={36} strokeWidth={1.75} />
              </div>
              {ORBIT_CHIPS.map((stackId, index) => {
                const group = COURSE_GROUPS.find((g) => g.id === stackId);
                if (!group) return null;
                return (
                  <div
                    key={stackId}
                    className={`all-courses-orbit-chip all-courses-orbit-chip--${index + 1}`}
                    style={{ "--chip-accent": group.accent }}
                  >
                    <img src={STACK_ICONS[stackId]} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <nav className="all-courses-jump" aria-label="Jump to language stack">
          <p className="all-courses-jump-label">Jump to stack</p>
          {COURSE_GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#course-stack-${group.id}`}
              style={{ "--stack-accent": group.accent }}
            >
              {group.label}
              <span className="all-courses-jump-count">{group.courses.length}</span>
            </a>
          ))}
        </nav>

        <div className="all-courses-stacks">
          {COURSE_GROUPS.map((group) => (
            <section
              key={group.id}
              id={`course-stack-${group.id}`}
              className={`all-courses-stack${
                focusStack === group.id ? " all-courses-stack--focus" : ""
              }`}
              style={{ "--stack-accent": group.accent }}
            >
              <div className="all-courses-stack-head">
                <div className="all-courses-stack-title-row">
                  <div className="all-courses-stack-icon">
                    {STACK_ICONS[group.id] ? (
                      <img src={STACK_ICONS[group.id]} alt="" />
                    ) : (
                      <Layers size={22} aria-hidden />
                    )}
                  </div>
                  <div>
                    <span className="all-courses-stack-label">{group.label}</span>
                    <h2>{group.label} courses</h2>
                    <p className="all-courses-stack-meta">
                      {group.courses.length} interactive{" "}
                      {group.courses.length === 1 ? "course" : "courses"}
                    </p>
                  </div>
                </div>
                <Link
                  className="all-courses-stack-hub"
                  to={group.languagePath}
                >
                  {group.label} hub
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>

              <div className="all-courses-grid">
                {group.courses.map((course) => {
                  const Icon = course.icon;
                  return (
                    <Link
                      key={course.href}
                      to={course.href}
                      className="all-courses-card"
                      style={{
                        "--course-accent": course.accent || group.accent,
                      }}
                    >
                      <div className="all-courses-card-icon">
                        <Icon size={22} aria-hidden />
                      </div>
                      <span className="all-courses-card-tag">{course.tag}</span>
                      <h3>{course.title}</h3>
                      {course.description ? <p>{course.description}</p> : null}
                      <span className="all-courses-card-cta">
                        Start course
                        <ArrowRight size={15} aria-hidden />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
