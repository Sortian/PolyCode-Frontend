import React from "react";

export default function AnimatedBackground({ theme = "dark" }) {
  const isLight = theme === "light";

  return (
    <div
      className={`landing-bg-wrap${isLight ? " landing-bg-wrap--light" : ""}`}
      aria-hidden="true"
    >
      <div className="landing-bg-ambient" />
      <div className="landing-bg-noise" />
    </div>
  );
}
