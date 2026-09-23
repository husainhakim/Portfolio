"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import {
  Scissors,
  Copy,
  ClipboardPaste,
  Trash2,
  ArrowDownUp,
  LayoutGrid,
  List,
  Filter,
  MoreHorizontal,
  Plus,
  Share2,
  FileEdit,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Play,
} from "lucide-react";
import { useTour } from "@/context/TourContext";
import { useAutopilot } from "@/context/AutopilotContext";
import styles from "./Gui.module.css";

const ICON_SIZE = 15;
const CHEVRON_SIZE = 11;
const STROKE_WIDTH = 1.8;

const NEW_BUTTON_EASTER_EGGS = [
  "⚡ Allocating 64TB of virtual RAM for your revolutionary idea...",
  "📦 Installing 847 dependencies for an empty folder. npm says this is normal.",
  "🧠 Spawning 47 CPU cores to decide what to name this folder.",
  "💾 Reserving 128GB of disk space for the 3KB you're probably going to put here.",
  "🗃️ Creating 256 backup copies. You can never be too careful with an empty folder.",
  "🧯 Allocating 32 fire extinguishers for a folder that contains 0 files.",
  "💻 Your 8GB machine has been asked for 64GB. Negotiations are ongoing.",
  "⚡ CPU: 3,847%. RAM: 64,208MB. Reason: folder.",
];

export function RibbonToolbar() {
  const { openHelpModal } = useTour();
  const { startAutopilot } = useAutopilot();
  const {
    viewLayout,
    setViewLayout,
    sortOption,
    setSortOption,
    isModified,
    resetModifications,
    selectedNode,
    customNames,
    handleCopyNode,
    handleDeleteNode,
    showToast,
  } = useFilesystem();

  const [eggIndex, setEggIndex] = React.useState(0);
  const [isNewSpinning, setIsNewSpinning] = React.useState(false);

  const handleNewClick = () => {
    setIsNewSpinning(true);
    const msg = NEW_BUTTON_EASTER_EGGS[eggIndex % NEW_BUTTON_EASTER_EGGS.length];
    setEggIndex((prev) => prev + 1);
    showToast(msg, 3800);
    setTimeout(() => setIsNewSpinning(false), 500);
  };

  const isVaultSelected =
    selectedNode?.id === "vault" ||
    selectedNode?.name.toLowerCase() === "vault" ||
    selectedNode?.name.toLowerCase() === "personal vault";

  const handleSortCycle = () => {
    if (sortOption === "default") setSortOption("a-z");
    else if (sortOption === "a-z") setSortOption("z-a");
    else setSortOption("default");
  };

  const getSortLabel = () => {
    if (sortOption === "a-z") return "Sort (A-Z)";
    if (sortOption === "z-a") return "Sort (Z-A)";
    return "Sort";
  };

  return (
    <div className={styles.ribbonToolbar}>
      {/* New (Interactive Easter Egg) */}
      <div className={styles.ribbonGroup}>
        <button
          className={`${styles.ribbonBtnWithLabel} ${styles.ribbonNewBtn}`}
          title="Create New Item (+ Easter Egg)"
          onClick={handleNewClick}
        >
          <Plus
            size={ICON_SIZE}
            strokeWidth={STROKE_WIDTH}
            className={isNewSpinning ? styles.ribbonPlusSpin : ""}
          />
          <span>New</span>
          <ChevronDown size={CHEVRON_SIZE} strokeWidth={STROKE_WIDTH} style={{ marginLeft: -2 }} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Primary Actions (Cut, Copy, Paste, Rename, Share, Delete) */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtn} title="Cut" disabled>
          <Scissors size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
        <button
          className={styles.ribbonBtn}
          title={selectedNode ? `Copy link to ${customNames[selectedNode.id] || selectedNode.name}` : "Copy"}
          disabled={!selectedNode}
          onClick={() => selectedNode && handleCopyNode(selectedNode)}
        >
          <Copy size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
        <button className={styles.ribbonBtn} title="Paste" disabled>
          <ClipboardPaste size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
        <button className={styles.ribbonBtn} title="Rename" disabled>
          <FileEdit size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
        <button className={styles.ribbonBtn} title="Share" disabled>
          <Share2 size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
        <button
          className={styles.ribbonBtn}
          title={selectedNode ? `Delete ${customNames[selectedNode.id] || selectedNode.name}` : "Delete"}
          disabled={!selectedNode || isVaultSelected}
          onClick={() => selectedNode && handleDeleteNode(selectedNode)}
        >
          <Trash2 size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Sort and View */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtnWithLabel} title="Sort" onClick={handleSortCycle}>
          <ArrowDownUp size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          <span>{getSortLabel()}</span>
          <ChevronDown size={CHEVRON_SIZE} strokeWidth={STROKE_WIDTH} style={{ marginLeft: -2 }} />
        </button>
        <button className={styles.ribbonBtnWithLabel} title="View" onClick={() => setViewLayout(viewLayout === "grid" ? "list" : "grid")}>
          {viewLayout === "grid" ? (
            <LayoutGrid size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          ) : (
            <List size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          )}
          <span>View</span>
          <ChevronDown size={CHEVRON_SIZE} strokeWidth={STROKE_WIDTH} style={{ marginLeft: -2 }} />
        </button>
        <button className={styles.ribbonBtnWithLabel} title="Filter" disabled>
          <Filter size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          <span>Filter</span>
          <ChevronDown size={CHEVRON_SIZE} strokeWidth={STROKE_WIDTH} style={{ marginLeft: -2 }} />
        </button>
        <button
          className={`${styles.ribbonBtnWithLabel} ${isModified ? styles.ribbonResetActive : ""}`}
          title={isModified ? "Reset all customizations (undo renames, deletions, reorders)" : "Reset workspace (no modifications)"}
          disabled={!isModified}
          onClick={resetModifications}
        >
          <RotateCcw size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          <span>Reset</span>
          {isModified && <span className={styles.ribbonResetBadge} />}
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Overflow */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtn} title="See more" disabled>
          <MoreHorizontal size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Feature Discovery & Interactive Tour */}
      <div className={styles.ribbonGroup}>
        <button
          className={`${styles.ribbonBtnWithLabel} ${styles.ribbonAutopilotBtn}`}
          title="Watch 20-Second Live UI Skim Walkthrough"
          onClick={startAutopilot}
        >
          <Play size={11} fill="currentColor" />
          <span>Watch Skim</span>
        </button>
        <button
          className={`${styles.ribbonBtnWithLabel} ${styles.ribbonTourBtn}`}
          title="Interactive Tour & Features Cheatsheet"
          onClick={openHelpModal}
        >
          <Sparkles size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
          <span>Tips &amp; Features</span>
        </button>
      </div>
    </div>
  );
}
