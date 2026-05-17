import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./features/navigation/components/Navbar";
import Sidebar from "./features/navigation/components/Sidebar";
import { PlaygroundProvider } from "./features/playground/context/PlaygroundContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import "./App.css";

// ── Lazy-load every page ──────────────────────────────────────────────────────
const LanguageSelectPage = lazy(
  () => import("./features/language/pages/LanguageSelectPage"),
);
const HomePage = lazy(() => import("./features/docs/pages/Home/HomePage"));
const DocumentPage = lazy(() => import("./features/docs/pages/DocumentPage"));
const CategoryPage = lazy(() => import("./features/docs/pages/CategoryPage"));
const SearchPage = lazy(() => import("./features/docs/pages/SearchPage"));
const PlaygroundPage = lazy(
  () => import("./features/playground/pages/PlaygroundPage"),
);
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("./features/auth/pages/SignupPage"));

const PageFallback = () => (
  <div className="loading">
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    () => localStorage.getItem("selectedLanguage") || null,
  );
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLanguageSelect = (language) => {
    localStorage.setItem("selectedLanguage", language);
    setSelectedLanguage(language);
  };

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme]);

  return (
    <AuthProvider>
      <PlaygroundProvider>
        <Router>
          <div className={`app ${theme === "light" ? "theme-light" : ""}`}>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* ── Auth routes (no navbar/sidebar) ── */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* ── Language selector (no navbar/sidebar) ── */}
                <Route
                  path="/select-language"
                  element={
                    <LanguageSelectPage
                      onLanguageSelect={handleLanguageSelect}
                    />
                  }
                />

                {/* ── Main app with navbar + sidebar ── */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar
                        toggleSidebar={toggleSidebar}
                        theme={theme}
                        onToggleTheme={toggleTheme}
                      />
                      <div className="layout">
                        {isSidebarOpen && (
                          <div className="backdrop" onClick={closeSidebar} />
                        )}
                        <Sidebar
                          isOpen={isSidebarOpen}
                          onClose={closeSidebar}
                          selectedLanguage={selectedLanguage}
                          onLanguageSelect={handleLanguageSelect}
                        />
                        <main className="main-content">
                          <Routes>
                            {/* Redirect root to language picker if no language selected */}
                            <Route
                              path="/"
                              element={
                                selectedLanguage ? (
                                  <HomePage
                                    selectedLanguage={selectedLanguage}
                                  />
                                ) : (
                                  <Navigate to="/select-language" replace />
                                )
                              }
                            />
                            <Route
                              path="/hub"
                              element={
                                selectedLanguage ? (
                                  <HomePage
                                    selectedLanguage={selectedLanguage}
                                  />
                                ) : (
                                  <Navigate to="/select-language" replace />
                                )
                              }
                            />
                            <Route
                              path="/doc/*"
                              element={
                                <DocumentPage
                                  selectedLanguage={selectedLanguage}
                                  theme={theme}
                                />
                              }
                            />
                            <Route
                              path="/category/*"
                              element={
                                <CategoryPage
                                  selectedLanguage={selectedLanguage}
                                />
                              }
                            />
                            <Route
                              path="/search"
                              element={
                                <SearchPage
                                  selectedLanguage={selectedLanguage}
                                />
                              }
                            />
                            <Route
                              path="/playground"
                              element={
                                <PlaygroundPage
                                  theme={theme}
                                  onToggleSidebar={toggleSidebar}
                                  sidebarOpen={isSidebarOpen}
                                />
                              }
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                          </Routes>
                        </main>
                      </div>
                    </>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </PlaygroundProvider>
    </AuthProvider>
  );
}

export default App;