"use client";

import React, { useState, useEffect } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import {
  Folder,
  HardDrive,
  Cloud,
  Pin,
  User
} from "lucide-react";
import { Win11Folder, Win11Pdf } from "./Win11Icons";
import { findNodeByPath } from "@/data/filesystemData";
import styles from "./Gui.module.css";

interface NavShortcut {
  label: string;
  path: string;
  colorTheme?: "yellow" | "blue" | "blueGray" | "teal" | "warm" | "brown";
  isPdf?: boolean;
  isUser?: boolean;
}

const SHORTCUTS: NavShortcut[] = [
  { label: "about.md", path: "/home/husain/about.md", isUser: true },
  { label: "projects", path: "/home/husain/projects", colorTheme: "blueGray" },
  { label: "writeups", path: "/home/husain/writeups", colorTheme: "teal" },
  { label: "blogs", path: "/home/husain/blogs", colorTheme: "warm" },
  { label: "skills.md", path: "/home/husain/skills.md", colorTheme: "yellow" },
  { label: "experience", path: "/home/husain/experience", colorTheme: "brown" },
  { label: "contact-info.md", path: "/home/husain/contact-info.md", colorTheme: "blue" },
  { label: "resume.pdf", path: "/home/husain/resume.pdf", isPdf: true },
];

interface SidebarQuickNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarQuickNav({ isOpen, onClose }: SidebarQuickNavProps) {
  const { currentPath, navigate, openFile } = useFilesystem();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      {/* Top Section */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarNavList}>
          <button
            onClick={() => navigate("/home/husain")}
            className={`${styles.sidebarNavItem} ${currentPath === "/home/husain" ? styles.sidebarNavActive : ""}`}
            title="Navigate to Home"
          >
            <div className={styles.sidebarNavLeft}>
              <Folder size={16} color="#0067C0" fill="#0067C0" className={styles.sidebarNavIcon} />
              <span className={styles.sidebarNavLabel}>Home</span>
            </div>
          </button>
          <button
            onClick={() => {
              const vaultFile = findNodeByPath("/home/husain/vault/personal_vault.md");
              if (vaultFile && vaultFile.type === "file") {
                openFile(vaultFile as any);
              }
            }}
            className={styles.sidebarNavItem}
            title="Personal Vault"
          >
            <div className={styles.sidebarNavLeft} style={{ alignItems: 'flex-start' }}>
              <Cloud size={16} color="#0067C0" className={styles.sidebarNavIcon} style={{ marginTop: '3px' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className={styles.sidebarNavLabel} style={{ lineHeight: 1.2 }}>Personal Vault</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 400, marginTop: '2px' }}>(don't click)</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.sidebarDivider} />

      {/* Quick Access Section */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarNavList}>
          {SHORTCUTS.map((item) => {
            const isActive = item.path !== "/home/husain" && currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${styles.sidebarNavItem} ${isActive ? styles.sidebarNavActive : ""}`}
                title={`Navigate to ${item.path}`}
              >
                <div className={styles.sidebarNavLeft}>
                  {item.isPdf ? (
                    <Win11Pdf size={16} className={styles.sidebarNavIcon} />
                  ) : item.isUser ? (
                    <User size={16} color="#3b82f6" className={styles.sidebarNavIcon} />
                  ) : (
                    <Win11Folder size={16} colorTheme={item.colorTheme} className={styles.sidebarNavIcon} />
                  )}
                  <span className={styles.sidebarNavLabel}>{item.label}</span>
                </div>
                <Pin size={12} className={styles.pinIconStatic} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.sidebarDivider} />

      {/* Workspace Section (This PC equivalent) */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarNavList}>
          <button
            onClick={() => navigate("/home/husain")}
            className={styles.sidebarNavItem}
            title="Workspace"
          >
            <div className={styles.sidebarNavLeft}>
              <HardDrive size={16} color="#0067C0" className={styles.sidebarNavIcon} />
              <span className={styles.sidebarNavLabel}>Workspace</span>
            </div>
          </button>

          <div style={{ marginLeft: 16 }}>
            <button
              onClick={() => navigate("/home/husain")}
              className={styles.sidebarNavItem}
              title="Local Storage"
            >
              <span className={styles.sidebarNavLeft} style={{ alignItems: 'flex-start', marginTop: '2px', whiteSpace: 'normal', display: 'flex' }}>
                <HardDrive size={16} color="#888" className={styles.sidebarNavIcon} style={{ marginTop: '2px' }} />
                <span style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
                  <span className={styles.sidebarNavLabel} style={{ marginBottom: '4px', lineHeight: 1 }}>Local Disk (C:)</span>
                  <span style={{ width: '100px', height: '12px', backgroundColor: '#e6e6e6', border: '1px solid #bcbcbc', marginBottom: '2px', display: 'block' }}>
                    <span style={{ width: '93%', height: '100%', backgroundColor: '#26a0da', display: 'block' }} />
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.3, marginTop: '2px' }}>
                    coffee storage consumed<br/>93% out of 100%
                  </span>
                </span>
              </span>
            </button>
            <button
              className={`${styles.sidebarNavItem} ${styles.hasTooltip}`}
              disabled
            >
              <div className={styles.sidebarNavLeft}>
                <Cloud size={16} color="#888" className={styles.sidebarNavIcon} />
                <span className={styles.sidebarNavLabel}>Network Attached</span>
              </div>
              <span className={styles.customTooltip}>Dont really know what to put here just added for the vibes🤓</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

