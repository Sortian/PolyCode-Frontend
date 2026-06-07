import React from "react";
import { ASSISTANT_CONFIG } from "../lib/assistantConfig";

const SIZES = {
  sm: { box: 28, img: 24 },
  md: { box: 56, img: 48 },
  lg: { box: 64, img: 56 },
};

/** Renders the PolyMentor mascot with consistent framing on the dark landing UI. */
export default function AssistantAvatar({ size = "md", alt = "" }) {
  const dims = SIZES[size] || SIZES.md;

  return (
    <span
      className="assistant-avatar-wrap"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dims.box,
        height: dims.box,
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: size === "lg" ? "1rem" : "0.75rem",
        border: "1px solid rgba(16, 185, 129, 0.35)",
        background: "#ececef",
        padding: 2,
      }}
    >
      <img
        src={ASSISTANT_CONFIG.avatarSrc}
        alt={alt}
        width={dims.img}
        height={dims.img}
        className="assistant-avatar-img"
        style={{
          width: dims.img,
          height: dims.img,
          objectFit: "contain",
          objectPosition: "center center",
        }}
      />
    </span>
  );
}
