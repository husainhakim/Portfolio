"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTour } from "@/context/TourContext";
import { useAutopilot } from "@/context/AutopilotContext";
import { findNodeById, findNodeByPath, FSFile } from "@/data/filesystemData";
import {
  FileText,
  Sparkles,
  ArrowRight,
  X,
  Terminal,
  Trophy,
  Shield,
  CornerDownLeft,
  Play,
} from "lucide-react";
import styles from "./WelcomeDialogueModal.module.css";

const WELCOME_STORAGE_KEY = "has_seen_welcome_dialogue";

export function WelcomeDialogueModal() {
  const { openFile, isBooted, openedFile, currentPath } = useFilesystem();
  const {
    isTourActive,
    startTour,
    isWelcomeOpen,
    openWelcome,
    closeWelcome,
  } = useTour();
  const { startAutopilot, isAutopilotActive } = useAutopilot();

  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Setup dedicated portal container
  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Check first-time visit on boot sequence complete
  useEffect(() => {
    if (!mounted || !isBooted || isTourActive || openedFile) return;

    try {
      const hasSeen = localStorage.getItem(WELCOME_STORAGE_KEY);
      if (!hasSeen && currentPath === "/home/husain") {
        const timer = setTimeout(() => {
          openWelcome();
        }, 450);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [mounted, isBooted, isTourActive, openedFile, currentPath, openWelcome]);

  const handleDismiss = useCallback(() => {
    closeWelcome();
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, "true");
      localStorage.setItem("has_seen_readme_tutorial", "true");
    } catch {
      // Ignore
    }
  }, [closeWelcome]);

  const handleOpenManual = useCallback(() => {
    handleDismiss();
    const readmeNode =
      findNodeById("readme-file") ||
      findNodeByPath("/home/husain/MANUAL.md") ||
      findNodeByPath("/home/husain/manual.md") ||
      findNodeByPath("/home/husain/README.md");
    if (readmeNode && readmeNode.type === "file") {
      openFile(readmeNode as FSFile);
    }
  }, [handleDismiss, openFile]);

  const handleStartTour = useCallback(() => {
    handleDismiss();
    startTour(0);
  }, [handleDismiss, startTour]);

  const handleWatchAutopilot = useCallback(() => {
    handleDismiss();
    startAutopilot();
  }, [handleDismiss, startAutopilot]);

  // Keyboard navigation: Enter -> Watch Skim, Escape -> Dismiss
  useEffect(() => {
    if (!isWelcomeOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only trigger if not typing inside an input
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          handleWatchAutopilot();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWelcomeOpen, handleDismiss, handleWatchAutopilot]);

  if (!isWelcomeOpen || !mounted || !portalContainer || isTourActive) {
    return null;
  }

  const modalContent = (
    <div
      className={styles.dialogueOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <div
        ref={modalRef}
        className={styles.dialogueCard}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome from Husain Hakim"
      >
        {/* Top Header Status Bar */}
        <div className={styles.hudBar}>
          <div className={styles.hudTransmissionInfo}>
            <div className={styles.signalPulse}>
              <div className={styles.signalDot} />
              <div className={styles.signalRing} />
            </div>
            <span className={styles.hudLabel}>HUSAIN_OS // SEC_COMM // INTERACTIVE WORKSTATION</span>
            <div className={styles.audioWaveform} aria-hidden="true">
              <span className={styles.waveformBar} />
              <span className={styles.waveformBar} />
              <span className={styles.waveformBar} />
              <span className={styles.waveformBar} />
              <span className={styles.waveformBar} />
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className={styles.closeButton}
            title="Dismiss (ESC)"
            aria-label="Close welcome dialogue"
          >
            <span>Close</span>
            <span className={styles.kbdBadge}>ESC</span>
            <X size={12} />
          </button>
        </div>

        {/* Hero Section: Avatar + Greeting */}
        <div className={styles.heroSection}>
          <div className={styles.avatarRingWrapper}>
            <div className={styles.avatarGlowRing} />
            <div className={styles.avatarImageContainer}>
              <Image
                src="/husain.jpg"
                alt="Husain Hakim"
                width={80}
                height={80}
                priority
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.avatarStatusBadge}>
              <span className={styles.avatarStatusDot} />
            </div>
          </div>

          <div className={styles.heroTextContent}>
            <div className={styles.roleBadge}>
              <span>CYBERSECURITY &amp; SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className={styles.greetingTitle}>
              <span>Hey there!</span>
              <span className={styles.waveHand}>👋</span>
              <span>I&apos;m <span className={styles.nameHighlight}>Husain Hakim</span></span>
            </h2>
            <p className={styles.heroDescription}>
              Welcome to my interactive cybersecurity workstation. Unlike a static portfolio, this entire environment is a <strong>stateful virtual UNIX operating system</strong> with executable files, interactive challenges, and live terminal sessions.
            </p>
          </div>
        </div>

        {/* Interactive Action Hub */}
        <div className={styles.actionHub}>
          {/* Featured Hero Action Card: 20s Live Skim */}
          <div
            className={styles.featuredSkimCard}
            onClick={handleWatchAutopilot}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleWatchAutopilot();
              }
            }}
          >
            <div className={styles.featuredCardGlow} />
            <div className={styles.featuredCardHeader}>
              <span className={styles.featuredBadge}>
                <Sparkles size={11} />
                RECOMMENDED
              </span>
              <div className={styles.featuredKbdWrapper}>
                <span className={styles.featuredKbdHint}>
                  <CornerDownLeft size={10} style={{ marginRight: 2 }} />
                  Enter
                </span>
              </div>
            </div>

            <div className={styles.featuredCardBody}>
              <div className={styles.featuredIconWrapper}>
                <Play size={18} fill="currentColor" />
              </div>
              <div className={styles.featuredCardDetails}>
                <h3 className={styles.featuredCardTitle}>
                  Watch 20-Second Live Skim
                  <ArrowRight size={15} className={styles.featuredArrow} />
                </h3>
                <p className={styles.featuredCardDescription}>
                  Automated live demonstration of in-place renaming, folder equipping, quick-access pinning, and terminal execution.
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Action Cards: MANUAL.md & Quick Tour */}
          <div className={styles.secondaryCardsGrid}>
            <button
              onClick={handleOpenManual}
              className={styles.secondaryCard}
              title="Open and read MANUAL.md cheat sheet"
            >
              <div className={styles.secondaryCardIconWrap}>
                <FileText size={16} />
              </div>
              <div className={styles.secondaryCardText}>
                <span className={styles.secondaryCardHeading}>Read MANUAL.md</span>
                <span className={styles.secondaryCardSub}>Documentation, flags &amp; secret riddles</span>
              </div>
              <ArrowRight size={13} className={styles.secondaryCardArrow} />
            </button>

            <button
              onClick={handleStartTour}
              className={styles.secondaryCard}
              title="Interactive step-by-step tour"
            >
              <div className={`${styles.secondaryCardIconWrap} ${styles.tourIconWrap}`}>
                <Sparkles size={16} />
              </div>
              <div className={styles.secondaryCardText}>
                <span className={styles.secondaryCardHeading}>30s Quick Tour</span>
                <span className={styles.secondaryCardSub}>Interactive step-by-step UI guide</span>
              </div>
              <ArrowRight size={13} className={styles.secondaryCardArrow} />
            </button>
          </div>
        </div>

        {/* Footer Bar */}
        <div className={styles.dialogueFooter}>
          <div className={styles.footerBrandWrapper}>
            <span className={styles.footerDot} />
            <span className={styles.footerBrand}>HUSAIN.OS v2.4</span>
            <span className={styles.footerDivider}>•</span>
            <span className={styles.footerHint}>Press <kbd className={styles.footerKbd}>⌘K</kbd> for Command Palette</span>
          </div>

          <button
            onClick={handleDismiss}
            className={styles.dismissLinkBtn}
          >
            <span>Explore Freely</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, portalContainer);
}
