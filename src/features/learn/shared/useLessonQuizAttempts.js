import { useCallback, useEffect, useMemo, useState } from "react";
import {
  REQUIRED_QUIZ_COUNT,
  countAttemptedQuizzes,
  loadQuizAttempts,
  prepareLessonQuizzes,
  recordQuizAttempt,
} from "./lessonQuizUtils";

/**
 * Prepares lesson theory with ≥2 MCQs and tracks which ones the learner attempted.
 */
export default function useLessonQuizAttempts(storagePrefix, lessonId, lesson) {
  const preparedLesson = useMemo(
    () => prepareLessonQuizzes(lesson),
    [lesson],
  );

  const quizCount = REQUIRED_QUIZ_COUNT;
  const [attempts, setAttempts] = useState({});

  useEffect(() => {
    if (!storagePrefix || !lessonId) {
      setAttempts({});
      return;
    }
    setAttempts(loadQuizAttempts(storagePrefix, lessonId));
  }, [storagePrefix, lessonId]);

  const recordAttempt = useCallback(
    (quizIndex, selectedIndex) => {
      if (!storagePrefix || !lessonId) return;
      recordQuizAttempt(storagePrefix, lessonId, quizIndex, selectedIndex);
      setAttempts((prev) => ({
        ...prev,
        [String(quizIndex)]: selectedIndex,
      }));
    },
    [storagePrefix, lessonId],
  );

  const attemptedCount = countAttemptedQuizzes(attempts, quizCount);
  const allQuizzesAttempted = attemptedCount >= quizCount;

  const getSelection = useCallback(
    (quizIndex) => {
      const value = attempts[String(quizIndex)];
      return value === undefined ? null : value;
    },
    [attempts],
  );

  return {
    preparedLesson,
    quizCount,
    attemptedCount,
    allQuizzesAttempted,
    recordAttempt,
    getSelection,
  };
}
