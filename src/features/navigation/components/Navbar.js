import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

export default function Navbar({
  toggleSidebar,
  theme = "dark",
  onToggleTheme,
}) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Hamburger */}
      <button
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Brand */}
      <Link to="/hub" className="navbar-brand">
        <img src="/logo.png" alt="PolyCode Logo" className="navbar-logo" />
        <div className="navbar-brand-text">
          <span className="logo-text">PolyCode</span>
          <span className="logo-sub">v2.0 docs</span>
        </div>
      </Link>

      {/* Search */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <span className="search-icon-left">⌕</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search docs, topics, code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <span className="search-kbd">⌘K</span>
      </form>

      {/* Links */}
      <div className="navbar-links">
        <Link to="/hub" className={isActive("/hub")}>
          Home
        </Link>
        <Link to="/search" className={isActive("/search")}>
          Search
        </Link>
        <NavLink
          to="/playground"
          className={({ isActive: a }) =>
            `navbar-playground-link ${a ? "active" : ""}`
          }
        >
          ▶ Playground
        </NavLink>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Auth section */}
        {user ? (
          <div className="navbar-user" ref={dropdownRef}>
            <button
              className="navbar-avatar-btn"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-label="User menu"
              title={user.username}
            >
              <span className="navbar-avatar-initials">
                {(
                  user.firstName?.[0] ||
                  user.username?.[0] ||
                  "?"
                ).toUpperCase()}
              </span>
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <strong>{user.username}</strong>
                  <span>{user.email}</span>
                </div>
                <button
                  className="navbar-dropdown-item navbar-dropdown-logout"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-auth-btns">
            <Link to="/login" className="navbar-login-btn">
              Sign in
            </Link>
            <Link to="/signup" className="navbar-signup-btn">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
