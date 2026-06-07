import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const SNIPPETS = [
  { text: "def learn():", x: "4%", y: "18%", duration: 14 },
  { text: "{ code }", x: "88%", y: "22%", duration: 16 },
  { text: "async/await", x: "92%", y: "58%", duration: 12 },
  { text: "<PolyCode />", x: "6%", y: "68%", duration: 18 },
  { text: "import ai", x: "78%", y: "78%", duration: 15 },
  { text: "git push", x: "14%", y: "42%", duration: 13 },
];

export default function FloatingCode() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="landing-floating-code">
      {SNIPPETS.map((snippet) => (
        <motion.span
          key={snippet.text}
          className="landing-code-snippet"
          style={{ left: snippet.x, top: snippet.y }}
          animate={{
            y: [0, -16, 0, 12, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [0.35, 0.75, 0.45, 0.7, 0.35],
            rotate: [0, 2, -2, 1, 0],
          }}
          transition={{
            duration: snippet.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {snippet.text}
        </motion.span>
      ))}
    </div>
  );
}
