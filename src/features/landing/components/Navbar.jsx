import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import PolyCodeLogo from "./PolyCodeLogo";

const NAV_LINKS = [
  { href: "#modules", label: "Modules" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#vision", label: "Vision" },
];

export default function Navbar() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="landing-navbar"
      initial={reduceMotion ? {} : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="landing-container landing-navbar-inner">
        <a href="#top" className="landing-nav-logo">
          <PolyCodeLogo height={32} className="landing-logo-sm" />
        </a>

        <nav className="landing-nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="landing-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#get-started" className="landing-btn-primary">
          Get started
        </a>
      </div>
    </motion.header>
  );
}
