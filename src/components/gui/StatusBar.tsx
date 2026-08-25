"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { formatFileSize } from "@/lib/fileHelpers";
import { FSFile } from "@/data/filesystemData";
import { ShieldCheck, HardDrive, Terminal, Layers } from "lucide-react";
import styles from "./Gui.module.css";

export function StatusBar() {
  const { currentPath, currentNode, selectedNode, mode } = useFilesystem();

  const childCount =
    currentNode && currentNode.type === "directory" ? currentNode.children.length : 0;

  return (
    <footer className={styles.statusBar}>
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
            <span className={styles.statusHighlight}>Selected: {selectedNode.name}</span>
            <span className={styles.statusText}>
              ({selectedNode.type === "file" ? formatFileSize((selectedNode as FSFile).size) : "folder"})
            </span>
          </div>
        )}
      </div>

      <div className={styles.statusRight}>
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
