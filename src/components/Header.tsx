"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTheme } from "@/context/ThemeContext";
import { PROFILE_DATA } from "@/data/profileData";
import {
  Terminal as TerminalIcon,
  LayoutGrid,
  Sun,
  Moon,
  FileText,
  X,
} from "lucide-react";
import styles from "./Header.module.css";

export function Header() {
  const { mode, toggleMode, navigate } = useFilesystem();
  const { theme, toggleTheme, mounted } = useTheme();

  const handleGuiClick = useCallback(() => {
    if (mode !== "gui") toggleMode();
  }, [mode, toggleMode]);

  const handleCliClick = useCallback(() => {
    if (mode !== "cli") toggleMode();
  }, [mode, toggleMode]);

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
              alt="Husain Hakim - Cybersecurity Student & Offensive Security Researcher"
              width={38}
              height={38}
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandNameLarge}>Husain Hakim</span>
            <span className={styles.brandSubLarge}>White Hat Hacking &amp; Network Security &amp; Backend Development</span>
          </div>
        </button>
      </div>

      {/* Hero Mode Switcher & Tools */}
      <div className={styles.actionsGroup}>
        {/* MODE SWITCHER */}
        <div className={styles.modeSwitchAnchor}>
          <div
            className={styles.heroModeSwitch}
            data-tour="mode-switch"
            role="group"
            aria-label="Interface Workspace Mode"
          >
            <div className={styles.modeSwitchLabel}>MODE:</div>
            <button
              id="mode-btn-gui"
              onClick={handleGuiClick}
              className={`${styles.heroModeBtn} ${mode === "gui" ? styles.heroModeBtnActive : ""}`}
              title="Switch to GUI File Explorer"
              aria-pressed={mode === "gui"}
            >
              <LayoutGrid size={13} />
              <span>GUI</span>
            </button>
            <button
              id="mode-btn-cli"
              onClick={handleCliClick}
              className={`${styles.heroModeBtn} ${styles.heroModeBtnCli} ${
                mode === "cli" ? styles.heroModeBtnActiveCli : ""
              }`}
              title="Switch to CLI Interactive Shell (Alt+T)"
              aria-pressed={mode === "cli"}
            >
              <TerminalIcon size={13} />
              <span>CLI</span>
            </button>
            <span className={styles.hotkeyTag} title="Toggle with Alt+T">Alt+T</span>
          </div>
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
