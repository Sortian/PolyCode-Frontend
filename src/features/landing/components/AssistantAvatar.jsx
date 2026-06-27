import React from "react";
import { ASSISTANT_CONFIG } from "../lib/assistantConfig";

const SIZES = {
  sm: { boxW: 36, boxH: 40, imgW: 34, imgH: 38, cls: "assistant-avatar-wrap--sm" },
  md: { boxW: 72, boxH: 80, imgW: 68, imgH: 76, cls: "assistant-avatar-wrap--md" },
  lg: { boxW: 88, boxH: 96, imgW: 84, imgH: 92, cls: "assistant-avatar-wrap--lg" },
  dock: { boxW: 56, boxH: 56, imgW: 50, imgH: 50, cls: "assistant-avatar-wrap--dock" },
  header: { boxW: 84, boxH: 84, imgW: 78, imgH: 78, cls: "assistant-avatar-wrap--header" },
};

/** Renders the PolyMentor mascot (full-character artwork). */
export default function AssistantAvatar({ size = "md", highlight = false, alt = "" }) {
  const dims = SIZES[size] || SIZES.md;

  return (
    <span
      className={`assistant-avatar-wrap assistant-avatar-wrap--mascot ${dims.cls}${
        highlight ? " assistant-avatar-wrap--highlight" : ""
      }`}
      style={{ width: dims.boxW, height: dims.boxH }}
    >
      <img
        src={ASSISTANT_CONFIG.avatarSrc}
        alt={alt || ASSISTANT_CONFIG.name}
        width={dims.imgW}
        height={dims.imgH}
        className="assistant-avatar-img assistant-avatar-img--mascot"
        style={{ width: dims.imgW, height: dims.imgH }}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
