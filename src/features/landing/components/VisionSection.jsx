import React, { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Marquee from "./Marquee";

const TECH_STACK = [
  "React / Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "AI API",
  "Python",
  "PyTorch",
  "Hugging Face",
];

const VISION_ITEMS = [
  "High-quality conversations are filtered and curated",
  "Training data powers periodic PolyMentor enhancements",
  "RAG and vector search planned for deeper context",
  "PolyGuard keeps security at the center of every project",
];

function TechPill({ label }) {
  return <span className="landing-tech-pill">{label}</span>;
}

export default function VisionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  return (
    <section id="vision" ref={ref} className="landing-section">
      <div className="landing-container landing-vision-grid">
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="landing-section-label">Long-term vision</p>
          <h2>A self-improving AI programming mentor</h2>
          <p className="landing-section-desc">
            PolyCode is building toward a future where PolyMentor learns from real
            student conversations — becoming more accurate, more personalized, and
            better at guiding learners through programming challenges.
          </p>
          <ul className="landing-vision-list">
            {VISION_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="landing-tech-panel"
          initial={reduceMotion ? {} : { opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h3>Built with modern tools</h3>
          <p>
            A full-stack ecosystem designed for scale, learning, and continuous AI
            improvement.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Marquee speed={32}>
              {TECH_STACK.map((tech) => (
                <TechPill key={`a-${tech}`} label={tech} />
              ))}
            </Marquee>
            <Marquee reverse speed={36}>
              {[...TECH_STACK].reverse().map((tech) => (
                <TechPill key={`b-${tech}`} label={tech} />
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
