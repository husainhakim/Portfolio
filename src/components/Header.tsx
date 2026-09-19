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
  Trophy,
} from "lucide-react";
import { useAchievements } from "@/context/AchievementContext";
import styles from "./Header.module.css";

const FULL_NAME = "Husain Hakim";
const FULL_SUBTITLE = "White Hat Hacking & Network Security & Backend Development";
const GLITCH_CHARS = ["0", "1", "#", "$", "@", "%", "&", "*", "!", "?", "<", ">", "/", "{", "}", "~"];

interface DecryptChar {
  char: string;
  isGlitch: boolean;
}

export function Header() {
  const { mode, toggleMode, navigate } = useFilesystem();
  const { theme, toggleTheme, mounted } = useTheme();
  const {
    unlockedCount,
    totalCount,
    openPanel,
    unlock,
    trophyBounceKey,
    trophyButtonRef,
  } = useAchievements();

  // Physical switch flipping state
  const [isFlipping, setIsFlipping] = useState(false);

  // Typing and Subtitle Glitch states
  const [typedName, setTypedName] = useState("");
  const [subtitleChars, setSubtitleChars] = useState<DecryptChar[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTypedName(FULL_NAME);
      setSubtitleChars(FULL_SUBTITLE.split("").map((c) => ({ char: c, isGlitch: false })));
      setIsTyping(false);
      return;
    }

    // Step 1: Rapid name typing
    let nameIdx = 0;
    const nameTimer = setInterval(() => {
      nameIdx++;
      setTypedName(FULL_NAME.slice(0, nameIdx));

      if (nameIdx >= FULL_NAME.length) {
        clearInterval(nameTimer);

        // Step 2: Progressive Subtitle Decrypt
        let progress = 0;
        const decryptTimer = setInterval(() => {
          progress += 5; // ~20 ticks * 25ms = ~500ms
          const resolvedCount = Math.floor((progress / 100) * FULL_SUBTITLE.length);

          const chars: DecryptChar[] = FULL_SUBTITLE.split("").map((realChar, idx) => {
            if (idx < resolvedCount || realChar === " " || realChar === "&") {
              return { char: realChar, isGlitch: false };
            }
            const randomGlitch = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            return { char: randomGlitch, isGlitch: true };
          });

          setSubtitleChars(chars);

          if (progress >= 100) {
            clearInterval(decryptTimer);
            setSubtitleChars(FULL_SUBTITLE.split("").map((c) => ({ char: c, isGlitch: false })));
            setIsTyping(false);
          }
        }, 25);
      }
    }, 22);

    return () => {
      clearInterval(nameTimer);
    };
  }, []);

  const handleGuiClick = useCallback(() => {
    if (mode !== "gui") toggleMode();
  }, [mode, toggleMode]);

  const handleCliClick = useCallback(() => {
    if (mode !== "cli") toggleMode();
  }, [mode, toggleMode]);

  const handleSwitchClick = () => {
    setIsFlipping(true);
    unlock("seen_the_light");
    toggleTheme();
    setTimeout(() => {
      setIsFlipping(false);
    }, 360);
  };

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

  const isDark = mounted && theme === "dark";

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
              alt="Husain Hakim - Cybersecurity Student & Offensive/Defensive Security Researcher"
              width={38}
              height={38}
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandNameLarge}>
              {typedName || (isTyping ? "" : FULL_NAME)}
              {isTyping && <span className={styles.brandCursor}>_</span>}
            </span>
            <span className={styles.brandSubLarge}>
              {subtitleChars.length > 0 ? (
                subtitleChars.map((item, idx) =>
                  item.isGlitch ? (
                    <span key={idx} className={styles.redGlitchChar}>
                      {item.char}
                    </span>
                  ) : (
                    <span key={idx}>{item.char}</span>
                  )
                )
              ) : (
                <span>{FULL_SUBTITLE}</span>
              )}
            </span>
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
              className={`${styles.heroModeBtn} ${styles.heroModeBtnCli} ${mode === "cli" ? styles.heroModeBtnActiveCli : ""
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

        {/* Achievements / Trophies Button */}
        <button
          id="header-trophy-button"
          ref={trophyButtonRef}
          onClick={openPanel}
          key={`trophy-btn-${trophyBounceKey}`}
          className={`${styles.trophyButton} ${unlockedCount > 0 ? styles.trophyButtonUnlocked : ""
            } ${trophyBounceKey > 0 ? styles.trophyLandingBounce : ""}`}
          title={`Achievements (${unlockedCount}/${totalCount} Unlocked)`}
          aria-label={`Achievements (${unlockedCount}/${totalCount} Unlocked)`}
        >
          <Trophy size={13} />
          {unlockedCount > 0 && (
            <span
              key={`badge-${unlockedCount}`}
              className={`${styles.trophyBadge} ${styles.trophyBadgePop}`}
            >
              {unlockedCount}/{totalCount}
            </span>
          )}
        </button>

        {/* Physical Mechanical Light Switch */}
        <button
          onClick={handleSwitchClick}
          className={`${styles.lightSwitchHousing} ${isDark ? styles.lightSwitchDark : styles.lightSwitchLight
            } ${isFlipping ? styles.lightSwitchFlipping : ""}`}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          aria-label={`Toggle Theme (Currently ${isDark ? "Dark" : "Light"} Mode)`}
          aria-pressed={isDark}
        >
          <div className={styles.lightSwitchRocker}>
            {isDark ? <Moon size={12} /> : <Sun size={12} />}
          </div>
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
