import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bot, Github, Mail, Shield, Zap } from "lucide-react";

function openPolyMentor(event) {
  event.preventDefault();
  window.dispatchEvent(new Event("open-polycode-assistant"));
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-footer-logo">
              <span className="landing-footer-logo-accent">Poly</span>Code
            </Link>
            <p className="landing-footer-tagline">
              AI-powered programming education with interactive courses, daily
              challenges, PolyMentor guidance, and built-in security analysis.
            </p>
            <div className="landing-footer-socials">
              <a
                href="https://github.com/QuantumLogicsLabs/PolyCode"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PolyCode on GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="mailto:support@quantumlogicslimited.com"
                aria-label="Email support"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="landing-footer-col">
            <h4>Platform</h4>
            <nav aria-label="Platform links">
              <a href="#assistant" onClick={openPolyMentor}>
                <Bot size={15} aria-hidden />
                PolyMentor
              </a>
              <Link to="/select-language">
                <BookOpen size={15} aria-hidden />
                Courses
              </Link>
              <a href="#assistant" onClick={openPolyMentor}>
                <Shield size={15} aria-hidden />
                PolyGuard
              </a>
              <Link to="/playground">
                <Zap size={15} aria-hidden />
                Playground
              </Link>
            </nav>
          </div>

          <div className="landing-footer-col">
            <h4>Resources</h4>
            <nav aria-label="Resource links">
              <Link to="/hub">Documentation</Link>
              <a href="#get-started">Learning paths</a>
              <Link to="/daily-challenge">Daily challenge</Link>
            </nav>
          </div>

          <div className="landing-footer-col">
            <h4>Company</h4>
            <nav aria-label="Company links">
              <a href="#top">About</a>
              <a href="mailto:support@quantumlogicslimited.com">Contact</a>
              <a
                href="https://www.quantumlogicslimited.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quantum Logics
              </a>
            </nav>
          </div>
        </div>

        <div className="landing-footer-bar">
          <p className="landing-footer-copy">© {year} PolyCode. All rights reserved.</p>
          <a
            className="landing-footer-powered"
            href="https://www.quantumlogicslimited.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/logo.png" alt="" aria-hidden />
            <span>
              Powered by <strong>Quantum Logics</strong>
            </span>
          </a>
          <span className="landing-footer-motto">Learn · Build · Secure</span>
        </div>
      </div>
    </footer>
  );
}
