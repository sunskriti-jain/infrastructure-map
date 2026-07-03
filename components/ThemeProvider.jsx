"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

// Auto mode: dark from 7pm to 7am local time, light otherwise.
function resolveTheme(theme) {
  if (theme === "light" || theme === "dark") return theme;
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("auto");
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    setThemeState(localStorage.getItem("theme") || "auto");
  }, []);

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(theme);
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
    };
    apply();
    if (theme !== "auto") return undefined;
    // Re-check periodically so the day/night switch happens live without a refresh.
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    localStorage.setItem("theme", next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
