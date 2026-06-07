import React from "react";
import { useReducedMotion } from "framer-motion";

export default function Marquee({ children, reverse = false, speed = 28 }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="landing-marquee-wrap">
      <div
        className={`landing-marquee-track ${
          reduceMotion
            ? ""
            : reverse
              ? "landing-marquee-track--reverse"
              : "landing-marquee-track--forward"
        }`}
        style={reduceMotion ? undefined : { animationDuration: `${speed}s` }}
      >
        <div style={{ display: "flex", gap: "0.75rem" }}>{children}</div>
        <div style={{ display: "flex", gap: "0.75rem" }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
