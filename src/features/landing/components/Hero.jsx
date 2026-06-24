import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const reduceMotion = useReducedMotion();
  const isLoggedIn = !loading && Boolean(user);

  function handlePrimaryAction() {
    if (isLoggedIn) {
      navigate("/courses");
      return;
    }
    navigate("/login");
  }

  return (
    <section className="landing-hero" id="top">
      <div className="landing-hero-glow" />

      <div className="landing-container landing-hero-grid">
        <motion.div
          className="landing-hero-copy"
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="landing-eyebrow">
            <Sparkles size={16} aria-hidden />
            AI-Powered Learning Ecosystem
          </p>
          <h1>
            Learn Programming Faster
            <span className="landing-hero-shimmer">with AI Guidance</span>
          </h1>
          <p className="landing-hero-lead">
            Structured programming courses, interactive exercises, real-time AI
            mentoring, and built-in security analysis in one platform.
          </p>
          <div className="landing-hero-actions">
            <button
              type="button"
              className="landing-btn-primary"
              onClick={handlePrimaryAction}
            >
              {isLoggedIn ? "Resume" : "Get Started"}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="landing-hero-image-wrap"
          initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <img
            className="landing-hero-image"
            src="/images/herooooo.png"
            alt="PolyCode platform — Learn, Code, Secure with PolyMentor, courses, and PolyGuard"
          />
        </motion.div>
      </div>
    </section>
  );
}
