// PolyCode — NumPy (Python) curriculum — Chapter 1

export const NUMPY_CHAPTERS = [
  {
    id: "intro",
    title: "What is NumPy?",
    icon: "🔢",
    color: "#4f46e5",
    lessons: [
      {
        id: "numpy-1",
        title: "Lists vs NumPy Arrays",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "**NumPy** is the standard library for numerical computing in Python. Its core type is the **ndarray** — a fast, homogeneous array instead of a slow, flexible Python list.",
          },
          {
            type: "callout",
            variant: "info",
            content:
              "Use lists for mixed data and small scripts. Use NumPy when you need speed, vector math, and integration with data science tools (pandas, matplotlib, scikit-learn).",
          },
          {
            type: "code",
            lang: "python",
            label: "Python list",
            content: `numbers = [1, 2, 3, 4]
doubled = [n * 2 for n in numbers]
print(doubled)`,
          },
          {
            type: "code",
            lang: "python",
            label: "NumPy array",
            content: `import numpy as np

numbers = np.array([1, 2, 3, 4])
doubled = numbers * 2
print(doubled)`,
          },
          {
            type: "quiz",
            question: "What is the main NumPy container type?",
            options: ["list", "tuple", "ndarray", "dict"],
            answer: 2,
            explanation:
              "NumPy stores data in ndarrays (N-dimensional arrays), which are optimized for numeric operations.",
          },
        ],
        challenge: {
          title: "Import NumPy and Build an Array",
          description:
            "Import NumPy as `np`, create a 1D array from `[10, 20, 30]`, and print it.",
          starterCode: `# Import NumPy as np
# Create the array and print it

`,
          solutionCode: `import numpy as np

arr = np.array([10, 20, 30])
print(arr)`,
          tests: [
            {
              id: 1,
              label: "Imports numpy as np",
              hint: "import numpy as np",
              keywords: [{ pattern: "import\\s+numpy\\s+as\\s+np" }],
            },
            {
              id: 2,
              label: "Uses np.array",
              hint: "np.array([10, 20, 30])",
              keywords: [{ pattern: "np\\.array\\s*\\(" }],
            },
            {
              id: 3,
              label: "Prints the array",
              hint: "print(arr)",
              keywords: [{ pattern: "print\\s*\\(" }],
            },
          ],
        },
      },
      {
        id: "numpy-2",
        title: "Shape, dtype, and Vector Math",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "Every ndarray has a **shape** (dimensions) and **dtype** (element type). Vector operations apply to every element without writing a loop.",
          },
          {
            type: "diagram",
            title: "Array attributes",
            nodes: [
              {
                id: "shape",
                label: "shape",
                color: "#4f46e5",
                items: ["(4,) for 1D", "(2, 3) for 2D", "rows × cols"],
              },
              {
                id: "dtype",
                label: "dtype",
                color: "#10b981",
                items: ["int64", "float64", "bool"],
              },
            ],
          },
          {
            type: "code",
            lang: "python",
            label: "Shape and dtype",
            content: `import numpy as np

a = np.array([1, 2, 3, 4])
print(a.shape)
print(a.dtype)`,
          },
          {
            type: "callout",
            variant: "tip",
            content:
              "Expressions like `a + 10` or `a * 2` broadcast across all elements — this is the heart of NumPy performance.",
          },
          {
            type: "quiz",
            question: "What does `np.array([1,2,3]).shape` return for a 1D array?",
            options: ["(3, 1)", "(3,)", "(1, 3)", "3"],
            answer: 1,
            explanation: "A 1D array of length 3 has shape `(3,)`.",
          },
        ],
        challenge: {
          title: "Vector Operations",
          description:
            "Create `np.array([1, 2, 3, 4])`, add 100 to every element, and print the result and the array's `shape`.",
          starterCode: `import numpy as np

# Create array, add 100, print result and shape

`,
          solutionCode: `import numpy as np

a = np.array([1, 2, 3, 4])
result = a + 100
print(result)
print(result.shape)`,
          tests: [
            {
              id: 1,
              label: "Uses np.array",
              hint: "np.array([1, 2, 3, 4])",
              keywords: [{ pattern: "np\\.array\\s*\\(" }],
            },
            {
              id: 2,
              label: "Adds 100 to the array",
              hint: "a + 100",
              keywords: [{ pattern: "\\+\\s*100" }],
            },
            {
              id: 3,
              label: "Prints shape",
              hint: "print(...shape)",
              keywords: [
                { pattern: "\\.shape" },
                { pattern: "print\\s*\\(" },
              ],
            },
          ],
        },
      },
    ],
  },
];

export const NUMPY_LESSONS = NUMPY_CHAPTERS.flatMap((ch) =>
  ch.lessons.map((l) => ({
    ...l,
    chapterId: ch.id,
    chapterTitle: ch.title,
    chapterColor: ch.color,
  })),
);

export const NUMPY_TOTAL_XP = NUMPY_LESSONS.reduce((s, l) => s + l.xp, 0);
