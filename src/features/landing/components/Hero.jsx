import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import FloatingCode from "./FloatingCode";
import OpenAssistantButton from "./OpenAssistantButton";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="landing-hero" id="top">
      <FloatingCode />
      <div className="landing-hero-glow" />

      <div className="landing-container landing-hero-grid">
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="landing-eyebrow">
            <Sparkles size={14} aria-hidden />
            AI-Powered Learning Ecosystem
          </p>

          <h1>
            Learn programming.
            <span className="landing-hero-shimmer">Build secure software.</span>
          </h1>

          <p className="landing-hero-lead">
            PolyCode combines an AI coding mentor, a full learning platform, and
            intelligent security analysis — so students learn faster and developers
            ship safer code.
          </p>

          <div className="landing-hero-actions">
            <a href="#get-started" className="landing-btn-accent">
              Get started
              <ArrowRight size={16} aria-hidden />
            </a>
            <OpenAssistantButton className="landing-btn-secondary">
              Talk to PolyMentor
            </OpenAssistantButton>
          </div>
        </motion.div>

        <motion.div
          className="landing-hero-image-wrap"
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="landing-hero-image-glow" />
          <motion.div
            className="landing-hero-image"
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/images/polycode-hero.png"
              alt="PolyCode platform — Learn, Code, Secure with PolyMentor, courses, and PolyGuard"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
