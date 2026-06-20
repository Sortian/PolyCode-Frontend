import React, { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES, getThemeById } from "./themes";

export default function ThemeSettingsMenu({
  theme,
  onThemeChange,
  buttonClassName = "theme-settings-btn",
  panelClassName = "theme-settings-panel",
  align = "right",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = getThemeById(theme);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  if (typeof onThemeChange !== "function") {
    return null;
  }

  return (
    <div
      className={`theme-settings theme-settings--${align}`}
      ref={rootRef}
    >
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Theme settings"
        title="Theme settings"
      >
        <Palette size={16} aria-hidden />
        <span className="theme-settings-btn-label">{current.label}</span>
      </button>

      {open ? (
        <div className={panelClassName} role="menu" aria-label="Choose theme">
          <p className="theme-settings-heading">Appearance</p>
          <div className="theme-settings-list">
            {THEMES.map((item) => {
              const active = item.id === theme;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  className={`theme-settings-option${active ? " theme-settings-option--active" : ""}`}
                  onClick={() => {
                    onThemeChange(item.id);
                    setOpen(false);
                  }}
                >
                  <span
                    className="theme-settings-swatch"
                    style={{ background: item.swatch }}
                    aria-hidden
                  />
                  <span className="theme-settings-copy">
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  {active ? (
                    <Check size={15} className="theme-settings-check" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
