# Python Fundamentals — Course Guide

## What is this course?

**Python Fundamentals** is PolyCode's core Python path: syntax, types, control flow, collections, functions, files, OOP basics, and modern habits. Theory uses objectives and scenarios; challenges run **real Python in the browser** (Pyodide).

**Live URL:** `/learn/python-fundamentals`

**Who it's for:** Complete beginners and anyone who wants a structured path before NumPy, Pandas, Matplotlib, or FastAPI.

---

## Folder structure

```
python-fundamentals/
├── COURSE_GUIDE.md
├── data/
├── hooks/
└── pages/
```

---

## What each file does

### `data/`

| File | What it holds |
|------|----------------|
| **pythonFundamentalsCurriculum.js** | Chapters, lessons, theory, quizzes, challenges. **Main content file.** |
| **pythonLessonEnhancements.js** | Per-lesson objectives, scenarios, warning/tip callouts. |
| **pythonFundamentalsVideoLinks.js** | Optional YouTube URL per lesson. |

### `hooks/`

| File | What it does |
|------|----------------|
| **usePythonFundamentalsProgress.js** | Tracks XP, completed lessons, saved code, bookmarks. |

### `pages/`

| File | What it does |
|------|----------------|
| **PythonFundamentalsHub.jsx** | Course landing page with learning path. |
| **PythonFundamentalsLessonPage.jsx** | One lesson: theory + challenge. |

---

## Borrowed from other folders

Same pattern as Matplotlib:

- **NumpyIntroTheory** + **PythonCodeChallenge** from `numpy-py/`
- **OopsSidebar** from `oops-cpp/`
- Shared helpers from `shared/` (read gate, challenge tab, certificate, etc.)

---

## Quick tips for editors

1. Lesson ids: `py-0` … `py-13` (22 lessons across 8 chapters)
2. Edit **`data/pythonFundamentalsCurriculum.js`** for lesson text and tasks
3. Edit **`data/pythonLessonEnhancements.js`** for objectives and scenarios
4. Edit **`data/pythonFundamentalsVideoLinks.js`** for video URLs
