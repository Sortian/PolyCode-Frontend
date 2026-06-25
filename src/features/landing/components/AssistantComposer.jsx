import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Isolated composer so typing does not re-render the full message list.
 */
function AssistantComposer({
  onSend,
  disabled = false,
  locked = false,
  sending = false,
  placeholder,
  autoFocus = false,
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!autoFocus) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  const submit = useCallback(() => {
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft("");
    inputRef.current?.focus();
  }, [draft, disabled, onSend]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={`assistant-composer${locked && !sending ? " assistant-composer--locked" : ""}`}
    >
      <span className="assistant-composer-prompt">&gt;</span>
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        aria-label="Ask PolyMentor"
        className="assistant-composer-input"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!draft.trim() || disabled}
        aria-label="Send"
        className="assistant-composer-send"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default memo(AssistantComposer);
