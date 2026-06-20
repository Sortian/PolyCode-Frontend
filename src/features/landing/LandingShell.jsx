import React from "react";
import LandingPage from "./pages/LandingPage";
import {
  applyDocumentTheme,
  clearDocumentThemeInlineStyles,
  getAppThemeClass,
} from "../../shared/theme/themes";

/**
 * Landing page theme follows the global app theme and stays in sync when changed.
 */
export default function LandingShell({
  savedTheme,
  onThemeChange,
  onLanguageSelect,
  continueLanguage,
}) {
  React.useLayoutEffect(() => {
    applyDocumentTheme(savedTheme, { landing: true });
    return () => clearDocumentThemeInlineStyles();
  }, [savedTheme]);

  const themeClass = getAppThemeClass(savedTheme);

  return (
    <div className={`app${themeClass ? ` ${themeClass}` : ""}`}>
      <LandingPage
        onLanguageSelect={onLanguageSelect}
        continueLanguage={continueLanguage}
        theme={savedTheme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}
