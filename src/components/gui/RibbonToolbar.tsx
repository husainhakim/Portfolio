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
  ChevronDown
} from "lucide-react";
import styles from "./Gui.module.css";

export function RibbonToolbar() {
  const { viewLayout, setViewLayout, sortOption, setSortOption } = useFilesystem();

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
          <Plus size={16} />
          <span>New</span>
          <ChevronDown size={12} style={{ marginLeft: -4 }} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Primary Actions (Cut, Copy, Paste, Rename, Share, Delete) */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtn} title="Cut" disabled>
          <Scissors size={16} />
        </button>
        <button className={styles.ribbonBtn} title="Copy" disabled>
          <Copy size={16} />
        </button>
        <button className={styles.ribbonBtn} title="Paste" disabled>
          <ClipboardPaste size={16} />
        </button>
        <button className={styles.ribbonBtn} title="Rename" disabled>
          <FileEdit size={16} />
        </button>
        <button className={styles.ribbonBtn} title="Share" disabled>
          <Share2 size={16} />
        </button>
        <button className={styles.ribbonBtn} title="Delete" disabled>
          <Trash2 size={16} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Sort and View */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtnWithLabel} title="Sort" onClick={handleSortCycle}>
          <ArrowDownUp size={16} />
          <span>{getSortLabel()}</span>
          <ChevronDown size={12} style={{ marginLeft: -4 }} />
        </button>
        <button className={styles.ribbonBtnWithLabel} title="View" onClick={() => setViewLayout(viewLayout === "grid" ? "list" : "grid")}>
          {viewLayout === "grid" ? <LayoutGrid size={16} /> : <List size={16} />}
          <span>View</span>
          <ChevronDown size={12} style={{ marginLeft: -4 }} />
        </button>
        <button className={styles.ribbonBtnWithLabel} title="Filter" disabled>
          <Filter size={16} />
          <span>Filter</span>
          <ChevronDown size={12} style={{ marginLeft: -4 }} />
        </button>
      </div>

      <div className={styles.ribbonDivider} />

      {/* Overflow */}
      <div className={styles.ribbonGroup}>
        <button className={styles.ribbonBtn} title="See more" disabled>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
