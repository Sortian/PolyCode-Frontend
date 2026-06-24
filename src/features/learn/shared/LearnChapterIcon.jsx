import React from "react";
import { getChapterIconComponent } from "./learnChapterIcons";

export default function LearnChapterIcon({ icon, size = 20, className = "" }) {
  const Icon = getChapterIconComponent(icon);
  return (
    <Icon
      size={size}
      strokeWidth={2}
      className={`learn-chapter-icon ${className}`.trim()}
      aria-hidden
    />
  );
}
