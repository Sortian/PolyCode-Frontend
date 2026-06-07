import React from "react";

export default function PolyCodeLogo({ className = "", height = 40, glow = true }) {
  return (
    <span
      className={`polycode-logo-wrap ${glow ? "polycode-logo-wrap--glow" : ""}`}
    >
      {glow ? (
        <>
          <span className="polycode-logo-aura" aria-hidden />
          <span className="polycode-logo-aura polycode-logo-aura--delay" aria-hidden />
        </>
      ) : null}
      <img
        src="/images/polycode-logo.png"
        alt="PolyCode — Learn. Code. Secure."
        height={height}
        className={`polycode-logo-img ${className}`}
        style={{ width: "auto", maxHeight: height }}
      />
    </span>
  );
}
