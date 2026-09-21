"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTour } from "@/context/TourContext";
import { findNodeById, findNodeByPath, VIRTUAL_FS, FSFile } from "@/data/filesystemData";
import { X, ArrowRight, Sparkles, FileText, Check } from "lucide-react";
import styles from "./InteractiveTour.module.css";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const STORAGE_KEY = "has_seen_readme_tutorial";

export function ReadmeSpotlightTutorial() {
  const { openFile, currentPath, openedFile, isBooted } = useFilesystem();
  const { isTourActive } = useTour();

  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 120, left: 120 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Setup dedicated portal container
  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    container.className = styles.tourPortalRoot;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Check if first-time user and on root /home/husain - ONLY AFTER BOOT SEQUENCE COMPLETES
  useEffect(() => {
    if (!mounted || !isBooted || isTourActive || openedFile) return;

    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen && currentPath === "/home/husain") {
        // Small delay so layout stabilizes after boot sequence finishes
        const timer = setTimeout(() => {
          setIsActive(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors (e.g. private mode)
    }
  }, [mounted, isBooted, isTourActive, currentPath, openedFile]);

  // Dismiss function
  const dismiss = useCallback(() => {
    setIsActive(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore
    }
  }, []);

  // Open README.md function
  const handleOpenReadme = useCallback(() => {
    dismiss();
    const readmeNode = findNodeById("readme-file") || findNodeByPath("/home/husain/README.md");
    if (readmeNode && readmeNode.type === "file") {
      openFile(readmeNode as FSFile);
    }
  }, [dismiss, openFile]);

  // Compute position of target README card and tour card
  const updatePositions = useCallback(() => {
    if (!isActive) return;

    const el =
      document.querySelector('[data-tour="readme-card"]') ||
      document.querySelector('[data-node-name="README.md"]') ||
      document.querySelector('[data-node-id="readme-file"]');

    if (el) {
      const rect = el.getBoundingClientRect();
      const pad = 6;
      const targetBounds: TargetRect = {
        top: Math.max(0, rect.top - pad),
        left: Math.max(0, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      };
      setTargetRect(targetBounds);

      const cardWidth = 380;
      const cardHeight = 240;
      const gap = 14;

      const vpW = window.innerWidth;
      const vpH = window.innerHeight;

      // Position card to the bottom or right of the card
      let top = targetBounds.top + targetBounds.height + gap;
      let left = Math.min(
        Math.max(16, targetBounds.left + targetBounds.width / 2 - cardWidth / 2),
        vpW - cardWidth - 16
      );

      if (top + cardHeight > vpH - 16) {
        // Flip to top if overflowing bottom
        top = Math.max(16, targetBounds.top - cardHeight - gap);
      }

      setCardPos({ top, left });
    } else {
      setTargetRect(null);
      setCardPos({
        top: Math.max(20, window.innerHeight / 2 - 120),
        left: Math.max(16, window.innerWidth / 2 - 190),
      });
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    updatePositions();

    const handleResize = () => updatePositions();
    const handleScroll = () => updatePositions();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isActive, updatePositions]);

  // Keyboard navigation: Escape to dismiss
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleOpenReadme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, dismiss, handleOpenReadme]);

  if (!isActive || !mounted || !isBooted || !portalContainer || isTourActive || openedFile) return null;

  const clipPathStyle = targetRect
    ? `polygon(0 0, 0 100%, ${targetRect.left}px 100%, ${targetRect.left}px ${targetRect.top}px, ${targetRect.left + targetRect.width}px ${targetRect.top}px, ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px, ${targetRect.left}px ${targetRect.top + targetRect.height}px, ${targetRect.left}px 100%, 100% 100%, 100% 0)`
    : undefined;

  const content = (
    <>
      {/* Semi-transparent backdrop: Dims and blurs entire viewport EXCEPT README.md */}
      <div
        className={styles.tourBackdrop}
        style={{
          clipPath: clipPathStyle,
          WebkitClipPath: clipPathStyle,
        }}
        onClick={dismiss}
      />

      {/* Target spotlight cutout frame */}
      {targetRect && (
        <div
          className={styles.spotlightFrame}
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            cursor: "pointer",
          }}
          onClick={handleOpenReadme}
          title="Click to open README.md"
        />
      )}

      {/* Floating Spotlight Card */}
      <div
        ref={cardRef}
        className={styles.tourCard}
        style={{
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Workstation Quickstart Guide"
      >
        <div className={styles.tourHeader}>
          <div className={styles.tourHeaderMeta}>
            <span className={styles.tourBadge} style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <Sparkles size={12} color="var(--accent-primary)" />
              <span>WORKSTATION QUICKSTART</span>
            </span>
            <h3 className={styles.tourTitle}>Start Here with README.md</h3>
          </div>
          <button
            onClick={dismiss}
            className={styles.tourCloseBtn}
            title="Dismiss (ESC)"
            aria-label="Close spotlight"
          >
            <X size={15} />
          </button>
        </div>

        <p className={styles.tourDescription}>
          Welcome to Husain&apos;s interactive cybersecurity workstation! Open <strong>README.md</strong> to discover interactive Linux CLI commands, confidential CTF vaults, 10 hidden secret trophies, and desktop shortcuts.
        </p>

        <ul className={styles.tourTipsList}>
          <li className={styles.tourTipItem}>
            <FileText size={12} className={styles.tourTipIcon} />
            <span>Interactive UNIX Terminal Shell (Alt+T)</span>
          </li>
          <li className={styles.tourTipItem}>
            <Sparkles size={12} className={styles.tourTipIcon} />
            <span>Stateful Virtual Linux Filesystem &amp; CTF Riddle Vault</span>
          </li>
        </ul>

        <div className={styles.tourFooter} style={{ justifyContent: "flex-end" }}>
          <div className={styles.tourActions}>
            <button onClick={dismiss} className={styles.tourBtnSecondary}>
              <span>Explore Myself</span>
            </button>
            <button onClick={handleOpenReadme} className={styles.tourBtnPrimary}>
              <span>Open README.md</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, portalContainer);
}
