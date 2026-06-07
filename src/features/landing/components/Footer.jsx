import React from "react";
import PolyCodeLogo from "./PolyCodeLogo";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-inner">
        <PolyCodeLogo height={48} />
        <p>PolyMentor · PolyCode Website · PolyGuard</p>
      </div>
    </footer>
  );
}
