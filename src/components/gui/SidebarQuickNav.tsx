"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import {
  HardDrive,
  Cloud,
  Pin,
  FileText,
  Lock,
  Mail,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, MediumIcon } from "@/components/ui/Icons";
import { PROFILE_DATA } from "@/data/profileData";
import { Win11Folder, Win11Pdf } from "./Win11Icons";
import { findNodeByPath, FSFile, VIRTUAL_FS } from "@/data/filesystemData";
import styles from "./Gui.module.css";

interface NavShortcut {
  label: string;
  path: string;
  type: "folder" | "document" | "pdf";
}

const SHORTCUTS: NavShortcut[] = [
  { label: "About.md", path: "/home/husain/about.md", type: "document" },
  { label: "Experience", path: "/home/husain/experience", type: "folder" },
  { label: "Projects", path: "/home/husain/projects", type: "folder" },
  { label: "Contact-info.md", path: "/home/husain/contact-info.md", type: "document" },
  { label: "Writeups", path: "/home/husain/writeups", type: "folder" },
  { label: "Blogs", path: "/home/husain/blogs", type: "folder" },
  { label: "Skills.md", path: "/home/husain/skills.md", type: "document" },
  { label: "Resume.pdf", path: "/home/husain/resume.pdf", type: "pdf" },
];

interface SidebarQuickNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarQuickNav({ isOpen, onClose }: SidebarQuickNavProps) {
  const { currentPath, navigate, openFile, customNames } = useFilesystem();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      {/* Zone 1: NAVIGATION */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <span className={styles.sidebarSectionTitle}>NAVIGATION</span>
        </div>
        <div className={styles.sidebarNavList}>
          <button
            onClick={() => handleNavigate("/home/husain")}
            className={`${styles.sidebarNavItem} ${currentPath === "/home/husain" ? styles.sidebarNavActive : ""}`}
            title="Navigate to Home Root"
          >
            <div className={styles.sidebarNavLeft}>
              <Win11Folder size={16} colorTheme="yellow" className={styles.sidebarNavIcon} />
              <span className={styles.sidebarNavLabel}>Home</span>
            </div>
          </button>

          <button
            onClick={() => {
              const vaultFile = findNodeByPath("/home/husain/vault/personal_vault.md", VIRTUAL_FS, customNames);
              if (vaultFile && vaultFile.type === "file") {
                openFile(vaultFile as FSFile);
              }
            }}
            className={`${styles.sidebarNavItem} ${styles.sidebarVaultBtn} ${styles.hasTooltip}`}
            data-tour="sidebar-vault-btn"
            aria-label="Personal Vault (Confidential)"
          >
            <div className={styles.sidebarNavLeft} style={{ alignItems: 'center' }}>
              <div className={styles.vaultIconWrapper}>
                <Lock size={14} className={styles.vaultLockIcon} />
              </div>
              <div className={styles.vaultTextGroup}>
                <span className={styles.vaultNavLabel}>Personal Vault</span>
                <span className={styles.dontClickBadge}>
                  <span className={styles.dontClickDot} />
                  <span>me beyond the resume</span>
                  <span className={styles.dontClickShimmer} />
                </span>
              </div>
            </div>
            <span className={styles.customTooltip}>
              ⚠️ Highly unfiltered thoughts, proceed at your own risk 👀
            </span>
          </button>
        </div>
      </div>

      <div className={styles.sidebarDivider} />

      {/* Zone 2: PINNED */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <span className={styles.sidebarSectionTitle}>PINNED</span>
        </div>
        <div className={styles.sidebarNavList}>
          {SHORTCUTS.map((item) => {
            const isActive = item.path !== "/home/husain" && currentPath.startsWith(item.path);
            const node = findNodeByPath(item.path, VIRTUAL_FS, customNames);
            const label = (node && customNames[node.id]) || item.label;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`${styles.sidebarNavItem} ${isActive ? styles.sidebarNavActive : ""}`}
                title={`Navigate to ${item.path}`}
              >
                <div className={styles.sidebarNavLeft}>
                  {item.type === "pdf" ? (
                    <Win11Pdf size={16} className={styles.sidebarNavIcon} />
                  ) : item.type === "folder" ? (
                    <Win11Folder size={16} colorTheme="yellow" className={styles.sidebarNavIcon} />
                  ) : (
                    <FileText size={16} color="var(--accent-primary)" className={styles.sidebarNavIcon} />
                  )}
                  <span className={styles.sidebarNavLabel}>{label}</span>
                </div>
                <Pin size={12} className={styles.pinIconHover} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.sidebarDivider} />

      {/* Zone 3: WORKSPACE */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <span className={styles.sidebarSectionTitle}>WORKSPACE</span>
        </div>
        <div className={styles.sidebarNavList}>
          <button
            onClick={() => handleNavigate("/home/husain")}
            className={styles.sidebarNavItem}
            title="Local Storage (C:)"
          >
            <div className={styles.sidebarNavLeft} style={{ alignItems: 'flex-start', width: '100%' }}>
              <HardDrive size={16} color="var(--accent-primary)" className={styles.sidebarNavIcon} style={{ marginTop: '2px' }} />
              <div className={styles.diskUsageContainer}>
                <span className={styles.sidebarNavLabel} style={{ fontWeight: 600 }}>Local Disk (C:)</span>
                <div className={styles.diskProgressTrack}>
                  <div className={styles.diskProgressBar} style={{ width: '93%' }} />
                </div>
                <div className={styles.diskUsageText}>
                  coffee storage consumed <strong className={styles.diskUsagePercent}>93%</strong>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.sidebarDivider} />

      {/* Zone 4: NETWORK ATTACHED */}
      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionHeader}>
          <span className={styles.sidebarSectionTitle}>NETWORK ATTACHED</span>
        </div>
        <div className={styles.sidebarNavList}>
          <button
            type="button"
            className={`${styles.sidebarNavItem} ${styles.hasTooltip}`}
            aria-disabled="true"
            style={{ cursor: 'default' }}
          >
            <div className={styles.sidebarNavLeft}>
              <Cloud size={16} color="var(--text-muted)" className={styles.sidebarNavIcon} />
              <span className={styles.sidebarNavLabel}>Network Drive</span>
            </div>
            <span className={styles.customTooltip}>Dont really know what to put here just added for the vibes🤓</span>
          </button>
        </div>
      </div>

      {/* Pushed-to-Bottom Footer Area */}
      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarFooterDivider} />

        {/* Social Links & Version Tag */}
        <div className={styles.sidebarFooterMeta}>
          <div className={styles.sidebarSocialsRow}>
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sidebarSocialBtn}
              title="GitHub Profile (@husainhakim)"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={17} />
            </a>
            <a
              href={PROFILE_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sidebarSocialBtn}
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={17} />
            </a>
            <a
              href={PROFILE_DATA.medium}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sidebarSocialBtn}
              title="Medium Profile (@husainhakim)"
              aria-label="Medium Profile"
            >
              <MediumIcon size={17} />
            </a>
            <a
              href={`mailto:${PROFILE_DATA.email}`}
              className={styles.sidebarSocialBtn}
              title="Email Contact"
              aria-label="Email Contact"
            >
              <Mail size={17} />
            </a>
          </div>
          <span className={styles.sidebarVersionBadge}>v2.1.3</span>
        </div>

        {/* User Identity & Live Status Badge */}
        <div className={styles.sidebarUserProfile}>
          <div className={styles.sidebarUserBadge}>
            <span className={styles.sidebarUserMonogram}>HH</span>
            <span className={styles.sidebarOnlineDot} title="System Ready / Online" />
          </div>
          <div className={styles.sidebarUserInfo}>
            <span className={styles.sidebarUserName}>Husain Hakim</span>
            <span className={styles.sidebarUserStatus}>Active • Terminal v1</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
