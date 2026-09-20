"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SKILLS_DATA, SkillCategory } from "@/data/skillsData";
import {
  Shield,
  Terminal,
  FastForward,
  RotateCcw,
  Search,
  CheckCircle2,
  Radio,
  Layers,
} from "lucide-react";
import styles from "./SkillsView.module.css";

interface ScanStep {
  type: "init" | "category" | "skill" | "complete";
  text: string;
  categoryId?: string;
  categoryName?: string;
  skillName?: string;
}

export function SkillsView() {
  const totalSkills = useMemo(
    () => SKILLS_DATA.reduce((acc, cat) => acc + cat.skills.length, 0),
    []
  );

  // Flatten the scanning steps sequence
  const steps: ScanStep[] = useMemo(() => {
    const list: ScanStep[] = [
      {
        type: "init",
        text: "[*] Initiating capability discovery scan on target: husainhakim.me...",
      },
      {
        type: "init",
        text: "[*] Probing runtime environments, protocols, and security toolchains...",
      },
    ];

    SKILLS_DATA.forEach((cat) => {
      list.push({
        type: "category",
        text: cat.category,
        categoryId: cat.id,
        categoryName: cat.category,
      });

      cat.skills.forEach((skill) => {
        list.push({
          type: "skill",
          text: skill,
          categoryId: cat.id,
          categoryName: cat.category,
          skillName: skill,
        });
      });
    });

    list.push({
      type: "complete",
      text: `[✓] Scan complete: ${totalSkills} technologies identified across ${SKILLS_DATA.length} categories.`,
    });

    return list;
  }, [totalSkills]);

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setStepIndex(steps.length - 1);
      setIsComplete(true);
    }
  }, [steps.length]);

  // Skip animation handler
  const handleSkip = useCallback(() => {
    setStepIndex(steps.length - 1);
    setIsComplete(true);
  }, [steps.length]);

  // Restart scan handler
  const handleRescan = useCallback(() => {
    setSearchQuery("");
    setStepIndex(0);
    setIsComplete(false);
  }, []);

  // Interval timer for revealing steps sequentially
  useEffect(() => {
    if (isComplete || stepIndex >= steps.length - 1) {
      if (!isComplete) setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          setIsComplete(true);
        }
        return next;
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [stepIndex, isComplete, steps.length]);

  // Keyboard shortcut listener (Space/Enter to skip if not focused on input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComplete, handleSkip]);

  // Calculate current progress statistics
  const currentStep = steps[stepIndex] || steps[0];
  const detectedCount = useMemo(() => {
    return steps.slice(0, stepIndex + 1).filter((s) => s.type === "skill").length;
  }, [steps, stepIndex]);

  const progressPercent = useMemo(() => {
    if (isComplete) return 100;
    return Math.min(100, Math.round(((stepIndex + 1) / steps.length) * 100));
  }, [stepIndex, steps.length, isComplete]);

  // Derive visible categories and their visible skills based on current step
  const visibleCategories = useMemo(() => {
    const revealedSteps = steps.slice(0, stepIndex + 1);
    const result: {
      category: SkillCategory;
      visibleSkills: string[];
    }[] = [];

    SKILLS_DATA.forEach((cat) => {
      const hasCategoryRevealed = revealedSteps.some(
        (s) => s.type === "category" && s.categoryId === cat.id
      );

      if (hasCategoryRevealed || isComplete) {
        const skillsForCat = revealedSteps
          .filter((s) => s.type === "skill" && s.categoryId === cat.id)
          .map((s) => s.skillName as string);

        const skillsToDisplay = isComplete ? cat.skills : skillsForCat;

        // Apply search filter if active
        const filteredSkills = searchQuery.trim()
          ? skillsToDisplay.filter((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
          : skillsToDisplay;

        if (filteredSkills.length > 0 || !searchQuery.trim()) {
          result.push({
            category: cat,
            visibleSkills: filteredSkills,
          });
        }
      }
    });

    return result;
  }, [steps, stepIndex, isComplete, searchQuery]);

  return (
    <div
      ref={containerRef}
      className={styles.scannerContainer}
      onClick={() => {
        if (!isComplete) handleSkip();
      }}
    >
      {/* Scanner Control & Status HUD */}
      <div className={styles.scannerHud} onClick={(e) => e.stopPropagation()}>
        <div className={styles.hudTopRow}>
          <div className={styles.hudMetaGroup}>
            <div className={styles.scannerTitle}>
              <Shield size={16} className={styles.scannerIcon} />
              <span>Skills Scanner Console</span>
            </div>
            <span className={styles.targetBadge}>
              TARGET: <span className={styles.targetHighlight}>husainhakim.me</span>
            </span>
          </div>

          <div className={styles.hudControls}>
            {isComplete ? (
              <>
                <span className={`${styles.hudStatusBadge} ${styles.statusComplete}`}>
                  <CheckCircle2 size={13} />
                  <span>SCAN COMPLETED</span>
                </span>
                <button
                  onClick={handleRescan}
                  className={styles.actionButton}
                  title="Re-run security discovery scan"
                >
                  <RotateCcw size={13} />
                  <span>Re-scan</span>
                </button>
              </>
            ) : (
              <>
                <span className={`${styles.hudStatusBadge} ${styles.statusScanning}`}>
                  <span className={styles.pulsingDot} />
                  <span>SCANNING...</span>
                </span>
                <button
                  onClick={handleSkip}
                  className={`${styles.actionButton} ${styles.actionButtonAccent}`}
                  title="Skip animation and show all skills (Space / Click)"
                >
                  <FastForward size={13} />
                  <span>Skip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={styles.progressStatsRow}>
            <span>
              [ Progress: {progressPercent}% | {detectedCount}/{totalSkills} detected ]
            </span>
            {!isComplete && (
              <span className={styles.skipHint}>Click anywhere or press Space to skip</span>
            )}
          </div>
        </div>
      </div>

      {/* Initial Scan Log Card */}
      <div className={styles.consoleInitCard}>
        <div className={styles.logLine}>
          <span className={styles.prefixAsterisk}>[*]</span>
          <span>Initiating capability discovery scan on target: <strong style={{ color: "var(--text-primary)" }}>husainhakim.me</strong>...</span>
        </div>
        {stepIndex >= 1 && (
          <div className={styles.logLine}>
            <span className={styles.prefixAsterisk}>[*]</span>
            <span className={styles.logTextSecondary}>
              Probing system stack, network protocols, Linux internals, and security toolchains...
            </span>
          </div>
        )}
      </div>

      {/* Search Filter Bar (Visible when scan is complete) */}
      {isComplete && (
        <div className={styles.filterBar} onClick={(e) => e.stopPropagation()}>
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search detected technologies, tools, and protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.filterInput}
          />
          {searchQuery && (
            <span className={styles.filterCount}>
              {visibleCategories.reduce((acc, cat) => acc + cat.visibleSkills.length, 0)} match(es)
            </span>
          )}
        </div>
      )}

      {/* Categories & Detected Skills Grid */}
      <div className={styles.categoriesGrid}>
        {visibleCategories.map(({ category, visibleSkills }) => (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <div className={styles.categoryTitleGroup}>
                <span className={styles.prefixCategory}>[#]</span>
                <span>{category.category}</span>
              </div>
              <span className={styles.categoryBadge}>
                {visibleSkills.length}/{category.skills.length} DETECTED
              </span>
            </div>

            <div className={styles.skillsList}>
              {visibleSkills.map((skill, sIdx) => (
                <div key={sIdx} className={styles.skillItem}>
                  <span className={styles.prefixPlus}>[+]</span>
                  <span className={styles.detectedLabel}>Detected:</span>
                  <span className={styles.skillName}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scan Complete Summary Card */}
      {(isComplete || stepIndex >= steps.length - 1) && (
        <div className={styles.completionCard}>
          <div className={styles.completionTitleRow}>
            <span className={styles.prefixCheck}>[✓]</span>
            <span>Scan complete: {totalSkills} technologies identified</span>
          </div>
          <div className={styles.completionSubtext}>
            Verified {SKILLS_DATA.length} technology domains • 100% fingerprint integrity • All capability modules loaded.
          </div>
        </div>
      )}
    </div>
  );
}
