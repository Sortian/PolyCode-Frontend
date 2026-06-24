import React from "react";
import { Check, Circle } from "lucide-react";

export default function LessonStatusIcon({ done }) {
  if (done) {
    return <Check size={15} strokeWidth={2.5} className="lesson-status-icon done" aria-hidden />;
  }
  return <Circle size={15} strokeWidth={2} className="lesson-status-icon" aria-hidden />;
}
