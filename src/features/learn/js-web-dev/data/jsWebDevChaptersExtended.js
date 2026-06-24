// Chapters 6–11: Dynamic DOM → Advanced Web → Graduation (lessons jsweb-15 … jsweb-29)

import {
  quiz,
  callout,
  text,
  diagram,
  table,
  objectives,
} from "../../js-fundamentals/data/jsCurriculumHelpers";

const DYNAMIC_COLOR = "#14b8a6";
const TIMING_COLOR = "#f97316";
const URLS_COLOR = "#6366f1";
const A11Y_COLOR = "#a855f7";
const SECURITY_COLOR = "#ef4444";
const ADVANCED_COLOR = "#eab308";

export const JS_WEB_DEV_EXTENDED_CHAPTERS = [
  {
    id: "dynamic-dom",
    title: "Dynamic DOM",
    icon: "blocks",
    color: DYNAMIC_COLOR,
    lessons: [
      {
        id: "jsweb-15",
        title: "Creating Elements",
        xp: 16,
        theory: [
          objectives([
            "Create nodes with createElement patterns",
            "Set text and attributes safely",
            "Append children to a parent container",
          ]),
          text(
            "Static HTML is only the starting point. Real apps **create** nodes at runtime — todo rows, chat bubbles, notifications. In the browser: `document.createElement('li')`, set `textContent`, then `parent.appendChild(node)`.",
            {
              label: "Build a list item in code",
              content: `function createItem(text) {
  return { tag: "li", textContent: text, children: [] };
}
const item = createItem("Learn fetch");
console.log(item.tag, item.textContent);`,
            },
          ),
          table("Create vs innerHTML", ["Approach", "Best for", "Risk"], [
            ["createElement + textContent", "Lists, buttons, safe text", "Low — no HTML parsing"],
            ["innerHTML template", "Rich markup from trusted templates", "XSS if user data is injected"],
            ["cloneNode", "Duplicating existing nodes", "Copies structure quickly"],
          ]),
          callout(
            "tip",
            "Build a small `createElement(tag, props, children)` helper in your app — same idea as React.createElement without the framework.",
          ),
          quiz(
            "Safest way to insert user-provided plain text into the DOM?",
            ["innerHTML = userText", "textContent = userText", "document.write(userText)", "eval(userText)"],
            1,
            "textContent never parses HTML — user text stays text.",
          ),
        ],
        challenge: {
          title: "Create Todo Node",
          description:
            "Write `createTodo(text, done)` returning `{ tag: 'li', textContent: text, classList: done ? ['done'] : [] }`. Log the classList length for a completed todo.",
          starterCode: `function createTodo(text, done) {
  // return mock element object
}

const todo = createTodo("Ship feature", true);
console.log(todo.classList.length);
`,
          solutionCode: `function createTodo(text, done) {
  return {
    tag: "li",
    textContent: text,
    classList: done ? ["done"] : [],
  };
}

const todo = createTodo("Ship feature", true);
console.log(todo.classList.length);`,
          tests: [
            { id: 1, label: "Defines createTodo", keywords: [{ pattern: "function\\s+createTodo" }] },
            { id: 2, label: "Sets classList when done", keywords: [{ pattern: "done" }] },
            { id: 3, label: "Logs classList length", keywords: [{ pattern: "console\\.log.*classList" }] },
          ],
        },
      },
      {
        id: "jsweb-16",
        title: "Rendering Lists",
        xp: 17,
        theory: [
          objectives([
            "Map data arrays to DOM nodes",
            "Clear and re-render a container",
            "Use keys or ids for stable identity",
          ]),
          text(
            "UI lists come from **data arrays**. The pattern: `items.map(item => createRow(item))` then append each row, or build one HTML string from a template (only for trusted data). When data changes, clear the container and render again.",
          ),
          diagram("Data to DOM pipeline", [
            { id: "data", label: "State array", color: DYNAMIC_COLOR, items: ["Todos, messages", "Sorted / filtered"] },
            { id: "map", label: "map + create", color: "#3b82f6", items: ["One node per item", "Stable id on each row"] },
            { id: "dom", label: "Container", color: "#f59e0b", items: ["appendChild", "Replace children"] },
          ]),
          callout(
            "warning",
            "Re-rendering huge lists by wiping innerHTML every keystroke is slow — later you will diff or virtualize; for small lists, full re-render is fine.",
          ),
          quiz(
            "Why give each list row a stable id?",
            ["CSS requires it", "Track updates, edit, and delete the right item", "fetch needs ids", "innerHTML deletes ids"],
            1,
            "Ids tie DOM rows back to data when users edit or delete one item.",
          ),
        ],
        challenge: {
          title: "Render Todo List",
          description:
            "Write `renderTodos(todos)` that maps `{ id, text }[]` to `{ tag: 'li', id, textContent: text }[]` and logs the length.",
          starterCode: `const todos = [
  { id: 1, text: "DOM" },
  { id: 2, text: "Events" },
];

function renderTodos(todos) {
  // map to mock li nodes, return array
}

console.log(renderTodos(todos).length);
`,
          solutionCode: `const todos = [
  { id: 1, text: "DOM" },
  { id: 2, text: "Events" },
];

function renderTodos(todos) {
  return todos.map((t) => ({
    tag: "li",
    id: t.id,
    textContent: t.text,
  }));
}

console.log(renderTodos(todos).length);`,
          tests: [
            { id: 1, label: "Defines renderTodos", keywords: [{ pattern: "function\\s+renderTodos" }] },
            { id: 2, label: "Uses map", keywords: [{ pattern: "\\.map\\s*\\(" }] },
            { id: 3, label: "Logs length", keywords: [{ pattern: "console\\.log.*length" }] },
          ],
        },
      },
      {
        id: "jsweb-17",
        title: "Document Fragments",
        xp: 16,
        theory: [
          objectives([
            "Batch DOM inserts with a fragment mental model",
            "Reduce reflows when adding many nodes",
            "Replace children in one step",
          ]),
          text(
            "Appending 100 nodes one-by-one can trigger 100 reflows. A **DocumentFragment** is a lightweight container — add all children to the fragment, then append the fragment once. In simulations we use arrays merged before a single `container.children = merged`.",
          ),
          callout(
            "info",
            "Frameworks like React batch updates for you; in vanilla JS, fragments and careful DOM writes still matter for performance.",
          ),
          quiz(
            "Main benefit of building nodes off-DOM then inserting once?",
            ["Smaller JavaScript bundle", "Fewer layout recalculations", "Automatic HTTPS", "No need for events"],
            1,
            "Batching inserts reduces expensive layout/reflow work in the browser.",
          ),
        ],
        challenge: {
          title: "Batch Append",
          description:
            "Write `batchAppend(parent, children)` returning `{ ...parent, children: [...parent.children, ...children] }`. Start with `{ tag: 'ul', children: [] }` and append two li nodes; log children.length.",
          starterCode: `function batchAppend(parent, children) {
  // return new parent with merged children
}

const ul = { tag: "ul", children: [] };
const next = batchAppend(ul, [
  { tag: "li", text: "a" },
  { tag: "li", text: "b" },
]);
console.log(next.children.length);
`,
          solutionCode: `function batchAppend(parent, children) {
  return { ...parent, children: [...parent.children, ...children] };
}

const ul = { tag: "ul", children: [] };
const next = batchAppend(ul, [
  { tag: "li", text: "a" },
  { tag: "li", text: "b" },
]);
console.log(next.children.length);`,
          tests: [
            { id: 1, label: "Defines batchAppend", keywords: [{ pattern: "function\\s+batchAppend" }] },
            { id: 2, label: "Spreads children", keywords: [{ pattern: "\\.\\.\\." }] },
            { id: 3, label: "Logs children length", keywords: [{ pattern: "console\\.log.*children\\.length" }] },
          ],
        },
      },
    ],
  },
  {
    id: "timing-performance",
    title: "Timing & Performance",
    icon: "timer",
    color: TIMING_COLOR,
    lessons: [
      {
        id: "jsweb-18",
        title: "Debounce & Throttle",
        xp: 18,
        theory: [
          objectives([
            "Debounce rapid input (search boxes)",
            "Throttle scroll or resize handlers",
            "Pick the right tool for the job",
          ]),
          text(
            "**Debounce** waits until the user pauses — perfect for search-as-you-type. **Throttle** runs at most once per interval — great for scroll position or window resize. Both prevent work from running hundreds of times per second.",
            {
              label: "Debounce sketch",
              content: `function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
            },
          ),
          table("Debounce vs throttle", ["Pattern", "Fires when", "Example"], [
            ["Debounce", "After pause in events", "Search input 300ms after typing stops"],
            ["Throttle", "At most every N ms", "Update scroll progress bar"],
            ["Neither", "Every event", "Simple button click OK"],
          ]),
          quiz(
            "Best for live search while typing?",
            ["Throttle 10ms", "Debounce 300ms", "No delay", "setInterval 1ms"],
            1,
            "Debounce waits for a typing pause before hitting the API.",
          ),
        ],
        challenge: {
          title: "Debounce Call Count",
          description:
            "Implement `debounce(fn, ms)` that returns a function. Call the returned function twice quickly; only after `ms` should `fn` run once. Use mock: log count when fn runs.",
          starterCode: `function debounce(fn, ms) {
  // return debounced function
}

let count = 0;
const run = debounce(() => { count += 1; console.log(count); }, 50);
run();
run();
`,
          solutionCode: `function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

let count = 0;
const run = debounce(() => { count += 1; console.log(count); }, 50);
run();
run();`,
          tests: [
            { id: 1, label: "Defines debounce", keywords: [{ pattern: "function\\s+debounce" }] },
            { id: 2, label: "Uses setTimeout", keywords: [{ pattern: "setTimeout" }] },
            { id: 3, label: "Uses clearTimeout", keywords: [{ pattern: "clearTimeout" }] },
          ],
        },
      },
      {
        id: "jsweb-19",
        title: "Loading & Empty States",
        xp: 16,
        theory: [
          objectives([
            "Model loading, error, and empty UI states",
            "Show skeletons instead of blank screens",
            "Retry failed fetches gracefully",
          ]),
          text(
            "Professional UIs never leave users guessing. Show **loading** while fetch runs, **empty** when the list has zero items, **error** with a retry button when the network fails. One state object drives the whole view.",
          ),
          diagram("Async UI states", [
            { id: "load", label: "loading", color: TIMING_COLOR, items: ["Spinner", "Disable actions"] },
            { id: "empty", label: "empty", color: "#94a3b8", items: ["Helpful message", "Call to action"] },
            { id: "err", label: "error", color: "#ef4444", items: ["Short message", "Retry button"] },
            { id: "ok", label: "success", color: "#22c55e", items: ["Render data", "Pagination"] },
          ]),
          quiz(
            "What should users see while awaiting fetch?",
            ["Blank white page", "Loading indicator or skeleton", "alert('wait')", "Nothing — skip UI"],
            1,
            "Loading feedback sets expectations and reduces perceived wait time.",
          ),
        ],
        challenge: {
          title: "View State Helper",
          description:
            "Write `getViewState({ loading, error, items })` returning 'loading', 'error', 'empty', or 'ready'. Log state for `{ loading: false, error: null, items: [] }`.",
          starterCode: `function getViewState({ loading, error, items }) {
  // return one of: loading, error, empty, ready
}

console.log(getViewState({ loading: false, error: null, items: [] }));
`,
          solutionCode: `function getViewState({ loading, error, items }) {
  if (loading) return "loading";
  if (error) return "error";
  if (!items || items.length === 0) return "empty";
  return "ready";
}

console.log(getViewState({ loading: false, error: null, items: [] }));`,
          tests: [
            { id: 1, label: "Defines getViewState", keywords: [{ pattern: "function\\s+getViewState" }] },
            { id: 2, label: "Returns empty", keywords: [{ pattern: "[\"']empty[\"']" }] },
            { id: 3, label: "Logs result", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
      {
        id: "jsweb-20",
        title: "Smooth Animation",
        xp: 17,
        theory: [
          objectives([
            "Use requestAnimationFrame for smooth updates",
            "Avoid layout thrashing in animations",
            "Prefer CSS transitions when possible",
          ]),
          text(
            "`requestAnimationFrame` syncs visual updates with the display refresh (~60fps). Use it for JS-driven animations; for simple fades and slides, **CSS transitions** on `transform` and `opacity` are cheaper than updating `top`/`left` every frame.",
          ),
          callout(
            "tip",
            "Animate `transform: translateX()` instead of `margin-left` — transforms often run on the GPU without triggering full layout.",
          ),
          quiz(
            "Why prefer transform over top/left for movement?",
            ["transform is deprecated", "Often avoids expensive layout recalc each frame", "top is not CSS", "transform blocks events"],
            1,
            "Transform and opacity animations can be compositor-only — smoother and cheaper.",
          ),
        ],
        challenge: {
          title: "Easing Step",
          description:
            "Write `lerp(start, end, t)` returning `start + (end - start) * t` for t between 0 and 1. Log lerp(0, 100, 0.5).",
          starterCode: `function lerp(start, end, t) {
  // linear interpolation
}

console.log(lerp(0, 100, 0.5));
`,
          solutionCode: `function lerp(start, end, t) {
  return start + (end - start) * t;
}

console.log(lerp(0, 100, 0.5));`,
          tests: [
            { id: 1, label: "Defines lerp", keywords: [{ pattern: "function\\s+lerp" }] },
            { id: 2, label: "Logs 50", keywords: [{ pattern: "console\\.log\\s*\\(\\s*50" }] },
          ],
        },
      },
    ],
  },
  {
    id: "urls-navigation",
    title: "URLs & Navigation",
    icon: "link",
    color: URLS_COLOR,
    lessons: [
      {
        id: "jsweb-21",
        title: "Query Strings",
        xp: 15,
        theory: [
          objectives([
            "Read and write URLSearchParams",
            "Sync filters with the address bar",
            "Shareable URLs for app state",
          ]),
          text(
            "Query strings (`?q=dom&page=2`) encode **shareable state**. `URLSearchParams` parses and builds them without manual string concat bugs.",
            {
              label: "URLSearchParams",
              content: `const params = new URLSearchParams("q=events&page=2");
console.log(params.get("q"));
params.set("page", "3");
console.log(params.toString());`,
            },
          ),
          quiz(
            "What does URLSearchParams help you avoid?",
            ["Using fetch", "Manual string bugs when building ?key=value", "CSS classes", "JSON.parse"],
            1,
            "It handles encoding and parsing query pairs correctly.",
          ),
        ],
        challenge: {
          title: "Build Query String",
          description:
            "Write `toQuery(obj)` that returns `key=value` pairs joined with `&` (no encoding needed). Log toQuery({ q: 'dom', page: 2 }).",
          starterCode: `function toQuery(obj) {
  // Object.entries -> join
}

console.log(toQuery({ q: "dom", page: 2 }));
`,
          solutionCode: `function toQuery(obj) {
  return Object.entries(obj)
    .map(([k, v]) => k + "=" + v)
    .join("&");
}

console.log(toQuery({ q: "dom", page: 2 }));`,
          tests: [
            { id: 1, label: "Defines toQuery", keywords: [{ pattern: "function\\s+toQuery" }] },
            { id: 2, label: "Uses Object.entries", keywords: [{ pattern: "Object\\.entries" }] },
            { id: 3, label: "Logs query", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
      {
        id: "jsweb-22",
        title: "Client-Side Routing",
        xp: 18,
        theory: [
          objectives([
            "Explain hash vs history routing",
            "Listen to popstate / hashchange",
            "Map paths to views without full reload",
          ]),
          text(
            "Single-page apps swap **views** without reloading the document. **Hash routing** (`#/settings`) is simple; **History API** (`pushState`) gives clean URLs. React Router uses the same ideas under the hood.",
          ),
          diagram("SPA navigation", [
            { id: "click", label: "User navigates", color: URLS_COLOR, items: ["Link click", "Back button"] },
            { id: "route", label: "Router matches path", color: "#3b82f6", items: ["/lessons", "/profile"] },
            { id: "view", label: "Render view", color: "#22c55e", items: ["Swap main content", "No full reload"] },
          ]),
          quiz(
            "What does history.pushState change without reloading?",
            ["Only CSS", "The URL shown in the address bar", "The server database", "localStorage keys"],
            1,
            "pushState updates browser history and URL while staying on the same document.",
          ),
        ],
        challenge: {
          title: "Match Route",
          description:
            "Write `matchRoute(routes, path)` where routes is `{ '/': 'home', '/about': 'about' }` — return the view string or 'not-found'. Log matchRoute(routes, '/about').",
          starterCode: `const routes = { "/": "home", "/about": "about" };

function matchRoute(routes, path) {
  // return view or 'not-found'
}

console.log(matchRoute(routes, "/about"));
`,
          solutionCode: `const routes = { "/": "home", "/about": "about" };

function matchRoute(routes, path) {
  return routes[path] || "not-found";
}

console.log(matchRoute(routes, "/about"));`,
          tests: [
            { id: 1, label: "Defines matchRoute", keywords: [{ pattern: "function\\s+matchRoute" }] },
            { id: 2, label: "Logs about", keywords: [{ pattern: "console\\.log.*about" }] },
          ],
        },
      },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    icon: "eye",
    color: A11Y_COLOR,
    lessons: [
      {
        id: "jsweb-23",
        title: "Semantic HTML & ARIA",
        xp: 16,
        theory: [
          objectives([
            "Choose semantic tags: button, nav, main",
            "Add aria-label when text is not visible",
            "Connect labels to inputs with for/id",
          ]),
          text(
            "Accessibility starts with **semantic HTML** — a real `<button>` is focusable and announced correctly; a `<div onclick>` is not. Use **ARIA** only when HTML alone cannot express role or state (`aria-expanded`, `aria-live`).",
          ),
          table("Common ARIA patterns", ["Attribute", "Use when", "Example"], [
            ["aria-label", "Icon-only button", "Close menu"],
            ["aria-expanded", "Disclosure open/closed", "Accordion header"],
            ["aria-live", "Dynamic status updates", "Form error region"],
          ]),
          quiz(
            "Best element for an on-page action?",
            ["<div role='button'>", "<button type='button'>", "<span onclick>", "<b>"],
            1,
            "Native button has keyboard support and correct role built in.",
          ),
        ],
        challenge: {
          title: "Accessible Button Props",
          description:
            "Write `buttonProps(label)` returning `{ tag: 'button', type: 'button', textContent: label, ariaLabel: label }`. Log ariaLabel for 'Save'.",
          starterCode: `function buttonProps(label) {
  // return mock accessible button props
}

console.log(buttonProps("Save").ariaLabel);
`,
          solutionCode: `function buttonProps(label) {
  return {
    tag: "button",
    type: "button",
    textContent: label,
    ariaLabel: label,
  };
}

console.log(buttonProps("Save").ariaLabel);`,
          tests: [
            { id: 1, label: "Defines buttonProps", keywords: [{ pattern: "function\\s+buttonProps" }] },
            { id: 2, label: "Sets ariaLabel", keywords: [{ pattern: "ariaLabel" }] },
            { id: 3, label: "Logs Save", keywords: [{ pattern: "console\\.log.*Save" }] },
          ],
        },
      },
      {
        id: "jsweb-24",
        title: "Focus & Keyboard",
        xp: 17,
        theory: [
          objectives([
            "Manage focus after modal open and close",
            "Support Tab and Escape patterns",
            "Never remove outline without a replacement",
          ]),
          text(
            "Keyboard users Tab through focusable elements. Trap focus inside modals, return focus to the trigger on close, and handle **Escape** to dismiss. Visible **focus rings** are not optional decoration — they show where you are.",
          ),
          callout(
            "warning",
            "Removing `outline: none` without custom focus styles makes your app unusable for keyboard users.",
          ),
          quiz(
            "What key typically closes a modal?",
            ["Enter", "Escape", "Space", "Tab"],
            1,
            "Escape is the standard dismiss key for overlays and dialogs.",
          ),
        ],
        challenge: {
          title: "Focusable Filter",
          description:
            "Write `isFocusable(el)` returning true for mock elements with `tag` button or a, or `tabIndex === 0`. Log results for button and div.",
          starterCode: `function isFocusable(el) {
  // button, a, or tabIndex 0
}

console.log(isFocusable({ tag: "button" }));
console.log(isFocusable({ tag: "div" }));
`,
          solutionCode: `function isFocusable(el) {
  if (el.tag === "button" || el.tag === "a") return true;
  if (el.tabIndex === 0) return true;
  return false;
}

console.log(isFocusable({ tag: "button" }));
console.log(isFocusable({ tag: "div" }));`,
          tests: [
            { id: 1, label: "Defines isFocusable", keywords: [{ pattern: "function\\s+isFocusable" }] },
            { id: 2, label: "Checks button", keywords: [{ pattern: "button" }] },
            { id: 3, label: "Two console.log calls", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
    ],
  },
  {
    id: "web-security",
    title: "Web Security",
    icon: "shield",
    color: SECURITY_COLOR,
    lessons: [
      {
        id: "jsweb-25",
        title: "XSS Prevention",
        xp: 18,
        theory: [
          objectives([
            "Explain cross-site scripting (XSS)",
            "Never inject user HTML with innerHTML",
            "Escape or sanitize untrusted content",
          ]),
          text(
            "**XSS** happens when attacker-controlled strings run as code in your page — often via `innerHTML` with user nicknames or comments. Use `textContent`, sanitize libraries, or strict Content Security Policy in production.",
          ),
          callout(
            "warning",
            "One `innerHTML = userComment` can steal cookies or session tokens if combined with other vulnerabilities.",
          ),
          quiz(
            "Safer way to show a user nickname?",
            ["innerHTML = nickname", "textContent = nickname", "eval(nickname)", "document.write(nickname)"],
            1,
            "textContent displays text literally — script tags are not executed.",
          ),
        ],
        challenge: {
          title: "Escape HTML",
          description:
            "Write `escapeHtml(str)` replacing `<` and `>` with `&lt;` and `&gt;`. Log escapeHtml('<script>').",
          starterCode: `function escapeHtml(str) {
  // replace < and >
}

console.log(escapeHtml("<script>"));
`,
          solutionCode: `function escapeHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

console.log(escapeHtml("<script>"));`,
          tests: [
            { id: 1, label: "Defines escapeHtml", keywords: [{ pattern: "function\\s+escapeHtml" }] },
            { id: 2, label: "Replaces angle brackets", keywords: [{ pattern: "replace" }] },
            { id: 3, label: "Logs escaped string", keywords: [{ pattern: "console\\.log" }] },
          ],
        },
      },
      {
        id: "jsweb-26",
        title: "Safe Data Flow",
        xp: 17,
        theory: [
          objectives([
            "Treat all client input as untrusted",
            "Validate on server even when client validates",
            "Store tokens in httpOnly cookies when possible",
          ]),
          text(
            "Security is a **pipeline**: validate input, encode output, use HTTPS, limit what you store in localStorage, and never expose secrets in frontend bundles. Your JS course challenges simulate these rules in plain functions.",
          ),
          diagram("Trust boundaries", [
            { id: "user", label: "Browser input", color: SECURITY_COLOR, items: ["Forms", "URL params"] },
            { id: "client", label: "Your JS", color: "#f59e0b", items: ["UX validation", "Not a security gate"] },
            { id: "server", label: "API", color: "#22c55e", items: ["Auth", "Real validation"] },
          ]),
          quiz(
            "Where must password rules be enforced for security?",
            ["CSS only", "Server-side", "console.log", "Favicon"],
            1,
            "Client checks are for UX — attackers can bypass the browser entirely.",
          ),
        ],
        challenge: {
          title: "Sanitize Payload",
          description:
            "Write `sanitizeComment(text)` returning trimmed text with length max 200 (slice if longer). Log length for a 300-char string.",
          starterCode: `function sanitizeComment(text) {
  // trim and max 200 chars
}

const long = "x".repeat(300);
console.log(sanitizeComment(long).length);
`,
          solutionCode: `function sanitizeComment(text) {
  const trimmed = text.trim();
  return trimmed.length > 200 ? trimmed.slice(0, 200) : trimmed;
}

const long = "x".repeat(300);
console.log(sanitizeComment(long).length);`,
          tests: [
            { id: 1, label: "Defines sanitizeComment", keywords: [{ pattern: "function\\s+sanitizeComment" }] },
            { id: 2, label: "Uses slice or substring", keywords: [{ pattern: "slice|substring" }] },
            { id: 3, label: "Logs length 200", keywords: [{ pattern: "console\\.log.*length" }] },
          ],
        },
      },
    ],
  },
  {
    id: "graduation",
    title: "Advanced & Capstone",
    icon: "trophy",
    color: ADVANCED_COLOR,
    lessons: [
      {
        id: "jsweb-27",
        title: "Custom Events",
        xp: 18,
        theory: [
          objectives([
            "Dispatch and listen for custom event names",
            "Decouple components with an event bus",
            "Pass detail payloads in events",
          ]),
          text(
            "Beyond clicks, browsers support **CustomEvent** — your own names like `cart:updated` with a `detail` payload. Micro-frontends and web components use this to talk without tight coupling.",
            {
              label: "Custom event pattern",
              content: `// element.dispatchEvent(new CustomEvent("saved", { detail: { id: 1 } }));
// element.addEventListener("saved", (e) => console.log(e.detail));`,
            },
          ),
          quiz(
            "Why use custom events between UI modules?",
            ["Replace CSS", "Loose coupling — modules do not import each other", "Avoid JavaScript", "Delete the DOM"],
            1,
            "Events let pieces react without direct references — easier to maintain.",
          ),
        ],
        challenge: {
          title: "Emit Custom Event",
          description:
            "Extend the eventBus from earlier: add `emit(event, detail)` logging `event` and `detail.id`. Emit 'saved' with `{ id: 42 }`.",
          starterCode: `const bus = {
  emit(event, detail) {
    console.log(event, detail.id);
  },
};

bus.emit("saved", { id: 42 });
`,
          solutionCode: `const bus = {
  emit(event, detail) {
    console.log(event, detail.id);
  },
};

bus.emit("saved", { id: 42 });`,
          tests: [
            { id: 1, label: "Defines emit", keywords: [{ pattern: "emit\\s*\\(" }] },
            { id: 2, label: "Logs saved", keywords: [{ pattern: "console\\.log.*saved" }] },
            { id: 3, label: "Logs id 42", keywords: [{ pattern: "42" }] },
          ],
        },
      },
      {
        id: "jsweb-28",
        title: "Observers & Lifecycle",
        xp: 19,
        theory: [
          objectives([
            "Describe IntersectionObserver use cases",
            "Clean up listeners and timers on teardown",
            "Avoid memory leaks in long-lived SPAs",
          ]),
          text(
            "**IntersectionObserver** fires when elements enter the viewport — lazy-load images, infinite scroll, play-pause videos. Always **clean up**: `removeEventListener`, `clearInterval`, `observer.disconnect()` when removing UI.",
          ),
          callout(
            "tip",
            "If your app feels slower the longer it runs, suspect listeners or timers that were never removed.",
          ),
          quiz(
            "IntersectionObserver is mainly used for?",
            ["Parsing JSON", "Detecting when elements enter/leave viewport", "Styling CSS", "SQL queries"],
            1,
            "It efficiently reports visibility changes without scroll listeners on every pixel.",
          ),
        ],
        challenge: {
          title: "Cleanup Registry",
          description:
            "Write `createCleanup()` with `add(fn)` and `run()` that calls every fn once then clears. Register two fns that log 'clean'; call run().",
          starterCode: `function createCleanup() {
  const fns = [];
  return {
    add(fn) { fns.push(fn); },
    run() { /* call all and clear */ },
  };
}

const c = createCleanup();
c.add(() => console.log("clean"));
c.add(() => console.log("clean"));
c.run();
`,
          solutionCode: `function createCleanup() {
  const fns = [];
  return {
    add(fn) { fns.push(fn); },
    run() {
      for (const fn of fns) fn();
      fns.length = 0;
    },
  };
}

const c = createCleanup();
c.add(() => console.log("clean"));
c.add(() => console.log("clean"));
c.run();`,
          tests: [
            { id: 1, label: "Defines createCleanup", keywords: [{ pattern: "function\\s+createCleanup" }] },
            { id: 2, label: "Has add method", keywords: [{ pattern: "add\\s*\\(" }] },
            { id: 3, label: "Logs clean", keywords: [{ pattern: "console\\.log\\s*\\(\\s*[\"']clean[\"']" }] },
          ],
        },
      },
      {
        id: "jsweb-29",
        title: "Capstone: Mini Dashboard",
        xp: 25,
        theory: [
          objectives([
            "Combine DOM, events, fetch, storage, and state",
            "Structure a small app into modules",
            "Ship a portfolio-ready project outline",
          ]),
          text(
            "You have the full stack of browser skills: **select and update DOM**, **handle events**, **validate forms**, **fetch JSON**, **persist with storage**, **debounce search**, and **guard against XSS**. A capstone dashboard ties them together — stats cards, filterable table, save preferences, loading and error states.",
          ),
          diagram("Capstone architecture", [
            { id: "state", label: "App state", color: ADVANCED_COLOR, items: ["items[], filter, status"] },
            { id: "ui", label: "Render layer", color: "#3b82f6", items: ["map data to DOM", "event delegation"] },
            { id: "data", label: "Data layer", color: "#22c55e", items: ["fetch + cache", "localStorage prefs"] },
          ]),
          callout(
            "info",
            "Build the capstone challenge below, then recreate it in a real `index.html` with DevTools open — that is your portfolio piece.",
          ),
          quiz(
            "What belongs in a small app state object for a dashboard?",
            [
              "Only CSS colors",
              "items, loading, error, filter — everything the UI reads",
              "Every DOM node reference forever",
              "Server passwords",
            ],
            1,
            "Central state keeps UI predictable and easier to debug.",
          ),
        ],
        challenge: {
          title: "Dashboard Reducer",
          description:
            "Write `dashboardReducer(state, action)` supporting `{ type: 'load' }`, `{ type: 'success', items }`, `{ type: 'fail', error }`. Start `{ status: 'idle', items: [], error: null }`. load sets loading; success sets ready + items; fail sets error. Log status after success with two items.",
          starterCode: `function dashboardReducer(state, action) {
  // handle load, success, fail
}

const next = dashboardReducer(
  { status: "idle", items: [], error: null },
  { type: "success", items: [{ id: 1 }, { id: 2 }] },
);
console.log(next.status, next.items.length);
`,
          solutionCode: `function dashboardReducer(state, action) {
  if (action.type === "load") {
    return { ...state, status: "loading", error: null };
  }
  if (action.type === "success") {
    return { status: "ready", items: action.items, error: null };
  }
  if (action.type === "fail") {
    return { ...state, status: "error", error: action.error };
  }
  return state;
}

const next = dashboardReducer(
  { status: "idle", items: [], error: null },
  { type: "success", items: [{ id: 1 }, { id: 2 }] },
);
console.log(next.status, next.items.length);`,
          tests: [
            { id: 1, label: "Defines dashboardReducer", keywords: [{ pattern: "function\\s+dashboardReducer" }] },
            { id: 2, label: "Handles success", keywords: [{ pattern: "success" }] },
            { id: 3, label: "Logs ready and length", keywords: [{ pattern: "console\\.log.*items\\.length" }] },
          ],
        },
      },
    ],
  },
];
