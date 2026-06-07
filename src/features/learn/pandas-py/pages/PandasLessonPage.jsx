import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NumpyIntroTheory from "../../numpy-py/components/NumpyIntroTheory";
import OopsSidebar from "../../oops-cpp/components/OopsSidebar";
import LearnProfileMenu from "../../shared/LearnProfileMenu";
import PythonCodeChallenge from "../../numpy-py/components/PythonCodeChallenge";
import {
  PANDAS_CHAPTERS,
  PANDAS_LESSONS,
  PANDAS_TOTAL_XP,
} from "../data/pandasCurriculum";
import usePandasProgress from "../hooks/usePandasProgress";

const BASE_PATH = "/learn/pandas-py";

function plainLessonText(text = "") {
  return text.replace(/\*\*/g, "").replace(/`/g, "");
}

function getLessonPlainBlocks(lesson) {
  return lesson.theory
    .filter((block) => block.type === "text" || block.type === "callout")
    .map((block) => plainLessonText(block.content));
}

function getReadableSummary(lesson) {
  const blocks = getLessonPlainBlocks(lesson);
  return {
    plain:
      blocks[0] ||
      `${lesson.title} is a core Pandas idea for working with tables in Python.`,
    why: `${lesson.title} helps you analyze and clean real-world data without slow manual loops.`,
    analogy:
      blocks[1] ||
      "Think of a DataFrame as a spreadsheet you can filter and transform with code.",
  };
}

function getKeyTerms(lesson) {
  const terms = new Set();
  const source = `${lesson.title} ${getLessonPlainBlocks(lesson).join(" ")} ${
    lesson.challenge.description
  }`.toLowerCase();

  [
    "pandas",
    "series",
    "dataframe",
    "loc",
    "iloc",
    "groupby",
    "merge",
    "csv",
    "index",
    "column",
  ].forEach((term) => {
    if (source.includes(term)) terms.add(term);
  });

  return [...terms].slice(0, 6);
}

export default function PandasLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("theory");
  const [focusMode, setFocusMode] = useState(false);
  const [confidence, setConfidence] = useState("");
  const {
    user,
    isAuthenticated,
    completedMap: progress,
    savedCodeMap,
    notesMap,
    bookmarks,
    completeLesson,
    rememberLesson,
    saveCode,
    saveNote,
    toggleBookmark,
  } = usePandasProgress();
  const [noteDraft, setNoteDraft] = useState("");
  const codeSaveTimer = useRef(null);

  const lesson = PANDAS_LESSONS.find((item) => item.id === lessonId);
  const lessonIdx = PANDAS_LESSONS.findIndex((item) => item.id === lessonId);
  const prev = PANDAS_LESSONS[lessonIdx - 1];
  const next = PANDAS_LESSONS[lessonIdx + 1];
  const firstTextBlock = lesson?.theory.find((block) => block.type === "text");
  const firstCodeBlock = lesson?.theory.find((block) => block.type === "code");
  const firstCallout = lesson?.theory.find((block) => block.type === "callout");
  const practicePrompts = lesson?.challenge?.tests?.slice(0, 3) || [];
  const lessonSummary = useMemo(
    () => (lesson ? getReadableSummary(lesson) : null),
    [lesson],
  );
  const keyTerms = useMemo(() => (lesson ? getKeyTerms(lesson) : []), [lesson]);
  const briefStepItems = [
    "Read how Series and DataFrames differ from plain lists.",
    "Run each code sample in the challenge editor.",
    "Change one column or filter and predict the output before running.",
  ];

  useEffect(() => {
    setTab("theory");
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) rememberLesson(lessonId);
  }, [lessonId, rememberLesson]);

  useEffect(() => {
    setNoteDraft(notesMap[lessonId] || "");
  }, [lessonId, notesMap]);

  useEffect(() => {
    setConfidence(
      localStorage.getItem(`pandas_py_confidence_${lessonId}`) || "",
    );
  }, [lessonId]);

  useEffect(
    () => () => {
      window.clearTimeout(codeSaveTimer.current);
    },
    [],
  );

  if (!lesson) {
    return (
      <div className="oops-not-found">
        <p>Pandas lesson not found.</p>
        <button type="button" onClick={() => navigate(BASE_PATH)}>
          ← Back to Pandas
        </button>
      </div>
    );
  }

  const isCompleted = isAuthenticated && !!progress[lessonId];
  const isBookmarked = bookmarks.includes(lessonId);
  const completedCount = Object.keys(progress).length;
  const earnedXP = PANDAS_LESSONS.filter((item) => progress[item.id]).reduce(
    (sum, item) => sum + item.xp,
    0,
  );

  async function handleChallengeComplete() {
    await completeLesson(lesson);
  }

  function handleSaveNote() {
    saveNote(lessonId, noteDraft);
  }

  function handleCodeChange(code) {
    window.clearTimeout(codeSaveTimer.current);
    codeSaveTimer.current = window.setTimeout(() => {
      saveCode(lessonId, code).catch(() => {});
    }, 700);
  }

  function handleConfidenceChange(value) {
    setConfidence(value);
    localStorage.setItem(`pandas_py_confidence_${lessonId}`, value);
  }

  return (
    <div className={`oops-lesson-page ${focusMode ? "oops-focus-mode" : ""}`}>
      <OopsSidebar
        currentLessonId={lessonId}
        progress={progress}
        chapters={PANDAS_CHAPTERS}
        basePath={BASE_PATH}
        title="Pandas · py"
      />

      <div className="oops-lesson-main">
        <div className="oops-lesson-topbar">
          <button
            type="button"
            className="oops-back-btn"
            onClick={() => navigate(BASE_PATH)}
          >
            ← Pandas · Python
          </button>
          <div className="oops-lesson-breadcrumb">
            <span style={{ color: lesson.chapterColor }}>
              {lesson.chapterTitle}
            </span>
            <span className="oops-bc-sep">›</span>
            <span>{lesson.title}</span>
          </div>
          {isCompleted && (
            <span className="oops-completed-badge">✓ Completed</span>
          )}
          <button
            type="button"
            className={`oops-bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={() => toggleBookmark(lessonId)}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
          <button
            type="button"
            className={`oops-focus-btn ${focusMode ? "active" : ""}`}
            onClick={() => setFocusMode((v) => !v)}
          >
            {focusMode ? "Exit Focus" : "Focus"}
          </button>
          <LearnProfileMenu
            user={user}
            trackTitle="Pandas · py"
            syncLabel={
              isAuthenticated
                ? "Pandas progress saved to your account"
                : "Sign in to save progress"
            }
            completedCount={completedCount}
            totalLessons={PANDAS_LESSONS.length}
            earnedXP={earnedXP}
            totalXP={PANDAS_TOTAL_XP}
            bookmarksCount={bookmarks.length}
            streak={0}
          />
        </div>

        <div className="oops-tabs">
          <button
            type="button"
            className={`oops-tab ${tab === "theory" ? "active" : ""}`}
            onClick={() => setTab("theory")}
          >
            Theory
          </button>
          <button
            type="button"
            className={`oops-tab ${tab === "challenge" ? "active" : ""}`}
            onClick={() => setTab("challenge")}
          >
            Challenge <span className="oops-tab-xp">+{lesson.xp} XP</span>
          </button>
        </div>

        <div className="oops-lesson-content">
          {tab === "theory" ? (
            <NumpyIntroTheory
              lesson={lesson}
              noteDraft={noteDraft}
              onNoteChange={setNoteDraft}
              onSaveNote={handleSaveNote}
              confidence={confidence}
              onConfidenceChange={handleConfidenceChange}
              onGoChallenge={() => setTab("challenge")}
            />
          ) : (
            <PythonCodeChallenge
              challenge={lesson.challenge}
              accentColor={lesson.chapterColor}
              isCompleted={isCompleted}
              onComplete={handleChallengeComplete}
              initialCode={savedCodeMap[lessonId]}
              onCodeChange={handleCodeChange}
            />
          )}
        </div>

        <div className="oops-lesson-nav">
          {prev ? (
            <button
              type="button"
              className="oops-nav-btn"
              onClick={() => navigate(`${BASE_PATH}/lesson/${prev.id}`)}
            >
              ← {prev.title}
            </button>
          ) : (
            <div />
          )}
          {next ? (
            <button
              type="button"
              className="oops-nav-btn oops-nav-next"
              onClick={() => navigate(`${BASE_PATH}/lesson/${next.id}`)}
            >
              {next.title} →
            </button>
          ) : (
            <button
              type="button"
              className="oops-nav-btn oops-nav-next"
              onClick={() => navigate(BASE_PATH)}
            >
              Finish Course →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
