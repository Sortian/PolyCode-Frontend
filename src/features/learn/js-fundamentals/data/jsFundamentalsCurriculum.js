// PolyCode — JavaScript Fundamentals interactive course
// 5 chapters · 16 lessons · browser JavaScript challenges
// YouTube links: edit jsFundamentalsVideoLinks.js

import { applyLessonVideoLinks } from "../../shared/applyLessonVideoLinks";
import { JS_FUNDAMENTALS_VIDEO_LINKS } from "./jsFundamentalsVideoLinks";

const ACCENT = "#f59e0b";

function quiz(question, options, answer, explanation) {
  return { type: "quiz", question, options, answer, explanation };
}

function callout(variant, content) {
  return { type: "callout", variant, content };
}

function text(content, codeBlock = null) {
  if (codeBlock) {
    return {
      type: "text",
      content,
      code: { lang: "javascript", ...codeBlock },
    };
  }
  return { type: "text", content };
}

function diagram(title, nodes) {
  return { type: "diagram", title, nodes };
}

export const JS_FUNDAMENTALS_CHAPTERS = [
  {
    id: "intro",
    title: "What is JavaScript?",
    icon: "🟨",
    color: ACCENT,
    lessons: [
      {
        id: "js-0",
        title: "What is JavaScript?",
        xp: 10,
        theory: [
          text(
            "**JavaScript** (often shortened to **JS**) is the programming language that brings websites to life. HTML builds the structure of a page, CSS styles how it looks — and JavaScript decides **what happens** when users click, type, scroll, or submit a form.",
            {
              label: "A single line can show output",
              content: `console.log("Hello, PolyCode!");`,
            },
          ),
          text(
            "Think of JavaScript as the **brain** behind a web app. When you like a post, add an item to a cart, or see a live chat message appear — that's JavaScript reacting to events and updating the screen.",
            {
              label: "Variables store information",
              content: `const appName = "PolyCode";
const lessonCount = 16;
console.log(appName, "has", lessonCount, "lessons");`,
            },
          ),
          diagram("Where JavaScript runs today", [
            {
              id: "browser",
              label: "In the browser",
              color: ACCENT,
              items: ["Buttons & forms", "Animations", "Fetch data from APIs"],
            },
            {
              id: "node",
              label: "On the server",
              color: "#22c55e",
              items: ["Node.js APIs", "Build tools", "Automation scripts"],
            },
            {
              id: "apps",
              label: "Everywhere else",
              color: "#3b82f6",
              items: ["React & Vue apps", "Mobile (React Native)", "Desktop (Electron)"],
            },
          ]),
          text(
            "JavaScript was created in 1995 to make web pages interactive. Today it is one of the **most popular languages in the world** — not because it is the easiest, but because it runs almost everywhere and has a huge community building tools and tutorials.",
          ),
          callout(
            "tip",
            "Your first tool while learning: `console.log()`. It prints messages to the **console** — open DevTools with **F12** (or right-click → Inspect → Console) and watch your code speak.",
          ),
          callout(
            "info",
            "Don't confuse JavaScript with Java — they are completely different languages that happen to share part of the name.",
          ),
          quiz(
            "What is JavaScript mainly responsible for on a website?",
            [
              "Choosing fonts and colors only",
              "Page structure and headings",
              "Behavior, logic, and interactivity",
              "Storing files on the hard drive",
            ],
            2,
            "HTML = structure, CSS = style, JavaScript = behavior and logic.",
          ),
        ],
        challenge: {
          title: "Hello, PolyCode",
          description:
            "Use `console.log` to print exactly: `Hello, PolyCode!`",
          starterCode: `// Print your first message

`,
          solutionCode: `console.log("Hello, PolyCode!");`,
          tests: [
            {
              id: 1,
              label: "Uses console.log",
              hint: 'console.log("Hello, PolyCode!")',
              keywords: [{ pattern: "console\\.log\\s*\\(" }],
            },
            {
              id: 2,
              label: "Prints Hello, PolyCode!",
              hint: "Include the exact greeting text",
              keywords: [{ pattern: "Hello,\\s*PolyCode!" }],
            },
          ],
        },
      },
      {
        id: "js-1",
        title: "Running JavaScript",
        xp: 10,
        theory: [
          text(
            "Before you build big apps, you need a **place to run code**. As a beginner, you have three great options — all free.",
          ),
          diagram("Three ways to run JavaScript", [
            {
              id: "console",
              label: "Browser console",
              color: ACCENT,
              items: ["F12 → Console", "Paste & run instantly", "Best for tiny tests"],
            },
            {
              id: "playground",
              label: "PolyCode Playground",
              color: "#22c55e",
              items: ["Save snippets", "Course challenges", "Sign in to run"],
            },
            {
              id: "node",
              label: "Node.js terminal",
              color: "#3b82f6",
              items: ["node file.js", "Server-side JS", "Real project workflow"],
            },
          ]),
          text(
            "A **script** is just a file or block of JavaScript instructions. The engine reads from top to bottom, line by line. If line 2 uses a variable from line 1, order matters.",
            {
              label: "Two constants, one log",
              content: `const course = "JavaScript Fundamentals";
const platform = "PolyCode";
console.log("Learning", course, "on", platform);`,
            },
          ),
          text(
            "When you **declare** a variable, you create a named box in memory. `const` means the **label** cannot point to a different value later. `let` means you may reassign it.",
            {
              label: "const vs let in practice",
              content: `const startYear = 2024;
let progress = 0;
progress = 25; // OK with let
// startYear = 2025; // Error with const`,
            },
          ),
          callout(
            "tip",
            "Rule of thumb: use **const** by default. Switch to **let** only when you know the value must change (counters, loops, toggles).",
          ),
          callout(
            "warning",
            "Avoid **var** in new projects — it has confusing scoping rules that trip up beginners and pros alike.",
          ),
          quiz(
            "Which keyword should you use for a variable that will never be reassigned?",
            ["var", "let", "const", "define"],
            2,
            "const prevents reassignment and is the modern default.",
          ),
        ],
        challenge: {
          title: "Two-Line Intro",
          description:
            "Create `const course = \"JavaScript Fundamentals\"` and `const track = \"PolyCode\"`, then `console.log(course, track)`.",
          starterCode: `// const course and track, then log both

`,
          solutionCode: `const course = "JavaScript Fundamentals";
const track = "PolyCode";
console.log(course, track);`,
          tests: [
            {
              id: 1,
              label: "Declares course with const",
              keywords: [{ pattern: "const\\s+course\\s*=" }],
            },
            {
              id: 2,
              label: "Declares track with const",
              keywords: [{ pattern: "const\\s+track\\s*=" }],
            },
            {
              id: 3,
              label: "Logs both variables",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*course\\s*,\\s*track\\s*\\)" }],
            },
          ],
        },
      },
      {
        id: "js-2",
        title: "Values & typeof",
        xp: 12,
        theory: [
          text(
            "Every piece of data in JavaScript has a **type**. Types tell the engine what operations make sense — you can add two numbers, but adding a number to a sentence works differently (sometimes surprisingly!).",
          ),
          text(
            "**Primitives** are simple single values: string, number, boolean, undefined, null, symbol, and bigint. **Objects** group related data — arrays, plain objects, dates, and functions are all objects.",
            {
              label: "Common types you'll use daily",
              content: `console.log(typeof "PolyCode");  // string
console.log(typeof 42);          // number
console.log(typeof true);        // boolean
console.log(typeof undefined);   // undefined`,
            },
          ),
          diagram("Primitive vs object (simple view)", [
            {
              id: "prim",
              label: "Primitives",
              color: ACCENT,
              items: ["\"hello\" (text)", "42 (number)", "true / false"],
            },
            {
              id: "obj",
              label: "Objects",
              color: "#f97316",
              items: ["[1, 2, 3] arrays", "{ name: \"Ali\" }", "functions"],
            },
          ]),
          text(
            "Use **`typeof`** to inspect a value at runtime. It's handy when debugging: \"Why did my math break?\" — often because something is a string instead of a number.",
            {
              label: "Watch out: typeof null",
              content: `console.log(typeof null); // "object" (historic quirk)
console.log(null === null); // true — use this to check for null`,
            },
          ),
          callout(
            "info",
            "Strings use quotes: `\"double\"` or `'single'`. Numbers never need quotes: `42`, `3.14`, `-7`.",
          ),
          callout(
            "tip",
            "**undefined** means \"no value assigned yet.\" **null** means \"intentionally empty.\" Both mean \"nothing useful here\" but for different reasons.",
          ),
          quiz(
            "What does typeof 42 return?",
            ["string", "number", "boolean", "object"],
            1,
            "All numeric values — integers and decimals — have type \"number\" in JavaScript.",
          ),
        ],
        challenge: {
          title: "Type Detective",
          description:
            "Log `typeof` for: `\"PolyCode\"`, `100`, and `false` on separate `console.log` lines.",
          starterCode: `// Log typeof for a string, number, and boolean

`,
          solutionCode: `console.log(typeof "PolyCode");
console.log(typeof 100);
console.log(typeof false);`,
          tests: [
            {
              id: 1,
              label: "Logs typeof string",
              keywords: [{ pattern: "typeof\\s+[\"']PolyCode[\"']" }],
            },
            {
              id: 2,
              label: "Logs typeof number",
              keywords: [{ pattern: "typeof\\s+100" }],
            },
            {
              id: 3,
              label: "Logs typeof boolean",
              keywords: [{ pattern: "typeof\\s+false" }],
            },
          ],
        },
      },
    ],
  },
  {
    id: "variables",
    title: "Variables & Logic",
    icon: "🔤",
    color: "#eab308",
    lessons: [
      {
        id: "js-3",
        title: "let, const & naming",
        xp: 12,
        theory: [
          text(
            "Variables are **named containers** for data. Good names make code read like English: `userScore`, `isLoggedIn`, `courseTitle` — not `x`, `temp`, `data2`.",
          ),
          text(
            "JavaScript gives you three declaration keywords. In **modern code**, you only need two:",
            {
              label: "const, let, and why skip var",
              content: `const MAX_LESSONS = 16;  // won't change
let completed = 0;         // will increase
completed = completed + 1;
// var oldStyle = 1;       // avoid in new code`,
            },
          ),
          diagram("When to use const vs let", [
            {
              id: "const",
              label: "Use const",
              color: "#22c55e",
              items: ["App name", "API URLs", "User object reference"],
            },
            {
              id: "let",
              label: "Use let",
              color: ACCENT,
              items: ["Loop counters", "Running totals", "Current step index"],
            },
          ]),
          text(
            "**Naming tips:** use camelCase (`firstName`), start with a letter, no spaces. Constants that are truly fixed are often UPPER_SNAKE (`MAX_RETRIES`), but regular camelCase is fine too.",
            {
              label: "Readable names in a mini app",
              content: `const courseTitle = "JavaScript Fundamentals";
let lessonsCompleted = 0;
let xpEarned = 0;
lessonsCompleted = 1;
xpEarned = 10;
console.log(courseTitle, lessonsCompleted, xpEarned);`,
            },
          ),
          callout(
            "tip",
            "If you get \"Assignment to constant variable\", you tried to reassign a `const`. Either use `let` or create a new variable instead.",
          ),
          quiz(
            "Best default choice for a variable that won't change?",
            ["var", "let", "const", "function"],
            2,
            "Start with const — switch to let only when reassignment is required.",
          ),
        ],
        challenge: {
          title: "Score Tracker",
          description:
            "Use `let score = 0`, then `score = 75`, then `console.log(score)`.",
          starterCode: `// let score, update it, log it

`,
          solutionCode: `let score = 0;
score = 75;
console.log(score);`,
          tests: [
            { id: 1, label: "Uses let score", keywords: [{ pattern: "let\\s+score\\s*=" }] },
            { id: 2, label: "Assigns 75 to score", keywords: [{ pattern: "score\\s*=\\s*75" }] },
            { id: 3, label: "Logs score", keywords: [{ pattern: "console\\.log\\s*\\(\\s*score\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-4",
        title: "Operators & strings",
        xp: 12,
        theory: [
          text(
            "**Operators** let you compute and compare values. Arithmetic: `+ - * / %`. Comparison: `=== !== > < >= <=`. Logical: `&&` (and), `||` (or), `!` (not).",
          ),
          text(
            "**Strings** are text in quotes. The `+` operator joins strings together — called **concatenation**. Template literals (backticks) are the modern, cleaner way to build messages with variables inside.",
            {
              label: "Old way vs template literal",
              content: `const name = "Sara";
const oldWay = "Hello, " + name + "!";
const newWay = \`Hello, \${name}!\`;
console.log(oldWay);
console.log(newWay);`,
            },
          ),
          text(
            "Inside backticks, use dollar-braces to insert any value — numbers, variables, or even math like price times 1.17.",
            {
              label: "Template literal with math",
              content: `const item = "Course";
const price = 49;
console.log(\`\${item}: $\${price} USD\`);`,
            },
          ),
          callout(
            "warning",
            "Use **===** (strict equality), not **==**. Strict checks value **and** type — so `5 === \"5\"` is false, which prevents subtle bugs.",
          ),
          callout(
            "tip",
            "When `+` sees a string, it may convert numbers to text. `\"5\" + 2` gives `\"52\"`, not `7`. Convert with `Number(\"5\")` when doing math.",
          ),
          quiz(
            "Which operator checks both value and type?",
            ["==", "===", "=", "!==="],
            1,
            "=== is strict equality — the one you should use by default.",
          ),
        ],
        challenge: {
          title: "Personal Greeting",
          description:
            'Set const name = "YourName" (any name), then log a template literal: Hello, plus the name in backticks.',
          starterCode: `const name = "YourName";
// console.log with template literal

`,
          solutionCode: `const name = "YourName";
console.log(\`Hello, \${name}!\`);`,
          tests: [
            { id: 1, label: "Uses const name", keywords: [{ pattern: "const\\s+name\\s*=" }] },
            { id: 2, label: "Uses template literal", keywords: [{ pattern: "`Hello,\\s*\\$\\{name\\}!`" }] },
            { id: 3, label: "Uses console.log", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
      {
        id: "js-5",
        title: "if / else",
        xp: 14,
        theory: [
          text(
            "Programs rarely do the same thing every time. **Conditionals** let your code choose a path: \"If the user is logged in, show the dashboard — otherwise show login.\"",
          ),
          text(
            "The **if / else if / else** chain checks conditions top to bottom. The **first true branch** runs; the rest are skipped.",
            {
              label: "Grading example",
              content: `const score = 82;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Keep practicing!");
}`,
            },
          ),
          text(
            "The **ternary operator** is a one-line if/else for simple cases: `condition ? valueIfTrue : valueIfFalse`.",
            {
              label: "Ternary for pass/fail",
              content: `const score = 65;
const result = score >= 60 ? "Pass" : "Fail";
console.log(result);`,
            },
          ),
          diagram("How if / else chooses a path", [
            {
              id: "check",
              label: "Check condition",
              color: ACCENT,
              items: ["score >= 60?", "user logged in?", "cart empty?"],
            },
            {
              id: "true",
              label: "If true",
              color: "#22c55e",
              items: ["Run block A", "Skip other branches"],
            },
            {
              id: "false",
              label: "If false",
              color: "#ef4444",
              items: ["Try else if", "Or run else block"],
            },
          ]),
          callout(
            "tip",
            "Keep conditions **readable**: `isActive && hasPermission` is clearer than nesting five if statements.",
          ),
          quiz(
            "What runs when score is 85 in: if (score >= 90) ... else if (score >= 80) ...?",
            ["First branch (A)", "Second branch (B)", "else branch", "Nothing"],
            1,
            "85 is not >= 90, but it is >= 80 — so the second branch runs.",
          ),
        ],
        challenge: {
          title: "Pass or Fail",
          description:
            "Given `const score = 65`, log `\"Pass\"` if `score >= 60`, else log `\"Fail\"`.",
          starterCode: `const score = 65;
// if / else and console.log

`,
          solutionCode: `const score = 65;
if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}`,
          tests: [
            { id: 1, label: "Uses if", keywords: [{ pattern: "if\\s*\\(" }] },
            { id: 2, label: "Checks score >= 60", keywords: [{ pattern: "score\\s*>=\\s*60" }] },
            { id: 3, label: "Logs Pass", keywords: [{ pattern: "[\"']Pass[\"']" }] },
          ],
        },
      },
      {
        id: "js-6",
        title: "Loops",
        xp: 14,
        theory: [
          text(
            "Loops **repeat code** without copy-pasting it fifty times. Use them for lists, counting, summing, searching — any job that says \"for each\" or \"until done.\"",
          ),
          text(
            "The classic **for** loop has three parts: start (`let i = 0`), condition (`i < 5`), step (`i++`). Together they control how many times the body runs.",
            {
              label: "Count 1 to 5",
              content: `for (let i = 1; i <= 5; i++) {
  console.log("Step", i);
}`,
            },
          ),
          text(
            "**for...of** is the friendly way to visit **each item** in an array — you don't need the index unless you want it.",
            {
              label: "Sum an array with for...of",
              content: `const scores = [10, 20, 30];
let total = 0;
for (const score of scores) {
  total += score;
}
console.log(total); // 60`,
            },
          ),
          text(
            "**while** loops repeat as long as a condition stays true. Use them when you don't know the exact count upfront.",
            {
              label: "while countdown",
              content: `let n = 3;
while (n > 0) {
  console.log(n);
  n--;
}`,
            },
          ),
          callout(
            "tip",
            "Prefer **for...of** when looping arrays in modern JavaScript — it's shorter and harder to mess up than manual index math.",
          ),
          callout(
            "warning",
            "Infinite loops freeze the tab: if the condition never becomes false, the loop never stops. Always move toward the exit (increment `i`, decrement `n`, etc.).",
          ),
          quiz(
            "Which loop is best for visiting every item in an array?",
            ["for (classic with index only)", "for...of", "while with no array", "switch"],
            1,
            "for...of reads each element directly — clean and readable.",
          ),
        ],
        challenge: {
          title: "Sum to Ten",
          description:
            "Use a `for` loop to add numbers 1 through 10 into `sum`, then `console.log(sum)` (should print 55).",
          starterCode: `let sum = 0;
// for loop 1 to 10

`,
          solutionCode: `let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}
console.log(sum);`,
          tests: [
            { id: 1, label: "Uses for loop", keywords: [{ pattern: "for\\s*\\(" }] },
            { id: 2, label: "Adds to sum", keywords: [{ pattern: "sum\\s*\\+=" }] },
            { id: 3, label: "Logs sum", keywords: [{ pattern: "console\\.log\\s*\\(\\s*sum\\s*\\)" }] },
          ],
        },
      },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    icon: "⚡",
    color: "#f97316",
    lessons: [
      {
        id: "js-7",
        title: "Function basics",
        xp: 14,
        theory: [
          text(
            "A **function** is a reusable recipe: name it once, run it whenever you need. Functions cut duplication and make programs easier to read and test.",
          ),
          text(
            "Define with the **function** keyword, then **call** it with parentheses. **Parameters** go inside the definition; **arguments** are the actual values you pass when calling.",
            {
              label: "Define, call, return",
              content: `function add(a, b) {
  return a + b;
}

const result = add(3, 5);
console.log(result); // 8`,
            },
          ),
          text(
            "**return** sends a value back to whoever called the function. Without `return`, the function gives back `undefined`.",
            {
              label: "With and without return",
              content: `function greet(name) {
  console.log("Hi", name); // prints only
}

function makeGreeting(name) {
  return "Hi " + name; // gives back a string
}

const msg = makeGreeting("Sara");
console.log(msg);`,
            },
          ),
          diagram("Function flow", [
            {
              id: "call",
              label: "You call it",
              color: ACCENT,
              items: ["add(3, 5)", "Pass arguments in"],
            },
            {
              id: "run",
              label: "Body runs",
              color: "#f97316",
              items: ["Use parameters a, b", "Compute result"],
            },
            {
              id: "return",
              label: "Return value",
              color: "#22c55e",
              items: ["Caller gets 8", "Store in a variable"],
            },
          ]),
          callout(
            "tip",
            "One function = one job. `calculateTax` shouldn't also send emails. Small, focused functions are easier to debug.",
          ),
          quiz(
            "What keyword sends a value back from a function?",
            ["print", "return", "export", "send"],
            1,
            "return passes a value to the caller — console.log only displays, it doesn't return to your variable.",
          ),
        ],
        challenge: {
          title: "Multiply",
          description:
            "Write `function multiply(a, b)` that returns `a * b`, then `console.log(multiply(4, 6))`.",
          starterCode: `// function multiply and log result

`,
          solutionCode: `function multiply(a, b) {
  return a * b;
}
console.log(multiply(4, 6));`,
          tests: [
            { id: 1, label: "Defines multiply", keywords: [{ pattern: "function\\s+multiply\\s*\\(" }] },
            { id: 2, label: "Returns product", keywords: [{ pattern: "return\\s+a\\s*\\*\\s*b" }] },
            { id: 3, label: "Calls multiply(4, 6)", keywords: [{ pattern: "multiply\\s*\\(\\s*4\\s*,\\s*6\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-8",
        title: "Arrow functions",
        xp: 14,
        theory: [
          text(
            "**Arrow functions** are a shorter way to write functions, introduced in ES6. They are everywhere in modern React, Node, and array methods like `.map()`.",
          ),
          text(
            "Syntax: `(parameters) => expression` or `(parameters) => { statements }`. When the body is one expression, you can skip `return` and curly braces.",
            {
              label: "Classic vs arrow",
              content: `function doubleClassic(n) {
  return n * 2;
}

const doubleArrow = (n) => n * 2;

console.log(doubleClassic(4));
console.log(doubleArrow(4));`,
            },
          ),
          text(
            "Arrow functions shine as **callbacks** — small functions you pass into `.map`, `.filter`, or event handlers.",
            {
              label: "Arrow inside map",
              content: `const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
console.log(doubled);`,
            },
          ),
          callout(
            "info",
            "For learning, classic `function` and arrow functions both work. In real projects you'll see arrows more often in UI and data code.",
          ),
          callout(
            "tip",
            "If the body needs multiple lines, use curly braces and an explicit `return`: `(n) => { const x = n * 2; return x; }`",
          ),
          quiz(
            "Which is an arrow function?",
            [
              "function add(a, b) { return a + b; }",
              "const add = (a, b) => a + b;",
              "arrow add(a, b)",
              "fn => add",
            ],
            1,
            "The => syntax defines an arrow function assigned to a const.",
          ),
        ],
        challenge: {
          title: "Square It",
          description:
            "Create `const square = (n) => n * n` and log `square(9)`.",
          starterCode: `// arrow function square

`,
          solutionCode: `const square = (n) => n * n;
console.log(square(9));`,
          tests: [
            { id: 1, label: "Arrow function square", keywords: [{ pattern: "const\\s+square\\s*=" }] },
            { id: 2, label: "Returns n * n", keywords: [{ pattern: "n\\s*\\*\\s*n" }] },
            { id: 3, label: "Calls square(9)", keywords: [{ pattern: "square\\s*\\(\\s*9\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-9",
        title: "Parameters & return",
        xp: 16,
        theory: [
          text(
            "Functions become powerful when you combine **parameters**, **default values**, and **return** to build small tools your whole app can reuse.",
          ),
          text(
            "**Default parameters** fill in missing arguments: `function greet(name = \"Guest\")` — if you call `greet()` with nothing, name becomes `\"Guest\"`.",
            {
              label: "Defaults in action",
              content: `function greet(name = "Guest", excited = false) {
  const msg = \`Hello, \${name}!\`;
  return excited ? msg.toUpperCase() : msg;
}

console.log(greet());
console.log(greet("Ali", true));`,
            },
          ),
          text(
            "Real-world functions often **transform input → output** without side effects: same input always gives same output. That makes them predictable and testable.",
            {
              label: "Temperature converter",
              content: `function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32;
}

console.log(celsiusToFahrenheit(0));   // 32
console.log(celsiusToFahrenheit(100)); // 212`,
            },
          ),
          diagram("Parameter → return pipeline", [
            {
              id: "in",
              label: "Input",
              color: ACCENT,
              items: ["Arguments passed in", "Types matter for math"],
            },
            {
              id: "work",
              label: "Function body",
              color: "#f97316",
              items: ["Validate", "Calculate", "Build string"],
            },
            {
              id: "out",
              label: "Output",
              color: "#22c55e",
              items: ["return value", "Used by caller"],
            },
          ]),
          callout(
            "tip",
            "Name parameters clearly: `celsius` not `c` is fine in tiny examples, but `celsius` reads better in team code.",
          ),
          quiz(
            "What happens when you call greet() if greet(name = \"Guest\")?",
            [
              "Error — missing argument",
              "name is undefined",
              "name becomes \"Guest\"",
              "Function skips the body",
            ],
            2,
            "Default parameters apply when the argument is missing or undefined.",
          ),
        ],
        challenge: {
          title: "Temperature Convert",
          description:
            "Write `celsiusToFahrenheit(c)` returning `c * 9/5 + 32`, log result for `25`.",
          starterCode: `// celsiusToFahrenheit function

`,
          solutionCode: `function celsiusToFahrenheit(c) {
  return c * 9 / 5 + 32;
}
console.log(celsiusToFahrenheit(25));`,
          tests: [
            { id: 1, label: "Defines function", keywords: [{ pattern: "function\\s+celsiusToFahrenheit" }] },
            { id: 2, label: "Uses return", keywords: [{ pattern: "return" }] },
            { id: 3, label: "Calls with 25", keywords: [{ pattern: "celsiusToFahrenheit\\s*\\(\\s*25\\s*\\)" }] },
          ],
        },
      },
    ],
  },
  {
    id: "data",
    title: "Arrays & Objects",
    icon: "📦",
    color: "#fb923c",
    lessons: [
      {
        id: "js-10",
        title: "Arrays",
        xp: 14,
        theory: [
          text(
            "An **array** is an ordered list: `[\"apple\", \"banana\", \"cherry\"]`. Index starts at **0** — first item is `arr[0]`, second is `arr[1]`.",
          ),
          text(
            "Arrays are perfect for collections: scores, names, cart items. Length is `arr.length`. Add to the end with `.push()`.",
            {
              label: "Create, access, push",
              content: `const fruits = ["apple", "banana"];
console.log(fruits[0]); // apple
fruits.push("cherry");
console.log(fruits.length); // 3`,
            },
          ),
          text(
            "**.map()** creates a **new array** by transforming each item. It does not change the original — great for safe data pipelines.",
            {
              label: "Double every score",
              content: `const scores = [10, 20, 30];
const doubled = scores.map((score) => score * 2);
console.log(doubled);   // [20, 40, 60]
console.log(scores);    // [10, 20, 30] unchanged`,
            },
          ),
          diagram("Array methods you'll use constantly", [
            {
              id: "map",
              label: "map",
              color: ACCENT,
              items: ["Transform each item", "Same length output"],
            },
            {
              id: "filter",
              label: "filter",
              color: "#f97316",
              items: ["Keep some items", "Test each element"],
            },
            {
              id: "find",
              label: "find",
              color: "#22c55e",
              items: ["First match", "Or undefined"],
            },
          ]),
          callout(
            "tip",
            "The callback in `.map((n) => n * 2)` can use parentheses around a single parameter — or omit them: `n => n * 2`.",
          ),
          quiz(
            "What does [1,2,3].map(n => n * 2) produce?",
            ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "6"],
            1,
            "map applies the function to each element and collects results in a new array.",
          ),
        ],
        challenge: {
          title: "Double the List",
          description:
            "Given `const scores = [10, 20, 30]`, use `.map()` to double each value into `doubled`, then log `doubled`.",
          starterCode: `const scores = [10, 20, 30];
// map to doubled and log

`,
          solutionCode: `const scores = [10, 20, 30];
const doubled = scores.map((n) => n * 2);
console.log(doubled);`,
          tests: [
            { id: 1, label: "Uses .map(", keywords: [{ pattern: "\\.map\\s*\\(" }] },
            { id: 2, label: "Stores in doubled", keywords: [{ pattern: "const\\s+doubled" }] },
            { id: 3, label: "Logs doubled", keywords: [{ pattern: "console\\.log\\s*\\(\\s*doubled\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-11",
        title: "filter & find",
        xp: 16,
        theory: [
          text(
            "**.filter()** builds a new array with only the items that pass a test. Think: \"Give me all scores above 70\" or \"Show only active users.\"",
            {
              label: "Filter passing grades",
              content: `const scores = [55, 72, 88, 91];
const passing = scores.filter((s) => s >= 70);
console.log(passing); // [72, 88, 91]`,
            },
          ),
          text(
            "**.find()** returns the **first** item that matches — or `undefined` if nothing matches. Use it when you expect one result, not a list.",
            {
              label: "Find first A grade",
              content: `const students = [
  { name: "Ali", grade: "B" },
  { name: "Sara", grade: "A" },
  { name: "Mo", grade: "C" },
];
const star = students.find((s) => s.grade === "A");
console.log(star.name); // Sara`,
            },
          ),
          diagram("filter vs find", [
            {
              id: "filter",
              label: "filter",
              color: ACCENT,
              items: ["Returns an array", "0 to many items", "Keep all matches"],
            },
            {
              id: "find",
              label: "find",
              color: "#f97316",
              items: ["Returns one item", "Or undefined", "Stops at first match"],
            },
          ]),
          callout(
            "tip",
            "Chain methods carefully: `scores.filter(s => s >= 70).map(s => s + 5)` — filter first, then transform the survivors.",
          ),
          quiz(
            "You want ALL products under $20. Which method?",
            ["find", "filter", "map", "push"],
            1,
            "filter keeps every item that passes the price test.",
          ),
        ],
        challenge: {
          title: "High Scorers",
          description:
            "From `const scores = [40, 75, 82, 91]`, filter scores `>= 80` into `top`, then log `top`.",
          starterCode: `const scores = [40, 75, 82, 91];
// filter into top

`,
          solutionCode: `const scores = [40, 75, 82, 91];
const top = scores.filter((s) => s >= 80);
console.log(top);`,
          tests: [
            { id: 1, label: "Uses filter", keywords: [{ pattern: "\\.filter\\s*\\(" }] },
            { id: 2, label: "Checks >= 80", keywords: [{ pattern: ">=\\s*80" }] },
            { id: 3, label: "Logs top", keywords: [{ pattern: "console\\.log\\s*\\(\\s*top\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-12",
        title: "Objects",
        xp: 14,
        theory: [
          text(
            "An **object** groups related fields under one name — like a profile card or product record. Keys (properties) map to values.",
          ),
          text(
            "Create with curly braces. Read with **dot notation** (`user.name`) or **bracket notation** (`user[\"name\"]`) when the key is dynamic.",
            {
              label: "User profile object",
              content: `const user = {
  name: "Ali",
  role: "student",
  xp: 120,
  isActive: true,
};

console.log(user.name);
console.log(user["xp"]);`,
            },
          ),
          text(
            "Objects can nest — an array inside an object, an object inside an array. That's how JSON APIs send real app data.",
            {
              label: "Course with lessons array",
              content: `const course = {
  title: "JS Fundamentals",
  lessons: ["Variables", "Functions", "Arrays"],
};
console.log(course.lessons.length);
console.log(course.lessons[0]);`,
            },
          ),
          callout(
            "tip",
            "Use objects when you have **named fields**. Use arrays when you have an **ordered list** of similar items.",
          ),
          callout(
            "info",
            "JSON (JavaScript Object Notation) is the text format APIs use — it looks almost exactly like object/array literals.",
          ),
          quiz(
            "How do you read the name field from const user = { name: \"Ali\" }?",
            ["user[name]", "user->name", "user.name", "name.user"],
            2,
            "Dot notation: objectName.propertyName",
          ),
        ],
        challenge: {
          title: "Course Card",
          description:
            'Create `const course = { title: "JS Fundamentals", level: "Beginner" }` and log `course.title` and `course.level`.',
          starterCode: `// course object and two console.log lines

`,
          solutionCode: `const course = { title: "JS Fundamentals", level: "Beginner" };
console.log(course.title);
console.log(course.level);`,
          tests: [
            { id: 1, label: "Defines course object", keywords: [{ pattern: "const\\s+course\\s*=\\s*\\{" }] },
            { id: 2, label: "Logs course.title", keywords: [{ pattern: "course\\.title" }] },
            { id: 3, label: "Logs course.level", keywords: [{ pattern: "course\\.level" }] },
          ],
        },
      },
      {
        id: "js-13",
        title: "Destructuring",
        xp: 16,
        theory: [
          text(
            "**Destructuring** unpacks values from arrays or properties from objects into separate variables — less typing, cleaner function arguments.",
          ),
          text(
            "Object destructuring pulls fields by name. Array destructuring pulls by position.",
            {
              label: "Object and array destructuring",
              content: `const user = { name: "Mo", score: 88 };
const { name, score } = user;

const colors = ["red", "green", "blue"];
const [first, second] = colors;

console.log(name, score);
console.log(first, second);`,
            },
          ),
          text(
            "You can destructure **function parameters** so callers pass one object instead of remembering argument order.",
            {
              label: "Destructuring in parameters",
              content: `function printLesson({ title, xp }) {
  console.log(title, "+", xp, "XP");
}

printLesson({ title: "Loops", xp: 14 });`,
            },
          ),
          callout(
            "tip",
            "Rename while destructuring: `const { name: userName } = user` — handy when names collide.",
          ),
          quiz(
            "What does const { title } = lesson extract?",
            [
              "The whole lesson array",
              "Only the title property",
              "Every property as strings",
              "Nothing — syntax error always",
            ],
            1,
            "Curly braces destructure matching property names from the object.",
          ),
        ],
        challenge: {
          title: "Unpack the Object",
          description:
            "Given `const lesson = { id: 1, title: \"Loops\" }`, destructure `title` and log it.",
          starterCode: `const lesson = { id: 1, title: "Loops" };
// destructure title and log

`,
          solutionCode: `const lesson = { id: 1, title: "Loops" };
const { title } = lesson;
console.log(title);`,
          tests: [
            { id: 1, label: "Destructures title", keywords: [{ pattern: "\\{\\s*title\\s*\\}" }] },
            { id: 2, label: "Logs title", keywords: [{ pattern: "console\\.log\\s*\\(\\s*title\\s*\\)" }] },
          ],
        },
      },
    ],
  },
  {
    id: "capstone",
    title: "Put It Together",
    icon: "🏁",
    color: "#ea580c",
    lessons: [
      {
        id: "js-14",
        title: "Mini to-do list",
        xp: 20,
        theory: [
          text(
            "Real apps combine **arrays**, **objects**, and **functions**. A to-do list is the classic mini-project: store tasks, add new ones, mark done, remove finished items.",
          ),
          text(
            "**.push()** adds to the end of an array. **.filter()** can remove items by keeping only what you want. **.length** tells you how many items exist.",
            {
              label: "Grow a task list",
              content: `const tasks = ["Read theory", "Try challenge"];
tasks.push("Review notes");
console.log(tasks);
console.log("Total tasks:", tasks.length);`,
            },
          ),
          text(
            "Later you'll store tasks as **objects** `{ text: \"Learn map\", done: false }` — but the same array methods still apply.",
            {
              label: "Tasks as objects (preview)",
              content: `const tasks = [
  { text: "Learn variables", done: true },
  { text: "Learn functions", done: false },
];
const open = tasks.filter((t) => !t.done);
console.log(open.length, "still to do");`,
            },
          ),
          diagram("Building blocks you already know", [
            {
              id: "arr",
              label: "Array",
              color: ACCENT,
              items: ["Hold the list", "push to add"],
            },
            {
              id: "fn",
              label: "Functions",
              color: "#f97316",
              items: ["addTask()", "removeTask()"],
            },
            {
              id: "logic",
              label: "Logic",
              color: "#22c55e",
              items: ["if item done", "filter & map"],
            },
          ]),
          callout(
            "tip",
            "Start simple: an array of strings works. Upgrade to objects when you need \"done\" flags and due dates.",
          ),
          quiz(
            "Which method adds an item to the end of an array?",
            ["filter", "find", "push", "map"],
            2,
            "push mutates the array and returns the new length.",
          ),
        ],
        challenge: {
          title: "Task Manager",
          description:
            "Start with `const tasks = [\"Learn JS\"]`, push `\"Build project\"`, then log `tasks.length` (should be 2).",
          starterCode: `const tasks = ["Learn JS"];
// push another task and log length

`,
          solutionCode: `const tasks = ["Learn JS"];
tasks.push("Build project");
console.log(tasks.length);`,
          tests: [
            { id: 1, label: "Starts with tasks array", keywords: [{ pattern: "const\\s+tasks\\s*=" }] },
            { id: 2, label: "Uses push", keywords: [{ pattern: "tasks\\.push\\s*\\(" }] },
            { id: 3, label: "Logs tasks.length", keywords: [{ pattern: "console\\.log\\s*\\(\\s*tasks\\.length\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-15",
        title: "Course recap",
        xp: 20,
        theory: [
          text(
            "Congratulations — you've walked through the **core JavaScript toolkit**: values, variables, decisions, loops, functions, arrays, and objects. That's the foundation every web developer builds on.",
          ),
          diagram("Your JavaScript journey so far", [
            {
              id: "a",
              label: "Basics",
              color: ACCENT,
              items: ["const / let", "if & loops", "typeof & operators"],
            },
            {
              id: "b",
              label: "Functions",
              color: "#f97316",
              items: ["return", "arrow functions", "default params"],
            },
            {
              id: "c",
              label: "Data",
              color: "#fb923c",
              items: ["map / filter / find", "objects", "destructuring"],
            },
          ]),
          text(
            "**What to learn next in PolyCode:** DOM & Events (make pages interactive), Async JavaScript (fetch data from servers), then Node.js or React — each builds directly on what you practiced here.",
            {
              label: "Combine skills in one snippet",
              content: `const lessons = [
  { title: "Variables", done: true },
  { title: "Functions", done: true },
  { title: "Arrays", done: false },
];

const completed = lessons.filter((l) => l.done).map((l) => l.title);
console.log("Finished:", completed.join(", "));`,
            },
          ),
          callout(
            "tip",
            "Revisit challenges you found hard — repetition with small edits (change numbers, add a field) is how concepts stick.",
          ),
          callout(
            "info",
            "The Docs Hub **JavaScript certificate path** goes deeper on web APIs and frameworks. This course gave you the hands-on coding base.",
          ),
          quiz(
            "Which method transforms every array element?",
            ["filter", "find", "map", "push"],
            2,
            "map() returns a new array with each element transformed.",
          ),
        ],
        challenge: {
          title: "Graduation Script",
          description:
            'Create const graduate as an arrow function that returns a congrats message with the name, then log graduate("You").',
          starterCode: `// arrow function graduate and log graduate("You")

`,
          solutionCode: `const graduate = (name) => \`Congrats, \${name}! You finished JS Fundamentals.\`;
console.log(graduate("You"));`,
          tests: [
            { id: 1, label: "Defines graduate", keywords: [{ pattern: "const\\s+graduate\\s*=" }] },
            { id: 2, label: "Uses template literal", keywords: [{ pattern: "Congrats" }] },
            { id: 3, label: 'Calls graduate("You")', keywords: [{ pattern: "graduate\\s*\\(\\s*[\"']You[\"']\\s*\\)" }] },
          ],
        },
      },
    ],
  },
];

export const JS_FUNDAMENTALS_LESSONS = applyLessonVideoLinks(
  JS_FUNDAMENTALS_CHAPTERS.flatMap((ch) =>
    ch.lessons.map((l) => ({
      ...l,
      chapterId: ch.id,
      chapterTitle: ch.title,
      chapterColor: ch.color,
    })),
  ),
  JS_FUNDAMENTALS_VIDEO_LINKS,
);

export const JS_FUNDAMENTALS_TOTAL_XP = JS_FUNDAMENTALS_LESSONS.reduce(
  (s, l) => s + l.xp,
  0,
);
