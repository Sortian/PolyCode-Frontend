import React, { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { BookOpen, Bot, Shield } from "lucide-react";
import OpenAssistantButton from "./OpenAssistantButton";

const MODULES = [
  {
    id: "polym_mentor",
    icon: Bot,
    name: "PolyMentor",
    tagline: "AI Coding Assistant",
    description:
      "Your intelligent programming mentor. Debug code, understand errors, learn best practices, and get step-by-step guidance.",
    features: [
      "Answers programming questions",
      "Explains errors & exceptions",
      "Suggests optimized solutions",
      "Improves from user feedback",
    ],
    cardClass: "landing-module-card--indigo",
    iconClass: "landing-module-icon--indigo",
    action: "assistant",
  },
  {
    id: "polycode-website",
    icon: BookOpen,
    name: "PolyCode Website",
    tagline: "Learning Platform",
    description:
      "The main educational hub with courses, video lectures, exercises, progress tracking, and AI-powered chat.",
    features: [
      "Course management system",
      "Video lectures & tutorials",
      "Programming exercises",
      "Student progress tracking",
    ],
    cardClass: "landing-module-card--violet",
    iconClass: "landing-module-icon--violet",
    action: "get-started",
  },
  {
    id: "polyguard",
    icon: Shield,
    name: "PolyGuard",
    tagline: "Security Analyzer",
    description:
      "AI/ML-based code security analysis that detects vulnerabilities, scores risk, and suggests improvements.",
    features: [
      "Vulnerability detection",
      "Security scoring",
      "Unsafe practice alerts",
      "Risk assessment reports",
    ],
    cardClass: "landing-module-card--cyan",
    iconClass: "landing-module-icon--cyan",
    action: null,
  },
];

export default function ModulesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <section id="modules" ref={ref} className="landing-section">
      <div className="landing-container">
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="landing-section-label">Three pillars</p>
          <h2>One ecosystem for learning and security</h2>
          <p className="landing-section-desc">
            PolyCode brings together mentorship, structured learning, and automated
            security analysis in a single platform built for students and developers.
          </p>
        </motion.div>

        <div className="landing-modules-grid">
          {MODULES.map((module, index) => {
            const Icon = module.icon;
            const cardContent = (
              <>
                <div className={`landing-module-icon ${module.iconClass}`}>
                  <Icon size={24} aria-hidden />
                </div>
                <p className="landing-module-tagline">{module.tagline}</p>
                <h3>{module.name}</h3>
                <p>{module.description}</p>
                <ul className="landing-module-features">
                  {module.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            );

            if (module.action === "assistant") {
              return (
                <motion.article
                  key={module.id}
                  className={`landing-module-card ${module.cardClass}`}
                  initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.15 }}
                >
                  {cardContent}
                  <div style={{ marginTop: "1.25rem" }}>
                    <OpenAssistantButton className="landing-btn-indigo">
                      Talk to PolyMentor
                    </OpenAssistantButton>
                  </div>
                </motion.article>
              );
            }

            if (module.action === "get-started") {
              return (
                <motion.a
                  key={module.id}
                  href="#get-started"
                  className={`landing-module-card landing-module-card--clickable ${module.cardClass}`}
                  initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.15 }}
                >
                  {cardContent}
                </motion.a>
              );
            }

            return (
              <motion.article
                key={module.id}
                className={`landing-module-card ${module.cardClass}`}
                initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.15 }}
              >
                {cardContent}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
