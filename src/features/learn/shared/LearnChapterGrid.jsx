import React from "react";

export default function LearnChapterGrid({ chapters, progress, basePath, navigate }) {
  return (
    <div className="oops-chapters">
      {chapters.map((chapter, index) => {
        const done = chapter.lessons.filter((lesson) => progress[lesson.id]).length;
        const total = chapter.lessons.length;
        const chapterPct = Math.round((done / total) * 100) || 0;
        const firstUnfinished = chapter.lessons.find((lesson) => !progress[lesson.id]);
        const allDone = done === total;
        const startLessonId = firstUnfinished
          ? firstUnfinished.id
          : chapter.lessons[0].id;

        return (
          <div
            key={chapter.id}
            className={`oops-chapter-card ${allDone ? "oops-chapter-done" : ""}`}
            style={{ "--ch-color": chapter.color }}
          >
            <div className="oops-chapter-header">
              <span className="oops-chapter-icon-wrap" aria-hidden>
                <span className="oops-chapter-icon">{chapter.icon}</span>
              </span>
              <div className="oops-chapter-heading">
                <div className="oops-chapter-num">Chapter {index + 1}</div>
                <div className="oops-chapter-title">{chapter.title}</div>
              </div>
              {allDone && <span className="oops-done-badge">✓ Done</span>}
            </div>

            <div className="oops-chapter-progress-track">
              <div
                className="oops-chapter-progress-fill"
                style={{ width: `${chapterPct}%` }}
              />
            </div>
            <div className="oops-chapter-meta">
              {done}/{total} lessons · {chapterPct}%
            </div>

            <ul className="oops-lesson-list">
              {chapter.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`oops-lesson-item ${progress[lesson.id] ? "done" : ""}`}
                  onClick={() => navigate(`${basePath}/lesson/${lesson.id}`)}
                >
                  <span className="oops-lesson-status">
                    {progress[lesson.id] ? "✓" : "○"}
                  </span>
                  <span className="oops-lesson-name">{lesson.title}</span>
                  <span className="oops-lesson-xp">+{lesson.xp} XP</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="oops-chapter-cta"
              onClick={() => navigate(`${basePath}/lesson/${startLessonId}`)}
            >
              {allDone
                ? "Review Chapter →"
                : done > 0
                  ? "Continue →"
                  : "Start →"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
