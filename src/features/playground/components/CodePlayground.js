import React, { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useAuth } from "../../auth/context/AuthContext";
import { executeCode, resolveEngine } from "../services/BrowserExecutor";
import {
  createPlaygroundFile,
  fetchPlaygroundFiles,
  deletePlaygroundFile,
  updatePlaygroundFile,
  savePlaygroundRun,
} from "../services/playgroundApi";
import {
  createFile,
  createWorkspace,
  getActiveFile,
  mergeLocalWorkspace,
  monacoLanguageForFile,
  nextUntitledName,
  saveLocalWorkspaces,
} from "../lib/playgroundFiles";
import {
  definePolycodeMonacoTheme,
  getVSCodeEditorOptions,
  POLYCODE_VSCODE_THEME,
} from "../../../shared/utils/monacoTheme";
import "./CodePlayground.css";

const LANG_GROUPS = [
  {
    label: "Browser IDEs",
    langs: [
      "javascript",
      "typescript",
      "python",
      "html",
      "css",
      "sql",
      "json",
      "xml",
      "markdown",
      "brainfuck",
      "regex",
      "php",
    ],
  },
  {
    label: "Server IDEs",
    langs: [
      "c",
      "cpp",
      "java",
      "go",
      "rust",
      "ruby",
      "bash",
      "kotlin",
      "swift",
      "csharp",
      "r",
      "lua",
      "powershell",
      "batch",
      "dart",
      "perl",
      "scala",
    ],
  },
];

const ALL_LANGUAGES = LANG_GROUPS.flatMap((group) => group.langs);
const DEFAULT_LANGUAGE = "javascript";
const CONSOLE_RATIO_KEY = "polycode_playground_console_ratio";
const DEFAULT_CONSOLE_RATIO = 0.38;
const MIN_CONSOLE_PX = 100;
const MIN_EDITOR_PX = 160;

function loadConsoleRatio() {
  try {
    const stored = Number(localStorage.getItem(CONSOLE_RATIO_KEY));
    if (Number.isFinite(stored) && stored >= 0.15 && stored <= 0.8) {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_CONSOLE_RATIO;
}

function clampConsoleRatio(ratio, panesHeight) {
  if (!panesHeight) return ratio;
  const minRatio = MIN_CONSOLE_PX / panesHeight;
  const maxRatio = 1 - MIN_EDITOR_PX / panesHeight;
  return Math.min(Math.max(ratio, minRatio), Math.max(minRatio, maxRatio));
}

function normalizeLanguage(lang) {
  return ALL_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
}

function buildInitialWorkspaces(initialLanguage, initialCode) {
  const activeLanguage = normalizeLanguage(initialLanguage);
  return ALL_LANGUAGES.reduce((acc, lang) => {
    const workspace = mergeLocalWorkspace(lang);
    if (lang === activeLanguage && typeof initialCode === "string") {
      const active = getActiveFile(workspace);
      if (active) {
        workspace.files = workspace.files.map((file) =>
          file.id === active.id
            ? { ...file, content: initialCode, dirty: true }
            : file,
        );
      }
    }
    acc[lang] = workspace;
    return acc;
  }, {});
}

function mapCloudFiles(files) {
  return files.map((file) => ({
    id: file.id,
    serverId: file.id,
    name: file.name,
    content: file.content || "",
    dirty: false,
  }));
}

export default function CodePlayground({
  initialCode,
  initialLanguage = "javascript",
}) {
  const { token } = useAuth();
  const normalizedInitialLanguage = normalizeLanguage(initialLanguage);
  const [language, setLanguage] = useState(normalizedInitialLanguage);
  const [workspaces, setWorkspaces] = useState(() =>
    buildInitialWorkspaces(normalizedInitialLanguage, initialCode),
  );
  const [runningLanguage, setRunningLanguage] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [consoleRatio, setConsoleRatio] = useState(loadConsoleRatio);
  const [isResizingPanes, setIsResizingPanes] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const outputRef = useRef(null);
  const panesRef = useRef(null);
  const paneDragRef = useRef(null);
  const consoleRatioRef = useRef(consoleRatio);
  const workspacesRef = useRef(workspaces);
  const saveTimerRef = useRef(null);

  const currentWorkspace = workspaces[language] || createWorkspace(language);
  const activeFile = getActiveFile(currentWorkspace);
  const code = activeFile?.content || "";
  const { files, output, previewHTML, activeTab } = currentWorkspace;
  const currentIsRunning = runningLanguage === language;

  useEffect(() => {
    workspacesRef.current = workspaces;
  }, [workspaces]);

  useEffect(() => {
    consoleRatioRef.current = consoleRatio;
  }, [consoleRatio]);

  useEffect(() => {
    if (!isResizingPanes) return undefined;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingPanes]);

  useEffect(() => {
    if (token) return;
    saveLocalWorkspaces(workspaces);
  }, [workspaces, token]);

  useEffect(() => {
    if (!token) return undefined;

    let cancelled = false;
    const workspace = workspacesRef.current[language];
    if (workspace?.cloudLoaded) return undefined;

    async function loadCloudFiles() {
      setSyncing(true);
      setSyncError(null);
      try {
        const data = await fetchPlaygroundFiles(token, language);
        if (cancelled || !data.files?.length) return;

        const mapped = mapCloudFiles(data.files);
        setWorkspaces((prev) => ({
          ...prev,
          [language]: {
            ...(prev[language] || createWorkspace(language)),
            files: mapped,
            activeFileId: mapped[0].id,
            cloudLoaded: true,
          },
        }));
      } catch (err) {
        if (!cancelled) {
          setSyncError(
            err instanceof Error ? err.message : "Could not load files from Drive.",
          );
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }

    loadCloudFiles();
    return () => {
      cancelled = true;
    };
  }, [token, language]);

  const persistDirtyFiles = useCallback(async () => {
    if (!token) return;

    const workspace = workspacesRef.current[language];
    if (!workspace?.files?.length) return;

    const dirtyFiles = workspace.files.filter((file) => file.dirty);
    if (!dirtyFiles.length) return;

    setSyncing(true);
    setSyncError(null);

    try {
      for (const file of dirtyFiles) {
        if (file.serverId) {
          await updatePlaygroundFile(token, file.serverId, {
            name: file.name,
            content: file.content,
          });
        } else {
          const created = await createPlaygroundFile(token, {
            language,
            name: file.name,
            content: file.content,
          });
          const serverId = created.file?.id;
          if (serverId) {
            setWorkspaces((prev) => {
              const current = prev[language];
              if (!current) return prev;
              return {
                ...prev,
                [language]: {
                  ...current,
                  files: current.files.map((entry) =>
                    entry.id === file.id
                      ? {
                          ...entry,
                          id: serverId,
                          serverId,
                          dirty: false,
                        }
                      : entry,
                  ),
                  activeFileId:
                    current.activeFileId === file.id
                      ? serverId
                      : current.activeFileId,
                },
              };
            });
            continue;
          }
        }

        setWorkspaces((prev) => {
          const current = prev[language];
          if (!current) return prev;
          return {
            ...prev,
            [language]: {
              ...current,
              files: current.files.map((entry) =>
                entry.id === file.id || entry.serverId === file.serverId
                  ? { ...entry, dirty: false }
                  : entry,
              ),
            },
          };
        });
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Could not save to Google Drive.");
    } finally {
      setSyncing(false);
    }
  }, [token, language]);

  useEffect(() => {
    if (!token) return undefined;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    const hasDirty = currentWorkspace.files?.some((file) => file.dirty);
    if (!hasDirty) return undefined;

    saveTimerRef.current = window.setTimeout(() => {
      persistDirtyFiles();
    }, 900);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [token, language, currentWorkspace.files, persistDirtyFiles]);

  const saveConsoleRatio = useCallback((ratio) => {
    try {
      localStorage.setItem(CONSOLE_RATIO_KEY, String(ratio));
    } catch {
      /* ignore */
    }
  }, []);

  const updateWorkspace = useCallback((lang, nextValue) => {
    setWorkspaces((prev) => {
      const current = prev[lang] || createWorkspace(lang);
      const patch =
        typeof nextValue === "function" ? nextValue(current) : nextValue;
      return {
        ...prev,
        [lang]: {
          ...current,
          ...patch,
        },
      };
    });
  }, []);

  const updateActiveFileContent = useCallback(
    (nextContent) => {
      if (!activeFile) return;
      updateWorkspace(language, (current) => ({
        files: current.files.map((file) =>
          file.id === activeFile.id
            ? { ...file, content: nextContent, dirty: true }
            : file,
        ),
      }));
    },
    [activeFile, language, updateWorkspace],
  );

  const selectFile = useCallback(
    (fileId) => {
      updateWorkspace(language, { activeFileId: fileId });
    },
    [language, updateWorkspace],
  );

  const addFile = useCallback(async () => {
    const workspace = workspacesRef.current[language] || createWorkspace(language);
    const name = nextUntitledName(language, workspace.files);
    const localFile = createFile(language, { name });

    if (token) {
      try {
        setSyncing(true);
        const created = await createPlaygroundFile(token, {
          language,
          name,
          content: localFile.content,
        });
        const serverId = created.file?.id;
        const cloudFile = createFile(language, {
          name: created.file?.name || name,
          content: created.file?.content || localFile.content,
          serverId,
        });
        updateWorkspace(language, (current) => ({
          files: [...current.files, cloudFile],
          activeFileId: cloudFile.id,
        }));
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : "Could not create file.");
      } finally {
        setSyncing(false);
      }
      return;
    }

    updateWorkspace(language, (current) => ({
      files: [...current.files, localFile],
      activeFileId: localFile.id,
    }));
  }, [language, token, updateWorkspace]);

  const closeFile = useCallback(
    async (fileId) => {
      const workspace = workspacesRef.current[language];
      const target = workspace?.files?.find((file) => file.id === fileId);
      if (!target || workspace.files.length <= 1) return;

      if (token && target.serverId) {
        try {
          setSyncing(true);
          await deletePlaygroundFile(token, target.serverId);
        } catch (err) {
          setSyncError(err instanceof Error ? err.message : "Could not delete file.");
          setSyncing(false);
          return;
        } finally {
          setSyncing(false);
        }
      }

      updateWorkspace(language, (current) => {
        const nextFiles = current.files.filter((file) => file.id !== fileId);
        const nextActive =
          current.activeFileId === fileId
            ? nextFiles[0]?.id
            : current.activeFileId;
        return {
          files: nextFiles,
          activeFileId: nextActive,
        };
      });
    },
    [language, token, updateWorkspace],
  );

  const handlePaneResizePointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();

    const panes = panesRef.current;
    if (!panes) return;

    paneDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startRatio: consoleRatioRef.current,
      panesHeight: panes.getBoundingClientRect().height,
    };
    setIsResizingPanes(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePaneResizePointerMove = (event) => {
    const drag = paneDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();

    const deltaRatio = (event.clientY - drag.startY) / drag.panesHeight;
    const nextRatio = clampConsoleRatio(
      drag.startRatio + deltaRatio,
      drag.panesHeight,
    );
    setConsoleRatio(nextRatio);
  };

  const finishPaneResize = (event) => {
    const drag = paneDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    paneDragRef.current = null;
    setIsResizingPanes(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    saveConsoleRatio(consoleRatioRef.current);
  };

  const resetConsoleRatio = () => {
    setConsoleRatio(DEFAULT_CONSOLE_RATIO);
    saveConsoleRatio(DEFAULT_CONSOLE_RATIO);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [language, output]);

  useEffect(() => {
    const nextLanguage = normalizeLanguage(initialLanguage);
    setLanguage((prev) => (prev === nextLanguage ? prev : nextLanguage));
    setWorkspaces((prev) => {
      const next = { ...prev };
      ALL_LANGUAGES.forEach((lang) => {
        if (!next[lang]) {
          next[lang] = mergeLocalWorkspace(lang);
        }
      });
      if (typeof initialCode === "string") {
        const workspace = next[nextLanguage] || createWorkspace(nextLanguage);
        const active = getActiveFile(workspace);
        if (active) {
          next[nextLanguage] = {
            ...workspace,
            files: workspace.files.map((file) =>
              file.id === active.id
                ? { ...file, content: initialCode, dirty: true }
                : file,
            ),
          };
        }
      }
      return next;
    });
  }, [initialLanguage, initialCode]);

  const handleLangChange = (lang) => {
    setLanguage(lang);
  };

  const handleRun = useCallback(async () => {
    const currentLanguage = language;
    const workspace = workspacesRef.current[currentLanguage] || createWorkspace(currentLanguage);
    const file = getActiveFile(workspace);
    const currentCode = file?.content || "";
    if (runningLanguage || !currentCode.trim()) return;

    setRunningLanguage(currentLanguage);
    updateWorkspace(currentLanguage, {
      output: [
        {
          type: "system",
          text: `▶ Running ${resolveEngine(currentLanguage).label}...`,
        },
      ],
      previewHTML: null,
      activeTab: "output",
    });

    const t0 = performance.now();
    let resultOutput = [];
    let resultPreview = null;
    let activeTabAfter = "output";

    try {
      const result = await executeCode(currentCode, currentLanguage);
      const ms = ((performance.now() - t0) / 1000).toFixed(2);

      if (result.previewHTML) {
        resultPreview = result.previewHTML;
        activeTabAfter = "preview";
        resultOutput = [{ type: "system", text: `✓ Rendered in ${ms}s` }];
      } else {
        const lines = [{ type: "system", text: `✓ Done in ${ms}s` }];
        if (result.stdout) lines.push({ type: "stdout", text: result.stdout });
        if (result.stderr) lines.push({ type: "stderr", text: result.stderr });
        if (result.error) lines.push({ type: "stderr", text: result.error });
        if (!result.stdout && !result.stderr && !result.error) {
          lines.push({ type: "stdout", text: "(no output)" });
        }
        resultOutput = lines;
      }

      updateWorkspace(currentLanguage, {
        output: resultOutput,
        previewHTML: resultPreview,
        activeTab: activeTabAfter,
      });

      if (token) {
        savePlaygroundRun(token, {
          language: currentLanguage,
          fileId: file?.serverId || null,
          fileName: file?.name || "",
          output: resultOutput,
          previewHTML: resultPreview,
          durationMs: Math.round(performance.now() - t0),
        }).catch(() => {
          /* non-blocking */
        });
      }
    } catch (e) {
      resultOutput = [{ type: "stderr", text: e.message }];
      updateWorkspace(currentLanguage, {
        output: resultOutput,
        previewHTML: null,
        activeTab: "output",
      });
    } finally {
      setRunningLanguage(null);
    }
  }, [language, runningLanguage, token, updateWorkspace]);

  const handleEditorKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun],
  );

  const langInfo = resolveEngine(language);
  const isServerBased = langInfo.engine === "server";
  const hasPreview = previewHTML !== null;
  const editorLanguage = monacoLanguageForFile(activeFile?.name, langInfo.mono);

  return (
    <div className="playground-root">
      <div className="pg-toolbar">
        <div className="pg-toolbar-left">
          <span className="pg-logo">⬡ IDE</span>
          <select
            className="pg-lang-select"
            value={language}
            onChange={(e) => handleLangChange(e.target.value)}
          >
            {ALL_LANGUAGES.map((l) => {
              const info = resolveEngine(l);
              return (
                <option key={l} value={l}>
                  {info.icon} {info.label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="pg-toolbar-center">
          {token ? (
            <span className={`pg-sync-badge${syncing ? " pg-sync-badge--busy" : ""}`}>
              {syncing ? "Saving to Drive…" : "Files saved to Google Drive"}
            </span>
          ) : (
            <span className="pg-sync-badge pg-sync-badge--local">
              Sign in to save files to Google Drive
            </span>
          )}
          {isServerBased ? (
            <span className="pg-server-badge">✓ Runs in local simulation</span>
          ) : (
            <span className="pg-browser-badge">✓ Runs in browser</span>
          )}
        </div>

        <div className="pg-toolbar-right">
          <span className="pg-font-size">{fontSize}px</span>
          <button
            type="button"
            className="pg-icon-btn"
            onClick={() => setFontSize((f) => Math.max(10, f - 1))}
            title="Decrease font size"
          >
            A-
          </button>
          <button
            type="button"
            className="pg-icon-btn"
            onClick={() => setFontSize((f) => Math.min(24, f + 1))}
            title="Increase font size"
          >
            A+
          </button>
          <button
            type="button"
            className={`pg-icon-btn ${wordWrap ? "active" : ""}`}
            onClick={() => setWordWrap((w) => !w)}
            title="Toggle word wrap"
          >
            ↵
          </button>
          <button
            type="button"
            className={`pg-run-btn ${currentIsRunning ? "running" : ""}`}
            onClick={handleRun}
            disabled={currentIsRunning}
            title="Run code (Ctrl+Enter)"
          >
            {currentIsRunning ? (
              <>
                <span className="pg-spinner">⟳</span> Running…
              </>
            ) : (
              "▶ Run"
            )}
          </button>
        </div>
      </div>

      {syncError ? <div className="pg-sync-error">{syncError}</div> : null}

      <div
        ref={panesRef}
        className={`pg-panes${isResizingPanes ? " pg-panes--resizing" : ""}`}
        onKeyDown={handleEditorKeyDown}
      >
        <div
          className="pg-editor-pane"
          style={{ flex: `1 1 ${(1 - consoleRatio) * 100}%` }}
        >
          <div className="pg-file-tabs" role="tablist" aria-label="Open files">
            {files.map((file) => (
              <div
                key={file.id}
                className={`pg-file-tab${file.id === activeFile?.id ? " active" : ""}`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={file.id === activeFile?.id}
                  className="pg-file-tab-btn"
                  onClick={() => selectFile(file.id)}
                >
                  {file.name}
                  {file.dirty ? <span className="pg-file-dirty">•</span> : null}
                </button>
                {files.length > 1 ? (
                  <button
                    type="button"
                    className="pg-file-tab-close"
                    onClick={() => closeFile(file.id)}
                    aria-label={`Close ${file.name}`}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="pg-file-tab-add"
              onClick={addFile}
              aria-label="New file"
              title="New file"
            >
              +
            </button>
          </div>

          <div className="pg-pane-header">
            <span className="pg-pane-title">
              {langInfo.icon} {activeFile?.name || langInfo.label}
            </span>
            <span className="pg-pane-hint">
              Ctrl+Enter to run the active file.
            </span>
          </div>

          <div className="pg-editor-body">
            <Editor
              height="100%"
              language={editorLanguage}
              value={code}
              beforeMount={definePolycodeMonacoTheme}
              onChange={(v) => updateActiveFileContent(v || "")}
              theme={POLYCODE_VSCODE_THEME}
              key={`editor-${language}-${activeFile?.id}-${editorLanguage}`}
              options={{
                ...getVSCodeEditorOptions({ fontSize, wordWrap }),
                fontSize,
              }}
            />
          </div>
        </div>

        <div
          className="pg-pane-resizer"
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize console panel"
          aria-valuemin={15}
          aria-valuemax={80}
          aria-valuenow={Math.round(consoleRatio * 100)}
          onPointerDown={handlePaneResizePointerDown}
          onPointerMove={handlePaneResizePointerMove}
          onPointerUp={finishPaneResize}
          onPointerCancel={finishPaneResize}
          onDoubleClick={resetConsoleRatio}
          title="Drag to resize console. Double-click to reset."
        />

        <div
          className="pg-output-pane"
          style={{ flex: `0 0 ${consoleRatio * 100}%` }}
        >
          <div className="pg-pane-header">
            <div className="pg-output-tabs">
              <button
                type="button"
                className={`pg-tab ${activeTab === "output" ? "active" : ""}`}
                onClick={() =>
                  updateWorkspace(language, { activeTab: "output" })
                }
              >
                ⬡ Console
              </button>
              {hasPreview && (
                <button
                  type="button"
                  className={`pg-tab ${activeTab === "preview" ? "active" : ""}`}
                  onClick={() =>
                    updateWorkspace(language, { activeTab: "preview" })
                  }
                >
                  🌐 Preview
                </button>
              )}
            </div>
            <button
              type="button"
              className="pg-clear-btn"
              onClick={() =>
                updateWorkspace(language, {
                  output: [],
                  previewHTML: null,
                  activeTab: "output",
                })
              }
            >
              CLEAR
            </button>
          </div>

          <div className="pg-output-body" ref={outputRef}>
            {activeTab === "output" && (
              <>
                {output.length === 0 ? (
                  <div className="pg-empty-state">
                    <span className="pg-empty-icon">▶</span>
                    <p>
                      Hit <strong>Run</strong> or press <kbd>Ctrl+Enter</kbd>
                    </p>
                    {isServerBased && (
                      <p className="pg-unsupported-note">
                        {langInfo.label} runs here in local simulation mode.
                        <br />
                        Use print-style statements to view output instantly.
                      </p>
                    )}
                  </div>
                ) : (
                  output.map((line, i) => (
                    <pre key={i} className={`pg-line ${line.type}`}>
                      {line.text}
                    </pre>
                  ))
                )}
                {currentIsRunning && (
                  <div className="pg-loader">
                    <span className="pg-pulse" />
                  </div>
                )}
              </>
            )}
            {activeTab === "preview" && hasPreview && (
              <iframe
                className="pg-preview-frame"
                srcDoc={previewHTML}
                title="Preview"
                sandbox="allow-scripts"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
