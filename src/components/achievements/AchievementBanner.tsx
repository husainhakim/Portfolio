"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAchievements } from "@/context/AchievementContext";
import { AchievementIcon } from "./AchievementIcon";
import { Trophy, Sparkles } from "lucide-react";
import styles from "./AchievementBanner.module.css";

export function AchievementBanner() {
  const { activePopup, flightCoords, isFlying } = useAchievements();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !activePopup) return null;

  const { achievement } = activePopup;

  // Compute dynamic flight transform when flying
  let flightStyle: React.CSSProperties = {};

  if (isFlying && flightCoords) {
    const deltaX = flightCoords.targetX - flightCoords.startX;
    const deltaY = flightCoords.targetY - flightCoords.startY;

    flightStyle = {
      transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.16)`,
      opacity: 0,
      transition:
        "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  }

  return createPortal(
    <div className={styles.portalRoot} aria-live="assertive">
      <div className={styles.centerContainer} style={flightStyle}>
        <div className={styles.popupCard}>
          <div className={styles.cardGlowBar} />

          <div className={styles.cardTopRow}>
            <span className={styles.unlockedBadge}>
              <Trophy size={13} />
              <span>Achievement Unlocked</span>
            </span>
            <span className={styles.pointsBadge}>+{achievement.points} PTS</span>
          </div>

          <div className={styles.cardMainBody}>
            <div className={styles.iconWrapper}>
              <AchievementIcon name={achievement.iconName} size={26} />
            </div>

            <div className={styles.textGroup}>
              <span className={styles.achievementTitle}>{achievement.title}</span>
              <span className={styles.achievementDesc}>
                {achievement.description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
