import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Minus,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import { useAssistant } from "../../assistant/context/AssistantContext";
import ProfileAvatar from "../../profile/components/ProfileAvatar";
import {
  getContextLabel,
  getQuickPrompts,
  getWelcomeMessage,
} from "../../assistant/lib/assistantPrompts";
import {
  clearAssistantSession,
  fetchAssistantSession,
  postAssistantChat,
  postAssistantFeedback,
} from "../lib/assistantApi";
import { ASSISTANT_CONFIG } from "../lib/assistantConfig";
import AssistantComposer from "./AssistantComposer";
import AssistantAvatar from "./AssistantAvatar";
import AssistantMarkdown from "../../assistant/components/AssistantMarkdown";

const MAX_STORED_MESSAGES = 20;
const ASSISTANT_LEVEL_KEY = "polycode_assistant_level";
const ASSISTANT_LEVELS = ["beginner", "intermediate", "advanced"];

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

function loadAssistantLevel() {
  try {
    const stored = localStorage.getItem(ASSISTANT_LEVEL_KEY);
    return ASSISTANT_LEVELS.includes(stored) ? stored : "beginner";
  } catch {
    return "beginner";
  }
}

function saveAssistantLevel(level) {
  try {
    localStorage.setItem(ASSISTANT_LEVEL_KEY, level);
  } catch {
    /* ignore */
  }
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
    const messagesForStorage = trimmed.map(({ stream, ...message }) => message);
    localStorage.setItem(
      ASSISTANT_CONFIG.storageKey,
      JSON.stringify({ ...session, messages: messagesForStorage }),
    );
  } catch {
    /* ignore */
  }
}

function ReplyFeedback({ feedback, onRate, disabled, required }) {
  const handleRate = (rating) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || feedback === rating) return;
    onRate(rating);
  };

  return (
    <div
      className={`assistant-feedback${required && !feedback ? " assistant-feedback--required" : ""}`}
    >
      {required && !feedback ? (
        <span className="assistant-feedback-hint">Rate this answer to continue</span>
      ) : null}
      <button
        type="button"
        className={`assistant-feedback-btn${feedback === "like" ? " assistant-feedback-btn--active-like" : ""}`}
        onClick={handleRate("like")}
        disabled={disabled}
        aria-label="Helpful reply"
        aria-pressed={feedback === "like"}
      >
        <ThumbsUp size={14} />
      </button>
      <button
        type="button"
        className={`assistant-feedback-btn${feedback === "dislike" ? " assistant-feedback-btn--active-dislike" : ""}`}
        onClick={handleRate("dislike")}
        disabled={disabled}
        aria-label="Not helpful reply"
        aria-pressed={feedback === "dislike"}
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}

const MentorReply = memo(function MentorReply({
  content,
  messageId,
  feedback,
  showFeedback,
  onRate,
  feedbackRequired,
  isWelcome = false,
}) {
  const canRate = showFeedback && content && messageId !== "welcome";

  return (
    <article className="assistant-mentor-reply">
      <span aria-hidden className="assistant-mentor-accent" />
      <div
        className={`assistant-mentor-card${
          isWelcome ? " assistant-mentor-card--welcome" : ""
        }`}
      >
        <div className="assistant-mentor-meta">
          <AssistantAvatar size="sm" />
          <span className="assistant-mentor-name">{ASSISTANT_CONFIG.name}</span>
        </div>
        <div className="assistant-markdown">
          <AssistantMarkdown content={content} streaming={false} />
        </div>
        {canRate ? (
          <ReplyFeedback
            feedback={feedback}
            onRate={onRate}
            disabled={false}
            required={feedbackRequired}
          />
        ) : null}
      </div>
    </article>
  );
});

const UserReply = memo(function UserReply({ content, user }) {
  return (
    <div className="assistant-user-row">
      {user ? (
        <div className="assistant-user-avatar" aria-hidden>
          <ProfileAvatar user={user} size="sm" />
        </div>
      ) : null}
      <div className="assistant-user-bubble">
        <p>{content}</p>
      </div>
    </div>
  );
});

function ThinkingIndicator() {
  return (
    <div className="assistant-thinking">
      <AssistantAvatar size="sm" alt="" />
      <span className="assistant-thinking-text">PolyMentor is thinking…</span>
    </div>
  );
}

function getPendingFeedbackMessage(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (
      message.role === "assistant" &&
      message.id !== "welcome" &&
      message.content?.trim() &&
      !message.stream
    ) {
      return message.feedback ? null : message;
    }
  }
  return null;
}

export default function AssistantFab() {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;
  const { context: assistantContext } = useAssistant();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(() => loadSession());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [assistantLevel, setAssistantLevel] = useState(() => loadAssistantLevel());
  const messagesEndRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const scrollRafRef = useRef(null);
  const sessionRef = useRef(session);
  const dockRef = useRef(null);
  const lastUserIdRef = useRef(userId);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const previousUserId = lastUserIdRef.current;
    if (previousUserId === userId) return;

    // First login on a guest session — keep chat; backend claims anonymous prompts.
    if (!previousUserId && userId) {
      lastUserIdRef.current = userId;
      return;
    }

    // Logout or account switch — avoid 403 from another user's session id.
    setSession({
      sessionId: generateSessionId(),
      messages: [WELCOME_MESSAGE],
    });
    setError(null);
    lastUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromServer() {
      try {
        const current = loadSession();
        const data = await fetchAssistantSession(current.sessionId);
        if (cancelled) return;

        if (data?.forbidden) {
          setSession({
            sessionId: generateSessionId(),
            messages: [WELCOME_MESSAGE],
          });
          return;
        }

        if (!data?.messages?.length) return;

        const serverMessages = data.messages.map((m, index) => ({
          id:
            m.clientMessageId ||
            `server-${index}-${m.createdAt || Date.now()}`,
          role: m.role,
          content: m.content,
          feedback: m.feedback || null,
        }));

        setSession({
          sessionId: current.sessionId,
          messages: [WELCOME_MESSAGE, ...serverMessages],
        });
      } catch {
        /* use local session from localStorage */
      }
    }

    hydrateFromServer();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollMessagesToBottom = useCallback((behavior = "auto") => {
    if (scrollRafRef.current) {
      window.cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const scrollNode = messagesScrollRef.current;
      if (!scrollNode) return;

      if (behavior === "smooth") {
        messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
        return;
      }

      scrollNode.scrollTop = scrollNode.scrollHeight;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    stickToBottomRef.current = true;
    scrollMessagesToBottom("auto");
  }, [open, scrollMessagesToBottom]);

  useLayoutEffect(() => {
    if (!open) return;

    const scrollNode = messagesScrollRef.current;
    if (!scrollNode) return;

    const distanceFromBottom =
      scrollNode.scrollHeight - scrollNode.scrollTop - scrollNode.clientHeight;

    if (sending || distanceFromBottom < 120) {
      stickToBottomRef.current = true;
      scrollMessagesToBottom("auto");
      return;
    }

    stickToBottomRef.current = false;
  }, [session.messages, sending, open, scrollMessagesToBottom]);

  useEffect(() => {
    const scrollNode = messagesScrollRef.current;
    if (!open || !scrollNode) return undefined;

    const onScroll = () => {
      const distanceFromBottom =
        scrollNode.scrollHeight - scrollNode.scrollTop - scrollNode.clientHeight;
      stickToBottomRef.current = distanceFromBottom < 120;
    };

    scrollNode.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollNode.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [open]);

  useEffect(() => {
    const scrollEl = messagesScrollRef.current;
    if (!open || !scrollEl) return undefined;

    const trapWheel = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) {
        event.preventDefault();
        return;
      }

      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        event.preventDefault();
      }
    };

    scrollEl.addEventListener("wheel", trapWheel, { passive: false });
    return () => scrollEl.removeEventListener("wheel", trapWheel);
  }, [open, session.messages.length]);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveAssistantLevel(assistantLevel);
  }, [assistantLevel]);

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

  const handleFeedback = useCallback(
    async (messageId, rating, assistantContent) => {
      const msgs = sessionRef.current.messages;
      const msgIndex = msgs.findIndex((m) => m.id === messageId);
      if (msgIndex < 0) return;
      if (msgs[msgIndex]?.feedback === rating) return;

      const userMsg = [...msgs.slice(0, msgIndex)]
        .reverse()
        .find((m) => m.role === "user" && m.content?.trim());
      if (!userMsg) {
        setError("Could not find your question for this reply. Try refreshing.");
        return;
      }

      setSession((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === messageId ? { ...m, feedback: rating } : m,
        ),
      }));
      setError(null);

      try {
        await postAssistantFeedback({
          session_id: sessionRef.current.sessionId,
          message_id: messageId,
          rating,
          user_message: userMsg.content,
          assistant_message: assistantContent,
          context: assistantContext,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not sync feedback to server.";
        const friendly =
          message === "Forbidden"
            ? "This chat belongs to another account. Start a new chat with the trash icon."
            : message.includes("Sign in to rate")
              ? "Sign in to save feedback for this conversation."
              : message;
        setError(`${friendly} (saved locally — you can keep chatting)`);
      }
    },
    [assistantContext],
  );

  const sendText = useCallback(
    async (text) => {
      if (!text.trim() || sending) return;
      if (getPendingFeedbackMessage(sessionRef.current.messages)) return;

      const userMsg = { id: `user-${Date.now()}`, role: "user", content: text };
      const assistantId = `assistant-${Date.now()}`;
      const pendingId = `pending-${Date.now()}`;
      const pendingMsg = { id: pendingId, role: "assistant", content: "" };
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg, pendingMsg],
      }));
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
          context: assistantContext,
          level: assistantLevel,
          assistant_message_id: assistantId,
        });
        const resolvedAssistantId = res.assistantMessageId || assistantId;
        const assistantMsg = {
          id: resolvedAssistantId,
          role: "assistant",
          content: res.response,
          feedback: null,
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
    [sending, assistantContext, assistantLevel],
  );

  const pendingFeedback = getPendingFeedbackMessage(session.messages);
  const inputLocked = sending || Boolean(pendingFeedback);

  const quickPrompts = getQuickPrompts(assistantContext);
  const contextLabel = getContextLabel(assistantContext);

  const showQuickPrompts =
    session.messages.length <= 1 &&
    !inputLocked &&
    session.messages.every((m) => m.id === "welcome");

  const messageContent = (msg) =>
    msg.id === "welcome" ? getWelcomeMessage(assistantContext) : msg.content;

  return createPortal(
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
            <div className="assistant-panel-header">
              <div className="assistant-panel-header-row">
                <div className="assistant-panel-header-main">
                  <AssistantAvatar
                    size="header"
                    highlight
                    alt={ASSISTANT_CONFIG.name}
                  />
                  <div className="assistant-panel-header-copy">
                    <p id="polym_mentor-title" className="assistant-panel-title">
                      {ASSISTANT_CONFIG.name}
                    </p>
                    <p className="assistant-panel-tagline">{ASSISTANT_CONFIG.tagline}</p>
                    <div className="assistant-panel-header-meta">
                      {contextLabel ? (
                        <span className="assistant-context-badge" title={contextLabel}>
                          {contextLabel}
                        </span>
                      ) : null}
                      <label className="assistant-level-label">
                        Level
                        <select
                          value={assistantLevel}
                          onChange={(event) => setAssistantLevel(event.target.value)}
                          disabled={sending}
                          aria-label="PolyMentor response level"
                          className="assistant-level-select"
                        >
                          {ASSISTANT_LEVELS.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="assistant-panel-header-actions">
                  <button
                    type="button"
                    onClick={clearSession}
                    disabled={sending}
                    aria-label="Reset session"
                    className="assistant-icon-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Minimize"
                    className="assistant-icon-btn"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={messagesScrollRef}
              className="polym_mentor-scroll assistant-messages"
            >
              {session.messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "assistant" && msg.content === "" ? (
                    <ThinkingIndicator />
                  ) : msg.role === "user" ? (
                    <UserReply
                      content={messageContent(msg)}
                      user={user}
                    />
                  ) : (
                    <MentorReply
                      messageId={msg.id}
                      content={messageContent(msg)}
                      feedback={msg.feedback}
                      isWelcome={msg.id === "welcome"}
                      showFeedback
                      feedbackRequired={msg.id === pendingFeedback?.id}
                      onRate={(rating) =>
                        handleFeedback(msg.id, rating, msg.content)
                      }
                    />
                  )}
                </div>
              ))}

              {showQuickPrompts ? (
                <div>
                  <p className="assistant-quick-label">Quick prompts</p>
                  <div className="assistant-quick-list">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendText(prompt)}
                        className="assistant-quick-btn"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="assistant-error-box">error: {error}</div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div className="assistant-footer">
              {pendingFeedback ? (
                <p className="assistant-feedback-lock-notice" role="status">
                  Like or dislike the last answer before sending another message.
                </p>
              ) : null}
              <AssistantComposer
                autoFocus={open}
                onSend={sendText}
                disabled={inputLocked}
                locked={Boolean(pendingFeedback)}
                sending={sending}
                placeholder={
                  pendingFeedback
                    ? "Rate the reply above to continue…"
                    : ASSISTANT_CONFIG.inputPlaceholder
                }
              />
              <p className="assistant-powered-by">{ASSISTANT_CONFIG.poweredByLabel}</p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <motion.div
          ref={dockRef}
          role="button"
          tabIndex={0}
          className="assistant-dock-btn polym_mentor-dock assistant-dock-btn--compact"
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen(true);
            }
          }}
          aria-label={`Open ${ASSISTANT_CONFIG.name}`}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 320, damping: 26 }}
        >
          <div aria-hidden="true" className="assistant-dock-inner">
            <AssistantAvatar size="dock" highlight alt={ASSISTANT_CONFIG.name} />
          </div>
        </motion.div>
      ) : null}
    </>,
    document.body,
  );
}
