"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAchievements } from "@/context/AchievementContext";
import { ACHIEVEMENTS, Achievement } from "@/data/achievementsData";
import { AchievementIcon } from "./AchievementIcon";
import { Trophy, X, Lock, RotateCcw, CheckCircle2 } from "lucide-react";
import styles from "./AchievementPanelModal.module.css";

function formatUnlockDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

export function AchievementPanelModal() {
  const {
    isPanelOpen,
    closePanel,
    unlockedMap,
    unlockedCount,
    totalCount,
    resetAchievements,
  } = useAchievements();

  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen, closePanel]);

  if (!mounted || !isPanelOpen) return null;

  const totalPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
  const currentPoints = ACHIEVEMENTS.reduce(
    (sum, a) => (unlockedMap[a.id] ? sum + a.points : sum),
    0
  );

  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isAchUnlocked = !!unlockedMap[ach.id];
    if (filter === "unlocked") return isAchUnlocked;
    if (filter === "locked") return !isAchUnlocked;
    return true;
  });

  return createPortal(
    <div className={styles.modalOverlay} onClick={closePanel}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="System Achievements & Trophies"
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <Trophy size={16} className={styles.headerIcon} />
            <span className={styles.headerTitle}>System Achievements</span>
          </div>
          <button
            onClick={closePanel}
            className={styles.headerCloseBtn}
            title="Close (ESC)"
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Progress HUD */}
        <div className={styles.progressHud}>
          <div className={styles.progressTopRow}>
            <span className={styles.progressLabel}>
              Unlocked {unlockedCount} of {totalCount} ({progressPercent}%)
            </span>
            <span className={styles.progressScore}>
              {currentPoints} / {totalPoints} PTS
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterRow}>
          <button
            onClick={() => setFilter("all")}
            className={`${styles.filterBtn} ${
              filter === "all" ? styles.filterBtnActive : ""
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter("unlocked")}
            className={`${styles.filterBtn} ${
              filter === "unlocked" ? styles.filterBtnActive : ""
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter("locked")}
            className={`${styles.filterBtn} ${
              filter === "locked" ? styles.filterBtnActive : ""
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Scrollable Achievements List */}
        <div className={styles.modalBody}>
          {filteredAchievements.map((ach) => {
            const unlockRecord = unlockedMap[ach.id];
            const isAchUnlocked = !!unlockRecord;

            return (
              <div
                key={ach.id}
                className={`${styles.achievementCard} ${
                  isAchUnlocked ? styles.cardUnlocked : styles.cardLocked
                }`}
              >
                <div
                  className={`${styles.cardIconCol} ${
                    isAchUnlocked ? styles.iconUnlocked : styles.iconLocked
                  }`}
                >
                  <AchievementIcon
                    name={ach.iconName}
                    size={20}
                    isLocked={!isAchUnlocked}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardTopMeta}>
                    {isAchUnlocked ? (
                      <span className={styles.cardTitle}>{ach.title}</span>
                    ) : (
                      <span className={styles.cardLockedTitle}>???</span>
                    )}

                    <span
                      className={`${styles.cardBadge} ${
                        isAchUnlocked
                          ? styles.badgeUnlocked
                          : styles.badgeLocked
                      }`}
                    >
                      {isAchUnlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>

                  {isAchUnlocked ? (
                    <span className={styles.cardDesc}>{ach.description}</span>
                  ) : (
                    <span className={styles.cardHint}>Hint: {ach.hint}</span>
                  )}

                  <div className={styles.cardFooterMeta}>
                    {isAchUnlocked ? (
                      <span className={styles.cardTimestamp}>
                        Unlocked on {formatUnlockDate(unlockRecord.unlockedAt)}
                      </span>
                    ) : (
                      <span>Encrypted Protocol</span>
                    )}
                    <span className={styles.cardPoints}>+{ach.points} PTS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <span>Explore and discover hidden workspace easter eggs.</span>
          <button
            onClick={() => {
              if (window.confirm("Reset all unlocked achievements?")) {
                resetAchievements();
              }
            }}
            className={styles.resetBtn}
            title="Reset achievement progress"
          >
            <RotateCcw size={11} style={{ display: "inline", marginRight: 4 }} />
            Reset Progress
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
