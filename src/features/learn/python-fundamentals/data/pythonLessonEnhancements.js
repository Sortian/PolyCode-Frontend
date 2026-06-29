/** Per-lesson objectives, scenarios, and callouts merged into curriculum at build time. */

export const LESSON_ENHANCEMENTS = {
  "py-0": {
    objectives: [
      "Explain what Python is used for in data, web, and automation",
      "Write and run a one-line program with print()",
      "Describe why indentation is part of Python syntax",
    ],
    scenario:
      "Your team automates weekly reports. A short Python script replaces an hour of manual spreadsheet work — that's the kind of win this language enables.",
    prepend: [
      {
        type: "callout",
        variant: "info",
        content:
          "This course uses **Python 3**. Python 2 reached end-of-life in 2020 — always install Python 3.10 or newer.",
      },
    ],
  },
  "py-0b": {
    objectives: [
      "Run Python in the REPL and from a .py script",
      "Know when to use the PolyCode playground vs a local install",
      "Read error messages without panic",
    ],
    scenario:
      "You receive a `.py` file from a colleague. You need to run it locally and confirm the output before deploying it to a server.",
  },
  "py-1": {
    objectives: [
      "Create variables with meaningful names",
      "Distinguish int, float, str, and bool",
      "Use type() to inspect values",
    ],
    scenario:
      "A sensor sends temperature readings as strings. You store them as numbers so you can compute averages later.",
    prepend: [
      {
        type: "callout",
        variant: "tip",
        content:
          "Follow **PEP 8** naming: `snake_case` for variables and functions, `UPPER_CASE` for constants.",
      },
    ],
  },
  "py-1b": {
    objectives: [
      "Build strings with f-strings",
      "Use input() to read user text",
      "Concatenate and repeat strings safely",
    ],
    scenario:
      "A CLI tool greets users by name and prints a formatted invoice total with two decimal places.",
    prepend: [
      {
        type: "callout",
        variant: "warning",
        content:
          "Prefer **f-strings** over `%` formatting or `.format()` in new code — they are clearer and faster to write.",
      },
    ],
  },
  "py-2": {
    objectives: [
      "Write if / elif / else branches",
      "Compare values with ==, !=, <, >, <=, >=",
      "Nest conditions when logic requires it",
    ],
    scenario:
      "Shipping software applies free delivery when order total exceeds $50 and the customer is in the same country.",
  },
  "py-2b": {
    objectives: [
      "Combine conditions with and, or, and not",
      "Understand Python truthiness for empty collections",
      "Avoid redundant comparisons",
    ],
    scenario:
      "Login succeeds only when username is non-empty **and** password length is at least 8 characters.",
    prepend: [
      {
        type: "callout",
        variant: "warning",
        content:
          "Use `==` for value comparison. `is` checks **identity** (same object in memory) — rarely what you want for strings and numbers.",
      },
    ],
  },
  "py-3": {
    objectives: [
      "Create and mutate lists with append, extend, and pop",
      "Access elements by index (positive and negative)",
      "Know that lists are ordered and mutable",
    ],
    scenario:
      "A to-do app keeps tasks in a list — add at the end, remove completed items, reorder by priority.",
  },
  "py-3b": {
    objectives: [
      "Use tuples for fixed-size records",
      "Explain why tuples are immutable",
      "Unpack tuple values into variables",
    ],
    scenario:
      "GPS coordinates `(latitude, longitude)` should not change accidentally — a tuple protects that pair.",
  },
  "py-3c": {
    objectives: [
      "Slice sequences with start:stop:step",
      "Copy lists without sharing references",
      "Iterate over list elements",
    ],
    scenario:
      "You extract the last three log lines from a list and process them without modifying the original log.",
    prepend: [
      {
        type: "callout",
        variant: "warning",
        content:
          "`b = a` does not copy a list — both names point to the same list. Use `b = a.copy()` or `b = a[:]` for a shallow copy.",
      },
    ],
  },
  "py-4": {
    objectives: [
      "Write for loops over sequences and range()",
      "Use enumerate() when you need index and value",
      "Choose range bounds intentionally",
    ],
    scenario:
      "Process each row in a CSV-derived list and print a numbered summary for stakeholders.",
  },
  "py-4b": {
    objectives: [
      "Write while loops with a clear exit condition",
      "Use break and continue appropriately",
      "Avoid infinite loops",
    ],
    scenario:
      "A game loop keeps asking for input until the player types `quit` or exceeds three wrong guesses.",
  },
  "py-5": {
    objectives: [
      "Define functions with def and return",
      "Pass parameters and use default values safely",
      "Understand local vs global scope basics",
    ],
    scenario:
      "Extract a `calculate_tax(amount, rate)` function so three different reports reuse the same logic.",
    prepend: [
      {
        type: "callout",
        variant: "warning",
        content:
          "Never use a **mutable default** like `def f(items=[])`. The same list is reused across calls — use `items=None` and create a new list inside.",
      },
    ],
  },
  "py-6": {
    objectives: [
      "Create dicts with keys and values",
      "Read safely with .get() and set defaults",
      "Loop over keys, values, or items",
    ],
    scenario:
      "A product catalog maps SKU codes to prices — dict lookup is O(1) and far clearer than parallel lists.",
  },
  "py-6b": {
    objectives: [
      "Use sets for unique membership",
      "Perform union, intersection, and difference",
      "Remove duplicates from a list via set",
    ],
    scenario:
      "Analytics needs unique visitor IDs from a noisy log where the same user appears many times.",
  },
  "py-7": {
    objectives: [
      "Open files with with open(...) as f",
      "Read and write text files line by line",
      "Choose relative paths deliberately",
    ],
    scenario:
      "Nightly job reads `orders.txt`, counts lines, and writes a one-line summary to `report.txt`.",
    prepend: [
      {
        type: "callout",
        variant: "tip",
        content:
          "Always use `with open(...)` so files close automatically even if an error occurs.",
      },
    ],
  },
  "py-7b": {
    objectives: [
      "Catch exceptions with try / except",
      "Raise meaningful errors with raise",
      "Fail gracefully instead of crashing silently",
    ],
    scenario:
      "User enters non-numeric input for age — your script catches ValueError and asks again instead of exiting.",
  },
  "py-8": {
    objectives: [
      "Define a class with __init__ and methods",
      "Create instances and access attributes",
      "Explain encapsulation at a beginner level",
    ],
    scenario:
      "Model a `BankAccount` with deposit, withdraw, and balance — OOP groups data and behavior together.",
  },
  "py-8b": {
    objectives: [
      "Import modules and use qualified names",
      "Organize code across multiple .py files",
      "Guard script entry with if __name__ == \"__main__\"",
    ],
    scenario:
      "Split utilities into `helpers.py` and keep `main.py` thin — imports connect the pieces.",
  },
  "py-9": {
    objectives: [
      "Write list comprehensions for simple transforms",
      "Filter collections with an if clause",
      "Know when a plain loop is clearer",
    ],
    scenario:
      "Convert a list of Celsius temperatures to Fahrenheit in one expressive line for a notebook.",
  },
  "py-10": {
    objectives: [
      "Create a virtual environment with python -m venv",
      "Install packages with pip",
      "Keep project dependencies isolated",
    ],
    scenario:
      "Project A needs Pandas 2.x while Project B needs an older stack — venvs prevent version conflicts.",
  },
  "py-11": {
    objectives: [
      "Add basic type hints to functions",
      "Use pathlib for modern file paths",
      "Read JSON with the standard json module",
    ],
    scenario:
      "A config file in JSON drives script behavior — type hints and pathlib make the loader maintainable.",
  },
  "py-12": {
    objectives: [
      "Combine variables, loops, functions, and dicts in one script",
      "Print a formatted grade report from sample data",
      "Structure code for readability",
    ],
    scenario:
      "Teachers export scores as a dict of student → list of grades. Your capstone prints each average and class rank.",
  },
  "py-13": {
    objectives: [
      "Recall syntax for core Python constructs",
      "Pick the right collection for a task",
      "Use this lesson as ongoing reference",
    ],
    scenario:
      "You start a new notebook and keep this cheat sheet open while exploring an unfamiliar codebase.",
    prepend: [
      {
        type: "callout",
        variant: "tip",
        content:
          "Bookmark this lesson — it summarizes the entire course in one place before you move on to NumPy and Pandas.",
      },
    ],
  },
};

export function applyLessonEnhancements(lesson) {
  const meta = LESSON_ENHANCEMENTS[lesson.id];
  const objectives = meta?.objectives || [
    `Understand the core idea in "${lesson.title}"`,
    "Apply the Python patterns from this lesson in code",
    "Build habits that scale to data science and web projects",
  ];

  const prefix = [{ type: "objectives", items: objectives }];
  if (meta?.scenario) {
    prefix.push({ type: "scenario", content: meta.scenario });
  }
  if (meta?.prepend?.length) {
    prefix.push(...meta.prepend);
  }

  return {
    ...lesson,
    theory: [...prefix, ...lesson.theory, ...(meta?.append || [])],
  };
}

export function applyChapterEnhancements(chapters) {
  return chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map(applyLessonEnhancements),
  }));
}
