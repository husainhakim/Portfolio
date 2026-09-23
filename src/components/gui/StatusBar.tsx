"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { formatFileSize } from "@/lib/fileHelpers";
import { FSFile } from "@/data/filesystemData";
import { ShieldCheck, HardDrive, Terminal, Layers, HelpCircle, Sparkles, Play } from "lucide-react";
import { useTour } from "@/context/TourContext";
import { useAutopilot } from "@/context/AutopilotContext";
import styles from "./Gui.module.css";

export function StatusBar() {
  const { currentPath, currentNode, selectedNode, mode, customNames } = useFilesystem();
  const { openHelpModal } = useTour();
  const { startAutopilot } = useAutopilot();

  const childCount =
    currentNode && currentNode.type === "directory" ? currentNode.children.length : 0;

  return (
    <footer className={styles.statusBar} data-tour="status-bar">
      <div className={styles.statusLeft}>
        <div className={styles.statusSection}>
          <HardDrive size={12} className={styles.statusIcon} />
          <span className={styles.statusText}>{currentPath}</span>
        </div>
        <div className={styles.statusSection}>
          <span className={styles.statusText}>{childCount} items</span>
        </div>
        {selectedNode && (
          <div className={styles.statusSection}>
            <span className={styles.statusHighlight}>
              Selected: {customNames[selectedNode.id] || selectedNode.name}
            </span>
            <span className={styles.statusText}>
              ({selectedNode.type === "file" ? formatFileSize((selectedNode as FSFile).size) : "folder"})
            </span>
          </div>
        )}
      </div>

      <div className={styles.statusRight}>
        <button
          onClick={startAutopilot}
          className={styles.statusAutopilotBtn}
          title="Watch 20-Second Live UI Skim Walkthrough"
        >
          <Play size={10} fill="currentColor" className={styles.statusIcon} />
          <span>Watch Skim</span>
        </button>
        <button
          onClick={openHelpModal}
          className={styles.statusTourBtn}
          title="Interactive Tour & Features Cheatsheet"
        >
          <Sparkles size={11} className={styles.statusIcon} />
          <span>Tips &amp; Features</span>
        </button>
        <div className={styles.statusSection}>
          <ShieldCheck size={12} className={styles.statusIcon} />
          <span className={styles.statusText}>Auth: Authorized Labs</span>
        </div>
        <div className={styles.statusSection}>
          <Terminal size={12} className={styles.statusIcon} />
          <span className={styles.statusText}>Sync: {mode.toUpperCase()}</span>
        </div>
      </div>
    </footer>
  );
}
