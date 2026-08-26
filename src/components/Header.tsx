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
import calloutStyles from "./CliOnboardingCallout.module.css";

const HINT_KEY = "hasSeenCliHint";

export function Header() {
  const { mode, toggleMode, navigate } = useFilesystem();
  const { theme, toggleTheme, mounted } = useTheme();

  // true = show callout, false = hide. Starts false to avoid SSR mismatch.
  const [showCallout, setShowCallout] = useState<boolean>(false);

  // Read localStorage only on the client (after mount) to avoid hydration mismatch.
  useEffect(() => {
    if (localStorage.getItem(HINT_KEY) !== "1") {
      // Small delay so the page settles before the callout draws attention
      const t = setTimeout(() => setShowCallout(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  // Dismiss the callout and permanently set the flag.
  const dismiss = useCallback(() => {
    setShowCallout(false);
    localStorage.setItem(HINT_KEY, "1");
  }, []);

  // Clicking either mode button = meaningful interaction → dismiss.
  const handleGuiClick = useCallback(() => {
    if (mode !== "gui") toggleMode();
    if (showCallout) dismiss();
  }, [mode, toggleMode, showCallout, dismiss]);

  const handleCliClick = useCallback(() => {
    if (mode !== "cli") toggleMode();
    if (showCallout) dismiss();
  }, [mode, toggleMode, showCallout, dismiss]);

  // Global hotkey: Alt+T or Ctrl+` to toggle GUI/CLI mode
  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "t") || (e.ctrlKey && e.key === "`")) {
        e.preventDefault();
        toggleMode();
        if (showCallout) dismiss();
      }
    };
    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, [toggleMode, showCallout, dismiss]);

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
            <span className={styles.brandSubLarge}>White Hat Hacking &amp; Network Security &amp; Backend Development</span>
          </div>
        </button>
      </div>

      {/* Hero Mode Switcher & Tools */}
      <div className={styles.actionsGroup}>
        {/* MODE SWITCHER — wrapped in relative container for callout anchor */}
        <div className={styles.modeSwitchAnchor}>
          <div
            className={`${styles.heroModeSwitch} ${showCallout ? calloutStyles.modeSwitchHighlight : ""}`}
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

          {/* CLI onboarding callout — only rendered when showCallout is true */}
          {showCallout && (
            <div
              className={calloutStyles.calloutWrapper}
              role="status"
              aria-live="polite"
              aria-label="CLI mode available"
            >
              {/* Directional arrow */}
              <div className={calloutStyles.calloutArrow} aria-hidden="true" />

              <div className={calloutStyles.callout}>
                {/* Terminal icon */}
                <div className={calloutStyles.calloutIcon} aria-hidden="true">
                  <TerminalIcon size={15} />
                </div>

                {/* Copy */}
                <div className={calloutStyles.calloutBody}>
                  <p className={calloutStyles.calloutHeadline}>
                    CLI mode available
                  </p>
                  <p className={calloutStyles.calloutSub}>
                    This portfolio also works as an interactive terminal.
                    Hit <strong>CLI</strong> above or press <strong>Alt+T</strong>.
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  className={calloutStyles.calloutDismiss}
                  onClick={dismiss}
                  title="Dismiss"
                  aria-label="Dismiss CLI mode hint"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          )}
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
