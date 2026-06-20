import { useCallback, useState } from "react";
import Editor from "@monaco-editor/react";
import { Sparkles } from "lucide-react";
import {
  runPythonCode,
  formatPythonOutput,
  getPythonRuntimeError,
} from "../../learn/shared/runPython.js";
import {
  runJavaScriptCode,
  formatJavaScriptOutput,
  getJavaScriptRuntimeError,
} from "../../learn/shared/runJavaScript.js";
import {
  runCppCode,
  formatCppOutput,
  getCppRuntimeError,
} from "../../learn/shared/runCpp.js";
import {
  runCsharpCode,
  formatCsharpOutput,
  getCsharpRuntimeError,
} from "../../learn/shared/runCsharp.js";
import {
  definePolycodeMonacoLightTheme,
  definePolycodeMonacoTheme,
  definePolycodePlaygroundThemes,
  getVSCodeEditorOptions,
  POLYCODE_PLAYGROUND_DARK_THEME,
  POLYCODE_PLAYGROUND_LIGHT_THEME,
} from "../../../shared/utils/monacoTheme";

const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    accent: "#3776ab",
    monacoLang: "python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    desc: "Versatile and beginner-friendly — great for AI, data science, and automation.",
    code: `# Python Example\nname = "PolyCode"\nprint(f"Welcome to {name}!")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    accent: "#d97706",
    monacoLang: "javascript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    desc: "The language of the web — build interactive UIs, APIs, and full-stack apps.",
    code: `// JavaScript Example\nconst name = "PolyCode";\nconsole.log(\`Welcome to \${name}!\`);`,
  },
  {
    id: "cpp",
    label: "C++",
    accent: "#f34b7d",
    monacoLang: "cpp",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    desc: "High-performance systems language for games, OS internals, and embedded software.",
    code: `// C++ Example\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Welcome to PolyCode!" << endl;\n  return 0;\n}`,
  },
  {
    id: "csharp",
    label: "C#",
    accent: "#9b4f96",
    monacoLang: "csharp",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    desc: "Modern OOP from Microsoft — apps, games, and enterprise backends.",
    code: `// C# Example\nstring name = "PolyCode";\nConsole.WriteLine("Welcome to " + name + "!");`,
  },
];

const OUTPUT_HINT = "Run your code to see output here";

const DEMO_FONT_SIZE = 15;
const DEMO_LINE_HEIGHT = 24;
const DEMO_VERTICAL_PADDING = 36;

function getDemoEditorHeight(source) {
  const lineCount = source.split("\n").length;
  const contentHeight = lineCount * DEMO_LINE_HEIGHT + DEMO_VERTICAL_PADDING;
  return Math.min(Math.max(contentHeight, 168), 280);
}

async function runForLanguage(langId, code) {
  if (langId === "python") {
    const { result } = await runPythonCode(code);
    const err = getPythonRuntimeError(result);
    if (err) throw new Error(err);
    return formatPythonOutput(result) || "(no output)";
  }
  if (langId === "javascript") {
    const { result } = await runJavaScriptCode(code);
    const err = getJavaScriptRuntimeError(result);
    if (err) throw new Error(err);
    return formatJavaScriptOutput(result) || "(no output)";
  }
  if (langId === "cpp") {
    const { result } = await runCppCode(code);
    const err = getCppRuntimeError(result);
    if (err) throw new Error(err);
    return formatCppOutput(result) || "(no output)";
  }
  if (langId === "csharp") {
    const { result } = await runCsharpCode(code);
    const err = getCsharpRuntimeError(result);
    if (err) throw new Error(err);
    return formatCsharpOutput(result) || "(no output)";
  }
  throw new Error("Unsupported language");
}

export default function TryItSection({ theme = "dark" }) {
  const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const isLight = theme === "light";
  const hasOutput = Boolean(output);
  const isError = output.startsWith("Error:");
  const demoCode = activeLang.code;
  const editorHeight = getDemoEditorHeight(demoCode);

  const switchLang = (lang) => {
    setActiveLang(lang);
    setOutput("");
  };

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOutput("");
    try {
      const out = await runForLanguage(activeLang.id, demoCode);
      setOutput(out);
    } catch (e) {
      setOutput("Error: " + e.message);
    } finally {
      setRunning(false);
    }
  }, [activeLang.id, demoCode, running]);

  const editorTheme = isLight
    ? POLYCODE_PLAYGROUND_LIGHT_THEME
    : POLYCODE_PLAYGROUND_DARK_THEME;

  return (
    <section className="tryit-section">
      <div className="landing-container">
        <div className="tryit-header">
          <p className="landing-sec-label">Live Playground</p>
          <h2 className="landing-sec-title">Try Code Instantly</h2>
          <p className="landing-sec-sub tryit-header-sub">
            Switch languages and run the built-in sample — open the full playground to write your own code.
          </p>
        </div>

        <div
          className="tryit-tabs"
          role="tablist"
          aria-label="Languages"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              role="tab"
              aria-selected={activeLang.id === lang.id}
              className={`tryit-tab ${activeLang.id === lang.id ? "tryit-tab--active" : ""}`}
              style={{ "--tab-accent": lang.accent }}
              onClick={() => switchLang(lang)}
            >
              <img
                src={lang.icon}
                alt=""
                className="tryit-tab-icon"
                aria-hidden
              />
              {lang.label}
            </button>
          ))}
        </div>

        <div className="tryit-shell">
          <div className="tryit-panel">
            <div className="tryit-body">
              <aside
                className="tryit-left"
                style={{ "--lang-accent": activeLang.accent }}
              >
                <div className="tryit-lang-badge">
                  <img
                    src={activeLang.icon}
                    alt=""
                    className="tryit-lang-logo"
                    aria-hidden
                  />
                </div>
                <div>
                  <h3 className="tryit-lang-name">{activeLang.label}</h3>
                  <p className="tryit-lang-desc">{activeLang.desc}</p>
                </div>
                <div className="tryit-sidebar-actions">
                  <button
                    type="button"
                    className="tryit-run-btn"
                    onClick={run}
                    disabled={running}
                  >
                    {running ? "▶ Running…" : "▶ Run Code"}
                  </button>
                  <a
                    href={`/language/${activeLang.id}`}
                    className="tryit-learn-btn"
                  >
                    Learn {activeLang.label} →
                  </a>
                </div>
              </aside>

              <div className="tryit-right">
                <div className="tryit-editor-wrap tryit-editor-wrap--demo">
                  <Editor
                    height={`${editorHeight}px`}
                    language={activeLang.monacoLang}
                    value={demoCode}
                    theme={editorTheme}
                    beforeMount={(monaco) => {
                      definePolycodeMonacoTheme(monaco);
                      definePolycodeMonacoLightTheme(monaco);
                      definePolycodePlaygroundThemes(monaco);
                    }}
                    options={{
                      ...getVSCodeEditorOptions({
                        fontSize: DEMO_FONT_SIZE,
                        wordWrap: true,
                        readOnly: true,
                        minimap: { enabled: false },
                      }),
                      lineHeight: DEMO_LINE_HEIGHT,
                      padding: { top: 18, bottom: 18 },
                      domReadOnly: true,
                      scrollbar: { vertical: "hidden", handleMouseWheel: false },
                      overviewRulerLanes: 0,
                    }}
                  />
                </div>

                <div
                  className={[
                    "tryit-output",
                    !hasOutput && "tryit-output--empty",
                    isError && "tryit-output--error",
                    running && "tryit-output--running",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="tryit-output-head">
                    <span className="tryit-output-label">
                      <Sparkles size={12} />
                      Output
                    </span>
                    {hasOutput && !isError ? (
                      <span className="tryit-output-badge tryit-output-badge--ok">
                        Success
                      </span>
                    ) : null}
                    {isError ? (
                      <span className="tryit-output-badge tryit-output-badge--err">
                        Failed
                      </span>
                    ) : null}
                  </div>
                  <pre className="tryit-output-pre">
                    {running
                      ? "Executing your code…"
                      : hasOutput
                        ? output
                        : OUTPUT_HINT}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
