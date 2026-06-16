import React from "react";
import LandingPage from "./pages/LandingPage";

/**
 * Landing page always starts in dark mode. Theme toggle only affects the
 * landing route and does not persist to the global app theme.
 */
export default function LandingShell({
  savedTheme,
  footer,
  onLanguageSelect,
  continueLanguage,
}) {
  const [landingTheme, setLandingTheme] = React.useState("dark");

  React.useLayoutEffect(() => {
    setLandingTheme("dark");
  }, []);

  React.useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute("data-theme", landingTheme);
    body.classList.toggle("light-theme", landingTheme === "light");

    if (landingTheme === "light") {
      html.style.backgroundColor = "#f4f6fa";
      body.style.backgroundColor = "#f4f6fa";
    } else {
      html.style.backgroundColor = "#03050a";
      body.style.backgroundColor = "#03050a";
    }

    return () => {
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
      html.setAttribute("data-theme", savedTheme);
      body.classList.toggle("light-theme", savedTheme === "light");
    };
  }, [landingTheme, savedTheme]);

  const toggleLandingTheme = React.useCallback(() => {
    setLandingTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <div className={`app ${landingTheme === "light" ? "theme-light" : ""}`}>
      <LandingPage
        onLanguageSelect={onLanguageSelect}
        continueLanguage={continueLanguage}
        theme={landingTheme}
        onToggleTheme={toggleLandingTheme}
      />
      {footer}
    </div>
  );
}
