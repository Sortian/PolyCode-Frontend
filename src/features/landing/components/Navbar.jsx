import React from "react";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  {
    href: "#modules",
    label: "Features",
  },
  {
    href: "#get-started",
    label: "Languages",
  },
  {
    href: "/docs",
    label: "Documentation",
  },
];

export default function Navbar() {
  return (
    <header className="landing-navbar">
      {" "}
      <div className="landing-container">
        {" "}
        <div className="landing-navbar-inner">
          <a href="#top" className="landing-brand">
            <div className="landing-brand-mark">
              <img
                src="/images/polycode-logo.png"
                alt="PolyCode Logo"
                className="landing-logo"
              />
            </div>

            <div className="landing-brand-text">
              <span className="landing-logo-text">PolyCode</span>

              <span className="landing-logo-sub">AI Learning Platform</span>
            </div>
          </a>
          <nav className="landing-nav-links">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="landing-nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <a href="#get-started" className="landing-btn-primary">
            Start Learning
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
