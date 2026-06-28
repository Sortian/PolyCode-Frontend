export const REQUIRED_QUIZ_COUNT = 2;

export function quizAttemptsKey(storagePrefix, lessonId) {
  return `${storagePrefix}_quiz_attempts_${lessonId}`;
}

export function loadQuizAttempts(storagePrefix, lessonId) {
  if (!storagePrefix || !lessonId) return {};
  try {
    const raw = localStorage.getItem(quizAttemptsKey(storagePrefix, lessonId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordQuizAttempt(storagePrefix, lessonId, quizIndex, selectedIndex) {
  if (!storagePrefix || !lessonId) return;
  const key = quizAttemptsKey(storagePrefix, lessonId);
  const current = loadQuizAttempts(storagePrefix, lessonId);
  current[String(quizIndex)] = selectedIndex;
  localStorage.setItem(key, JSON.stringify(current));
}

export function countAttemptedQuizzes(attempts = {}, quizCount = REQUIRED_QUIZ_COUNT) {
  let count = 0;
  for (let index = 0; index < quizCount; index += 1) {
    if (attempts[String(index)] !== undefined) count += 1;
  }
  return count;
}

export function countQuizBlocks(theory = []) {
  return theory.filter((block) => block.type === "quiz").length;
}

function buildFallbackQuiz(lesson, slot) {
  const title = lesson?.title || "this lesson";
  const templates = [
    {
      question: `What is the main focus of **${title}**?`,
      options: [
        "The core idea taught in this lesson",
        "A topic unrelated to this course",
        "Something only experts need to know",
        "A deprecated pattern you should avoid",
      ],
      answer: 0,
      explanation: `This lesson is about **${title}**. The first option matches what you just studied.`,
    },
    {
      question: `Before moving on from **${title}**, you should be able to…`,
      options: [
        "Explain the idea in your own words",
        "Skip the coding challenge",
        "Ignore the examples in the lesson",
        "Memorize syntax without understanding why",
      ],
      answer: 0,
      explanation:
        "Understanding the idea — not just copying code — is what makes the challenge easier.",
    },
  ];

  return { ...templates[slot % templates.length], type: "quiz", _generated: true };
}

/**
 * Ensures every lesson has at least `minCount` MCQ blocks (appends topic-aware fallbacks).
 */
export function ensureMinimumQuizzes(theory = [], lesson = {}, minCount = REQUIRED_QUIZ_COUNT) {
  const blocks = [...theory];
  const existing = countQuizBlocks(blocks);
  if (existing >= minCount) return blocks;

  let slot = 0;
  while (countQuizBlocks(blocks) < minCount) {
    blocks.push(buildFallbackQuiz(lesson, slot));
    slot += 1;
  }
  return blocks;
}

export function prepareLessonQuizzes(lesson) {
  if (!lesson) return null;
  return {
    ...lesson,
    theory: ensureMinimumQuizzes(lesson.theory || [], lesson),
  };
}

export function mapTheoryWithQuizIndices(theory = []) {
  let quizIndex = -1;
  return theory.map((block, theoryIndex) => {
    if (block.type === "quiz") {
      quizIndex += 1;
      return { block, theoryIndex, quizIndex };
    }
    return { block, theoryIndex, quizIndex: null };
  });
}
