import { useCallback, useState } from "react";
import { useAuth } from "../../../auth/context/AuthContext";

const LOCAL_KEY = "numpy_py_progress";
const LOCAL_CODE_KEY = "numpy_py_saved_code";
const LOCAL_NOTES_KEY = "numpy_py_notes";
const LOCAL_BOOKMARKS_KEY = "numpy_py_bookmarks";
const LOCAL_LAST_KEY = "numpy_py_last_lesson";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export default function useNumpyProgress() {
  const { user } = useAuth();
  const [, setLocalVersion] = useState(0);
  const refreshLocal = useCallback(() => setLocalVersion((v) => v + 1), []);

  const completedMap = readJson(LOCAL_KEY, {});
  const savedCodeMap = readJson(LOCAL_CODE_KEY, {});
  const notesMap = readJson(LOCAL_NOTES_KEY, {});
  const bookmarks = readJson(LOCAL_BOOKMARKS_KEY, []);
  const lastLessonId = localStorage.getItem(LOCAL_LAST_KEY);

  const completeLesson = useCallback(
    async (lesson) => {
      const current = readJson(LOCAL_KEY, {});
      current[lesson.id] = { xp: lesson.xp, at: Date.now() };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(current));
      localStorage.setItem(LOCAL_LAST_KEY, lesson.id);
      refreshLocal();
    },
    [refreshLocal],
  );

  const rememberLesson = useCallback(
    async (lessonId) => {
      localStorage.setItem(LOCAL_LAST_KEY, lessonId);
      refreshLocal();
    },
    [refreshLocal],
  );

  const saveCode = useCallback(
    async (lessonId, code) => {
      const current = readJson(LOCAL_CODE_KEY, {});
      current[lessonId] = code;
      localStorage.setItem(LOCAL_CODE_KEY, JSON.stringify(current));
      refreshLocal();
    },
    [refreshLocal],
  );

  const saveNote = useCallback(
    async (lessonId, note) => {
      const current = readJson(LOCAL_NOTES_KEY, {});
      current[lessonId] = note;
      localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(current));
      refreshLocal();
    },
    [refreshLocal],
  );

  const toggleBookmark = useCallback(
    async (lessonId) => {
      const current = readJson(LOCAL_BOOKMARKS_KEY, []);
      const next = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];
      localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(next));
      refreshLocal();
    },
    [refreshLocal],
  );

  const addTime = useCallback(async () => {}, []);

  return {
    user,
    syncState: "local",
    remoteProgress: null,
    completedMap,
    savedCodeMap,
    notesMap,
    bookmarks,
    lastLessonId,
    completeLesson,
    rememberLesson,
    saveCode,
    saveNote,
    toggleBookmark,
    addTime,
  };
}
