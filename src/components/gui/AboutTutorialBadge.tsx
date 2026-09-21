"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, MousePointerClick, Sparkles } from "lucide-react";
import { useTour } from "@/context/TourContext";
import { useFilesystem } from "@/context/FilesystemContext";
import styles from "./AboutTutorialBadge.module.css";

export const ABOUT_TUTORIAL_KEY = "hasSeenAboutTutorial";

interface AboutTutorialBadgeProps {
  onDismiss?: () => void;
  variant?: "quick-access" | "grid";
}

export function AboutTutorialBadge({ onDismiss, variant = "quick-access" }: AboutTutorialBadgeProps) {
  const { startTour } = useTour();
  const { isBooted } = useFilesystem();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (!isBooted) return;
    try {
      const seen = localStorage.getItem(ABOUT_TUTORIAL_KEY);
      if (!seen) {
        const timer = setTimeout(() => setIsVisible(true), 350);
        return () => clearTimeout(timer);
      }
    } catch (_) { }
  }, [isBooted]);

  const handleDismiss = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsDismissing(true);
      try {
        localStorage.setItem(ABOUT_TUTORIAL_KEY, "1");
      } catch (_) { }
      setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }, 250);
    },
    [onDismiss]
  );

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.tutorialWrapper} ${variant === "quick-access" ? styles.qaPos : styles.gridPos} ${isDismissing ? styles.dismissing : ""
        }`}
      role="tooltip"
      aria-label="Tutorial Quest: Double click about.md to begin"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.speechBubble}>
        <div className={styles.bubbleHeader}>
          <div className={styles.questTag}>
            <span className={styles.pixelIcon}>🕹️</span>
            <span className={styles.questTitle}>QUEST 01</span>
          </div>
          <span className={styles.startBadge}>START HERE</span>
          <button
            onClick={handleDismiss}
            className={styles.closeBtn}
            title="Dismiss tutorial"
            aria-label="Dismiss tutorial"
          >
            <X size={13} />
          </button>
        </div>

        <div className={styles.bubbleBody}>
          <p className={styles.actionText}>
            <strong>Double-click</strong> <code className={styles.fileHighlight}>about.md</code> to open Husain&apos;s dossier
          </p>
        </div>

        <div className={styles.bubbleFooter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span className={styles.shortcutHint}>
            <MousePointerClick size={12} className={styles.clickIcon} />
            <kbd className={styles.kbd}>Double-Click</kbd>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDismiss();
              startTour(0);
            }}
            className={styles.takeTourLinkBtn}
            title="Take 30s interactive tour of all workstation features"
          >
            <Sparkles size={11} />
            <span>Tour (30s)</span>
          </button>
        </div>

        {/* Retro Animated Arrow pointing down */}
        <div className={styles.arrowContainer} aria-hidden="true">
          <div className={styles.pixelArrow}>
            <ChevronDown size={20} strokeWidth={3} className={styles.arrowIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}
