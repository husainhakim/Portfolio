"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTheme } from "@/context/ThemeContext";
import { PROFILE_DATA } from "@/data/profileData";
import {
  Terminal as TerminalIcon,
  LayoutGrid,
  Sun,
  Moon,
  Shield,
  Search,
  FileText,
  Command,
  Zap,
} from "lucide-react";
import styles from "./Header.module.css";

export function Header() {
  const { mode, toggleMode, searchQuery, setSearchQuery, navigate } = useFilesystem();
  const { theme, toggleTheme, mounted } = useTheme();

  // Global hotkey: Alt+T or Ctrl+` to toggle GUI/CLI mode
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "t") || (e.ctrlKey && e.key === "`")) {
        e.preventDefault();
        toggleMode();
      }
    };
    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, [toggleMode]);

  return (
    <header className={styles.header}>
      {/* Brand & Identity */}
      <div className={styles.brandGroup}>
        <button
          onClick={() => navigate("/home/husain")}
          className={styles.brandButton}
          title="Return to Workspace Root (/home/husain)"
        >
          <div className={styles.brandAvatar}>
            <Image
              src="/husain.jpg"
              alt="Husain Hakim"
              width={48}
              height={48}
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandNameLarge}>Husain Hakim</span>
            <span className={styles.brandSubLarge}>White Hat Hacking & Network Security & Backend Development</span>
          </div>
        </button>
      </div>

      {/* Global Quick Search Filter Removed (Handled by Breadcrumb Search) */}

      {/* Hero Mode Switcher & Tools */}
      <div className={styles.actionsGroup}>
        {/* HERO MODE SWITCHER HUD */}
        <div className={styles.heroModeSwitch} role="group" aria-label="Interface Workspace Mode">
          <div className={styles.modeSwitchLabel}>MODE:</div>
          <button
            onClick={() => mode !== "gui" && toggleMode()}
            className={`${styles.heroModeBtn} ${mode === "gui" ? styles.heroModeBtnActive : ""}`}
            title="Switch to GUI File Explorer"
          >
            <LayoutGrid size={13} />
            <span>GUI</span>
          </button>
          <button
            onClick={() => mode !== "cli" && toggleMode()}
            className={`${styles.heroModeBtn} ${mode === "cli" ? styles.heroModeBtnActiveCli : ""}`}
            title="Switch to CLI Interactive Shell (Alt+T)"
          >
            <TerminalIcon size={13} />
            <span>CLI</span>
          </button>
          <span className={styles.hotkeyTag} title="Toggle with Alt+T">Alt+T</span>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className={styles.iconActionButton}
          title={`Switch to ${!mounted || theme === "light" ? "Dark" : "Light"} Mode`}
          aria-label="Toggle Theme"
        >
          {!mounted || theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* Resume Quick Access */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeButton}
          title="Open Technical Resume (PDF)"
        >
          <FileText size={13} />
          <span className={styles.resumeText}>Resume</span>
        </a>
      </div>
    </header>
  );
}
