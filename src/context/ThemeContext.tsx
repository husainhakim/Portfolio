"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the already-applied data-theme from documentElement or localStorage
    const applied = (document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("workspace_theme") ||
      "light") as Theme;
    setThemeState(applied);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("workspace_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (typeof window === "undefined") {
      setTheme(nextTheme);
      return;
    }

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    // Use document.startViewTransition if supported
    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => void;
      documentElement: HTMLElement;
    };

    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        setTheme(nextTheme);
      });
      return;
    }

    // Fallback: transient class on root element
    doc.documentElement.classList.add("theme-transitioning");
    setTheme(nextTheme);
    setTimeout(() => {
      doc.documentElement.classList.remove("theme-transitioning");
    }, 380);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
