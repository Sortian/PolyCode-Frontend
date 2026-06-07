import React from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import AssistantFab from "../components/AssistantFab";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorksSection from "../components/HowItWorksSection";
import LanguagePickerSection from "../components/LanguagePickerSection";
import ModulesSection from "../components/ModulesSection";
import Navbar from "../components/Navbar";
import VisionSection from "../components/VisionSection";
import "../landing.css";

export default function LandingPage({ onLanguageSelect, continueLanguage }) {
  return (
    <div className="polycode-landing">
      <AnimatedBackground />
      <div className="polycode-grid" style={{ position: "relative", minHeight: "100vh" }}>
        <Navbar />
        <main>
          <Hero />
          <ModulesSection />
          <HowItWorksSection />
          <VisionSection />
          <CTASection />
          <LanguagePickerSection
            onLanguageSelect={onLanguageSelect}
            continueLanguage={continueLanguage}
          />
        </main>
        <Footer />
      </div>
      <AssistantFab />
    </div>
  );
}
