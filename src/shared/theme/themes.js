export const DEFAULT_THEME_ID = "dark";

export const THEMES = [
  {
    id: "dark",
    label: "Dark",
    description: "PolyCode default",
    icon: "🌙",
    swatch: "#03050a",
    bg: "#03050a",
    bgLanding: "#07090f",
    appClass: "",
  },
  {
    id: "light",
    label: "Light",
    description: "Clean and bright",
    icon: "☀️",
    swatch: "#f4f6fa",
    bg: "#f8f9fb",
    bgLanding: "#f4f6fa",
    appClass: "theme-light",
  },
  {
    id: "classic",
    label: "Classic",
    description: "Retro amber terminal",
    icon: "📟",
    swatch: "#1a1408",
    bg: "#0c0a06",
    bgLanding: "#0c0a06",
    appClass: "theme-classic",
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep indigo glow",
    icon: "🌌",
    swatch: "#1e1b4b",
    bg: "#0b0f1a",
    bgLanding: "#0b0f1a",
    appClass: "theme-midnight",
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool teal focus",
    icon: "🌊",
    swatch: "#042f2e",
    bg: "#041016",
    bgLanding: "#041016",
    appClass: "theme-ocean",
  },
  {
    id: "slate",
    label: "Slate",
    description: "Soft professional gray",
    icon: "🪨",
    swatch: "#1e293b",
    bg: "#111318",
    bgLanding: "#111318",
    appClass: "theme-slate",
  },
];

const THEME_MAP = Object.fromEntries(THEMES.map((theme) => [theme.id, theme]));

export function getThemeById(themeId) {
  return THEME_MAP[themeId] || THEME_MAP[DEFAULT_THEME_ID];
}

export function normalizeThemeId(themeId) {
  return THEME_MAP[themeId] ? themeId : DEFAULT_THEME_ID;
}

export function isLightTheme(themeId) {
  return themeId === "light";
}

export function getAppThemeClass(themeId) {
  return getThemeById(themeId).appClass || "";
}

export function applyDocumentTheme(themeId, { landing = false } = {}) {
  const theme = getThemeById(normalizeThemeId(themeId));
  const html = document.documentElement;
  const body = document.body;

  html.setAttribute("data-theme", theme.id);
  body.classList.toggle("light-theme", isLightTheme(theme.id));

  const bg = landing ? theme.bgLanding : theme.bg;
  html.style.backgroundColor = bg;
  body.style.backgroundColor = bg;
}

export function clearDocumentThemeInlineStyles() {
  document.documentElement.style.backgroundColor = "";
  document.body.style.backgroundColor = "";
}
