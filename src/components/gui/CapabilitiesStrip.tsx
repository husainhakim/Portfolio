"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { findNodeById, FSFile } from "@/data/filesystemData";
import { useTour } from "@/context/TourContext";
import { useAchievements } from "@/context/AchievementContext";
import {
  Terminal,
  ShieldAlert,
  Trophy,
  Sparkles,
  Command,
  HelpCircle,
} from "lucide-react";
import styles from "./CapabilitiesStrip.module.css";

interface CapabilitiesStripProps {
  onOpenCommandPalette?: () => void;
}

export function CapabilitiesStrip({ onOpenCommandPalette }: CapabilitiesStripProps) {
  const { toggleMode, navigate, openFile } = useFilesystem();
  const { startTour, openHelpModal } = useTour();
  const { openPanel, unlockedCount, totalCount } = useAchievements();

  return (
    <div className={styles.capabilitiesBar} role="region" aria-label="Interactive Capabilities HUD">
      <div className={styles.systemTag}>
        <span className={styles.statusPulse} />
        <span className={styles.systemName}>HUSAIN.OS</span>
        <span className={styles.systemVersion}>v2.4</span>
      </div>

      <div className={styles.pillsScrollArea}>
        {/* CLI Terminal Pill */}
        <button
          onClick={() => toggleMode()}
          className={`${styles.pillBtn} ${styles.pillTerminal}`}
          title="Switch to interactive Linux CLI shell (Alt+T)"
        >
          <Terminal size={12} className={styles.pillIcon} />
          <span>Interactive Shell</span>
          <kbd className={styles.pillKbd}>Alt+T</kbd>
        </button>

        {/* CTF Vault Pill */}
        <button
          onClick={() => {
            navigate("/home/husain/vault");
            const vaultNode = findNodeById("vault-file");
            if (vaultNode && vaultNode.type === "file") openFile(vaultNode as FSFile);
          }}
          className={`${styles.pillBtn} ${styles.pillVault}`}
          title="Crack the security riddle to breach the Personal Vault"
        >
          <ShieldAlert size={12} className={styles.pillIcon} />
          <span>CTF Vault</span>
          <span className={styles.pillBadge}>Riddle</span>
        </button>

        {/* Trophy / Easter Egg Pill */}
        <button
          onClick={openPanel}
          className={`${styles.pillBtn} ${styles.pillTrophy}`}
          title="View 10 secret Easter eggs and achievement trophies"
        >
          <Trophy size={12} className={styles.pillIcon} />
          <span>Achievements</span>
          <span className={styles.trophyCountBadge}>
            {unlockedCount}/{totalCount}
          </span>
        </button>

        {/* 30s Quick Tour Pill */}
        <button
          onClick={() => startTour(0)}
          className={`${styles.pillBtn} ${styles.pillTour}`}
          title="Take a 30-second guided tour of all workstation capabilities"
        >
          <Sparkles size={12} className={styles.pillIcon} />
          <span>30s Tour</span>
        </button>

        {/* Command Palette Pill */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className={`${styles.pillBtn} ${styles.pillSpotlight}`}
            title="Open Spotlight Command Palette (⌘K / Ctrl+K)"
          >
            <Command size={12} className={styles.pillIcon} />
            <span>Spotlight</span>
            <kbd className={styles.pillKbd}>⌘K</kbd>
          </button>
        )}

        {/* Cheatsheet Modal Button */}
        <button
          onClick={openHelpModal}
          className={`${styles.pillBtn} ${styles.pillHelp}`}
          title="Open Features & Capabilities Cheatsheet"
        >
          <HelpCircle size={12} className={styles.pillIcon} />
          <span>Features</span>
        </button>
      </div>
    </div>
  );
}
