"use client";

import React, { useState } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { findNodeById, findNodeByPath, VIRTUAL_FS, FSFile } from "@/data/filesystemData";
import { useTour } from "@/context/TourContext";
import { useAchievements } from "@/context/AchievementContext";
import { downloadNode } from "@/lib/downloadHelper";
import {
  Terminal,
  Shield,
  ShieldAlert,
  Trophy,
  Sparkles,
  Command,
  KeyRound,
  ArrowRight,
  FolderTree,
  Move,
  Tag,
  Trash2,
  Copy,
  Check,
  Cpu,
  Download,
  RotateCcw,
} from "lucide-react";
import styles from "./Views.module.css";

export function ReadmeView() {
  const { toggleMode, navigate, openFile, closeFile } = useFilesystem();
  const { startTour } = useTour();
  const { openPanel, unlockedCount, totalCount } = useAchievements();
  const [copied, setCopied] = useState(false);

  const sampleCommandsRaw = `$ neofetch                  # Display HusainOS system & kernel specs
$ tree /home/husain         # Render hierarchical file system tree
$ cat about.md              # Inspect dossier directly in shell
$ whoami                    # Display operator profile and status
$ help                      # List all 20+ built-in CLI commands`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCommandsRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((unlockedCount / Math.max(1, totalCount)) * 100));

  return (
    <div className={styles.viewContainer}>
      {/* Workstation Guide Header */}
      <div className={styles.projectHeader}>
        <div className={styles.projectMetaTop}>
          <div className={styles.badgeRow}>
            <div className={styles.readmeHeroStatus}>
              <span className={styles.readmeStatusDotPulse} />
              <span>SYSTEM ACTIVE // HUSAIN.OS v2.4</span>
            </div>
            <span className="badge badge-writeup">WORKSTATION MANUAL</span>
            <span className={styles.monoTag} style={{ color: "#f59e0b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              🏆 {unlockedCount}/{totalCount} Secrets Unlocked ({progressPercent}%)
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => toggleMode()}
              className={styles.primaryActionButton}
              title="Engage Interactive CLI Terminal"
            >
              <Terminal size={14} />
              <span>Launch Terminal (Alt+T)</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => startTour(0)}
              className={styles.secondaryActionButton}
              title="Take 30-Second Guided Tour"
            >
              <Sparkles size={14} />
              <span>Take Guided Tour</span>
            </button>
          </div>
        </div>

        <h1 className={styles.projectTitle}>Husain Hakim&apos;s Interactive Workstation</h1>
        <p className={styles.projectTagline}>
          A simulated Linux desktop environment (<code style={{ fontFamily: "var(--font-mono)", color: "var(--accent-text)" }}>/home/husain</code>) engineered with a stateful virtual filesystem, interactive UNIX shell, confidential CTF vault, and 10 unlockable secrets.
        </p>
      </div>

      {/* Overview & Core Architecture */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Shield size={16} className={styles.sectionIcon} />
          System Overview &amp; Interactive Architecture
        </h2>
        <p className={styles.bodyParagraph}>
          Unlike a conventional static portfolio, this workstation runs an in-memory virtual filesystem with full desktop operations. You can drag cards to reorganize them, assign custom aliases, right-click to download or soft-delete files to the trash, and seamlessly switch between the graphical file manager and the UNIX terminal shell.
        </p>
      </div>

      {/* Dedicated Superpower Spotlight: Stateful Virtual Linux Filesystem */}
      <div className={styles.vfsHighlightCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "4px" }}>
              <FolderTree size={16} className={styles.sectionIcon} />
              Stateful Virtual Linux Filesystem (VFS)
            </h2>
            <p className={styles.bodyParagraphMuted} style={{ margin: 0 }}>
              The filesystem tracks real in-memory inodes, permissions, drag-and-drop hierarchy, and custom metadata.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                closeFile();
                navigate("/home/husain");
              }}
              className={styles.primaryActionButton}
              title="Explore the filesystem"
            >
              <FolderTree size={13} />
              <span>Browse /home/husain</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={() => {
                const rootNode = findNodeByPath("/home/husain") || VIRTUAL_FS;
                if (rootNode) downloadNode(rootNode);
              }}
              className={styles.secondaryActionButton}
              title="Download complete portfolio workspace as HusainHakim.zip"
            >
              <Download size={13} />
              <span>HusainHakim.zip</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Capability Tiles */}
        <div className={styles.vfsGrid}>
          <div className={styles.vfsBox}>
            <div className={styles.vfsBoxHeader}>
              <Move size={15} className={styles.vfsBoxIcon} />
              <span>Drag-and-Drop Reordering</span>
            </div>
            <p className={styles.vfsBoxDesc}>
              Drag cards to reorder files within any folder, or drag files into the <strong>Quick Access</strong> shelf (supports up to 5 pinned cards).
            </p>
          </div>

          <div className={styles.vfsBox}>
            <div className={styles.vfsBoxHeader}>
              <Tag size={15} className={styles.vfsBoxIcon} />
              <span>Custom Aliasing &amp; Renaming</span>
            </div>
            <p className={styles.vfsBoxDesc}>
              Right-click any dossier or folder and choose <span className={styles.vfsBoxKbd}>Rename</span>. Your custom alias stays synchronized in real time across GUI and CLI.
            </p>
          </div>

          <div className={styles.vfsBox}>
            <div className={styles.vfsBoxHeader}>
              <Trash2 size={15} className={styles.vfsBoxIcon} />
              <span>Soft-Delete &amp; Easter Eggs</span>
            </div>
            <p className={styles.vfsBoxDesc}>
              Right-click to delete files to test the safety net. Deleting <code style={{ fontFamily: "var(--font-mono)" }}>about.md</code> triggers the <em>Identity Thief</em> secret trophy!
            </p>
          </div>

          <div className={styles.vfsBox}>
            <div className={styles.vfsBoxHeader}>
              <RotateCcw size={15} className={styles.vfsBoxIcon} />
              <span>One-Click State Reset</span>
            </div>
            <p className={styles.vfsBoxDesc}>
              Made changes or moved things around? Click <span className={styles.vfsBoxKbd}>Reset</span> in the Ribbon Toolbar anytime to restore the pristine default hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Terminal & CTF Vault */}
      <div className={styles.twoColumnGrid}>
        {/* CLI Terminal Shell */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Terminal size={16} className={styles.sectionIcon} />
            1. Interactive UNIX Terminal Shell
          </h2>
          <p className={styles.bodyParagraphMuted}>
            Press <kbd className={styles.monoTag}>Alt+T</kbd> or <kbd className={styles.monoTag}>Ctrl+`</kbd> anywhere to engage the command line. Features tab auto-completion, history navigation, and built-in tools.
          </p>
          <div style={{ marginTop: "14px" }}>
            <button
              onClick={() => toggleMode()}
              className={styles.primaryActionButton}
              style={{ width: "fit-content" }}
            >
              <Terminal size={13} />
              <span>Open Terminal Shell</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* CTF Security Vault */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <ShieldAlert size={16} className={styles.sectionIcon} />
            2. Confidential CTF Security Vault
          </h2>
          <p className={styles.bodyParagraphMuted}>
            Protected by a cryptographic gatekeeper riddle and authentic 3D bank vault door decryption animation. Crack the riddle to breach the vault and read unreleased notes.
          </p>
          <div style={{ marginTop: "14px" }}>
            <button
              onClick={() => {
                navigate("/home/husain/vault");
                const vaultNode = findNodeById("vault-file");
                if (vaultNode && vaultNode.type === "file") openFile(vaultNode as FSFile);
              }}
              className={styles.primaryActionButton}
              style={{ width: "fit-content" }}
            >
              <KeyRound size={13} />
              <span>Breach Personal Vault</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Trophy Showcase Card */}
      <div className={styles.sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 className={styles.sectionTitle} style={{ marginBottom: "4px" }}>
              <Trophy size={16} className={styles.sectionIcon} />
              3. Gamified Trophy Engine (10 Secrets &amp; Easter Eggs)
            </h2>
            <p className={styles.bodyParagraphMuted} style={{ margin: 0 }}>
              10 unlockable achievements track your exploration across the OS. Discover hidden CLI commands, flip the physical light switch, rearrange filesystem cards, or soft-delete dossiers to unlock trophies.
            </p>
          </div>
          <button
            onClick={openPanel}
            className={styles.primaryActionButton}
            style={{ width: "fit-content", flexShrink: 0 }}
          >
            <Trophy size={13} />
            <span>View Achievements ({unlockedCount}/{totalCount})</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Live Progress Bar */}
        <div className={styles.readmeTrophyProgressContainer}>
          <div className={styles.readmeTrophyProgressHeader}>
            <span>Trophy Progression Matrix</span>
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>{unlockedCount} / {totalCount} Completed ({progressPercent}%)</span>
          </div>
          <div className={styles.readmeProgressBarTrack}>
            <div className={styles.readmeProgressBarFill} style={{ width: `${progressPercent}%` }} />
          </div>

          <div className={styles.readmeTrophyChips}>
            <span className={`${styles.readmeTrophyChip} ${styles.readmeTrophyChipActive}`}>
              ⚡ Shell Hacker
            </span>
            <span className={styles.readmeTrophyChip}>
              🕵️ Identity Thief
            </span>
            <span className={styles.readmeTrophyChip}>
              🔐 CTF Breacher
            </span>
            <span className={styles.readmeTrophyChip}>
              🌙 Midnight Operator
            </span>
            <span className={styles.readmeTrophyChip}>
              📁 VFS Architect
            </span>
            <span className={styles.readmeTrophyChip}>
              ✨ Guided Pioneer
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Command Sample */}
      <div className={styles.sectionCard}>
        <div className={styles.codeBlockHeader}>
          <h2 className={styles.sectionTitle}>
            <Cpu size={16} className={styles.sectionIcon} />
            Terminal Shell Command Reference
          </h2>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={() => toggleMode()}
              className={styles.primaryActionButton}
              style={{ fontSize: "11px", padding: "4px 8px" }}
              title="Launch Shell directly"
            >
              <Terminal size={12} />
              <span>Launch Shell</span>
            </button>
            <button
              onClick={handleCopy}
              className={styles.copyButton}
              title="Copy command reference"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className={styles.readmeTerminalFrame}>
          <div className={styles.readmeTerminalTopBar}>
            <div className={styles.readmeTerminalDots}>
              <span className={`${styles.readmeTerminalDot} ${styles.readmeTerminalDotRed}`} />
              <span className={`${styles.readmeTerminalDot} ${styles.readmeTerminalDotYellow}`} />
              <span className={`${styles.readmeTerminalDot} ${styles.readmeTerminalDotGreen}`} />
            </div>
            <span className={styles.readmeTerminalTitle}>
              <Terminal size={12} color="#38bdf8" /> husain@workstation: ~ (sh)
            </span>
            <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "var(--font-mono)" }}>zsh 5.9</span>
          </div>
          <div className={styles.readmeTerminalBody}>
            <div className={styles.readmeCommandLine}>
              <span className={styles.readmePrompt}>husain@cyber-node:~$</span>
              <span className={styles.readmeCommandText}>neofetch</span>
              <span className={styles.readmeComment}># Display HusainOS system &amp; kernel specs</span>
            </div>
            <div className={styles.readmeCommandLine}>
              <span className={styles.readmePrompt}>husain@cyber-node:~$</span>
              <span className={styles.readmeCommandText}>tree /home/husain</span>
              <span className={styles.readmeComment}># Render hierarchical file system tree</span>
            </div>
            <div className={styles.readmeCommandLine}>
              <span className={styles.readmePrompt}>husain@cyber-node:~$</span>
              <span className={styles.readmeCommandText}>cat about.md</span>
              <span className={styles.readmeComment}># Inspect dossier directly in shell</span>
            </div>
            <div className={styles.readmeCommandLine}>
              <span className={styles.readmePrompt}>husain@cyber-node:~$</span>
              <span className={styles.readmeCommandText}>whoami</span>
              <span className={styles.readmeComment}># Display operator profile and status</span>
            </div>
            <div className={styles.readmeCommandLine}>
              <span className={styles.readmePrompt}>husain@cyber-node:~$</span>
              <span className={styles.readmeCommandText}>help</span>
              <span className={styles.readmeComment}># List all 20+ built-in CLI commands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Keyboard Shortcuts */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Command size={16} className={styles.sectionIcon} />
          Global Keyboard Shortcuts Cheat Sheet
        </h2>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Toggle Terminal Shell</span>
            <span className={styles.metadataValue}>Alt + T / Ctrl + `</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Command Palette Spotlight</span>
            <span className={styles.metadataValue}>⌘K / Ctrl + K</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Close File Viewer / Modals</span>
            <span className={styles.metadataValue}>Escape (ESC)</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Open Selected File / Folder</span>
            <span className={styles.metadataValue}>Enter / Double Click</span>
          </div>
        </div>
      </div>
    </div>
  );
}
