// Chapters 6–11: Strings → Web APIs → Graduation (lessons js-16 … js-31)

import {
  JS_ACCENT,
  quiz,
  callout,
  text,
  diagram,
  table,
  objectives,
} from "./jsCurriculumHelpers";

const STRINGS_COLOR = "#f97316";
const SCOPE_COLOR = "#8b5cf6";
const ASYNC_COLOR = "#06b6d4";
const CLASS_COLOR = "#ec4899";
const WEB_COLOR = "#22c55e";
const GRAD_COLOR = "#eab308";

export const JS_EXTENDED_CHAPTERS = [
  {
    id: "strings",
    title: "Strings & JSON",
    icon: "type",
    color: STRINGS_COLOR,
    lessons: [
      {
        id: "js-16",
        title: "String methods",
        xp: 14,
        theory: [
          objectives([
            "Use common string methods without memorizing every name",
            "Know when strings are immutable (each method returns a new string)",
            "Clean user input with trim and toLowerCase",
          ]),
          text(
            "A **string** is text in quotes. JavaScript strings are **immutable** — methods like `.toUpperCase()` return a **new** string; the original stays the same.",
            {
              label: "Transform text safely",
              content: `const name = "  polycode  ";
const clean = name.trim().toLowerCase();
console.log(clean);
console.log(name.length);`,
            },
          ),
          table("Handy string methods", ["Method", "What it does", "Example result"], [
            [".length", "Character count", '"hi".length returns 2'],
            [".trim()", "Remove extra spaces at ends", '"  hi ".trim() returns "hi"'],
            [".toLowerCase()", "All lowercase", '"Hi".toLowerCase() returns "hi"'],
            [".includes(x)", "True if text contains x", '"hello".includes("ell") returns true'],
            [".split(',')", "Split into an array", '"a,b".split(",") returns ["a","b"]'],
            [".replace(a,b)", "Swap first match", '"cat".replace("c","k") returns "kat"'],
          ]),
          callout(
            "tip",
            "Chain methods left to right: `email.trim().toLowerCase()` — read it as a pipeline.",
          ),
          quiz(
            "What does \"  Hello  \".trim().length return?",
            ["4", "5", "7", "9"],
            1,
            "trim removes the two spaces on each side, leaving Hello (5 characters).",
          ),
        ],
        challenge: {
          title: "Clean a Username",
          description:
            'Given `const raw = "  PolyCode  "`, create `clean` with trim + toLowerCase and log it (expect `polycode`).',
          starterCode: `const raw = "  PolyCode  ";
// create clean and log

`,
          solutionCode: `const raw = "  PolyCode  ";
const clean = raw.trim().toLowerCase();
console.log(clean);`,
          tests: [
            { id: 1, label: "Uses trim", keywords: [{ pattern: "\\.trim\\s*\\(" }] },
            { id: 2, label: "Uses toLowerCase", keywords: [{ pattern: "\\.toLowerCase\\s*\\(" }] },
            { id: 3, label: "Logs clean", keywords: [{ pattern: "console\\.log\\s*\\(\\s*clean\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-17",
        title: "JSON data",
        xp: 16,
        theory: [
          text(
            "**JSON** (JavaScript Object Notation) is how apps send structured data over the internet. It looks like JavaScript objects but keys must use **double quotes**.",
          ),
          diagram("JSON on the web", [
            {
              id: "api",
              label: "Server",
              color: ASYNC_COLOR,
              items: ["Sends JSON text", "Lists, users, scores"],
            },
            {
              id: "parse",
              label: "Your code",
              color: JS_ACCENT,
              items: ["JSON.parse()", "Use as objects/arrays"],
            },
            {
              id: "stringify",
              label: "Sending back",
              color: STRINGS_COLOR,
              items: ["JSON.stringify()", "Save or POST data"],
            },
          ]),
          text(
            "`JSON.parse()` turns a JSON **string** into real JavaScript values. `JSON.stringify()` does the reverse — great for logging or APIs.",
            {
              label: "Parse and stringify",
              content: `const jsonText = '{"name":"Aisha","xp":120}';
const user = JSON.parse(jsonText);
console.log(user.name, user.xp);

const back = JSON.stringify(user);
console.log(back);`,
            },
          ),
          table("JSON vs JavaScript object", ["Feature", "JSON", "JS object literal"], [
            ["Key quotes", "Required `\"name\"`", "Often optional `name`"],
            ["Functions", "Not allowed", "Allowed"],
            ["Trailing commas", "Not allowed", "Allowed in modern JS"],
            ["undefined", "Omitted when stringifying", "Kept as value"],
          ]),
          callout(
            "warning",
            "Always wrap `JSON.parse` in try/catch when data comes from users — bad JSON throws an error.",
          ),
          quiz(
            "Which method converts a JavaScript object into a JSON string?",
            ["JSON.parse", "JSON.stringify", "Object.toJSON", "String.json"],
            1,
            "stringify → string; parse → object.",
          ),
        ],
        challenge: {
          title: "Parse Player JSON",
          description:
            'Parse `\'{"level":3,"name":"Nova"}\'` with JSON.parse, then log `player.name` and `player.level`.',
          starterCode: `const jsonText = '{"level":3,"name":"Nova"}';
// parse and log name + level

`,
          solutionCode: `const jsonText = '{"level":3,"name":"Nova"}';
const player = JSON.parse(jsonText);
console.log(player.name);
console.log(player.level);`,
          tests: [
            { id: 1, label: "Uses JSON.parse", keywords: [{ pattern: "JSON\\.parse" }] },
            { id: 2, label: "Logs player.name", keywords: [{ pattern: "player\\.name" }] },
            { id: 3, label: "Logs player.level", keywords: [{ pattern: "player\\.level" }] },
          ],
        },
      },
      {
        id: "js-18",
        title: "Map & Set",
        xp: 16,
        theory: [
          text(
            "Arrays are great for lists, but sometimes you need **faster lookups** or **unique values**. `Map` and `Set` are built-in collections for those jobs.",
          ),
          table("When to use which collection", ["Structure", "Best for", "Duplicate values?"], [
            ["Array", "Ordered lists", "Yes"],
            ["Set", "Unique tags, IDs", "No — auto-unique"],
            ["Map", "Key → value pairs (any key type)", "Keys must be unique"],
            ["Object `{}`", "Records with string keys", "Keys must be unique"],
          ]),
          text(
            "A **Set** stores unique items. A **Map** stores key-value pairs like an object, but keys can be anything (numbers, objects).",
            {
              label: "Set and Map basics",
              content: `const tags = new Set(["js", "web", "js"]);
console.log(tags.size);

const scores = new Map();
scores.set("Aisha", 95);
scores.set("Ben", 88);
console.log(scores.get("Aisha"));`,
            },
          ),
          callout(
            "info",
            "Use `array.filter` + spread to dedupe: `[...new Set(arr)]` — a common interview-friendly trick.",
          ),
          quiz(
            "How many items does new Set([1, 2, 2, 3]) contain?",
            ["2", "3", "4", "Error"],
            1,
            "Set keeps only unique values: 1, 2, 3.",
          ),
        ],
        challenge: {
          title: "Unique Tags",
          description:
            "From `const words = [\"js\", \"web\", \"js\", \"api\"]`, build `unique` with `new Set(words)` and log `unique.size` (expect 3).",
          starterCode: `const words = ["js", "web", "js", "api"];
// unique Set and log size

`,
          solutionCode: `const words = ["js", "web", "js", "api"];
const unique = new Set(words);
console.log(unique.size);`,
          tests: [
            { id: 1, label: "Creates Set", keywords: [{ pattern: "new\\s+Set\\s*\\(" }] },
            { id: 2, label: "Logs unique.size", keywords: [{ pattern: "console\\.log\\s*\\(\\s*unique\\.size\\s*\\)" }] },
          ],
        },
      },
    ],
  },
  {
    id: "scope",
    title: "Scope & Errors",
    icon: "shield",
    color: SCOPE_COLOR,
    lessons: [
      {
        id: "js-19",
        title: "Scope & closures",
        xp: 16,
        theory: [
          objectives([
            "Explain the difference between global and block scope",
            "Understand what a closure remembers",
            "Avoid accidental global variables",
          ]),
          text(
            "**Scope** is where a variable can be used. `let` and `const` are **block-scoped** — they exist only inside `{ }` blocks. A **closure** is when a function remembers variables from the place it was created.",
          ),
          diagram("Scope layers", [
            {
              id: "global",
              label: "Global",
              color: JS_ACCENT,
              items: ["Script-wide", "Avoid polluting"],
            },
            {
              id: "function",
              label: "Function",
              color: SCOPE_COLOR,
              items: ["Parameters", "Local const/let"],
            },
            {
              id: "block",
              label: "Block",
              color: "#a78bfa",
              items: ["if / for / while", "Temporary counters"],
            },
          ]),
          text(
            "Closures power counters, private data, and callbacks. The inner function keeps access to outer variables even after the outer function finishes.",
            {
              label: "Simple counter closure",
              content: `function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const next = makeCounter();
console.log(next());
console.log(next());`,
            },
          ),
          table("Scope cheat sheet", ["Declaration", "Scope", "Reassign?", "Hoisted?"], [
            ["`const`", "Block", "No", "Temporal dead zone"],
            ["`let`", "Block", "Yes", "Temporal dead zone"],
            ["`var`", "Function (legacy)", "Yes", "Yes (avoid)"],
          ]),
          quiz(
            "Where can you use a variable declared with let inside an if block?",
            [
              "Anywhere in the file",
              "Only inside that if block",
              "Only in functions",
              "Only in the browser console",
            ],
            1,
            "let/const are block-scoped to the nearest `{ }`.",
          ),
        ],
        challenge: {
          title: "Block Scope",
          description:
            "Inside an `if (true) { }` block, declare `const secret = 42` and log `secret` inside the block.",
          starterCode: `if (true) {
  // const secret = 42 and log it
}

`,
          solutionCode: `if (true) {
  const secret = 42;
  console.log(secret);
}`,
          tests: [
            { id: 1, label: "Declares secret", keywords: [{ pattern: "const\\s+secret\\s*=\\s*42" }] },
            { id: 2, label: "Logs secret", keywords: [{ pattern: "console\\.log\\s*\\(\\s*secret\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-20",
        title: "try / catch",
        xp: 16,
        theory: [
          text(
            "Sometimes code **fails** — bad input, missing data, invalid JSON. **try / catch** lets you attempt risky code and handle errors without crashing the whole app.",
          ),
          text(
            "Put risky code in `try`. If an error happens, JavaScript jumps to `catch (err)` where you can log a friendly message or use a fallback value.",
            {
              label: "Safe JSON parse",
              content: `function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("Invalid JSON");
    return null;
  }
}

console.log(safeParse('{"ok":true}'));
console.log(safeParse("not json"));`,
            },
          ),
          table("Error handling tools", ["Tool", "Purpose"], [
            ["`try / catch`", "Handle errors you expect"],
            ["`throw new Error(msg)`", "Create your own error"],
            ["`finally`", "Runs whether or not there was an error"],
            ["`console.error`", "Log problems for developers"],
          ]),
          callout(
            "tip",
            "Catch errors at **boundaries** — user input, network, file reads — not around every single line.",
          ),
          quiz(
            "What happens when JSON.parse receives invalid text inside try/catch?",
            [
              "The browser closes",
              "Execution jumps to catch",
              "JavaScript ignores it",
              "The string becomes null automatically",
            ],
            1,
            "parse throws; catch receives the error object.",
          ),
        ],
        challenge: {
          title: "Safe Divide",
          description:
            "Write `function divide(a, b)` that returns `a / b` or logs `\"Cannot divide by zero\"` and returns `null` when `b === 0`. Log `divide(10, 2)` and `divide(4, 0)`.",
          starterCode: `function divide(a, b) {
  // your code
}

console.log(divide(10, 2));
console.log(divide(4, 0));
`,
          solutionCode: `function divide(a, b) {
  if (b === 0) {
    console.log("Cannot divide by zero");
    return null;
  }
  return a / b;
}

console.log(divide(10, 2));
console.log(divide(4, 0));`,
          tests: [
            { id: 1, label: "Defines divide function", keywords: [{ pattern: "function\\s+divide" }] },
            { id: 2, label: "Checks b === 0", keywords: [{ pattern: "b\\s*===\\s*0" }] },
            { id: 3, label: "Logs cannot divide message", keywords: [{ pattern: "Cannot divide by zero" }] },
          ],
        },
      },
      {
        id: "js-21",
        title: "Debugging habits",
        xp: 12,
        theory: [
          text(
            "Advanced developers are not people who never make bugs — they are people who **find bugs faster**. Good habits beat random guessing.",
          ),
          diagram("Debug workflow", [
            {
              id: "repro",
              label: "1. Reproduce",
              color: JS_ACCENT,
              items: ["Smallest example", "One input that fails"],
            },
            {
              id: "read",
              label: "2. Read the error",
              color: STRINGS_COLOR,
              items: ["Line number", "Message text"],
            },
            {
              id: "log",
              label: "3. Inspect",
              color: SCOPE_COLOR,
              items: ["console.log", "Check types"],
            },
          ]),
          table("console helpers", ["Method", "Use when"], [
            ["`console.log`", "General values"],
            ["`console.table`", "Arrays / objects in columns"],
            ["`console.warn`", "Suspicious but not fatal"],
            ["`typeof x`", "Confirm string vs number vs object"],
          ]),
          callout(
            "tip",
            "When stuck, explain the bug out loud (rubber duck debugging) — it forces you to read your own code carefully.",
          ),
          quiz(
            "What is the first step in a solid debugging process?",
            ["Rewrite the whole file", "Reproduce the bug reliably", "Delete all comments", "Switch to another language"],
            1,
            "You need a reliable failing case before you can prove a fix works.",
          ),
        ],
        challenge: {
          title: "Type Detective",
          description:
            "Log `typeof 42`, `typeof \"hi\"`, and `typeof true` on separate lines.",
          starterCode: `// three console.log lines with typeof

`,
          solutionCode: `console.log(typeof 42);
console.log(typeof "hi");
console.log(typeof true);`,
          tests: [
            { id: 1, label: "Logs typeof number", keywords: [{ pattern: "typeof\\s+42" }] },
            { id: 2, label: "Logs typeof string", keywords: [{ pattern: "typeof\\s+[\"']hi[\"']" }] },
            { id: 3, label: "Logs typeof boolean", keywords: [{ pattern: "typeof\\s+true" }] },
          ],
        },
      },
    ],
  },
  {
    id: "async",
    title: "Async JavaScript",
    icon: "refresh",
    color: ASYNC_COLOR,
    lessons: [
      {
        id: "js-22",
        title: "Sync vs async",
        xp: 14,
        theory: [
          text(
            "Most JavaScript runs **synchronously** — one line at a time, top to bottom. **Asynchronous** code starts something now and finishes **later** (timers, fetching data, reading files) without freezing the whole program.",
          ),
          diagram("Sync vs async timeline", [
            {
              id: "sync",
              label: "Synchronous",
              color: JS_ACCENT,
              items: ["Line 1 runs", "Then line 2", "Blocks until done"],
            },
            {
              id: "async",
              label: "Asynchronous",
              color: ASYNC_COLOR,
              items: ["Start task", "Other code runs", "Result arrives later"],
            },
          ]),
          text(
            "A **callback** is a function you pass to run later. Timers use callbacks — that's why `setTimeout` does not pause the lines below it in your script (in real browsers; in our challenge runner focus on Promises).",
            {
              label: "Promise = future value",
              content: `const job = new Promise((resolve) => {
  resolve("Data ready");
});

job.then((message) => {
  console.log(message);
});`,
            },
          ),
          table("Async concepts", ["Term", "Plain English"], [
            ["Callback", "Function called when work finishes"],
            ["Promise", "Placeholder for a value that will exist later"],
            ["async / await", "Cleaner syntax for Promises"],
            ["fetch", "Browser API to request network data"],
          ]),
          quiz(
            "What does a Promise represent?",
            ["A syntax error", "A value now or in the future", "A type of loop", "A CSS animation"],
            1,
            "Promises model delayed success or failure.",
          ),
        ],
        challenge: {
          title: "First Promise",
          description:
            "Create `const p = Promise.resolve(\"done\")` and use `.then(msg => console.log(msg))`.",
          starterCode: `// Promise.resolve and .then

`,
          solutionCode: `const p = Promise.resolve("done");
p.then((msg) => console.log(msg));`,
          tests: [
            { id: 1, label: "Uses Promise.resolve", keywords: [{ pattern: "Promise\\.resolve" }] },
            { id: 2, label: "Uses .then", keywords: [{ pattern: "\\.then\\s*\\(" }] },
            { id: 3, label: "Logs inside then", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
      {
        id: "js-23",
        title: "async / await",
        xp: 18,
        theory: [
          objectives([
            "Read async code top-to-bottom with await",
            "Know that await only works inside async functions",
            "Chain multiple async steps clearly",
          ]),
          text(
            "`async` marks a function that returns a Promise. `await` pauses **inside that function** until a Promise settles — your code still looks readable.",
            {
              label: "async function pattern",
              content: `async function loadScore() {
  const response = await Promise.resolve(100);
  console.log("Score:", response);
  return response;
}

loadScore();`,
            },
          ),
          text(
            "Use **try/catch** with await the same way you guard JSON.parse — network requests can fail.",
            {
              label: "await with try/catch",
              content: `async function safeLoad() {
  try {
    const data = await Promise.resolve({ ok: true });
    console.log(data.ok);
  } catch (err) {
    console.log("Failed");
  }
}

safeLoad();`,
            },
          ),
          callout(
            "info",
            "await does not block the entire browser — only your async function waits. Other events (clicks, animations) still work on real pages.",
          ),
          quiz(
            "Where is await allowed?",
            ["Any function", "Only inside async functions", "Only in classes", "Only in callbacks"],
            1,
            "await is syntax sugar for Promises inside async functions.",
          ),
        ],
        challenge: {
          title: "Await a Value",
          description:
            "Write `async function show()` that awaits `Promise.resolve(\"PolyCode\")` into `name` and logs `name`. Call `show()`.",
          starterCode: `async function show() {
  // await Promise.resolve into name and log
}

show();
`,
          solutionCode: `async function show() {
  const name = await Promise.resolve("PolyCode");
  console.log(name);
}

show();`,
          tests: [
            { id: 1, label: "async function show", keywords: [{ pattern: "async\\s+function\\s+show" }] },
            { id: 2, label: "Uses await", keywords: [{ pattern: "await\\s+" }] },
            { id: 3, label: "Calls show()", keywords: [{ pattern: "show\\s*\\(\\s*\\)" }] },
          ],
        },
      },
      {
        id: "js-24",
        title: "Working with APIs",
        xp: 18,
        theory: [
          text(
            "Web apps load data from **APIs** — URLs that return JSON. In the browser you use **`fetch(url)`**, which returns a Promise. You await `.json()` to parse the body.",
          ),
          diagram("fetch data flow", [
            {
              id: "req",
              label: "Request",
              color: ASYNC_COLOR,
              items: ["fetch(url)", "GET / POST"],
            },
            {
              id: "res",
              label: "Response",
              color: WEB_COLOR,
              items: ["status 200", "headers"],
            },
            {
              id: "body",
              label: "Body",
              color: JS_ACCENT,
              items: ["await res.json()", "Use in UI"],
            },
          ]),
          text(
            "Our course challenges run in a sandbox without network access, but the pattern is always: **fetch → check response → parse JSON → update UI**.",
            {
              label: "Typical fetch pattern (browser)",
              content: `async function loadUser() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Request failed");
  const user = await res.json();
  console.log(user.name);
}`,
            },
          ),
          table("HTTP status codes (basics)", ["Code", "Meaning"], [
            ["200", "OK — success"],
            ["404", "Not found"],
            ["500", "Server error"],
            ["401", "Not authenticated"],
          ]),
          callout(
            "tip",
            "Always check `response.ok` or `response.status` before assuming data is valid.",
          ),
          quiz(
            "What does fetch return in modern JavaScript?",
            ["A plain object", "A Promise", "An array buffer only", "undefined"],
            1,
            "fetch is asynchronous and returns a Promise of Response.",
          ),
        ],
        challenge: {
          title: "Mock API Response",
          description:
            "Simulate an API: `async function getUser()` returns `await Promise.resolve({ name: \"Aisha\" })`. Log `user.name` inside. Call `getUser()`.",
          starterCode: `async function getUser() {
  // return resolved user object and log name
}

getUser();
`,
          solutionCode: `async function getUser() {
  const user = await Promise.resolve({ name: "Aisha" });
  console.log(user.name);
  return user;
}

getUser();`,
          tests: [
            { id: 1, label: "async getUser", keywords: [{ pattern: "async\\s+function\\s+getUser" }] },
            { id: 2, label: "Resolves user object", keywords: [{ pattern: "Promise\\.resolve\\s*\\(\\s*\\{\\s*name" }] },
            { id: 3, label: "Logs user.name", keywords: [{ pattern: "user\\.name" }] },
          ],
        },
      },
    ],
  },
  {
    id: "classes",
    title: "Classes & OOP",
    icon: "blocks",
    color: CLASS_COLOR,
    lessons: [
      {
        id: "js-25",
        title: "Class basics",
        xp: 16,
        theory: [
          text(
            "A **class** is a blueprint for creating objects with shared behavior. JavaScript classes are syntactic sugar over prototypes — friendly for readers coming from other languages.",
            {
              label: "Define and instantiate",
              content: `class Player {
  constructor(name, xp) {
    this.name = name;
    this.xp = xp;
  }

  levelUp(amount) {
    this.xp += amount;
    return this.xp;
  }
}

const p = new Player("Nova", 10);
console.log(p.levelUp(5));`,
            },
          ),
          table("Class vocabulary", ["Piece", "Role"], [
            ["`constructor`", "Runs when you `new` the class"],
            ["`this`", "The current instance"],
            ["Method", "Function on the prototype"],
            ["`new`", "Create an instance"],
          ]),
          diagram("Object from a class", [
            {
              id: "class",
              label: "class Player",
              color: CLASS_COLOR,
              items: ["constructor", "methods"],
            },
            {
              id: "instance",
              label: "new Player()",
              color: JS_ACCENT,
              items: ["name", "xp", "own state"],
            },
          ]),
          quiz(
            "What keyword creates an instance from a class?",
            ["this", "new", "create", "instanceof only"],
            1,
            "new Player() calls the constructor and returns an object.",
          ),
        ],
        challenge: {
          title: "Lesson Class",
          description:
            'Create class `Lesson` with constructor `(title, xp)` setting `this.title` and `this.xp`. `new Lesson("Async", 18)` then log `lesson.title`.',
          starterCode: `class Lesson {
  // constructor
}

const lesson = new Lesson("Async", 18);
// log lesson.title

`,
          solutionCode: `class Lesson {
  constructor(title, xp) {
    this.title = title;
    this.xp = xp;
  }
}

const lesson = new Lesson("Async", 18);
console.log(lesson.title);`,
          tests: [
            { id: 1, label: "class Lesson", keywords: [{ pattern: "class\\s+Lesson" }] },
            { id: 2, label: "constructor sets title", keywords: [{ pattern: "this\\.title\\s*=" }] },
            { id: 3, label: "new Lesson", keywords: [{ pattern: "new\\s+Lesson\\s*\\(" }] },
          ],
        },
      },
      {
        id: "js-26",
        title: "Inheritance",
        xp: 18,
        theory: [
          text(
            "**extends** lets one class inherit fields and methods from another. Use `super()` in the child constructor to run the parent setup first.",
            {
              label: "Parent and child class",
              content: `class User {
  constructor(name) {
    this.name = name;
  }
}

class Admin extends User {
  constructor(name, role) {
    super(name);
    this.role = role;
  }
}

const a = new Admin("Mo", "editor");
console.log(a.name, a.role);`,
            },
          ),
          callout(
            "tip",
            "Favor composition (objects inside objects) when inheritance hierarchies get deep — shallow trees are easier to maintain.",
          ),
          quiz(
            "What must you call in a child constructor before using this?",
            ["extends", "super", "new", "static"],
            1,
            "super(...) runs the parent constructor.",
          ),
        ],
        challenge: {
          title: "Extend Animal",
          description:
            'class `Animal` with `constructor(name)` setting `this.name`. class `Dog extends Animal` with `bark()` logging `"Woof!"`. Create `new Dog("Rex")`, call `bark()`.',
          starterCode: `class Animal {
  // constructor(name)
}

class Dog extends Animal {
  // bark method
}

const d = new Dog("Rex");
// call bark

`,
          solutionCode: `class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

const d = new Dog("Rex");
d.bark();`,
          tests: [
            { id: 1, label: "Dog extends Animal", keywords: [{ pattern: "class\\s+Dog\\s+extends\\s+Animal" }] },
            { id: 2, label: "Uses super", keywords: [{ pattern: "super\\s*\\(" }] },
            { id: 3, label: "bark logs Woof", keywords: [{ pattern: "Woof!" }] },
          ],
        },
      },
      {
        id: "js-27",
        title: "Static & getters",
        xp: 16,
        theory: [
          text(
            "**Static** methods belong to the class itself, not instances — great for helpers like `Math.max` or factory functions. **Getters** look like properties but run code.",
            {
              label: "static and get",
              content: `class Course {
  static platform() {
    return "PolyCode";
  }

  constructor(title) {
    this.title = title;
  }

  get label() {
    return "Course: " + this.title;
  }
}

console.log(Course.platform());
const c = new Course("JS");
console.log(c.label);`,
            },
          ),
          table("static vs instance", ["Kind", "Called on", "Example"], [
            ["Instance method", "`object.method()`", "`player.levelUp()`"],
            ["Static method", "`Class.method()`", "`Course.platform()`"],
            ["Getter", "`object.prop` (no parens)", "`course.label`"],
          ]),
          quiz(
            "How do you call a static method named create on class Task?",
            ["task.create()", "Task.create()", "new Task.create()", "static Task.create()"],
            1,
            "Static methods live on the constructor function.",
          ),
        ],
        challenge: {
          title: "Static Helper",
          description:
            'class `MathHelper` with static `double(n)` returning `n * 2`. Log `MathHelper.double(21)`.',
          starterCode: `class MathHelper {
  // static double(n)
}

// log MathHelper.double(21)

`,
          solutionCode: `class MathHelper {
  static double(n) {
    return n * 2;
  }
}

console.log(MathHelper.double(21));`,
          tests: [
            { id: 1, label: "static double", keywords: [{ pattern: "static\\s+double" }] },
            { id: 2, label: "Returns n * 2", keywords: [{ pattern: "n\\s*\\*\\s*2" }] },
            { id: 3, label: "Calls MathHelper.double", keywords: [{ pattern: "MathHelper\\.double\\s*\\(\\s*21\\s*\\)" }] },
          ],
        },
      },
    ],
  },
  {
    id: "web",
    title: "DOM & Web APIs",
    icon: "globe",
    color: WEB_COLOR,
    lessons: [
      {
        id: "js-28",
        title: "The DOM",
        xp: 14,
        theory: [
          objectives([
            "Explain what the DOM is in plain language",
            "Name common selection methods",
            "Connect JS variables to page elements",
          ]),
          text(
            "When the browser loads HTML, it builds the **DOM** (Document Object Model) — a tree of objects representing every element. JavaScript can read and change that tree to update the page without reloading.",
          ),
          diagram("DOM tree (simplified)", [
            {
              id: "doc",
              label: "document",
              color: WEB_COLOR,
              items: ["Root of the tree", "entry point"],
            },
            {
              id: "body",
              label: "body",
              color: JS_ACCENT,
              items: ["Visible page", "Contains sections"],
            },
            {
              id: "el",
              label: "elements",
              color: "#4ade80",
              items: ["h1, p, button", "id & class"],
            },
          ]),
          table("Selecting elements", ["API", "Selects"], [
            ["`document.getElementById('id')`", "One element by id"],
            ["`document.querySelector('.class')`", "First match for CSS selector"],
            ["`document.querySelectorAll('li')`", "All matches (NodeList)"],
            ["`element.textContent`", "Read/write text inside"],
          ]),
          text(
            "In the browser you might write:",
            {
              label: "Change heading text",
              content: `const title = document.querySelector("#app-title");
title.textContent = "Welcome back!";`,
            },
          ),
          callout(
            "info",
            "Course challenges use `console.log` instead of real DOM nodes — but the mental model is identical: **select → read → update**.",
          ),
          quiz(
            "What does the DOM represent?",
            ["A database table", "The page structure as objects", "A CSS file", "A npm package"],
            1,
            "DOM = live object tree mirroring HTML.",
          ),
        ],
        challenge: {
          title: "DOM Plan in Comments",
          description:
            "Log three strings: `\"select element\"`, `\"read textContent\"`, `\"update UI\"` — your checklist for DOM work.",
          starterCode: `// log the three checklist strings

`,
          solutionCode: `console.log("select element");
console.log("read textContent");
console.log("update UI");`,
          tests: [
            { id: 1, label: "Logs select", keywords: [{ pattern: "select element" }] },
            { id: 2, label: "Logs read", keywords: [{ pattern: "read textContent" }] },
            { id: 3, label: "Logs update", keywords: [{ pattern: "update UI" }] },
          ],
        },
      },
      {
        id: "js-29",
        title: "Events & forms",
        xp: 16,
        theory: [
          text(
            "An **event** is something that happens — click, key press, form submit. You listen with `addEventListener` and run a **handler** function when it fires.",
          ),
          diagram("Event flow", [
            {
              id: "user",
              label: "User action",
              color: JS_ACCENT,
              items: ["Click button", "Type in input"],
            },
            {
              id: "listen",
              label: "addEventListener",
              color: WEB_COLOR,
              items: ["'click', handler", "'submit', handler"],
            },
            {
              id: "handler",
              label: "Handler runs",
              color: CLASS_COLOR,
              items: ["Update DOM", "Validate form"],
            },
          ]),
          table("Common events", ["Event", "When it fires"], [
            ["`click`", "Mouse click on element"],
            ["`input`", "Field value changes"],
            ["`submit`", "Form submitted"],
            ["`keydown`", "Keyboard key pressed"],
          ]),
          text(
            "Forms often call `event.preventDefault()` on submit to stop a full page reload while your JavaScript validates data.",
            {
              label: "Pseudo-form validation logic",
              content: `function isValidEmail(value) {
  return value.includes("@") && value.includes(".");
}

console.log(isValidEmail("you@polycode.dev"));
console.log(isValidEmail("not-an-email"));`,
            },
          ),
          quiz(
            "Which method attaches an event listener in modern JS?",
            ["onClick = only", "addEventListener", "attachEvent", "listen()"],
            1,
            "addEventListener is the standard, flexible API.",
          ),
        ],
        challenge: {
          title: "Validate Email",
          description:
            "Write `function isValidEmail(s)` returning true when `s` includes `@` and `.`. Log results for `\"a@b.com\"` and `\"bad\"`.",
          starterCode: `function isValidEmail(s) {
  // return true/false
}

console.log(isValidEmail("a@b.com"));
console.log(isValidEmail("bad"));
`,
          solutionCode: `function isValidEmail(s) {
  return s.includes("@") && s.includes(".");
}

console.log(isValidEmail("a@b.com"));
console.log(isValidEmail("bad"));`,
          tests: [
            { id: 1, label: "Defines isValidEmail", keywords: [{ pattern: "function\\s+isValidEmail" }] },
            { id: 2, label: "Checks includes @", keywords: [{ pattern: "includes\\s*\\(\\s*[\"']@['\"]\\s*\\)" }] },
            { id: 3, label: "Uses &&", keywords: [{ pattern: "&&" }] },
          ],
        },
      },
      {
        id: "js-30",
        title: "Modules & tooling",
        xp: 14,
        theory: [
          text(
            "Large apps split code into **modules** — each file exports what others need and imports dependencies. In browsers you use `import` / `export` with `type=\"module\"` scripts.",
          ),
          table("Module syntax", ["Statement", "Purpose"], [
            ["`export const x = 1`", "Share a binding"],
            ["`export function fn()`", "Share a function"],
            ["`import { fn } from './file.js'`", "Pull in exports"],
            ["`export default class App`", "One main export per file"],
          ]),
          diagram("Modern JS toolchain", [
            {
              id: "src",
              label: "Your modules",
              color: JS_ACCENT,
              items: ["import / export", "components"],
            },
            {
              id: "bundler",
              label: "Bundler (Vite, etc.)",
              color: ASYNC_COLOR,
              items: ["Packages files", "Dev server"],
            },
            {
              id: "run",
              label: "Browser / Node",
              color: WEB_COLOR,
              items: ["Runs output", "npm scripts"],
            },
          ]),
          callout(
            "tip",
            "`npm install` adds packages from the ecosystem (React, lodash). Always read a package's docs before importing it.",
          ),
          quiz(
            "What does export allow you to do?",
            ["Hide all variables", "Share values from a module", "Delete the file", "Compile to C++"],
            1,
            "export makes bindings available to importers.",
          ),
        ],
        challenge: {
          title: "Module Mindset",
          description:
            'Create `const API_URL = "https://api.example.com"` and `function path(p) { return API_URL + p; }`, then log `path("/users")`.',
          starterCode: `// API_URL and path function

`,
          solutionCode: `const API_URL = "https://api.example.com";
function path(p) {
  return API_URL + p;
}
console.log(path("/users"));`,
          tests: [
            { id: 1, label: "Defines API_URL", keywords: [{ pattern: "const\\s+API_URL" }] },
            { id: 2, label: "Defines path function", keywords: [{ pattern: "function\\s+path" }] },
            { id: 3, label: "Logs path result", keywords: [{ pattern: "console\\.log\\s*\\(\\s*path\\s*\\(" }] },
          ],
        },
      },
    ],
  },
  {
    id: "graduation",
    title: "Graduation",
    icon: "trophy",
    color: GRAD_COLOR,
    lessons: [
      {
        id: "js-31",
        title: "Full-stack mindset",
        xp: 22,
        theory: [
          text(
            "You have moved from **first console.log** to **async patterns, classes, and web APIs**. Advanced JavaScript is not one giant topic — it is knowing which tool fits each layer of an app.",
          ),
          diagram("Your full JS stack map", [
            {
              id: "core",
              label: "Core language",
              color: JS_ACCENT,
              items: ["Types, functions", "Arrays, objects", "Classes"],
            },
            {
              id: "runtime",
              label: "Runtime features",
              color: ASYNC_COLOR,
              items: ["Promises", "fetch", "Modules"],
            },
            {
              id: "ui",
              label: "Browser UI",
              color: WEB_COLOR,
              items: ["DOM", "Events", "Forms"],
            },
          ]),
          table("What to explore next", ["Track", "Learn"], [
            ["React / Vue", "Component-based UIs"],
            ["Node.js", "Servers & APIs"],
            ["TypeScript", "Types on top of JS"],
            ["Testing", "Jest, Vitest, confidence"],
          ]),
          callout(
            "tip",
            "Build one small project that uses fetch + DOM + classes — a weather widget or habit tracker cements everything faster than passive reading.",
          ),
          quiz(
            "Which skill connects JavaScript to live page updates?",
            ["JSON only", "DOM manipulation", "SQL queries", "Binary files"],
            1,
            "DOM + events bridge logic and what users see.",
          ),
        ],
        challenge: {
          title: "Graduation Project",
          description:
            "Build `class TaskList` with `constructor()` setting `this.tasks = []`, method `add(title)` pushing to tasks, method `count()` returning length. Add two tasks, log `list.count()` (expect 2).",
          starterCode: `class TaskList {
  // constructor, add, count
}

const list = new TaskList();
// add two tasks and log count

`,
          solutionCode: `class TaskList {
  constructor() {
    this.tasks = [];
  }
  add(title) {
    this.tasks.push(title);
  }
  count() {
    return this.tasks.length;
  }
}

const list = new TaskList();
list.add("Review async");
list.add("Build UI");
console.log(list.count());`,
          tests: [
            { id: 1, label: "class TaskList", keywords: [{ pattern: "class\\s+TaskList" }] },
            { id: 2, label: "add pushes to tasks", keywords: [{ pattern: "this\\.tasks\\.push" }] },
            { id: 3, label: "Logs list.count()", keywords: [{ pattern: "console\\.log\\s*\\(\\s*list\\.count\\s*\\(\\s*\\)\\s*\\)" }] },
          ],
        },
      },
    ],
  },
];
