// PolyCode — JavaScript Web Development course (beginner → advanced)
// 11 chapters · 30 lessons · browser worker challenges (DOM simulated in code)
// YouTube links: edit jsWebDevVideoLinks.js

import { applyLessonVideoLinks } from "../../shared/applyLessonVideoLinks";
import { JS_WEB_DEV_VIDEO_LINKS } from "./jsWebDevVideoLinks";
import { JS_WEB_DEV_EXTENDED_CHAPTERS } from "./jsWebDevChaptersExtended";
import {
  quiz,
  callout,
  text,
  diagram,
  table,
  objectives,
} from "../../js-fundamentals/data/jsCurriculumHelpers";

export const JS_WEB_DEV_CHAPTERS = [
  {
    id: "dom-foundations",
    title: "DOM Foundations",
    icon: "globe",
    color: "#22c55e",
    lessons: [
      {
        id: "jsweb-0",
        title: "What is the DOM?",
        xp: 10,
        theory: [
          objectives([
            "Explain what the DOM is and why it matters",
            "Picture a page as a tree of nodes",
            "Connect HTML structure to JavaScript access",
          ]),
          text(
            "When a browser loads a web page, it builds an in-memory **model** of that page called the **Document Object Model** (DOM). Every heading, paragraph, button, and input becomes a **node** in a tree — and JavaScript can read and change that tree to update what users see.",
            {
              label: "HTML becomes a live tree",
              content: `// Simplified mental model (not real browser code)
const page = {
  tag: "body",
  children: [
    { tag: "h1", text: "Welcome" },
    { tag: "p", text: "Learn web dev with PolyCode" },
  ],
};
console.log(page.children[0].text); // "Welcome"`,
            },
          ),
          diagram("From HTML file to interactive page", [
            {
              id: "html",
              label: "HTML file",
              color: "#22c55e",
              items: ["Tags & structure", "Sent over the network", "Parsed by browser"],
            },
            {
              id: "dom",
              label: "DOM tree",
              color: "#3b82f6",
              items: ["Nodes & children", "Live in memory", "Updated by JS"],
            },
            {
              id: "screen",
              label: "What users see",
              color: "#f59e0b",
              items: ["Rendered pixels", "Clicks & typing", "Animations"],
            },
          ]),
          text(
            "The DOM is **not** your `.html` file on disk — it is a **live** representation. When JavaScript changes a node's text or adds a child, the browser re-renders. That is how single-page apps update without a full page reload.",
          ),
          table("Common node types you'll meet", ["Type", "Example in HTML", "What JS can do"], [
            ["Element", "<button>", "Change text, classes, attributes"],
            ["Text", "Hello inside <p>", "Read or replace text content"],
            ["Document", "The whole page", "querySelector, createElement"],
          ]),
          callout(
            "tip",
            "Open DevTools (**F12** → Elements) to see the real DOM tree for any site. Click a node and watch how HTML nests inside parent elements.",
          ),
          callout(
            "info",
            "In PolyCode challenges, we **simulate** the DOM with plain objects so your code runs safely in a worker without a real browser page.",
          ),
          quiz(
            "What does the DOM represent?",
            [
              "The CSS stylesheet only",
              "A live tree of page nodes in memory",
              "The server database",
              "The URL in the address bar",
            ],
            1,
            "The DOM is the browser's in-memory tree built from HTML — JavaScript reads and updates it.",
          ),
        ],
        challenge: {
          title: "Count DOM Nodes",
          description:
            "Given a nested `domTree` object, write a function `countNodes(node)` that returns the total number of nodes (the node itself plus all descendants). Log the result for the sample tree.",
          starterCode: `const domTree = {
  tag: "div",
  children: [
    { tag: "h1", children: [] },
    { tag: "p", children: [{ tag: "span", children: [] }] },
  ],
};

function countNodes(node) {
  // count this node + all children recursively
}

console.log(countNodes(domTree));
`,
          solutionCode: `const domTree = {
  tag: "div",
  children: [
    { tag: "h1", children: [] },
    { tag: "p", children: [{ tag: "span", children: [] }] },
  ],
};

function countNodes(node) {
  let total = 1;
  for (const child of node.children) {
    total += countNodes(child);
  }
  return total;
}

console.log(countNodes(domTree));`,
          tests: [
            {
              id: 1,
              label: "Defines countNodes function",
              keywords: [{ pattern: "function\\s+countNodes" }],
            },
            {
              id: 2,
              label: "Uses recursion or loop on children",
              keywords: [{ pattern: "children" }],
            },
            {
              id: 3,
              label: "Logs countNodes result",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*countNodes" }],
            },
          ],
        },
      },
      {
        id: "jsweb-1",
        title: "Selecting Elements",
        xp: 12,
        theory: [
          objectives([
            "Use querySelector and querySelectorAll patterns",
            "Understand ID vs class vs tag selectors",
            "Find nodes in a simulated DOM tree",
          ]),
          text(
            "Before you change the page, you need to **find** the right element. In a real browser, `document.querySelector('.btn')` returns the first match, and `document.querySelectorAll('li')` returns every match.",
          ),
          text(
            "Selectors use **CSS syntax**: `#id` for one element with an id, `.class` for class, and `tag` for element name. Combine them: `form input[name=\"email\"]` targets a specific input.",
            {
              label: "Common selectors",
              content: `// In the browser:
// document.getElementById("hero")
// document.querySelector(".card")
// document.querySelectorAll("button.primary")`,
            },
          ),
          table("Selector cheat sheet", ["Selector", "Matches", "Returns"], [
            ["#main", 'id="main"', "One element (or null)"],
            [".active", 'class contains active', "First match / all matches"],
            ["button", "Every <button>", "NodeList of buttons"],
            ["div > p", "Direct child <p> of <div>", "Nested structure"],
          ]),
          diagram("Selection flow", [
            {
              id: "doc",
              label: "document",
              color: "#22c55e",
              items: ["Root of the tree", "querySelector entry point"],
            },
            {
              id: "sel",
              label: "CSS selector",
              color: "#3b82f6",
              items: ["#id, .class, tag", "Same as styling"],
            },
            {
              id: "el",
              label: "Element node",
              color: "#f59e0b",
              items: ["Read .textContent", "Change classes", "Attach listeners"],
            },
          ]),
          callout(
            "warning",
            "`querySelector` returns **null** if nothing matches — always check before using the result, or you will get \"Cannot read property of null\" errors.",
          ),
          callout(
            "tip",
            "Prefer **specific** selectors: `#submit-btn` beats `div div button` — easier to read and less likely to break when layout changes.",
          ),
          quiz(
            "Which selector finds the element with id=\"menu\"?",
            [".menu", "#menu", "menu", "*menu"],
            1,
            "The # prefix means id in CSS selectors — #menu matches id=\"menu\".",
          ),
        ],
        challenge: {
          title: "Find by Selector",
          description:
            "Implement `findById(tree, id)` and `findByTag(tree, tag)` that search a nested tree (each node may have `id`, `tag`, and `children`). Log the tag of the node with id \"title\".",
          starterCode: `const tree = {
  tag: "div",
  children: [
    { tag: "h1", id: "title", children: [] },
    { tag: "p", id: "intro", children: [] },
  ],
};

function findById(node, id) {
  // return matching node or null
}

function findByTag(node, tag) {
  // return first node with matching tag or null
}

const found = findById(tree, "title");
console.log(found ? found.tag : "not found");
`,
          solutionCode: `const tree = {
  tag: "div",
  children: [
    { tag: "h1", id: "title", children: [] },
    { tag: "p", id: "intro", children: [] },
  ],
};

function findById(node, id) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const match = findById(child, id);
    if (match) return match;
  }
  return null;
}

function findByTag(node, tag) {
  if (node.tag === tag) return node;
  for (const child of node.children) {
    const match = findByTag(child, tag);
    if (match) return match;
  }
  return null;
}

const found = findById(tree, "title");
console.log(found ? found.tag : "not found");`,
          tests: [
            {
              id: 1,
              label: "Defines findById",
              keywords: [{ pattern: "function\\s+findById" }],
            },
            {
              id: 2,
              label: "Defines findByTag",
              keywords: [{ pattern: "function\\s+findByTag" }],
            },
            {
              id: 3,
              label: "Logs found tag",
              keywords: [{ pattern: "console\\.log.*found" }],
            },
          ],
        },
      },
      {
        id: "jsweb-2",
        title: "Changing Content & Classes",
        xp: 14,
        theory: [
          objectives([
            "Update text safely with textContent",
            "Toggle CSS classes with classList",
            "Know when innerHTML is risky",
          ]),
          text(
            "Once you have a reference to an element, you can change what it shows. **`textContent`** sets plain text (safe — no HTML parsing). **`innerHTML`** parses HTML strings — powerful but dangerous if the string comes from users (XSS risk).",
            {
              label: "Safe text update vs HTML",
              content: `// Simulated element object
const el = { textContent: "Old", classList: ["card"] };
el.textContent = "Updated title";
el.classList.push("highlight");
console.log(el.textContent, el.classList.join(" "));`,
            },
          ),
          text(
            "**classList** is your friend for styling states: `add`, `remove`, `toggle`, and `contains`. Instead of flipping many inline styles in JS, toggle one class and let CSS do the visual work.",
            {
              label: "classList operations (browser API)",
              content: `// btn.classList.add("loading");
// btn.classList.remove("hidden");
// btn.classList.toggle("active");
// btn.classList.contains("active"); // true/false`,
            },
          ),
          table("Property vs use case", ["API", "Best for", "Caution"], [
            ["textContent", "Headings, labels, counters", "Strips HTML — good for safety"],
            ["innerHTML", "Rich markup from trusted source", "Never with raw user input"],
            ["classList.toggle", "Open menus, active tabs", "Pair with CSS classes"],
            ["setAttribute", 'href, aria-label, data-*', "Accessibility matters"],
          ]),
          diagram("Update flow", [
            {
              id: "select",
              label: "1. Select element",
              color: "#22c55e",
              items: ["querySelector", "Store reference"],
            },
            {
              id: "mutate",
              label: "2. Mutate DOM",
              color: "#3b82f6",
              items: ["textContent", "classList", "attributes"],
            },
            {
              id: "render",
              label: "3. Browser renders",
              color: "#f59e0b",
              items: ["Reflow / repaint", "User sees change"],
            },
          ]),
          callout(
            "tip",
            "For a loading button: toggle class `loading`, set `disabled` attribute, and change `textContent` to \"Saving…\" — three small updates, one clear UX.",
          ),
          quiz(
            "Which property is safest for user-provided plain text?",
            ["innerHTML", "textContent", "outerHTML", "document.write"],
            1,
            "textContent treats input as text only — it does not interpret HTML tags.",
          ),
        ],
        challenge: {
          title: "Toggle Highlight Class",
          description:
            "Write `updateElement(el, text, className)` that sets `textContent`, toggles `className` in `el.classes` array (add if missing, remove if present), and returns the element. Test on a mock element and log the final classes joined by space.",
          starterCode: `const mockEl = { textContent: "", classes: ["card"] };

function updateElement(el, text, className) {
  // set text, toggle className in el.classes, return el
}

const result = updateElement(mockEl, "Hello", "highlight");
console.log(result.textContent, result.classes.join(" "));
`,
          solutionCode: `const mockEl = { textContent: "", classes: ["card"] };

function updateElement(el, text, className) {
  el.textContent = text;
  const idx = el.classes.indexOf(className);
  if (idx === -1) {
    el.classes.push(className);
  } else {
    el.classes.splice(idx, 1);
  }
  return el;
}

const result = updateElement(mockEl, "Hello", "highlight");
console.log(result.textContent, result.classes.join(" "));`,
          tests: [
            {
              id: 1,
              label: "Defines updateElement",
              keywords: [{ pattern: "function\\s+updateElement" }],
            },
            {
              id: 2,
              label: "Sets textContent",
              keywords: [{ pattern: "textContent\\s*=" }],
            },
            {
              id: 3,
              label: "Logs text and classes",
              keywords: [{ pattern: "console\\.log.*classes" }],
            },
          ],
        },
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    icon: "radio",
    color: "#3b82f6",
    lessons: [
      {
        id: "jsweb-3",
        title: "Event Listeners",
        xp: 12,
        theory: [
          objectives([
            "Attach listeners with addEventListener",
            "Name common events: click, input, submit",
            "Remove listeners when cleaning up",
          ]),
          text(
            "Websites feel alive because they **react** to users. An **event** is a signal — a click, key press, form submit, or scroll. You register an **event listener**: when the event fires, your callback runs.",
            {
              label: "Classic click listener (browser)",
              content: `const btn = document.querySelector("#save");
btn.addEventListener("click", () => {
  console.log("Saved!");
});`,
            },
          ),
          text(
            "`addEventListener(type, handler)` is preferred over old `onclick` attributes — you can add multiple handlers and remove them with `removeEventListener` when a component unmounts.",
          ),
          table("Events you'll use daily", ["Event", "Fires when", "Typical handler job"], [
            ["click", "Mouse click / tap", "Open modal, navigate"],
            ["input", "Field value changes", "Live search, char count"],
            ["submit", "Form submitted", "Validate, send data"],
            ["keydown", "Key pressed", "Shortcuts, Enter to send"],
          ]),
          diagram("Event loop (simplified)", [
            {
              id: "user",
              label: "User action",
              color: "#3b82f6",
              items: ["Click button", "Type in input"],
            },
            {
              id: "browser",
              label: "Browser dispatches",
              color: "#22c55e",
              items: ["Creates event object", "Calls listeners"],
            },
            {
              id: "js",
              label: "Your callback",
              color: "#f59e0b",
              items: ["Update DOM", "Fetch API", "Update state"],
            },
          ]),
          callout(
            "tip",
            "Use **named functions** when you need to remove a listener later: `element.removeEventListener('click', handleClick)`.",
          ),
          quiz(
            "Which method registers a handler without overwriting others?",
            [
              "element.onclick = fn",
              "addEventListener",
              "document.write",
              "innerHTML",
            ],
            1,
            "addEventListener stacks handlers; onclick replaces the previous handler.",
          ),
        ],
        challenge: {
          title: "Mini Event Bus",
          description:
            "Create an `eventBus` object with `on(event, fn)` and `emit(event, data)` that calls all registered handlers. Register a click handler that logs \"clicked\", then emit \"click\".",
          starterCode: `const eventBus = {
  handlers: {},
  on(event, fn) {
    // register fn for event
  },
  emit(event, data) {
    // call all handlers for event
  },
};

// register and emit
`,
          solutionCode: `const eventBus = {
  handlers: {},
  on(event, fn) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(fn);
  },
  emit(event, data) {
    const list = this.handlers[event] || [];
    for (const fn of list) fn(data);
  },
};

eventBus.on("click", () => console.log("clicked"));
eventBus.emit("click");`,
          tests: [
            {
              id: 1,
              label: "eventBus has on method",
              keywords: [{ pattern: "on\\s*\\(\\s*event" }],
            },
            {
              id: 2,
              label: "eventBus has emit method",
              keywords: [{ pattern: "emit\\s*\\(\\s*event" }],
            },
            {
              id: 3,
              label: "Logs clicked",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*[\"']clicked[\"']" }],
            },
          ],
        },
      },
      {
        id: "jsweb-4",
        title: "The Event Object",
        xp: 14,
        theory: [
          objectives([
            "Read event.type and event.target",
            "Call preventDefault on submit links",
            "Use event data in handlers",
          ]),
          text(
            "When a listener runs, the browser passes an **event object** as the first argument. It describes **what** happened (`type`), **where** (`target`), and gives controls like `preventDefault()` to stop default browser behavior.",
            {
              label: "Handler receives event",
              content: `function handleSubmit(e) {
  e.preventDefault(); // don't reload page
  console.log(e.type, e.target);
}
// form.addEventListener("submit", handleSubmit);`,
            },
          ),
          text(
            "`event.target` is the element that triggered the event (often the innermost clicked node). `event.currentTarget` is the element the listener is attached to — useful in delegation.",
          ),
          table("Event object highlights", ["Property / method", "Meaning", "Example use"], [
            ["type", "Event name string", "'click', 'input', 'submit'"],
            ["target", "Element that triggered", "Read input.value"],
            ["preventDefault()", "Cancel default action", "Stop form navigation"],
            ["stopPropagation()", "Don't bubble to parents", "Nested clickable areas"],
          ]),
          callout(
            "warning",
            "Forgetting `preventDefault()` on form **submit** causes a full page reload — the #1 beginner bug in web forms.",
          ),
          callout(
            "info",
            "In our simulations, event objects are plain `{ type, target, defaultPrevented }` objects — same ideas, no real browser needed.",
          ),
          quiz(
            "What does preventDefault() do on a form submit event?",
            [
              "Deletes the form from the DOM",
              "Stops the browser's default submit navigation",
              "Prevents all future events",
              "Clears all input values",
            ],
            1,
            "preventDefault stops the browser from doing its default action — like navigating away on submit.",
          ),
        ],
        challenge: {
          title: "Handle Mock Submit",
          description:
            "Write `handleSubmit(event)` that calls `preventDefault` (set `defaultPrevented = true`), logs `event.type`, and returns whether default was prevented. Test with a mock event and log the result.",
          starterCode: `function handleSubmit(event) {
  // prevent default, log type, return defaultPrevented
}

const mockEvent = {
  type: "submit",
  target: { tag: "form" },
  defaultPrevented: false,
  preventDefault() {
    this.defaultPrevented = true;
  },
};

console.log(handleSubmit(mockEvent));
`,
          solutionCode: `function handleSubmit(event) {
  event.preventDefault();
  console.log(event.type);
  return event.defaultPrevented;
}

const mockEvent = {
  type: "submit",
  target: { tag: "form" },
  defaultPrevented: false,
  preventDefault() {
    this.defaultPrevented = true;
  },
};

console.log(handleSubmit(mockEvent));`,
          tests: [
            {
              id: 1,
              label: "Defines handleSubmit",
              keywords: [{ pattern: "function\\s+handleSubmit" }],
            },
            {
              id: 2,
              label: "Calls preventDefault",
              keywords: [{ pattern: "preventDefault\\s*\\(" }],
            },
            {
              id: 3,
              label: "Logs event type",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*event\\.type" }],
            },
          ],
        },
      },
      {
        id: "jsweb-5",
        title: "Event Delegation",
        xp: 14,
        theory: [
          objectives([
            "Explain event bubbling",
            "Attach one listener on a parent",
            "Match targets with closest or tag checks",
          ]),
          text(
            "**Event delegation** means listening on a **parent** instead of every child. Clicks **bubble** up the DOM tree — a click on `<li>` also hits `<ul>` and `<body>`. One parent handler can serve dozens of dynamic children.",
            {
              label: "Delegation pattern",
              content: `list.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item) return;
  console.log("Clicked", item.dataset.id);
});`,
            },
          ),
          diagram("Bubbling up the tree", [
            {
              id: "li",
              label: "<li> clicked",
              color: "#3b82f6",
              items: ["target = li", "Handler on li runs"],
            },
            {
              id: "ul",
              label: "<ul> hears bubble",
              color: "#22c55e",
              items: ["Delegation handler", "One listener for all items"],
            },
            {
              id: "body",
              label: "<body>",
              color: "#94a3b8",
              items: ["Bubble continues", "Rarely attach here"],
            },
          ]),
          text(
            "Delegation shines for **dynamic lists** — todo items, chat messages, table rows added by JavaScript. You do not re-attach listeners every time HTML changes.",
          ),
          callout(
            "tip",
            "Use `event.target.closest('button')` to find the nearest matching ancestor-or-self — ignores stray clicks on icons inside the button.",
          ),
          quiz(
            "Why use delegation on a todo list?",
            [
              "It makes CSS faster",
              "New items work without new listeners",
              "It prevents all errors",
              "It replaces fetch",
            ],
            1,
            "One parent listener handles current and future children — perfect for dynamic lists.",
          ),
        ],
        challenge: {
          title: "Delegate Clicks",
          description:
            "Given `children` array of `{ id, tag }`, write `delegateClick(children, targetId, handler)` that finds the child whose `id` matches `targetId`, runs `handler(child)`, and returns true — or returns false if no match. Log the result.",
          starterCode: `const items = [
  { id: "a", tag: "li" },
  { id: "b", tag: "li" },
  { id: "c", tag: "li" },
];

function delegateClick(children, targetId, handler) {
  // find child by id, call handler, return true/false
}

const ok = delegateClick(items, "b", (child) => console.log(child.id));
console.log(ok);
`,
          solutionCode: `const items = [
  { id: "a", tag: "li" },
  { id: "b", tag: "li" },
  { id: "c", tag: "li" },
];

function delegateClick(children, targetId, handler) {
  const child = children.find((c) => c.id === targetId);
  if (!child) return false;
  handler(child);
  return true;
}

const ok = delegateClick(items, "b", (child) => console.log(child.id));
console.log(ok);`,
          tests: [
            {
              id: 1,
              label: "Defines delegateClick",
              keywords: [{ pattern: "function\\s+delegateClick" }],
            },
            {
              id: 2,
              label: "Uses find or loop",
              keywords: [{ pattern: "\\.find\\s*\\(|for\\s*\\(" }],
            },
            {
              id: 3,
              label: "Logs handler result or ok",
              keywords: [{ pattern: "console\\.log" }],
            },
          ],
        },
      },
    ],
  },
  {
    id: "forms",
    title: "Forms & Validation",
    icon: "clipboard-list",
    color: "#f59e0b",
    lessons: [
      {
        id: "jsweb-6",
        title: "Working with Forms",
        xp: 14,
        theory: [
          objectives([
            "Read values from form fields",
            "Understand name attributes and FormData",
            "Serialize form state to an object",
          ]),
          text(
            "Forms collect user input — login, signup, checkout, search. Each control (`input`, `select`, `textarea`) has a **name** that becomes the key when you read data. In the browser, `new FormData(form)` builds key-value pairs automatically.",
            {
              label: "Simulated form object",
              content: `const form = {
  fields: {
    email: "sara@example.com",
    password: "secret123",
    remember: true,
  },
};
console.log(form.fields.email);`,
            },
          ),
          table("Control types & values", ["Input type", "Value shape", "Notes"], [
            ["text / email", "string", "Trim whitespace before save"],
            ["checkbox", "boolean", "checked or unchecked"],
            ["number", "number", "May need parsing"],
            ["select", "string (option value)", "One or multiple"],
          ]),
          diagram("Form submit path", [
            {
              id: "input",
              label: "User fills fields",
              color: "#f59e0b",
              items: ["Types email", "Checks remember me"],
            },
            {
              id: "read",
              label: "JS reads values",
              color: "#22c55e",
              items: ["FormData or fields object", "Build payload"],
            },
            {
              id: "send",
              label: "Send or save",
              color: "#3b82f6",
              items: ["fetch POST", "Update app state"],
            },
          ]),
          callout(
            "tip",
            "Always know whether you are reading **on submit** or **on input** — live validation uses `input` events; final payload usually on `submit`.",
          ),
          quiz(
            "What does the name attribute on an input control?",
            [
              "Sets the CSS class",
              "Becomes the key when collecting form data",
              "Hides the field from screen readers",
              "Encrypts the value",
            ],
            1,
            "The name attribute labels the field in FormData and server payloads — e.g. name=\"email\".",
          ),
        ],
        challenge: {
          title: "Form to Object",
          description:
            "Write `formToObject(fields)` that takes `{ key: value }` and returns a new object with trimmed string values (non-strings unchanged). Log the result for a sample form.",
          starterCode: `const fields = {
  username: "  polycode  ",
  email: "learn@polycode.dev ",
  age: 25,
};

function formToObject(fields) {
  // trim strings, copy other types as-is
}

console.log(formToObject(fields));
`,
          solutionCode: `const fields = {
  username: "  polycode  ",
  email: "learn@polycode.dev ",
  age: 25,
};

function formToObject(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = typeof value === "string" ? value.trim() : value;
  }
  return result;
}

console.log(formToObject(fields));`,
          tests: [
            {
              id: 1,
              label: "Defines formToObject",
              keywords: [{ pattern: "function\\s+formToObject" }],
            },
            {
              id: 2,
              label: "Trims strings",
              keywords: [{ pattern: "\\.trim\\s*\\(" }],
            },
            {
              id: 3,
              label: "Logs result",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*formToObject" }],
            },
          ],
        },
      },
      {
        id: "jsweb-7",
        title: "Validation Basics",
        xp: 15,
        theory: [
          objectives([
            "Validate required fields and formats",
            "Return clear error messages",
            "Validate before sending to a server",
          ]),
          text(
            "**Client-side validation** gives instant feedback — empty email, password too short, mismatched confirm fields. It improves UX but never replaces **server validation** (users can bypass the browser).",
            {
              label: "Simple validators",
              content: `function isRequired(value) {
  return value.trim().length > 0;
}
function isEmail(value) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}`,
            },
          ),
          table("Validation rules (common)", ["Rule", "Check", "User message"], [
            ["Required", "Non-empty after trim", "This field is required"],
            ["Email format", "Contains @ and domain", "Enter a valid email"],
            ["Min length", "password.length >= 8", "At least 8 characters"],
            ["Match", "password === confirm", "Passwords must match"],
          ]),
          text(
            "Return **structured errors** — an object like `{ email: \"Invalid email\" }` — instead of one generic alert. Your UI can highlight the exact field.",
          ),
          callout(
            "warning",
            "Regex email checks catch obvious typos, not every RFC edge case. For production, still verify on the server and send confirmation emails.",
          ),
          quiz(
            "Why validate on the server even if the client validates?",
            [
              "Server is slower so it must check",
              "Client validation can be bypassed",
              "HTML forms cannot validate",
              "CSS requires it",
            ],
            1,
            "Anyone can send raw HTTP requests — never trust the browser alone.",
          ),
        ],
        challenge: {
          title: "Validate Signup",
          description:
            "Write `validateSignup({ email, password })` returning `{ valid: true }` or `{ valid: false, errors: { ... } }`. Email must contain @, password at least 8 chars. Log the result.",
          starterCode: `function validateSignup({ email, password }) {
  // return { valid: true } or { valid: false, errors: { email?, password? } }
}

console.log(validateSignup({ email: "bad", password: "short" }));
`,
          solutionCode: `function validateSignup({ email, password }) {
  const errors = {};
  if (!email.includes("@")) errors.email = "Enter a valid email";
  if (password.length < 8) errors.password = "At least 8 characters";
  if (Object.keys(errors).length === 0) return { valid: true };
  return { valid: false, errors };
}

console.log(validateSignup({ email: "bad", password: "short" }));`,
          tests: [
            {
              id: 1,
              label: "Defines validateSignup",
              keywords: [{ pattern: "function\\s+validateSignup" }],
            },
            {
              id: 2,
              label: "Checks email or password",
              keywords: [{ pattern: "email|password" }],
            },
            {
              id: 3,
              label: "Returns valid false or errors",
              keywords: [{ pattern: "valid\\s*:" }],
            },
          ],
        },
      },
      {
        id: "jsweb-8",
        title: "UX Feedback",
        xp: 16,
        theory: [
          objectives([
            "Show inline errors next to fields",
            "Disable submit while saving",
            "Communicate success and failure clearly",
          ]),
          text(
            "Great forms **talk back**. Red border + message under the field beats one alert box. Disable the submit button while `fetch` runs so users do not double-post. On success, show a confirmation or redirect.",
          ),
          diagram("Form UI states", [
            {
              id: "idle",
              label: "Idle",
              color: "#94a3b8",
              items: ["Submit enabled", "No error text"],
            },
            {
              id: "invalid",
              label: "Invalid",
              color: "#ef4444",
              items: ["Inline errors", "Focus first problem"],
            },
            {
              id: "loading",
              label: "Submitting",
              color: "#f59e0b",
              items: ["Button disabled", "Spinner / Saving…"],
            },
            {
              id: "done",
              label: "Success",
              color: "#22c55e",
              items: ["Thank you message", "Clear form or navigate"],
            },
          ]),
          text(
            "Model UI state in one object — `{ status: 'idle' | 'loading' | 'error' | 'success', errors: {}, message: '' }` — and render from that. Same pattern works in vanilla JS or React.",
            {
              label: "UI state object",
              content: `const formState = {
  status: "idle",
  errors: {},
  message: "",
};
// status = "loading" during fetch
// status = "error" with errors.email set
// status = "success" with message`,
            },
          ),
          callout(
            "tip",
            "Move focus to the first invalid field (`field.focus()`) — keyboard and screen-reader users find problems faster.",
          ),
          quiz(
            "Best reason to disable submit during an API call?",
            [
              "It makes CSS load faster",
              "Prevents duplicate submissions",
              "It encrypts the password",
              "It removes need for validation",
            ],
            1,
            "Disabling submit stops double-clicks from creating duplicate orders or accounts.",
          ),
        ],
        challenge: {
          title: "Build Form State",
          description:
            "Write `nextFormState(state, action)` for actions: `{ type: 'submit' }`, `{ type: 'success', message }`, `{ type: 'error', errors }`. Start `{ status: 'idle' }`. submit → loading; success → success + message; error → error + errors. Log state after an error action.",
          starterCode: `function nextFormState(state, action) {
  // reducer-style state updates
}

const afterError = nextFormState(
  { status: "idle" },
  { type: "error", errors: { email: "Invalid" } },
);
console.log(afterError.status, afterError.errors);
`,
          solutionCode: `function nextFormState(state, action) {
  if (action.type === "submit") {
    return { ...state, status: "loading", errors: {}, message: "" };
  }
  if (action.type === "success") {
    return { status: "success", errors: {}, message: action.message };
  }
  if (action.type === "error") {
    return { status: "error", errors: action.errors, message: "" };
  }
  return state;
}

const afterError = nextFormState(
  { status: "idle" },
  { type: "error", errors: { email: "Invalid" } },
);
console.log(afterError.status, afterError.errors);`,
          tests: [
            {
              id: 1,
              label: "Defines nextFormState",
              keywords: [{ pattern: "function\\s+nextFormState" }],
            },
            {
              id: 2,
              label: "Handles error action",
              keywords: [{ pattern: "error" }],
            },
            {
              id: 3,
              label: "Logs status and errors",
              keywords: [{ pattern: "console\\.log.*afterError" }],
            },
          ],
        },
      },
    ],
  },
  {
    id: "fetch-apis",
    title: "Fetch & APIs",
    icon: "refresh",
    color: "#8b5cf6",
    lessons: [
      {
        id: "jsweb-9",
        title: "The Fetch Pattern",
        xp: 15,
        theory: [
          objectives([
            "Call fetch and read the response",
            "Use async/await with Promises",
            "Know GET vs POST basics",
          ]),
          text(
            "**fetch(url)** returns a **Promise** that resolves to a **Response**. Modern code wraps it in `async/await` so it reads top-to-bottom instead of nested `.then()` chains.",
            {
              label: "async/await fetch",
              content: `async function loadUser() {
  const response = await fetch("/api/user");
  const data = await response.json();
  console.log(data.name);
}`,
            },
          ),
          diagram("fetch timeline", [
            {
              id: "req",
              label: "Request",
              color: "#8b5cf6",
              items: ["URL + method", "Headers, body (POST)"],
            },
            {
              id: "net",
              label: "Network",
              color: "#3b82f6",
              items: ["DNS, TLS, server", "Takes milliseconds+"],
            },
            {
              id: "res",
              label: "Response",
              color: "#22c55e",
              items: ["status code", ".json() parses body"],
            },
          ]),
          table("HTTP methods (intro)", ["Method", "Typical use", "Body?"], [
            ["GET", "Read data", "No"],
            ["POST", "Create / submit", "Yes (JSON)"],
            ["PUT / PATCH", "Update", "Yes"],
            ["DELETE", "Remove", "Rarely"],
          ]),
          callout(
            "info",
            "In challenges we mock fetch with `Promise.resolve({ ok: true, json: () => ... })` — same async patterns, no real network.",
          ),
          quiz(
            "What does await fetch(url) give you first?",
            [
              "Parsed JSON object",
              "A Response object",
              "An array buffer always",
              "undefined",
            ],
            1,
            "fetch resolves to a Response — you call .json() or .text() to read the body.",
          ),
        ],
        challenge: {
          title: "Mock Fetch User",
          description:
            "Write async `loadUser()` that awaits a mock `fetchUser()` Promise returning `{ ok: true, json: () => ({ name: 'Poly' }) }`, parses JSON, and logs `data.name`. Use async/await.",
          starterCode: `function fetchUser() {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ name: "Poly" }),
  });
}

async function loadUser() {
  // await fetchUser, parse json, log name
}

loadUser();
`,
          solutionCode: `function fetchUser() {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ name: "Poly" }),
  });
}

async function loadUser() {
  const response = await fetchUser();
  const data = await response.json();
  console.log(data.name);
}

loadUser();`,
          tests: [
            {
              id: 1,
              label: "async loadUser function",
              keywords: [{ pattern: "async\\s+function\\s+loadUser" }],
            },
            {
              id: 2,
              label: "Uses await",
              keywords: [{ pattern: "await" }],
            },
            {
              id: 3,
              label: "Logs data.name",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*data\\.name" }],
            },
          ],
        },
      },
      {
        id: "jsweb-10",
        title: "JSON APIs",
        xp: 16,
        theory: [
          objectives([
            "Parse JSON strings safely",
            "Map API fields to UI state",
            "Send JSON with POST headers",
          ]),
          text(
            "Most web APIs speak **JSON** — text that looks like JavaScript objects. `JSON.parse(string)` turns text into data; `JSON.stringify(obj)` turns data into text for request bodies.",
            {
              label: "Parse and use API data",
              content: `const raw = '{"id":1,"title":"Learn DOM"}';
const lesson = JSON.parse(raw);
console.log(lesson.title);`,
            },
          ),
          text(
            "POST requests usually set `Content-Type: application/json` and pass `body: JSON.stringify(payload)`. The server responds with JSON you parse the same way.",
            {
              label: "POST with JSON body",
              content: `await fetch("/api/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "New task" }),
});`,
            },
          ),
          table("JSON helpers", ["Function", "Input", "Output"], [
            ["JSON.parse", "JSON string", "Object / array"],
            ["JSON.stringify", "Object / array", "JSON string"],
            ["response.json()", "Response body stream", "Promise of parsed data"],
          ]),
          callout(
            "tip",
            "API field names are often **snake_case** (`user_id`) while JS prefers **camelCase** (`userId`) — map them once when data arrives.",
          ),
          quiz(
            "How do you send a JavaScript object as a JSON POST body?",
            [
              "body: obj",
              "body: JSON.stringify(obj)",
              "body: obj.toString()",
              "headers: obj",
            ],
            1,
            "fetch expects body as a string or FormData — JSON.stringify converts your object.",
          ),
        ],
        challenge: {
          title: "Map API Lessons",
          description:
            "Given JSON string of lessons `[{ \"title\": \"DOM\" }, { \"title\": \"Events\" }]`, parse it and log titles joined with comma using `.map(l => l.title).join(', ')`.",
          starterCode: `const json = '[{"title":"DOM"},{"title":"Events"}]';

// parse, map titles, join, log
`,
          solutionCode: `const json = '[{"title":"DOM"},{"title":"Events"}]';

const lessons = JSON.parse(json);
const titles = lessons.map((l) => l.title).join(", ");
console.log(titles);`,
          tests: [
            {
              id: 1,
              label: "Uses JSON.parse",
              keywords: [{ pattern: "JSON\\.parse" }],
            },
            {
              id: 2,
              label: "Uses map on lessons",
              keywords: [{ pattern: "\\.map\\s*\\(" }],
            },
            {
              id: 3,
              label: "Logs titles",
              keywords: [{ pattern: "console\\.log" }],
            },
          ],
        },
      },
      {
        id: "jsweb-11",
        title: "Error Handling",
        xp: 18,
        theory: [
          objectives([
            "Check response.ok and status codes",
            "Use try/catch for network failures",
            "Show friendly messages to users",
          ]),
          text(
            "A fetch **can fail** two ways: **network error** (no connection) or **HTTP error** (404, 500) where fetch still \"succeeds\" but `response.ok` is false. Handle both.",
            {
              label: "Robust load pattern",
              content: `async function load() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("Load failed:", err.message);
    return null;
  }
}`,
            },
          ),
          table("Status codes (essentials)", ["Code", "Meaning", "User-facing hint"], [
            ["200", "OK", "Show data"],
            ["400", "Bad request", "Check form input"],
            ["401", "Unauthorized", "Please log in"],
            ["404", "Not found", "Item may be deleted"],
            ["500", "Server error", "Try again later"],
          ]),
          diagram("Error handling layers", [
            {
              id: "try",
              label: "try / catch",
              color: "#8b5cf6",
              items: ["Network down", "JSON parse errors"],
            },
            {
              id: "ok",
              label: "response.ok",
              color: "#f59e0b",
              items: ["4xx / 5xx status", "Custom error messages"],
            },
            {
              id: "ui",
              label: "UI message",
              color: "#22c55e",
              items: ["Retry button", "Support link"],
            },
          ]),
          callout(
            "warning",
            "Never show raw server stack traces to users — log details to the console, show a simple friendly message in the UI.",
          ),
          quiz(
            "When does fetch throw without try/catch?",
            [
              "When status is 404",
              "On network failure (no response)",
              "When JSON is invalid",
              "When status is 200",
            ],
            1,
            "fetch rejects on network errors; HTTP 404 still returns a Response — check res.ok.",
          ),
        ],
        challenge: {
          title: "Safe Load Data",
          description:
            "Write async `safeLoad(fetchFn)` that awaits `fetchFn()`, throws if `!response.ok`, else returns `await response.json()`. Wrap in try/catch, log \"error\" on failure or log data on success. Use a mock that returns `{ ok: false, status: 404 }`.",
          starterCode: `function mockFetch() {
  return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
}

async function safeLoad(fetchFn) {
  // try fetch, check ok, return json or catch and log "error"
}

safeLoad(mockFetch);
`,
          solutionCode: `function mockFetch() {
  return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) });
}

async function safeLoad(fetchFn) {
  try {
    const response = await fetchFn();
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("error");
    return null;
  }
}

safeLoad(mockFetch);`,
          tests: [
            {
              id: 1,
              label: "Defines safeLoad",
              keywords: [{ pattern: "async\\s+function\\s+safeLoad" }],
            },
            {
              id: 2,
              label: "Checks response.ok",
              keywords: [{ pattern: "!response\\.ok|response\\.ok" }],
            },
            {
              id: 3,
              label: "Logs error on failure",
              keywords: [{ pattern: "console\\.log\\s*\\(\\s*[\"']error[\"']" }],
            },
          ],
        },
      },
    ],
  },
  {
    id: "storage-projects",
    title: "Storage & Projects",
    icon: "trophy",
    color: "#eab308",
    lessons: [
      {
        id: "jsweb-12",
        title: "localStorage",
        xp: 16,
        theory: [
          objectives([
            "Save and read strings with localStorage",
            "Store objects using JSON.stringify",
            "Know storage limits and privacy basics",
          ]),
          text(
            "**localStorage** keeps key-value data in the browser across page reloads. Values must be **strings** — store objects with `JSON.stringify` on save and `JSON.parse` on load.",
            {
              label: "Save and load preferences",
              content: `localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

const prefs = { fontSize: 16, compact: true };
localStorage.setItem("prefs", JSON.stringify(prefs));
const saved = JSON.parse(localStorage.getItem("prefs"));`,
            },
          ),
          table("Storage comparison (intro)", ["API", "Lifetime", "Shared"], [
            ["localStorage", "Until cleared", "Same origin, all tabs"],
            ["sessionStorage", "Tab session", "One tab only"],
            ["Cookies", "Configurable expiry", "Sent with HTTP requests"],
          ]),
          callout(
            "warning",
            "Never store **passwords** or **auth tokens** in localStorage if XSS is a risk — prefer httpOnly cookies for sensitive sessions in production apps.",
          ),
          callout(
            "tip",
            "Wrap storage in helper functions (`loadState`, `saveState`) so you can swap to memory in tests — exactly what we do in challenges.",
          ),
          quiz(
            "How do you store an array in localStorage?",
            [
              "localStorage.setItem('key', array)",
              "JSON.stringify then setItem",
              "array.save()",
              "document.cookie = array",
            ],
            1,
            "localStorage only stores strings — stringify objects and arrays first.",
          ),
        ],
        challenge: {
          title: "Mock Storage Helpers",
          description:
            "Create `createStorage()` returning `{ set(key, value), get(key) }` backed by a `{}` object, stringifying non-strings on set and parsing JSON on get. Save `{ xp: 100 }` under \"progress\" and log `get('progress').xp`.",
          starterCode: `function createStorage() {
  const data = {};
  return {
    set(key, value) {
      // stringify objects, store string
    },
    get(key) {
      // parse JSON if present, else null
    },
  };
}

const store = createStorage();
store.set("progress", { xp: 100 });
console.log(store.get("progress").xp);
`,
          solutionCode: `function createStorage() {
  const data = {};
  return {
    set(key, value) {
      data[key] = typeof value === "string" ? value : JSON.stringify(value);
    },
    get(key) {
      const raw = data[key];
      if (raw === undefined) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    },
  };
}

const store = createStorage();
store.set("progress", { xp: 100 });
console.log(store.get("progress").xp);`,
          tests: [
            {
              id: 1,
              label: "Defines createStorage",
              keywords: [{ pattern: "function\\s+createStorage" }],
            },
            {
              id: 2,
              label: "Uses JSON.stringify",
              keywords: [{ pattern: "JSON\\.stringify" }],
            },
            {
              id: 3,
              label: "Logs xp value",
              keywords: [{ pattern: "console\\.log.*xp" }],
            },
          ],
        },
      },
      {
        id: "jsweb-13",
        title: "App State",
        xp: 18,
        theory: [
          objectives([
            "Keep one source of truth for UI data",
            "Update state immutably",
            "Re-render from state changes",
          ]),
          text(
            "Interactive apps center on **state** — todos, cart items, logged-in user. Instead of scattered global variables, keep one **state object** and functions that return **new** state when something changes.",
            {
              label: "Immutable todo update",
              content: `const state = { todos: [{ id: 1, text: "Learn DOM", done: false }] };

function toggleTodo(state, id) {
  return {
    ...state,
    todos: state.todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    ),
  };
}`,
            },
          ),
          diagram("State → view loop", [
            {
              id: "state",
              label: "App state",
              color: "#eab308",
              items: ["todos, user, theme", "Single object"],
            },
            {
              id: "render",
              label: "render(state)",
              color: "#22c55e",
              items: ["Update DOM from data", "Called after each change"],
            },
            {
              id: "events",
              label: "User events",
              color: "#3b82f6",
              items: ["state = reducer(state, action)", "Save to localStorage"],
            },
          ]),
          text(
            "This pattern scales from a 50-line todo app to React/Redux — **data in**, **view out**, events send **actions** that produce new state.",
          ),
          callout(
            "tip",
            "After updating state, call `saveState(state)` and `render(state)` — two hooks you can wire to real DOM or keep in simulation.",
          ),
          quiz(
            "Why return a new state object instead of mutating?",
            [
              "JSON requires it",
              "Easier to track changes and debug",
              "localStorage forbids mutation",
              "CSS cannot read mutated objects",
            ],
            1,
            "Immutable updates make change detection, undo, and time-travel debugging possible.",
          ),
        ],
        challenge: {
          title: "Todo Reducer",
          description:
            "Write `todoReducer(state, action)` with actions `{ type: 'add', text }` and `{ type: 'toggle', id }`. State shape `{ todos: [{ id, text, done }] }`. Start empty, add \"Study\", toggle id 1, log done status of first todo.",
          starterCode: `function todoReducer(state, action) {
  // return new state for add and toggle
}

let state = { todos: [] };
state = todoReducer(state, { type: "add", text: "Study" });
state = todoReducer(state, { type: "toggle", id: 1 });
console.log(state.todos[0].done);
`,
          solutionCode: `function todoReducer(state, action) {
  if (action.type === "add") {
    const id = state.todos.length + 1;
    return {
      todos: [...state.todos, { id, text: action.text, done: false }],
    };
  }
  if (action.type === "toggle") {
    return {
      todos: state.todos.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      ),
    };
  }
  return state;
}

let state = { todos: [] };
state = todoReducer(state, { type: "add", text: "Study" });
state = todoReducer(state, { type: "toggle", id: 1 });
console.log(state.todos[0].done);`,
          tests: [
            {
              id: 1,
              label: "Defines todoReducer",
              keywords: [{ pattern: "function\\s+todoReducer" }],
            },
            {
              id: 2,
              label: "Handles add action",
              keywords: [{ pattern: "add" }],
            },
            {
              id: 3,
              label: "Logs done property",
              keywords: [{ pattern: "console\\.log.*done" }],
            },
          ],
        },
      },
      {
        id: "jsweb-14",
        title: "Capstone: Mini App Logic",
        xp: 20,
        theory: [
          objectives([
            "Combine DOM simulation, events, and state",
            "Persist data with storage helpers",
            "Plan a small interactive feature end-to-end",
          ]),
          text(
            "You have the building blocks: **select & update** nodes, **listen** for events, **validate** forms, **fetch** remote data, and **persist** locally. A capstone ties them into one flow — even without a real DOM, the **logic layer** is the same.",
          ),
          diagram("Mini bookmark app architecture", [
            {
              id: "ui",
              label: "UI layer",
              color: "#22c55e",
              items: ["Form + list HTML", "Event listeners"],
            },
            {
              id: "logic",
              label: "Logic layer",
              color: "#eab308",
              items: ["validate, reducer", "fetch / storage"],
            },
            {
              id: "data",
              label: "Data",
              color: "#8b5cf6",
              items: ["localStorage", "REST API"],
            },
          ]),
          text(
            "**Project idea:** Bookmark manager — add URL + title, validate URL contains `http`, save list to storage, render from state, delete on delegated click. Build logic first in the playground, then paste into a real HTML file.",
            {
              label: "End-to-end slice (simulated)",
              content: `// 1. validate input
// 2. state = reducer(state, { type: 'add', bookmark })
// 3. storage.set('bookmarks', state.bookmarks)
// 4. renderList(state.bookmarks)`,
            },
          ),
          callout(
            "info",
            "Congratulations — finishing this course means you can read MDN docs and build real pages. Next step: one `index.html` + `app.js` project deploying to GitHub Pages or Netlify.",
          ),
          quiz(
            "Best order when starting a small web app?",
            [
              "Pick colors first, skip data model",
              "Define state shape and actions, then wire DOM",
              "Write CSS before any HTML",
              "Deploy before testing locally",
            ],
            1,
            "Clear state + actions make UI wiring straightforward — logic first saves rework.",
          ),
        ],
        challenge: {
          title: "Bookmark App Core",
          description:
            "Implement `bookmarkReducer(state, action)` for `{ type: 'add', title, url }` and `{ type: 'remove', id }`. Validate url includes 'http' — if not, return state unchanged. State: `{ bookmarks: [{ id, title, url }] }`. Add one valid bookmark, log `bookmarks.length`.",
          starterCode: `function bookmarkReducer(state, action) {
  // add with http check, remove by id
}

let state = { bookmarks: [] };
state = bookmarkReducer(state, {
  type: "add",
  title: "PolyCode",
  url: "https://polycode.dev",
});
console.log(state.bookmarks.length);
`,
          solutionCode: `function bookmarkReducer(state, action) {
  if (action.type === "add") {
    if (!action.url.includes("http")) return state;
    const id = state.bookmarks.length + 1;
    return {
      bookmarks: [
        ...state.bookmarks,
        { id, title: action.title, url: action.url },
      ],
    };
  }
  if (action.type === "remove") {
    return {
      bookmarks: state.bookmarks.filter((b) => b.id !== action.id),
    };
  }
  return state;
}

let state = { bookmarks: [] };
state = bookmarkReducer(state, {
  type: "add",
  title: "PolyCode",
  url: "https://polycode.dev",
});
console.log(state.bookmarks.length);`,
          tests: [
            {
              id: 1,
              label: "Defines bookmarkReducer",
              keywords: [{ pattern: "function\\s+bookmarkReducer" }],
            },
            {
              id: 2,
              label: "Checks url for http",
              keywords: [{ pattern: "includes\\s*\\(\\s*[\"']http[\"']" }],
            },
            {
              id: 3,
              label: "Logs bookmarks length",
              keywords: [{ pattern: "console\\.log.*bookmarks\\.length" }],
            },
          ],
        },
      },
    ],
  },
  ...JS_WEB_DEV_EXTENDED_CHAPTERS,
];

export const JS_WEB_DEV_LESSONS = applyLessonVideoLinks(
  JS_WEB_DEV_CHAPTERS.flatMap((ch) =>
    ch.lessons.map((l) => ({
      ...l,
      chapterId: ch.id,
      chapterTitle: ch.title,
      chapterColor: ch.color,
    })),
  ),
  JS_WEB_DEV_VIDEO_LINKS,
);

export const JS_WEB_DEV_TOTAL_XP = JS_WEB_DEV_LESSONS.reduce((s, l) => s + l.xp, 0);
