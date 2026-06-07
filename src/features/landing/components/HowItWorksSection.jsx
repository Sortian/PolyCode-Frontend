import React, { useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Database, MessageSquare, Sparkles, ThumbsUp, User } from "lucide-react";

const STEPS = [
  {
    icon: User,
    title: "Student asks",
    description: "A learner opens the AI chat and asks a programming question.",
  },
  {
    icon: MessageSquare,
    title: "AI responds",
    description: "The AI mentor generates a contextual, conversational answer.",
  },
  {
    icon: Database,
    title: "MongoDB stores",
    description: "The full conversation and metadata are saved for continuity.",
  },
  {
    icon: ThumbsUp,
    title: "Feedback collected",
    description: "Users rate responses and mark them helpful or unhelpful.",
  },
  {
    icon: Sparkles,
    title: "PolyMentor improves",
    description: "Curated conversations become training data for a smarter mentor.",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" ref={ref} className="landing-section landing-section-alt">
      <div className="landing-container">
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="landing-section-label">Data pipeline</p>
          <h2>How PolyCode gets smarter over time</h2>
          <p className="landing-section-desc">
            Every interaction on the platform feeds a self-improving loop — from chat
            to feedback to a better PolyMentor.
          </p>
        </motion.div>

        <div className="landing-steps-grid">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="landing-step-card"
                initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="landing-step-num">{index + 1}</span>
                <div className="landing-step-icon">
                  <Icon size={20} aria-hidden />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
