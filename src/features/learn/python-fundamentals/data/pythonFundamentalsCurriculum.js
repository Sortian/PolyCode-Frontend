// PolyCode — Python Fundamentals full curriculum
// 8 chapters · 22 lessons · browser Python challenges (Pyodide)
// YouTube links: edit pythonFundamentalsVideoLinks.js (not this file).

import { applyLessonVideoLinks } from "../../shared/applyLessonVideoLinks";
import { PYTHON_FUNDAMENTALS_VIDEO_LINKS } from "./pythonFundamentalsVideoLinks";
import { applyChapterEnhancements } from "./pythonLessonEnhancements";

const ACCENT = "#3776ab";

const RAW_PYTHON_FUNDAMENTALS_CHAPTERS = [
  {
    id: "foundations",
    title: "Foundations",
    icon: "🐍",
    color: ACCENT,
    lessons: [
      {
        id: "py-0",
        title: "What is Python?",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "**Python** is a high-level, general-purpose language designed for readability. Its clean syntax lets you express ideas in fewer lines than many other languages — which is why it dominates data science, automation, and backend web development.",
          },
          {
            type: "diagram",
            title: "Where Python is used today",
            nodes: [
              {
                id: "data",
                label: "Data & AI",
                color: ACCENT,
                items: ["NumPy & Pandas", "Machine learning", "Research notebooks"],
              },
              {
                id: "web",
                label: "Web & APIs",
                color: "#2563eb",
                items: ["FastAPI & Django", "Microservices", "Scripting glue"],
              },
              {
                id: "ops",
                label: "Automation",
                color: "#3b82f6",
                items: ["DevOps scripts", "Testing", "File processing"],
              },
            ],
          },
          {
            type: "code",
            lang: "python",
            label: "Your first program",
            content: `print("Hello, PolyCode!")`,
          },
          {
            type: "callout",
            variant: "tip",
            content:
              "Python uses **indentation** (usually 4 spaces) to define blocks — not curly braces. The colon `:` starts a block; the next lines must be indented consistently.",
          },
          {
            type: "quiz",
            question: "What does Python use to define code blocks?",
            options: ["Curly braces {}", "Semicolons only", "Indentation", "Parentheses"],
            answer: 2,
            explanation:
              "After a colon, the indented lines belong to that block — if, for, def, class, and more.",
          },
        ],
        challenge: {
          title: "Hello, PolyCode",
          description: "Use `print()` to output exactly: `Hello, PolyCode!`",
          starterCode: `# Your first Python challenge\n\n`,
          solutionCode: `print("Hello, PolyCode!")`,
          tests: [
            { id: 1, label: "Uses print()", keywords: [{ pattern: "print\\s*\\(" }] },
            { id: 2, label: "Prints Hello, PolyCode!", keywords: [{ pattern: "Hello,\\s*PolyCode!" }] },
          ],
        },
      },
      {
        id: "py-0b",
        title: "Running Python",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "You can run Python in three common ways: the **interactive REPL** (type one line at a time), a **`.py` script** (saved file executed top to bottom), or **course challenges** here in PolyCode (Pyodide in the browser).",
          },
          {
            type: "diagram",
            title: "How code executes",
            nodes: [
              { id: "src", label: "Source", color: ACCENT, items: [".py file or REPL", "Top to bottom"] },
              { id: "interp", label: "Interpreter", color: "#2563eb", items: ["Reads each line", "Runs immediately"] },
              { id: "out", label: "Output", color: "#3b82f6", items: ["print() to console", "Errors if syntax fails"] },
            ],
          },
          {
            type: "code",
            lang: "python",
            label: "Multiple print statements",
            content: `print("Line 1")
print("Line 2")
print("Line 3")`,
          },
          {
            type: "callout",
            variant: "info",
            content:
              "When something breaks, Python prints a **traceback** — read from the bottom up to find the error type and line number.",
          },
          {
            type: "quiz",
            question: "In a .py script, in what order does Python run your code?",
            options: ["Random order", "Bottom to top", "Top to bottom", "Alphabetical by function name"],
            answer: 2,
            explanation: "Scripts execute sequentially from the first line unless control flow redirects execution.",
          },
        ],
        challenge: {
          title: "Three-Line Greeting",
          description:
            "Print three lines exactly: `Python`, then `is`, then `fun` — each on its own line using separate `print()` calls.",
          starterCode: `# Three print statements\n\n`,
          solutionCode: `print("Python")
print("is")
print("fun")`,
          tests: [
            { id: 1, label: "Uses print()", keywords: [{ pattern: "print\\s*\\(" }] },
            { id: 2, label: "Prints Python", keywords: [{ pattern: "Python" }] },
            { id: 3, label: "Prints fun", keywords: [{ pattern: "fun" }] },
          ],
        },
      },
    ],
  },
  {
    id: "variables-types",
    title: "Variables & Types",
    icon: "🔢",
    color: "#2563eb",
    lessons: [
      {
        id: "py-1",
        title: "Variables and Basic Types",
        xp: 12,
        theory: [
          {
            type: "text",
            content:
              "A **variable** is a name that refers to a value in memory. Python figures out the type automatically — you do not declare `int x` like in C++.",
          },
          {
            type: "code",
            lang: "python",
            label: "Core types",
            content: `age = 25          # int
price = 19.99     # float
name = "Ada"      # str
active = True     # bool

print(type(age), type(price), type(name), type(active))`,
          },
          {
            type: "callout",
            variant: "tip",
            content:
              "Use descriptive names: `student_count` not `sc`. Constants that never change are often written `MAX_RETRIES = 3`.",
          },
          {
            type: "quiz",
            question: "Which type does `3.14` have in Python?",
            options: ["int", "float", "str", "bool"],
            answer: 1,
            explanation: "Numbers with a decimal point are floats; whole numbers without a dot are ints.",
          },
        ],
        challenge: {
          title: "Store and Print Types",
          description:
            "Create `x = 42` and `y = \"PolyCode\"`, then print `type(x)` and `type(y)` on separate lines.",
          starterCode: `# x, y, then two prints\n\n`,
          solutionCode: `x = 42
y = "PolyCode"
print(type(x))
print(type(y))`,
          tests: [
            { id: 1, label: "Assigns x = 42", keywords: [{ pattern: "x\\s*=\\s*42" }] },
            { id: 2, label: "Uses type()", keywords: [{ pattern: "type\\s*\\(" }] },
          ],
        },
      },
      {
        id: "py-1b",
        title: "Strings and f-strings",
        xp: 12,
        theory: [
          {
            type: "text",
            content:
              "Strings hold text. **f-strings** (formatted string literals) embed variables inside `{}` — they are the modern standard for building messages.",
          },
          {
            type: "code",
            lang: "python",
            label: "f-string formatting",
            content: `name = "Fatima"
score = 95
print(f"{name} scored {score}%")`,
          },
          {
            type: "code",
            lang: "python",
            label: "input() example",
            content: `# name = input("Your name: ")
# print(f"Hello, {name}!")`,
          },
          {
            type: "callout",
            variant: "warning",
            content:
              "Strings use quotes: `\"double\"` or `'single'`. Mixing them incorrectly causes SyntaxError — pick one style per string.",
          },
          {
            type: "quiz",
            question: "Which prints the value of variable `city` inside a sentence?",
            options: ["print(\"city\")", "print(f\"I live in {city}\")", "print(city + city)", "print(type(city))"],
            answer: 1,
            explanation: "f-strings interpolate variables inside curly braces.",
          },
        ],
        challenge: {
          title: "Format a Message",
          description:
            "Set `language = \"Python\"` and `level = \"beginner\"`, then print exactly: `Learning Python at beginner level` using an f-string.",
          starterCode: `language = "Python"
level = "beginner"
# print with f-string\n`,
          solutionCode: `language = "Python"
level = "beginner"
print(f"Learning {language} at {level} level")`,
          tests: [
            { id: 1, label: "Uses f-string", keywords: [{ pattern: 'f"[^"]*\\{language\\}' }] },
            { id: 2, label: "Prints Learning", keywords: [{ pattern: "Learning" }] },
          ],
        },
      },
    ],
  },
  {
    id: "control-flow",
    title: "Control Flow",
    icon: "🔀",
    color: "#0d9488",
    lessons: [
      {
        id: "py-2",
        title: "If, Elif, Else",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "Control flow lets programs make decisions. Use `if` for the first condition, `elif` for additional checks, and `else` when nothing matched.",
          },
          {
            type: "code",
            lang: "python",
            label: "Grade checker",
            content: `score = 78

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("Keep practicing")`,
          },
          {
            type: "quiz",
            question: "What keyword adds another condition after if?",
            options: ["elseif", "elif", "else if", "when"],
            answer: 1,
            explanation: "Python uses elif — not elseif or else if.",
          },
        ],
        challenge: {
          title: "Even or Odd",
          description:
            "Given `n = 7`, print `even` if n is divisible by 2, otherwise print `odd`.",
          starterCode: `n = 7
# if / else\n`,
          solutionCode: `n = 7
if n % 2 == 0:
    print("even")
else:
    print("odd")`,
          tests: [
            { id: 1, label: "Uses if", keywords: [{ pattern: "if\\s+" }] },
            { id: 2, label: "Prints odd", keywords: [{ pattern: "odd" }] },
          ],
        },
      },
      {
        id: "py-2b",
        title: "Logic and Truthiness",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "Combine conditions with `and`, `or`, and `not`. In Python, empty strings, zero, `None`, and empty lists are **falsy** — everything else is truthy in a boolean context.",
          },
          {
            type: "code",
            lang: "python",
            label: "Combined conditions",
            content: `age = 20
has_id = True

if age >= 18 and has_id:
    print("Access granted")`,
          },
          {
            type: "callout",
            variant: "warning",
            content: "`==` compares values. `is` checks whether two names refer to the **same object** — use `==` for strings and numbers.",
          },
          {
            type: "quiz",
            question: "Which value is falsy in Python?",
            options: ["[1, 2]", "\"hello\"", "0", "True"],
            answer: 2,
            explanation: "Zero is falsy; non-empty collections and non-empty strings are truthy.",
          },
        ],
        challenge: {
          title: "Login Check",
          description:
            "Set `username = \"ada\"` and `password_len = 10`. If username is non-empty AND password_len >= 8, print `ok`, else print `denied`.",
          starterCode: `username = "ada"
password_len = 10\n`,
          solutionCode: `username = "ada"
password_len = 10
if username and password_len >= 8:
    print("ok")
else:
    print("denied")`,
          tests: [
            { id: 1, label: "Uses and", keywords: [{ pattern: "and" }] },
            { id: 2, label: "Prints ok", keywords: [{ pattern: "ok" }] },
          ],
        },
      },
    ],
  },
  {
    id: "collections-core",
    title: "Lists & Tuples",
    icon: "📋",
    color: "#7c3aed",
    lessons: [
      {
        id: "py-3",
        title: "Lists",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "A **list** is an ordered, mutable collection. Use square brackets `[]` and methods like `.append()` to grow it.",
          },
          {
            type: "code",
            lang: "python",
            label: "List basics",
            content: `tasks = ["read", "code", "review"]
tasks.append("ship")
print(tasks)
print(len(tasks))`,
          },
          {
            type: "quiz",
            question: "Which method adds one item to the end of a list?",
            options: [".add()", ".append()", ".push()", ".insert_end()"],
            answer: 1,
            explanation: "list.append(x) adds a single element to the end.",
          },
        ],
        challenge: {
          title: "Build a List",
          description:
            "Start with `nums = [1, 2, 3]`, append `4`, then print the list.",
          starterCode: `nums = [1, 2, 3]\n`,
          solutionCode: `nums = [1, 2, 3]
nums.append(4)
print(nums)`,
          tests: [
            { id: 1, label: "Uses append", keywords: [{ pattern: "\\.append\\s*\\(" }] },
            { id: 2, label: "Prints list", keywords: [{ pattern: "print\\s*\\(" }] },
          ],
        },
      },
      {
        id: "py-3b",
        title: "Tuples",
        xp: 12,
        theory: [
          {
            type: "text",
            content:
              "A **tuple** is like a list but **immutable** — after creation you cannot add, remove, or replace items. Use parentheses for fixed records.",
          },
          {
            type: "code",
            lang: "python",
            label: "Tuple unpacking",
            content: `point = (10, 20)
x, y = point
print(x, y)`,
          },
          {
            type: "quiz",
            question: "Why use a tuple instead of a list?",
            options: [
              "Tuples are always faster at math",
              "Tuples protect fixed data from accidental changes",
              "Tuples can only hold numbers",
              "Lists cannot be indexed",
            ],
            answer: 1,
            explanation: "Immutability makes tuples ideal for coordinates, RGB colors, and dict keys.",
          },
        ],
        challenge: {
          title: "Unpack a Tuple",
          description:
            "Given `rgb = (255, 128, 0)`, unpack into `r`, `g`, `b` and print `r` and `g` on one line separated by a space.",
          starterCode: `rgb = (255, 128, 0)\n`,
          solutionCode: `rgb = (255, 128, 0)
r, g, b = rgb
print(r, g)`,
          tests: [
            { id: 1, label: "Unpacks three variables", keywords: [{ pattern: "r,\\s*g,\\s*b\\s*=" }] },
            { id: 2, label: "Prints r and g", keywords: [{ pattern: "print\\s*\\(\\s*r" }] },
          ],
        },
      },
      {
        id: "py-3c",
        title: "Indexing and Slicing",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "Index from `0` for the first item. Negative indices count from the end: `-1` is the last element. Slicing `start:stop` returns a sub-sequence without modifying the original.",
          },
          {
            type: "code",
            lang: "python",
            label: "Slice examples",
            content: `letters = ["a", "b", "c", "d", "e"]
print(letters[0])
print(letters[-1])
print(letters[1:4])`,
          },
          {
            type: "quiz",
            question: "What does `items[-1]` return?",
            options: ["First item", "Last item", "Empty list", "SyntaxError always"],
            answer: 1,
            explanation: "-1 is a common Python idiom for the last element.",
          },
        ],
        challenge: {
          title: "Last Two Items",
          description:
            "Given `data = [10, 20, 30, 40, 50]`, print a slice containing only the last two elements using negative indexing or slicing.",
          starterCode: `data = [10, 20, 30, 40, 50]\n`,
          solutionCode: `data = [10, 20, 30, 40, 50]
print(data[-2:])`,
          tests: [
            { id: 1, label: "Uses slicing", keywords: [{ pattern: "\\[.*:.*\\]" }] },
            { id: 2, label: "Prints result", keywords: [{ pattern: "print" }] },
          ],
        },
      },
    ],
  },
  {
    id: "loops-functions",
    title: "Loops & Functions",
    icon: "🔁",
    color: "#dc2626",
    lessons: [
      {
        id: "py-4",
        title: "For Loops",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "A `for` loop iterates over each item in a sequence. `range(n)` produces numbers from `0` to `n-1` — perfect for counted loops.",
          },
          {
            type: "code",
            lang: "python",
            label: "Loop over a list",
            content: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`,
          },
          {
            type: "code",
            lang: "python",
            label: "range()",
            content: `for i in range(3):
    print(i)  # 0, 1, 2`,
          },
          {
            type: "quiz",
            question: "What does range(5) produce?",
            options: ["1 through 5", "0 through 4", "0 through 5", "5 through 10"],
            answer: 1,
            explanation: "range(stop) starts at 0 and stops before stop.",
          },
        ],
        challenge: {
          title: "Sum with a Loop",
          description:
            "Use a for loop to print the sum of `nums = [2, 4, 6]` — expected output: `12`.",
          starterCode: `nums = [2, 4, 6]
total = 0\n`,
          solutionCode: `nums = [2, 4, 6]
total = 0
for n in nums:
    total += n
print(total)`,
          tests: [
            { id: 1, label: "Uses for", keywords: [{ pattern: "for\\s+" }] },
            { id: 2, label: "Prints 12", keywords: [{ pattern: "print\\s*\\(\\s*total" }] },
          ],
        },
      },
      {
        id: "py-4b",
        title: "While Loops",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "Use `while` when you repeat until a condition becomes false. Always ensure the loop body moves toward the exit — otherwise you get an infinite loop.",
          },
          {
            type: "code",
            lang: "python",
            label: "Countdown",
            content: `count = 3
while count > 0:
    print(count)
    count -= 1
print("go")`,
          },
          {
            type: "quiz",
            question: "When is a while loop the better choice?",
            options: [
              "When you know the exact number of items in a list",
              "When repetition depends on a condition that changes each iteration",
              "When you never need to update variables",
              "When you want to define a reusable block",
            ],
            answer: 1,
            explanation: "while fits unknown iteration counts — e.g. read until sentinel value.",
          },
        ],
        challenge: {
          title: "Count Up",
          description:
            "Use a while loop to print numbers `1`, `2`, `3` each on its own line (start with `n = 1`).",
          starterCode: `n = 1\n`,
          solutionCode: `n = 1
while n <= 3:
    print(n)
    n += 1`,
          tests: [
            { id: 1, label: "Uses while", keywords: [{ pattern: "while\\s+" }] },
            { id: 2, label: "Increments n", keywords: [{ pattern: "n\\s*\\+=\\s*1" }] },
          ],
        },
      },
      {
        id: "py-5",
        title: "Functions",
        xp: 18,
        theory: [
          {
            type: "text",
            content:
              "Functions group reusable logic. Define with `def`, optionally `return` a value. Parameters receive arguments from the caller.",
          },
          {
            type: "code",
            lang: "python",
            label: "Function with return",
            content: `def area(width, height):
    return width * height

print(area(4, 5))`,
          },
          {
            type: "callout",
            variant: "warning",
            content:
              "Avoid `def add_item(x, bucket=[])` — the default list is shared across calls. Use `bucket=None` and create `[]` inside the function.",
          },
          {
            type: "quiz",
            question: "What keyword sends a value back to the caller?",
            options: ["send", "return", "yield", "exit"],
            answer: 1,
            explanation: "return exits the function and optionally provides a result.",
          },
        ],
        challenge: {
          title: "Double It",
          description:
            "Define `def double(n):` that returns `n * 2`, then print `double(21)`.",
          starterCode: `# def double ...\n`,
          solutionCode: `def double(n):
    return n * 2

print(double(21))`,
          tests: [
            { id: 1, label: "Defines double", keywords: [{ pattern: "def\\s+double" }] },
            { id: 2, label: "Uses return", keywords: [{ pattern: "return" }] },
            { id: 3, label: "Calls double(21)", keywords: [{ pattern: "double\\s*\\(\\s*21" }] },
          ],
        },
      },
    ],
  },
  {
    id: "dicts-sets",
    title: "Dicts & Sets",
    icon: "🗂️",
    color: "#ea580c",
    lessons: [
      {
        id: "py-6",
        title: "Dictionaries",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "A **dict** maps unique keys to values — like a real dictionary maps words to definitions. Lookup by key is fast and readable.",
          },
          {
            type: "code",
            lang: "python",
            label: "Dict operations",
            content: `prices = {"apple": 1.2, "banana": 0.8}
print(prices["apple"])
print(prices.get("pear", 0))`,
          },
          {
            type: "quiz",
            question: "How do you safely read a key that might be missing?",
            options: ["prices[key] always", "prices.get(key, default)", "prices.delete(key)", "dict[key] = None"],
            answer: 1,
            explanation: ".get returns a default instead of raising KeyError.",
          },
        ],
        challenge: {
          title: "Lookup a Price",
          description:
            "Create `menu = {\"tea\": 2, \"coffee\": 3}`, print the value for `\"coffee\"`.",
          starterCode: `# menu dict and print\n`,
          solutionCode: `menu = {"tea": 2, "coffee": 3}
print(menu["coffee"])`,
          tests: [
            { id: 1, label: "Creates dict", keywords: [{ pattern: "\\{\\s*\"tea\"" }] },
            { id: 2, label: "Accesses coffee", keywords: [{ pattern: "coffee" }] },
          ],
        },
      },
      {
        id: "py-6b",
        title: "Sets",
        xp: 12,
        theory: [
          {
            type: "text",
            content:
              "A **set** holds unique unordered items. Use sets to remove duplicates or test membership quickly.",
          },
          {
            type: "code",
            lang: "python",
            label: "Unique tags",
            content: `tags = ["py", "data", "py", "web", "data"]
unique = set(tags)
print(unique)
print("py" in unique)`,
          },
          {
            type: "quiz",
            question: "What happens if you add a duplicate to a set?",
            options: ["Error", "Two copies remain", "It is ignored — sets keep unique items only", "The set becomes a list"],
            answer: 2,
            explanation: "Sets automatically deduplicate values.",
          },
        ],
        challenge: {
          title: "Unique Numbers",
          description:
            "Given `nums = [1, 2, 2, 3, 3, 3]`, convert to a set, then print `len()` of that set.",
          starterCode: `nums = [1, 2, 2, 3, 3, 3]\n`,
          solutionCode: `nums = [1, 2, 2, 3, 3, 3]
unique = set(nums)
print(len(unique))`,
          tests: [
            { id: 1, label: "Uses set()", keywords: [{ pattern: "set\\s*\\(" }] },
            { id: 2, label: "Prints len", keywords: [{ pattern: "len\\s*\\(" }] },
          ],
        },
      },
    ],
  },
  {
    id: "files-errors",
    title: "Files & Errors",
    icon: "📁",
    color: "#0891b2",
    lessons: [
      {
        id: "py-7",
        title: "Working with Files",
        xp: 18,
        theory: [
          {
            type: "text",
            content:
              "The `with open(path, mode) as f:` pattern opens a file and closes it automatically. Mode `\"r\"` reads; `\"w\"` writes (overwrites); `\"a\"` appends.",
          },
          {
            type: "code",
            lang: "python",
            label: "Write then read (concept)",
            content: `# with open("notes.txt", "w") as f:
#     f.write("Hello\\n")
# with open("notes.txt", "r") as f:
#     print(f.read())`,
          },
          {
            type: "callout",
            variant: "tip",
            content:
              "In browser challenges you simulate file logic with strings. On your machine, paths are relative to where you run the script.",
          },
          {
            type: "quiz",
            question: "Why use `with open(...)` instead of open() alone?",
            options: [
              "It runs code faster",
              "It guarantees the file is closed even if an error occurs",
              "It only works on Windows",
              "It converts text to JSON automatically",
            ],
            answer: 1,
            explanation: "Context managers release resources reliably.",
          },
        ],
        challenge: {
          title: "Line Counter Logic",
          description:
            "Given `text = \"a\\nb\\nc\"`, split by newline into `lines`, then print `len(lines)` (expect 3).",
          starterCode: `text = "a\\nb\\nc"\n`,
          solutionCode: `text = "a\\nb\\nc"
lines = text.split("\\n")
print(len(lines))`,
          tests: [
            { id: 1, label: "Uses split", keywords: [{ pattern: "\\.split\\s*\\(" }] },
            { id: 2, label: "Prints len", keywords: [{ pattern: "len\\s*\\(" }] },
          ],
        },
      },
      {
        id: "py-7b",
        title: "Exceptions",
        xp: 18,
        theory: [
          {
            type: "text",
            content:
              "When something goes wrong, Python raises an **exception**. Wrap risky code in `try` / `except` to handle errors gracefully.",
          },
          {
            type: "code",
            lang: "python",
            label: "Handle ValueError",
            content: `raw = "abc"
try:
    value = int(raw)
except ValueError:
    print("not a number")`,
          },
          {
            type: "quiz",
            question: "Which block runs when int(\"hello\") fails?",
            options: ["try", "except", "else", "finally only"],
            answer: 1,
            explanation: "The except block catches matching exception types.",
          },
        ],
        challenge: {
          title: "Safe Divide",
          description:
            "Define `def safe_div(a, b):` that returns `a / b` inside try/except; on `ZeroDivisionError` return `0`. Print `safe_div(10, 0)`.",
          starterCode: `# def safe_div\n`,
          solutionCode: `def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 0

print(safe_div(10, 0))`,
          tests: [
            { id: 1, label: "Defines safe_div", keywords: [{ pattern: "def\\s+safe_div" }] },
            { id: 2, label: "Uses except", keywords: [{ pattern: "except" }] },
            { id: 3, label: "Handles ZeroDivisionError", keywords: [{ pattern: "ZeroDivisionError" }] },
          ],
        },
      },
    ],
  },
  {
    id: "pro-python",
    title: "Pro Python",
    icon: "🚀",
    color: "#9333ea",
    lessons: [
      {
        id: "py-8",
        title: "Classes and Objects",
        xp: 20,
        theory: [
          {
            type: "text",
            content:
              "A **class** is a blueprint; an **object** is an instance. `__init__` initializes instance attributes; methods are functions on the object.",
          },
          {
            type: "code",
            lang: "python",
            label: "Simple class",
            content: `class Dog:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} says woof"

d = Dog("Rex")
print(d.speak())`,
          },
          {
            type: "quiz",
            question: "What is self in an instance method?",
            options: ["The class name", "The current instance", "A Python keyword only for static methods", "Always None"],
            answer: 1,
            explanation: "self refers to the specific object calling the method.",
          },
        ],
        challenge: {
          title: "Greeter Class",
          description:
            "Define class `Greeter` with `__init__(self, name)` storing `self.name`, method `hello` returning `f\"Hi, {self.name}\"`. Create `Greeter(\"PolyCode\")` and print `.hello()`.",
          starterCode: `# class Greeter\n`,
          solutionCode: `class Greeter:
    def __init__(self, name):
        self.name = name

    def hello(self):
        return f"Hi, {self.name}"

g = Greeter("PolyCode")
print(g.hello())`,
          tests: [
            { id: 1, label: "Defines class", keywords: [{ pattern: "class\\s+Greeter" }] },
            { id: 2, label: "Defines __init__", keywords: [{ pattern: "__init__" }] },
            { id: 3, label: "Prints greeting", keywords: [{ pattern: "print" }] },
          ],
        },
      },
      {
        id: "py-8b",
        title: "Modules and Imports",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "Split code across files. `import math` loads a module; `from math import sqrt` brings one name into scope. Use `if __name__ == \"__main__\":` to run code only when the file is executed directly.",
          },
          {
            type: "code",
            lang: "python",
            label: "Using math",
            content: `import math

print(math.sqrt(16))`,
          },
          {
            type: "quiz",
            question: "What does if __name__ == \"__main__\": protect?",
            options: [
              "Code from running when the file is imported",
              "Code from syntax errors",
              "Variables from deletion",
              "The Python interpreter from crashing",
            ],
            answer: 0,
            explanation: "Importing a module should not accidentally start your app's main logic.",
          },
        ],
        challenge: {
          title: "Import math",
          description: "Import `math` and print `math.pi` rounded conceptually — print `math.pi` as-is.",
          starterCode: `# import math\n`,
          solutionCode: `import math
print(math.pi)`,
          tests: [
            { id: 1, label: "Imports math", keywords: [{ pattern: "import\\s+math" }] },
            { id: 2, label: "Uses math.pi", keywords: [{ pattern: "math\\.pi" }] },
          ],
        },
      },
      {
        id: "py-9",
        title: "List Comprehensions",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "A **list comprehension** builds a new list in one expression: `[expr for item in iterable if condition]`.",
          },
          {
            type: "code",
            lang: "python",
            label: "Squares",
            content: `nums = [1, 2, 3, 4]
squares = [n * n for n in nums]
print(squares)`,
          },
          {
            type: "code",
            lang: "python",
            label: "With filter",
            content: `evens = [n for n in range(10) if n % 2 == 0]
print(evens)`,
          },
          {
            type: "quiz",
            question: "What does [x*2 for x in [1,2,3]] produce?",
            options: ["[1,2,3]", "[2,4,6]", "[1,4,9]", "SyntaxError"],
            answer: 1,
            explanation: "Each element is doubled in order.",
          },
        ],
        challenge: {
          title: "Double All",
          description:
            "Given `vals = [1, 2, 3]`, build `doubled = [v * 2 for v in vals]` and print it.",
          starterCode: `vals = [1, 2, 3]\n`,
          solutionCode: `vals = [1, 2, 3]
doubled = [v * 2 for v in vals]
print(doubled)`,
          tests: [
            { id: 1, label: "Uses comprehension", keywords: [{ pattern: "\\[.*for.*in" }] },
            { id: 2, label: "Prints doubled", keywords: [{ pattern: "print\\s*\\(\\s*doubled" }] },
          ],
        },
      },
      {
        id: "py-10",
        title: "venv and pip",
        xp: 12,
        theory: [
          {
            type: "text",
            content:
              "A **virtual environment** isolates project packages. Create with `python -m venv .venv`, activate it, then `pip install package_name`.",
          },
          {
            type: "diagram",
            title: "Project dependency flow",
            nodes: [
              { id: "venv", label: "venv", color: ACCENT, items: ["Isolated site-packages", "Per-project versions"] },
              { id: "pip", label: "pip", color: "#2563eb", items: ["install", "freeze", "requirements.txt"] },
              { id: "code", label: "Your code", color: "#3b82f6", items: ["import installed libs", "Reproducible builds"] },
            ],
          },
          {
            type: "callout",
            variant: "tip",
            content: "Commit `requirements.txt` — not your `.venv` folder — so teammates install the same versions.",
          },
          {
            type: "quiz",
            question: "Why use a virtual environment?",
            options: [
              "To compile Python to C++",
              "To isolate package versions per project",
              "To run Python without installing it",
              "To replace try/except",
            ],
            answer: 1,
            explanation: "Different projects often need different library versions.",
          },
        ],
        challenge: {
          title: "Requirements Comment",
          description:
            "Print exactly two lines: `# requirements.txt` then `numpy>=1.24` (simulating a requirements file header).",
          starterCode: `# two print lines\n`,
          solutionCode: `print("# requirements.txt")
print("numpy>=1.24")`,
          tests: [
            { id: 1, label: "Prints requirements header", keywords: [{ pattern: "requirements\\.txt" }] },
            { id: 2, label: "Prints numpy line", keywords: [{ pattern: "numpy" }] },
          ],
        },
      },
      {
        id: "py-11",
        title: "Modern Python Habits",
        xp: 15,
        theory: [
          {
            type: "text",
            content:
              "**Type hints** document expected types: `def greet(name: str) -> str:`. **pathlib.Path** replaces messy string paths. **json** reads structured config files.",
          },
          {
            type: "code",
            lang: "python",
            label: "Type hints",
            content: `def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))`,
          },
          {
            type: "quiz",
            question: "Do type hints force Python to reject wrong types at runtime by default?",
            options: ["Yes, always", "No — they are mainly for documentation and tooling", "Only on Windows", "Only inside classes"],
            answer: 1,
            explanation: "Python remains dynamically typed; mypy and IDEs use hints for checking.",
          },
        ],
        challenge: {
          title: "Typed Add",
          description:
            "Define `def add(a: int, b: int) -> int:` returning `a + b`. Print `add(10, 32)`.",
          starterCode: `# typed add\n`,
          solutionCode: `def add(a: int, b: int) -> int:
    return a + b

print(add(10, 32))`,
          tests: [
            { id: 1, label: "Type hints on params", keywords: [{ pattern: "a:\\s*int" }] },
            { id: 2, label: "Return type hint", keywords: [{ pattern: "->\\s*int" }] },
            { id: 3, label: "Prints 42", keywords: [{ pattern: "add\\s*\\(\\s*10\\s*,\\s*32" }] },
          ],
        },
      },
      {
        id: "py-12",
        title: "Capstone — Grade Report",
        xp: 25,
        theory: [
          {
            type: "text",
            content:
              "Combine dicts, loops, and functions: store student → list of scores, compute each average, print a simple report.",
          },
          {
            type: "code",
            lang: "python",
            label: "Reference solution shape",
            content: `def average(scores):
    return sum(scores) / len(scores)

grades = {"Ada": [90, 92], "Lin": [80, 88]}
for name, scores in grades.items():
    print(f"{name}: {average(scores):.1f}")`,
          },
          {
            type: "callout",
            variant: "info",
            content: "This capstone mirrors real scripting tasks before you jump into NumPy and Pandas.",
          },
        ],
        challenge: {
          title: "Student Average",
          description:
            "Given `scores = [85, 90, 95]`, define `def avg(nums):` returning the mean, and print `avg(scores)` (expect 90.0).",
          starterCode: `scores = [85, 90, 95]\n`,
          solutionCode: `scores = [85, 90, 95]

def avg(nums):
    return sum(nums) / len(nums)

print(avg(scores))`,
          tests: [
            { id: 1, label: "Defines avg", keywords: [{ pattern: "def\\s+avg" }] },
            { id: 2, label: "Uses sum", keywords: [{ pattern: "sum\\s*\\(" }] },
            { id: 3, label: "Calls avg(scores)", keywords: [{ pattern: "avg\\s*\\(\\s*scores" }] },
          ],
        },
      },
      {
        id: "py-13",
        title: "Python Cheat Sheet",
        xp: 10,
        theory: [
          {
            type: "text",
            content:
              "**Quick reference** — bookmark this lesson. Variables: `x = 1`. Conditionals: `if` / `elif` / `else`. Loops: `for x in items` / `while cond`. Collections: `list`, `tuple`, `dict`, `set`. Functions: `def f(): return`. Classes: `class C:`. Files: `with open()`. Errors: `try` / `except`.",
          },
          {
            type: "diagram",
            title: "Pick the right collection",
            nodes: [
              { id: "list", label: "list", color: ACCENT, items: ["Ordered", "Mutable", "Duplicates OK"] },
              { id: "tuple", label: "tuple", color: "#2563eb", items: ["Ordered", "Immutable", "Fixed records"] },
              { id: "dict", label: "dict", color: "#7c3aed", items: ["Key → value", "Fast lookup", "Unique keys"] },
              { id: "set", label: "set", color: "#dc2626", items: ["Unique items", "Unordered", "Membership tests"] },
            ],
          },
          {
            type: "callout",
            variant: "tip",
            content: "Next step: **NumPy** for numeric arrays, then **Pandas** for tables — both assume the Python basics you just learned.",
          },
          {
            type: "quiz",
            question: "Which collection should map user IDs to email addresses?",
            options: ["list", "tuple", "dict", "set"],
            answer: 2,
            explanation: "Dicts map keys to values — perfect for ID → email.",
          },
        ],
        challenge: {
          title: "Cheat Sheet Drill",
          description:
            "Create `skills = [\"Python\", \"logic\", \"practice\"]`, print the **second** item (index 1) using indexing.",
          starterCode: `skills = ["Python", "logic", "practice"]\n`,
          solutionCode: `skills = ["Python", "logic", "practice"]
print(skills[1])`,
          tests: [
            { id: 1, label: "Indexes skills", keywords: [{ pattern: "skills\\s*\\[\\s*1\\s*\\]" }] },
            { id: 2, label: "Prints logic", keywords: [{ pattern: "print" }] },
          ],
        },
      },
    ],
  },
];

export const PYTHON_FUNDAMENTALS_CHAPTERS = applyChapterEnhancements(
  RAW_PYTHON_FUNDAMENTALS_CHAPTERS,
);

export const PYTHON_FUNDAMENTALS_LESSONS = applyLessonVideoLinks(
  PYTHON_FUNDAMENTALS_CHAPTERS.flatMap((ch) =>
    ch.lessons.map((l) => ({
      ...l,
      chapterId: ch.id,
      chapterTitle: ch.title,
      chapterColor: ch.color,
    })),
  ),
  PYTHON_FUNDAMENTALS_VIDEO_LINKS,
);

export const PYTHON_FUNDAMENTALS_TOTAL_XP = PYTHON_FUNDAMENTALS_LESSONS.reduce(
  (sum, lesson) => sum + lesson.xp,
  0,
);
