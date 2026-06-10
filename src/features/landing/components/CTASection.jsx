import React, { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import OpenAssistantButton from "./OpenAssistantButton";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} className="landing-section" style={{ paddingBottom: "6rem" }}>
      <div className="landing-container">
        <motion.div
          className="landing-cta-box"
          initial={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="landing-cta-glow" />
          <h2>Ready to start learning with PolyCode?</h2>
          <p>
            Explore courses, ask PolyMentor anything about programming, and analyze
            your code with PolyGuard — all in one ecosystem.
          </p>
          <div className="landing-cta-actions">
            <OpenAssistantButton className="landing-btn-accent">
              Chat with PolyMentor
            </OpenAssistantButton>
            <a href="#get-started" className="landing-btn-secondary">
              Choose your language
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
