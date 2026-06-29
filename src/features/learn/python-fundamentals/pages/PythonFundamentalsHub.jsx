import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PYTHON_FUNDAMENTALS_CHAPTERS,
  PYTHON_FUNDAMENTALS_LESSONS,
  PYTHON_FUNDAMENTALS_TOTAL_XP,
} from "../data/pythonFundamentalsCurriculum";
import usePythonFundamentalsProgress from "../hooks/usePythonFundamentalsProgress";
import CourseCertificate from "../../shared/CourseCertificate";
import LearnChapterPathOverview from "../../shared/LearnChapterPathOverview";
import LearnChapterGrid from "../../shared/LearnChapterGrid";

const BASE_PATH = "/learn/python-fundamentals";

const LEARNING_PATH = [
  {
    level: "Beginner",
    chapters: ["foundations", "variables-types"],
    color: "#3776ab",
    summary: "What Python is, running code, variables, strings, and basic types.",
  },
  {
    level: "Intermediate",
    chapters: ["control-flow", "collections-core", "loops-functions"],
    color: "#2563eb",
    summary: "Conditionals, lists, tuples, for/while loops, and functions.",
  },
  {
    level: "Advanced",
    chapters: ["dicts-sets", "files-errors"],
    color: "#7c3aed",
    summary: "Dictionaries, sets, file patterns, and exception handling.",
  },
  {
    level: "Pro",
    chapters: ["pro-python"],
    color: "#9333ea",
    summary: "Classes, imports, comprehensions, venv, capstone, and cheat sheet.",
  },
];

function lessonPlainText(lesson) {
  return lesson.theory
    .filter((block) => block.type === "text" || block.type === "callout")
    .map((block) => block.content.replace(/\*\*/g, "").replace(/`/g, ""))
    .join(" ");
}

export default function PythonFundamentalsHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const {
    isAuthenticated,
    completedMap: progress,
    bookmarks,
    lastLessonId,
  } = usePythonFundamentalsProgress();

  const completedCount = Object.keys(progress).length;
  const earnedXP = PYTHON_FUNDAMENTALS_LESSONS.filter(
    (lesson) => progress[lesson.id],
  ).reduce((sum, lesson) => sum + lesson.xp, 0);
  const pct =
    Math.round((completedCount / PYTHON_FUNDAMENTALS_LESSONS.length) * 100) ||
    0;
  const nextLesson =
    PYTHON_FUNDAMENTALS_LESSONS.find((lesson) => !progress[lesson.id]) ||
    PYTHON_FUNDAMENTALS_LESSONS[0];
  const resumeLesson =
    PYTHON_FUNDAMENTALS_LESSONS.find((lesson) => lesson.id === lastLessonId) ||
    nextLesson;
  const completedChapters = PYTHON_FUNDAMENTALS_CHAPTERS.filter((chapter) =>
    chapter.lessons.every((lesson) => progress[lesson.id]),
  ).length;
  const bookmarkedLessons = bookmarks
    .map((id) => PYTHON_FUNDAMENTALS_LESSONS.find((lesson) => lesson.id === id))
    .filter(Boolean);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PYTHON_FUNDAMENTALS_LESSONS.filter((lesson) => {
      const matchesQuery =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.chapterTitle.toLowerCase().includes(query) ||
        lessonPlainText(lesson).toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "todo" && !progress[lesson.id]) ||
        (filter === "done" && progress[lesson.id]) ||
        (filter === "bookmarked" && bookmarks.includes(lesson.id));
      return matchesQuery && matchesFilter;
    });
  }, [bookmarks, filter, progress, search]);

  return (
    <div className="oops-hub matplotlib-hub">
      <div className="oops-hero matplotlib-hero">
        <Link
          to="/language/Python"
          className="oops-back-btn"
          style={{ marginBottom: "0.75rem", display: "inline-flex" }}
        >
          ← Python courses
        </Link>
        <div className="oops-hero-badge">PYTHON · BEGINNER → PRO</div>
        <h1 className="oops-hero-title">
          Python
          <br />
          <span className="oops-hero-accent">Fundamentals</span>
        </h1>
        <p className="oops-hero-sub">
          A structured path from your first print statement to classes, files,
          and modern Python habits — 8 chapters, 22 lessons, and hands-on
          challenges before NumPy, Pandas, and beyond.
        </p>

        <div className="oops-hero-grid">
          <div className="oops-xp-bar-wrap">
            <div className="oops-xp-meta">
              <span>
                {isAuthenticated
                  ? `${completedCount}/${PYTHON_FUNDAMENTALS_LESSONS.length} lessons · ${earnedXP}/${PYTHON_FUNDAMENTALS_TOTAL_XP} XP`
                  : `Sign in to track progress · ${PYTHON_FUNDAMENTALS_LESSONS.length} lessons`}
              </span>
              <span>{isAuthenticated ? `${pct}%` : "—"}</span>
            </div>
            <div className="oops-xp-track">
              <div
                className="oops-xp-fill"
                style={{ width: isAuthenticated ? `${pct}%` : "0%" }}
              />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="oops-auth-gate oops-auth-gate-hub">
              <p>
                Create a free account to run challenges, earn XP, and save your
                place in the course.
              </p>
              <div className="oops-auth-gate-actions">
                <Link to="/login" className="oops-auth-gate-btn">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="oops-auth-gate-btn oops-auth-gate-btn-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}

          <div className="oops-resume-panel">
            <span className="oops-sync-pill">
              {isAuthenticated
                ? "Progress saved to your account"
                : "Browse lessons — sign in to save progress"}
            </span>
            <h2>{resumeLesson.title}</h2>
            <p>
              {resumeLesson.chapterTitle} · {resumeLesson.xp} XP
            </p>
            <button
              type="button"
              onClick={() => navigate(`${BASE_PATH}/lesson/${resumeLesson.id}`)}
            >
              {completedCount > 0 ? "Resume Python" : "Start Python"}
            </button>
          </div>
        </div>
      </div>

      <section className="matplotlib-prerequisites" aria-label="What comes next">
        <div className="matplotlib-prerequisites-head">
          <span>After this course</span>
          <small>Continue your Python stack on PolyCode</small>
        </div>
        <div className="matplotlib-prerequisites-grid">
          <Link to="/learn/numpy-py" className="matplotlib-prereq-card">
            <strong>NumPy</strong>
            <p>Numeric arrays and vector math — the foundation of data science.</p>
          </Link>
          <Link to="/learn/pandas-py" className="matplotlib-prereq-card">
            <strong>Pandas</strong>
            <p>Tables, CSV workflows, and data cleaning.</p>
          </Link>
          <Link to="/learn/matplotlib-py" className="matplotlib-prereq-card">
            <strong>Matplotlib</strong>
            <p>Charts and publication-ready visualizations.</p>
          </Link>
          <Link
            to={`${BASE_PATH}/lesson/py-13`}
            className="matplotlib-prereq-card matplotlib-prereq-cheat"
          >
            <strong>Cheat sheet</strong>
            <p>Syntax reference — bookmark lesson 22 anytime.</p>
          </Link>
        </div>
        <p className="matplotlib-runtime-note">
          Challenges run in your browser via Pyodide. The first run may take a
          few seconds to load the Python runtime — output appears in the
          console panel after <code>print()</code>.
        </p>
      </section>

      <div className="oops-guide-tools">
        <div className="oops-tool-panel oops-tool-panel-main">
          <span className="oops-interactive-label">Find a Python topic</span>
          <div className="oops-search-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search loops, dicts, classes..."
              aria-label="Search Python lessons"
            />
            <div
              className="oops-filter-tabs"
              aria-label="Filter Python lessons"
            >
              {[
                ["all", "All"],
                ["todo", "To do"],
                ["done", "Done"],
                ["bookmarked", "Saved"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="oops-search-results">
            {filteredLessons.slice(0, 6).map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                className="oops-search-result"
                onClick={() => navigate(`${BASE_PATH}/lesson/${lesson.id}`)}
              >
                <span>{progress[lesson.id] ? "✓" : "○"}</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.chapterTitle}</small>
              </button>
            ))}
            {filteredLessons.length === 0 && (
              <p className="oops-empty-copy">No lessons match that search.</p>
            )}
          </div>
        </div>

        <div className="oops-tool-panel">
          <span className="oops-interactive-label">Recommended</span>
          <h2>{nextLesson.title}</h2>
          <p>
            Next in {nextLesson.chapterTitle}. Earn {nextLesson.xp} XP.
          </p>
          <button
            type="button"
            onClick={() => navigate(`${BASE_PATH}/lesson/${nextLesson.id}`)}
          >
            Open next lesson
          </button>
        </div>

        <div className="oops-tool-panel">
          <span className="oops-interactive-label">Bookmarks</span>
          {bookmarkedLessons.length > 0 ? (
            <div className="oops-bookmark-list">
              {bookmarkedLessons.slice(0, 3).map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => navigate(`${BASE_PATH}/lesson/${lesson.id}`)}
                >
                  <strong>{lesson.title}</strong>
                  <small>{lesson.chapterTitle}</small>
                </button>
              ))}
            </div>
          ) : (
            <p>Bookmark lessons to review them here.</p>
          )}
        </div>
      </div>

      <div className="oops-dashboard-strip">
        <div className="oops-stat-tile">
          <span>Lessons</span>
          <strong>
            {completedCount}/{PYTHON_FUNDAMENTALS_LESSONS.length}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>Chapters</span>
          <strong>
            {completedChapters}/{PYTHON_FUNDAMENTALS_CHAPTERS.length}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>XP</span>
          <strong>
            {earnedXP}/{PYTHON_FUNDAMENTALS_TOTAL_XP}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>Bookmarks</span>
          <strong>{bookmarks.length}</strong>
        </div>
      </div>

      <section className="matplotlib-learn-path" aria-label="Learning path">
        <div className="matplotlib-path-label">
          <span>Your path · Beginner to Pro</span>
          <small>
            {PYTHON_FUNDAMENTALS_CHAPTERS.length} chapters ·{" "}
            {PYTHON_FUNDAMENTALS_LESSONS.length} lessons
          </small>
        </div>
        <div className="matplotlib-path-grid">
          {LEARNING_PATH.map((stage) => {
            const stageChapters = PYTHON_FUNDAMENTALS_CHAPTERS.filter((ch) =>
              stage.chapters.includes(ch.id),
            );
            const stageLessons = stageChapters.flatMap((ch) => ch.lessons);
            const stageDone = stageLessons.filter((l) => progress[l.id]).length;
            const stagePct =
              stageLessons.length > 0
                ? Math.round((stageDone / stageLessons.length) * 100)
                : 0;

            return (
              <article
                key={stage.level}
                className="matplotlib-path-card"
                style={{ "--stage-color": stage.color }}
              >
                <header className="matplotlib-path-card-head">
                  <span className="matplotlib-path-level">{stage.level}</span>
                  <span className="matplotlib-path-pct">{stagePct}%</span>
                </header>
                <p className="matplotlib-path-summary">{stage.summary}</p>
                <ul className="matplotlib-path-chapters">
                  {stageChapters.map((ch) => (
                    <li key={ch.id}>
                      <span aria-hidden>{ch.icon}</span>
                      {ch.title}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="matplotlib-path-cta"
                  onClick={() => {
                    const firstOpen =
                      stageLessons.find((l) => !progress[l.id]) ||
                      stageLessons[0];
                    if (firstOpen) {
                      navigate(`${BASE_PATH}/lesson/${firstOpen.id}`);
                    }
                  }}
                >
                  {stageDone === stageLessons.length && stageLessons.length > 0
                    ? "Review stage →"
                    : stageDone > 0
                      ? "Continue stage →"
                      : "Start stage →"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <LearnChapterPathOverview
        chapters={PYTHON_FUNDAMENTALS_CHAPTERS}
        progress={progress}
        onChapterSelect={(chapter) =>
          navigate(`${BASE_PATH}/lesson/${chapter.lessons[0].id}`)
        }
      />

      <LearnChapterGrid
        chapters={PYTHON_FUNDAMENTALS_CHAPTERS}
        progress={progress}
        basePath={BASE_PATH}
        navigate={navigate}
      />
      <CourseCertificate
        courseName="Python Fundamentals"
        totalLessons={PYTHON_FUNDAMENTALS_LESSONS.length}
        completedCount={completedCount}
        earnedXP={earnedXP}
        totalXP={PYTHON_FUNDAMENTALS_TOTAL_XP}
      />
    </div>
  );
}
