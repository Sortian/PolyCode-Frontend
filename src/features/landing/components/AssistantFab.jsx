import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Minus, Sparkles, Trash2, Zap } from "lucide-react";
import {
  clearAssistantSession,
  fetchAssistantSession,
  postAssistantChat,
} from "../lib/assistantApi";
import { ASSISTANT_CONFIG } from "../lib/assistantConfig";
import { useTypewriter } from "../lib/useTypewriter";
import AssistantAvatar from "./AssistantAvatar";

const MAX_STORED_MESSAGES = 20;

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content: ASSISTANT_CONFIG.welcomeMessage,
};

function generateSessionId() {
  return `pm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(ASSISTANT_CONFIG.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.sessionId && Array.isArray(parsed.messages)) {
        const hasWelcome = parsed.messages.some((m) => m.id === "welcome");
        return {
          ...parsed,
          messages: hasWelcome
            ? parsed.messages
            : [WELCOME_MESSAGE, ...parsed.messages],
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { sessionId: generateSessionId(), messages: [WELCOME_MESSAGE] };
}

function saveSession(session) {
  try {
    const trimmed =
      session.messages.length > MAX_STORED_MESSAGES
        ? [
            WELCOME_MESSAGE,
            ...session.messages
              .filter((m) => m.id !== "welcome")
              .slice(-(MAX_STORED_MESSAGES - 1)),
          ]
        : session.messages;
    localStorage.setItem(
      ASSISTANT_CONFIG.storageKey,
      JSON.stringify({ ...session, messages: trimmed }),
    );
  } catch {
    /* ignore */
  }
}

function renderMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: "var(--acid)" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    const lines = part.split("\n");
    return (
      <span key={i}>
        {lines.map((line, j) => (
          <span key={j}>
            {line}
            {j < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </span>
    );
  });
}

function MentorReply({ msg, reduceMotion }) {
  const isNew = msg.id.startsWith("assistant-");
  const shouldStream = isNew && !reduceMotion;
  const { displayed, done } = useTypewriter(msg.content, shouldStream);
  const visible = shouldStream ? displayed : msg.content;

  return (
    <article style={{ position: "relative", paddingLeft: "1.25rem" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "0.75rem",
          height: "calc(100% - 12px)",
          width: 3,
          borderRadius: 999,
          background: "var(--acid)",
        }}
      />
      <div
        style={{
          borderRadius: "0.75rem",
          border: "1px solid var(--border)",
          background: "rgba(10,18,24,0.9)",
          padding: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <AssistantAvatar size="sm" />
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--acid)",
            }}
          >
            mentor.output
          </span>
        </div>
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#e2e8f0", margin: 0 }}>
          {renderMarkdown(visible)}
          {!done && shouldStream ? (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                marginLeft: 2,
                background: "var(--acid)",
                verticalAlign: "middle",
                animation: "pulse 1s infinite",
              }}
            />
          ) : null}
        </p>
      </div>
    </article>
  );
}

function ThinkingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderRadius: "0.75rem",
        border: "1px solid rgba(34,211,238,0.15)",
        background: "rgba(34,211,238,0.05)",
        padding: "0.75rem 1rem",
      }}
    >
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", color: "rgba(103,232,249,0.8)" }}>
        PolyMentor is thinking…
      </span>
    </div>
  );
}

export default function AssistantFab() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(() => loadSession());
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionRef = useRef(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromServer() {
      const current = loadSession();
      const data = await fetchAssistantSession(current.sessionId);
      if (cancelled || !data?.messages?.length) return;

      const serverMessages = data.messages.map((m, index) => ({
        id: `server-${index}-${m.createdAt || Date.now()}`,
        role: m.role,
        content: m.content,
      }));

      setSession({
        sessionId: current.sessionId,
        messages: [WELCOME_MESSAGE, ...serverMessages],
      });
    }

    hydrateFromServer();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, open, sending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-polycode-assistant", onOpen);
    return () => window.removeEventListener("open-polycode-assistant", onOpen);
  }, []);

  const clearSession = useCallback(() => {
    const previousSessionId = sessionRef.current.sessionId;
    const nextSession = {
      sessionId: generateSessionId(),
      messages: [WELCOME_MESSAGE],
    };
    setSession(nextSession);
    setError(null);
    clearAssistantSession(previousSessionId).catch(() => {});
  }, []);

  const sendText = useCallback(
    async (text) => {
      if (!text.trim() || sending) return;

      const userMsg = { id: `user-${Date.now()}`, role: "user", content: text };
      const pendingId = `pending-${Date.now()}`;
      const pendingMsg = { id: pendingId, role: "assistant", content: "" };
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg, pendingMsg],
      }));
      setDraft("");
      setSending(true);
      setError(null);

      const currentSession = sessionRef.current;
      const history = currentSession.messages
        .filter((m) => m.id !== "welcome" && m.id !== pendingId)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await postAssistantChat({
          message: text,
          history,
          session_id: currentSession.sessionId,
        });
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: res.response,
        };
        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages.filter((m) => m.id !== pendingId), assistantMsg],
        }));
      } catch (err) {
        setSession((prev) => ({
          ...prev,
          messages: prev.messages.filter((m) => m.id !== pendingId),
        }));
        setError(err instanceof Error ? err.message : "Connection failed. Try again.");
      } finally {
        setSending(false);
      }
    },
    [sending],
  );

  const send = useCallback(async () => {
    await sendText(draft);
  }, [draft, sendText]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showQuickPrompts =
    session.messages.length <= 1 &&
    !sending &&
    session.messages.every((m) => m.id === "welcome");

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close PolyMentor"
            className="assistant-overlay"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="polym_mentor-title"
            initial={reduceMotion ? {} : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? {} : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="assistant-panel polym_mentor-panel"
          >
            <div
              style={{
                flexShrink: 0,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <AssistantAvatar size="md" alt={ASSISTANT_CONFIG.name} />
                  <div>
                    <p id="polym_mentor-title" style={{ margin: 0, fontFamily: "ui-monospace, monospace", fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>
                      {ASSISTANT_CONFIG.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
                      {ASSISTANT_CONFIG.tagline}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  <button
                    type="button"
                    onClick={clearSession}
                    disabled={sending}
                    aria-label="Reset session"
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.5rem" }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Minimize"
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.5rem" }}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="polym_mentor-scroll"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {session.messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "assistant" && msg.content === "" ? (
                    <ThinkingIndicator />
                  ) : msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div
                        style={{
                          maxWidth: "92%",
                          borderRadius: "0.75rem",
                          border: "1px solid rgba(100,116,139,0.3)",
                          background: "rgba(30,41,59,0.5)",
                          padding: "0.75rem 1rem",
                        }}
                      >
                        <p style={{ margin: "0 0 0.25rem", fontFamily: "ui-monospace, monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
                          you.input
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#f1f5f9" }}>{msg.content}</p>
                      </div>
                    </div>
                  ) : (
                    <MentorReply msg={msg} reduceMotion={reduceMotion} />
                  )}
                </div>
              ))}

              {showQuickPrompts ? (
                <div>
                  <p style={{ margin: "0 0 0.5rem", fontFamily: "ui-monospace, monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>
                    Quick prompts
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {ASSISTANT_CONFIG.quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendText(prompt)}
                        style={{
                          borderRadius: "0.5rem",
                          border: "1px solid var(--border)",
                          background: "var(--glass)",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.75rem",
                          color: "rgba(167,243,208,0.9)",
                          cursor: "pointer",
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div
                  style={{
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(239,68,68,0.25)",
                    background: "rgba(239,68,68,0.1)",
                    padding: "0.75rem 1rem",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "0.75rem",
                    color: "#fca5a5",
                  }}
                >
                  error: {error}
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                flexShrink: 0,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "#04080d",
                padding: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "#0a1018", padding: "0.5rem" }}>
                <span style={{ paddingBottom: "0.5rem", paddingLeft: "0.25rem", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "var(--acid)" }}>
                  &gt;
                </span>
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={ASSISTANT_CONFIG.inputPlaceholder}
                  rows={1}
                  disabled={sending}
                  aria-label="Ask PolyMentor"
                  style={{
                    flex: 1,
                    minHeight: "2rem",
                    maxHeight: "5rem",
                    resize: "none",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#f1f5f9",
                    fontSize: "0.875rem",
                    padding: "0.375rem 0",
                  }}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim() || sending}
                  aria-label="Send"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    border: "none",
                    background: "#c4b56a",
                    color: "#fff",
                    cursor: "pointer",
                    opacity: !draft.trim() || sending ? 0.3 : 1,
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <p style={{ margin: "0.5rem 0 0", textAlign: "center", fontFamily: "ui-monospace, monospace", fontSize: "9px", color: "#475569" }}>
                {ASSISTANT_CONFIG.poweredByLabel}
              </p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <motion.div
          className="assistant-dock-btn polym_mentor-dock"
          initial={reduceMotion ? {} : { x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 24 }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open ${ASSISTANT_CONFIG.name}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <AssistantAvatar size="lg" alt={ASSISTANT_CONFIG.name} />
            <span style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--acid)" }}>
                <Zap size={12} />
                {ASSISTANT_CONFIG.name}
              </span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Tap to open mentor</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "0.5rem", background: "var(--acid-dim)", color: "var(--acid)" }}>
              <Sparkles size={16} />
            </span>
          </button>
        </motion.div>
      ) : null}
    </>
  );
}
