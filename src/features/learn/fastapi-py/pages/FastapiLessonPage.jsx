import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NumpyIntroTheory from "../../numpy-py/components/NumpyIntroTheory";
import OopsSidebar from "../../oops-cpp/components/OopsSidebar";
import LearnProfileMenu from "../../shared/LearnProfileMenu";
import LessonContentShell from "../../shared/LessonContentShell";
import PythonCodeChallenge from "../../numpy-py/components/PythonCodeChallenge";
import {
  FASTAPI_CHAPTERS,
  FASTAPI_LESSONS,
  FASTAPI_TOTAL_XP,
} from "../data/fastapiCurriculum";
import useFastapiProgress from "../hooks/useFastapiProgress";
import useLessonReadGate from "../../shared/useLessonReadGate";
import LessonChallengeTab from "../../shared/LessonChallengeTab";
import { useLessonAssistantContext } from "../../../assistant/hooks/useLessonAssistantContext";

const BASE_PATH = "/learn/fastapi-py";
const READ_GATE_PREFIX = "fastapi_py";
const FASTAPI_ACCENT = "#009688";

export default function FastapiLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("theory");
  const [focusMode, setFocusMode] = useState(false);
  const {
    markedAsRead,
    markAsRead,
    confidence,
    handleConfidenceChange,
    createGoToChallenge,
    challengeTabLocked,
  } = useLessonReadGate(READ_GATE_PREFIX, lessonId);
  const goToChallenge = createGoToChallenge(setTab);
  const {
    user,
    isAuthenticated,
    completedMap: progress,
    savedCodeMap,
    bookmarks,
    completeLesson,
    rememberLesson,
    saveCode,
    toggleBookmark,
  } = useFastapiProgress();
  const codeSaveTimer = useRef(null);

  const lesson = FASTAPI_LESSONS.find((item) => item.id === lessonId);
  const lessonIdx = FASTAPI_LESSONS.findIndex((item) => item.id === lessonId);
  const prev = FASTAPI_LESSONS[lessonIdx - 1];
  const next = FASTAPI_LESSONS[lessonIdx + 1];

  useLessonAssistantContext({
    course: "FastAPI",
    language: "Python",
    lesson,
    chapter: lesson?.chapterTitle,
    tab,
    code: savedCodeMap[lessonId] || "",
  });

  useEffect(() => {
    setTab("theory");
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) rememberLesson(lessonId);
  }, [lessonId, rememberLesson]);

  useEffect(
    () => () => {
      window.clearTimeout(codeSaveTimer.current);
    },
    [],
  );

  if (!lesson) {
    return (
      <div className="oops-not-found">
        <p>FastAPI lesson not found.</p>
        <button type="button" onClick={() => navigate(BASE_PATH)}>
          ← Back to FastAPI
        </button>
      </div>
    );
  }

  const isCompleted = isAuthenticated && !!progress[lessonId];
  const isBookmarked = bookmarks.includes(lessonId);
  const completedCount = Object.keys(progress).length;
  const earnedXP = FASTAPI_LESSONS.filter((item) => progress[item.id]).reduce(
    (sum, item) => sum + item.xp,
    0,
  );

  async function handleChallengeComplete() {
    await completeLesson(lesson);
  }

  function handleCodeChange(code) {
    window.clearTimeout(codeSaveTimer.current);
    codeSaveTimer.current = window.setTimeout(() => {
      saveCode(lessonId, code).catch(() => {});
    }, 700);
  }

  return (
    <div className={`oops-lesson-page ${focusMode ? "oops-focus-mode" : ""}`}>
      <OopsSidebar
        currentLessonId={lessonId}
        progress={progress}
        chapters={FASTAPI_CHAPTERS}
        basePath={BASE_PATH}
        title="FastAPI · py"
      />

      <div className="oops-lesson-main">
        <div className="oops-lesson-topbar">
          <button
            type="button"
            className="oops-back-btn"
            onClick={() => navigate(BASE_PATH)}
          >
            ← FastAPI · Python
          </button>
          <div className="oops-lesson-breadcrumb">
            <span className="learn-lesson-chapter-tag">
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
            trackTitle="FastAPI · py"
            syncLabel={
              isAuthenticated
                ? "FastAPI progress saved to your account"
                : "Sign in to save progress"
            }
            completedCount={completedCount}
            totalLessons={FASTAPI_LESSONS.length}
            earnedXP={earnedXP}
            totalXP={FASTAPI_TOTAL_XP}
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
          <LessonChallengeTab
            active={tab === "challenge"}
            locked={challengeTabLocked}
            xp={lesson.xp}
            onClick={goToChallenge}
          />
        </div>

        <LessonContentShell
          storageKey={`fastapi-py:${lessonId}`}
          videoUrl={lesson.videoUrl}
          videoTitle={`${lesson.title} — FastAPI`}
        >
          {tab === "theory" ? (
            <NumpyIntroTheory
              lesson={lesson}
              quizStoragePrefix={READ_GATE_PREFIX}
              confidence={confidence}
              onConfidenceChange={handleConfidenceChange}
              markedAsRead={markedAsRead}
              onMarkAsRead={markAsRead}
              onGoChallenge={goToChallenge}
            />
          ) : (
            <PythonCodeChallenge
              challenge={lesson.challenge}
              accentColor={FASTAPI_ACCENT}
              isCompleted={isCompleted}
              onComplete={handleChallengeComplete}
              initialCode={savedCodeMap[lessonId]}
              onCodeChange={handleCodeChange}
            />
          )}
        </LessonContentShell>

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
