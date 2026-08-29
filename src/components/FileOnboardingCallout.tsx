"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MousePointerClick, X, Check } from "lucide-react";
import styles from "./FileOnboardingCallout.module.css";

export const FILE_HINT_KEY = "hasSeenFileDoubleClickHint";

interface FileOnboardingCalloutProps {
  onDismiss?: () => void;
}

export function FileOnboardingCallout({ onDismiss }: FileOnboardingCalloutProps) {
  const [showCallout, setShowCallout] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem(FILE_HINT_KEY) !== "1") {
      const timer = setTimeout(() => setShowCallout(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setShowCallout(false);
    localStorage.setItem(FILE_HINT_KEY, "1");
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  if (!showCallout) return null;

  return (
    <div className={styles.bannerWrapper} role="status" aria-live="polite">
      <div className={styles.bannerCard}>
        <div className={styles.leftGroup}>
          <div className={styles.iconWrapper} aria-hidden="true">
            <MousePointerClick size={17} className={styles.iconSvg} />
          </div>
          <div className={styles.textContent}>
            <div className={styles.headline}>
              <span>Navigation Tip</span>
              <span className={styles.tag}>Hint</span>
            </div>
            <p className={styles.subtext}>
              <strong className={styles.highlightAction}>Double-click</strong> (or double-tap on mobile) any item to open files &amp; folders. You can also press <kbd className={styles.kbd}>Enter</kbd>.
            </p>
          </div>
        </div>

        <div className={styles.rightGroup}>
          <button
            onClick={handleDismiss}
            className={styles.gotItBtn}
            title="Got it"
          >
            Got it
          </button>
          <button
            onClick={handleDismiss}
            className={styles.dismissBtn}
            title="Dismiss hint"
            aria-label="Dismiss hint"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
