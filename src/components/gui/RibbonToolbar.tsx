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
  RotateCcw
} from "lucide-react";
import styles from "./Gui.module.css";

const ICON_SIZE = 15;
const CHEVRON_SIZE = 11;
const STROKE_WIDTH = 1.8;

export function RibbonToolbar() {
  const {
    viewLayout,
    setViewLayout,
    sortOption,
    setSortOption,
    isModified,
    resetModifications,
    selectedNode,
    handleCopyNode,
    handleDeleteNode,
  } = useFilesystem();

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
      {/* New */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtnWithLabel} title="New" disabled>
          <Plus size={ICON_SIZE} strokeWidth={STROKE_WIDTH} />
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
          title={selectedNode ? `Copy link to ${selectedNode.name}` : "Copy"}
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
          title={selectedNode ? `Delete ${selectedNode.name}` : "Delete"}
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
    </div>
  );
}
