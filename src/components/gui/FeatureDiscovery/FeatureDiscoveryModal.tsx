"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTour } from "@/context/TourContext";
import {
  X,
  Sparkles,
  Pin,
  Move,
  Lock,
  MousePointer,
  RotateCcw,
  Keyboard,
  Compass,
  CheckCircle2,
  FolderTree,
  Command,
  Terminal as TerminalIcon,
  Trophy,
} from "lucide-react";
import styles from "./FeatureDiscoveryModal.module.css";

type TabKey = "all" | "quick-access" | "file-ops" | "vault" | "shortcuts";

export function FeatureDiscoveryModal() {
  const { isHelpModalOpen, closeHelpModal, startTour } = useTour();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    container.className = "feature-modal-portal-root";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isHelpModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeHelpModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpModalOpen, closeHelpModal]);

  if (!isHelpModalOpen || !mounted || !portalContainer) return null;

  const content = (
    <div className={styles.modalOverlay} onClick={closeHelpModal}>
      <div
        ref={modalRef}
        className={styles.modalPanel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Workstation Features & Cheatsheet"
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconWrapper}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className={styles.headerTitle}>Interactive Workstation Features</h2>
              <p className={styles.headerSubtitle}>
                A complete cheatsheet to all gestures, pinning, customization, and vault secrets.
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => startTour(0)}
              className={styles.tourTriggerBtn}
              title="Launch interactive spotlight tour"
            >
              <Compass size={14} />
              <span>Start Interactive Tour</span>
            </button>
            <button
              onClick={closeHelpModal}
              className={styles.closeBtn}
              title="Close (ESC)"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className={styles.tabsBar}>
          <button
            onClick={() => setActiveTab("all")}
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
          >
            All Features
          </button>
          <button
            onClick={() => setActiveTab("quick-access")}
            className={`${styles.tabBtn} ${activeTab === "quick-access" ? styles.tabBtnActive : ""}`}
          >
            <Pin size={13} />
            <span>Quick Access</span>
          </button>
          <button
            onClick={() => setActiveTab("file-ops")}
            className={`${styles.tabBtn} ${activeTab === "file-ops" ? styles.tabBtnActive : ""}`}
          >
            <MousePointer size={13} />
            <span>File Management</span>
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`${styles.tabBtn} ${activeTab === "vault" ? styles.tabBtnActive : ""}`}
          >
            <Lock size={13} />
            <span>Personal Vault</span>
          </button>
          <button
            onClick={() => setActiveTab("shortcuts")}
            className={`${styles.tabBtn} ${activeTab === "shortcuts" ? styles.tabBtnActive : ""}`}
          >
            <Keyboard size={13} />
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {activeTab !== "shortcuts" ? (
            <div className={styles.cardsGrid}>
              {/* Quick Access Card 1 */}
              {(activeTab === "all" || activeTab === "quick-access") && (
                <div className={styles.featureCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox}>
                      <Pin size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Drag & Drop to Pin</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Drag any file or folder card from the main directory and drop it onto Quick Access to pin it immediately.
                  </p>
                  <span className={styles.cardBadge}>Max 5 items limit</span>
                </div>
              )}

              {/* Quick Access Card 2 */}
              {(activeTab === "all" || activeTab === "quick-access") && (
                <div className={styles.featureCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox} style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.12)" }}>
                      <Move size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Mobile-Style Drag to Remove</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Drag any card from Quick Access downward: a phone-style &quot;Remove from Quick Access&quot; drop zone smoothly emerges to unpin the item.
                  </p>
                  <span className={styles.cardBadge} style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    Interactive Gesture
                  </span>
                </div>
              )}

              {/* Context Menu Action */}
              {(activeTab === "all" || activeTab === "quick-access" || activeTab === "file-ops") && (
                <div className={styles.featureCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox}>
                      <MousePointer size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Right-Click Context Menu</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Right-click any item to Open, Rename, Delete, Download, Copy Link, or toggle &quot;Add to / Remove from Quick Access&quot;.
                  </p>
                  <span className={styles.cardBadge}>Right Click Anywhere</span>
                </div>
              )}

              {/* Card Reordering */}
              {(activeTab === "all" || activeTab === "file-ops") && (
                <div className={styles.featureCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox}>
                      <FolderTree size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>In-Folder Card Reordering</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Rearrange cards inside any folder or Quick Access by dragging them to new positions. The order persists in your session.
                  </p>
                  <span className={styles.cardBadge}>Custom Reordering</span>
                </div>
              )}

              {/* Reset Workspace */}
              {(activeTab === "all" || activeTab === "file-ops") && (
                <div className={styles.featureCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox} style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.12)" }}>
                      <RotateCcw size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Ribbon Workspace Reset</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Renamed, deleted, or rearranged cards? The &quot;Reset&quot; button in the Ribbon Toolbar lights up and undoes all modifications.
                  </p>
                  <span className={styles.cardBadge} style={{ color: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.3)" }}>
                    One-Click Revert
                  </span>
                </div>
              )}

              {/* Personal Vault */}
              {(activeTab === "all" || activeTab === "vault") && (
                <div className={styles.featureCard} style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox} style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.15)" }}>
                      <Lock size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Encrypted Personal Vault</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Click the glowing Personal Vault button in the sidebar. Answer any 1 of 3 trivia questions about me to trigger the full 3D bank vault sequence.
                  </p>
                  <span className={styles.cardBadge} style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)" }}>
                    Confidential Archive
                  </span>
                </div>
              )}

              {/* CLI Terminal */}
              {(activeTab === "all" || activeTab === "file-ops") && (
                <div className={styles.featureCard} style={{ borderColor: "rgba(14, 165, 233, 0.4)" }}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox} style={{ color: "var(--accent-primary)", background: "rgba(14, 165, 233, 0.15)" }}>
                      <TerminalIcon size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Interactive Linux CLI Terminal</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Prefer a terminal? Switch to CLI mode anytime using the top header or press <strong>Alt+T</strong>. Run real shell commands (<code>neofetch</code>, <code>ls</code>, <code>cat</code>, <code>tree</code>, <code>whoami</code>) against the live virtual filesystem.
                  </p>
                  <span className={styles.cardBadge}>
                    Hotkey: Alt+T / Ctrl+`
                  </span>
                </div>
              )}

              {/* Trophy & Achievement System */}
              {(activeTab === "all") && (
                <div className={styles.featureCard} style={{ borderColor: "rgba(234, 179, 8, 0.4)" }}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIconBox} style={{ color: "#eab308", background: "rgba(234, 179, 8, 0.15)" }}>
                      <Trophy size={16} />
                    </div>
                    <h4 className={styles.cardTitle}>Trophy &amp; Achievement System</h4>
                  </div>
                  <p className={styles.cardDescription}>
                    Click the trophy button in the header bar anytime. Explore the system, run secret CLI commands, inspect hidden files, and unlock all 7 achievement badges.
                  </p>
                  <span className={styles.cardBadge} style={{ color: "#eab308", borderColor: "rgba(234, 179, 8, 0.4)" }}>
                    7 Secret Badges
                  </span>
                </div>
              )}
            </div>
          ) : (
            <table className={styles.shortcutsTable}>
              <thead>
                <tr>
                  <th>Shortcut</th>
                  <th>Action</th>
                  <th>Context</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className={styles.keyBadge}>Alt+T</span> / <span className={styles.keyBadge}>Ctrl+`</span></td>
                  <td>Toggle between GUI File Explorer &amp; Interactive CLI Shell</td>
                  <td>Global</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>ESC</span></td>
                  <td>Close file viewer, exit tour, or dismiss modals</td>
                  <td>Global</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>Enter</span></td>
                  <td>Open selected file / folder, or commit rename</td>
                  <td>File Grid</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>Double Click</span></td>
                  <td>Open file in modal viewer or enter folder</td>
                  <td>Cards</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>Right Click</span></td>
                  <td>Display context actions (Pin, Rename, Delete, Download, Copy Link)</td>
                  <td>Cards</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>Tab</span> / <span className={styles.keyBadge}>Shift+Tab</span></td>
                  <td>Navigate between interactive focusable elements</td>
                  <td>Workstation</td>
                </tr>
                <tr>
                  <td><span className={styles.keyBadge}>Arrow Left/Right</span></td>
                  <td>Navigate previous / next in the Guided Tour</td>
                  <td>Interactive Tour</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.footerNote}>
            Husain Hakim &bull; Interactive Cybersecurity Workstation
          </span>
          <button onClick={closeHelpModal} className={styles.tourTriggerBtn} style={{ background: "transparent", border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalContainer);
}
