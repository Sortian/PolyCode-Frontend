import React from "react";
import { MessageCircle } from "lucide-react";

export default function OpenAssistantButton({ className = "", children }) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-polycode-assistant"))
      }
      className={className}
    >
      {children ?? (
        <>
          <MessageCircle size={16} aria-hidden />
          Talk to PolyMentor
        </>
      )}
    </button>
  );
}
