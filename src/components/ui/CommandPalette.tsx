"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTour } from "@/context/TourContext";
import { useAutopilot } from "@/context/AutopilotContext";
import { useAchievements } from "@/context/AchievementContext";
import { useTheme } from "@/context/ThemeContext";
import { downloadNode } from "@/lib/downloadHelper";
import { findNodeById, FSFile } from "@/data/filesystemData";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";
import {
  Search,
  Terminal,
  ShieldAlert,
  Trophy,
  Sparkles,
  SunMoon,
  Download,
  RotateCcw,
  Folder,
  FileText,
  Shield,
  BookOpen,
  CornerDownLeft,
  Sparkle,
  Play,
} from "lucide-react";
import styles from "./CommandPalette.module.css";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Quick Actions" | "Navigation" | "Projects & Tools" | "Writeups & Research" | "Dossiers";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const {
    mode,
    toggleMode,
    navigate,
    openFile,
    currentNode,
    resetModifications,
  } = useFilesystem();
  const { startTour, openHelpModal, openWelcome } = useTour();
  const { startAutopilot } = useAutopilot();
  const { openPanel, unlockedCount, totalCount, unlock } = useAchievements();
  const { toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openFileNodeById = useCallback((id: string) => {
    const node = findNodeById(id);
    if (node && node.type === "file") {
      openFile(node as FSFile);
    }
  }, [openFile]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command catalogue
  const allCommands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Quick Actions
      {
        id: "act-autopilot",
        title: "Watch 20s Live Autopilot Skim (Demo)",
        subtitle: "Automated cinema walkthrough of Terminal, CTF Vault, and Trophies",
        category: "Quick Actions",
        icon: <Play size={15} className={styles.iconTour} />,
        action: () => {
          startAutopilot();
          onClose();
        },
      },
      {
        id: "act-welcome",
        title: "Meet Husain & Operator Welcome Guide",
        subtitle: "Introduction message, photo dialogue, and MANUAL.md quickstart",
        category: "Quick Actions",
        icon: <Sparkles size={15} className={styles.iconTour} />,
        action: () => {
          openWelcome();
          onClose();
        },
      },
      {
        id: "act-terminal",
        title: mode === "cli" ? "Switch to GUI Desktop" : "Switch to Interactive Linux Terminal",
        subtitle: "Engage full UNIX shell simulation with neofetch, tree, and custom commands",
        category: "Quick Actions",
        icon: <Terminal size={15} className={styles.iconTerminal} />,
        shortcut: "Alt+T",
        action: () => {
          toggleMode();
          onClose();
        },
      },
      {
        id: "act-vault",
        title: "Breach Personal Vault (CTF Challenge)",
        subtitle: "Solve security riddle to breach the locked chamber",
        category: "Quick Actions",
        icon: <ShieldAlert size={15} className={styles.iconVault} />,
        action: () => {
          navigate("/home/husain/vault");
          openFileNodeById("vault-file");
          onClose();
        },
      },
      {
        id: "act-achievements",
        title: `View Trophy Showcase (${unlockedCount}/${totalCount} Unlocked)`,
        subtitle: "10 secret Easter eggs and achievement badges",
        category: "Quick Actions",
        icon: <Trophy size={15} className={styles.iconTrophy} />,
        action: () => {
          openPanel();
          onClose();
        },
      },
      {
        id: "act-tour",
        title: "Start 30-Second Workstation Tour",
        subtitle: "Interactive guided walkthrough of all power features",
        category: "Quick Actions",
        icon: <Sparkles size={15} className={styles.iconTour} />,
        action: () => {
          startTour(0);
          onClose();
        },
      },
      {
        id: "act-cheatsheet",
        title: "Workstation Tips & Features Cheatsheet",
        subtitle: "View complete technical capabilities modal",
        category: "Quick Actions",
        icon: <Sparkle size={15} className={styles.iconTour} />,
        action: () => {
          openHelpModal();
          onClose();
        },
      },
      {
        id: "act-theme",
        title: "Flip Mechanical Light/Dark Switch",
        subtitle: "Toggle between Dark Terminal and Daylight theme",
        category: "Quick Actions",
        icon: <SunMoon size={15} className={styles.iconTheme} />,
        action: () => {
          unlock("seen_the_light");
          toggleTheme();
          onClose();
        },
      },
      {
        id: "act-download",
        title: "Download Current Workspace as .ZIP",
        subtitle: "Package active directory files into an archive",
        category: "Quick Actions",
        icon: <Download size={15} className={styles.iconAction} />,
        action: () => {
          if (currentNode) downloadNode(currentNode);
          onClose();
        },
      },
      {
        id: "act-reset",
        title: "Reset Filesystem Customizations",
        subtitle: "Undo all file renames, soft-deletions, and card reorders",
        category: "Quick Actions",
        icon: <RotateCcw size={15} className={styles.iconAction} />,
        action: () => {
          resetModifications();
          onClose();
        },
      },

      // Navigation
      {
        id: "nav-root",
        title: "Go to Workspace Root (/home/husain)",
        subtitle: "Primary home directory",
        category: "Navigation",
        icon: <Folder size={15} className={styles.iconFolder} />,
        action: () => {
          navigate("/home/husain");
          onClose();
        },
      },
      {
        id: "nav-projects",
        title: "Browse /home/husain/projects",
        subtitle: "Offensive & defensive security utilities and scanners",
        category: "Navigation",
        icon: <Folder size={15} className={styles.iconFolder} />,
        action: () => {
          navigate("/home/husain/projects");
          onClose();
        },
      },
      {
        id: "nav-writeups",
        title: "Browse /home/husain/writeups",
        subtitle: "CTF walkthroughs, CVE analyses, and room breakdowns",
        category: "Navigation",
        icon: <Folder size={15} className={styles.iconFolder} />,
        action: () => {
          navigate("/home/husain/writeups");
          onClose();
        },
      },
      {
        id: "nav-blogs",
        title: "Browse /home/husain/blogs",
        subtitle: "Technical articles on networking, Linux, and protocols",
        category: "Navigation",
        icon: <Folder size={15} className={styles.iconFolder} />,
        action: () => {
          navigate("/home/husain/blogs");
          onClose();
        },
      },

      // Dossiers
      {
        id: "doc-readme",
        title: "MANUAL.md (Workstation Guide & Feature Matrix)",
        subtitle: "Capabilities overview and shortcuts cheat sheet",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          navigate("/home/husain");
          openFileNodeById("readme-file");
          onClose();
        },
      },
      {
        id: "doc-about",
        title: "about.md (Husain Hakim Dossier)",
        subtitle: "Background, mindset, systems philosophy, and academic journey",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          navigate("/home/husain");
          openFileNodeById("about-file");
          onClose();
        },
      },
      {
        id: "doc-skills",
        title: "skills.json (Technical Arsenal & Proficiencies)",
        subtitle: "Linux, Networking, Python, Web Security, Forensics",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          navigate("/home/husain");
          openFileNodeById("skills-file");
          onClose();
        },
      },
      {
        id: "doc-experience",
        title: "experience.md (Academic Background & Hackathon Lead)",
        subtitle: "ITM Skills University, Hackathon organizer (₹6.85L prize pools)",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          navigate("/home/husain");
          openFileNodeById("experience-file");
          onClose();
        },
      },
      {
        id: "doc-contact",
        title: "contact-info.md (Secure Channels)",
        subtitle: "Email, GitHub, LinkedIn, Medium, X",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          navigate("/home/husain");
          openFileNodeById("contact-file");
          onClose();
        },
      },
      {
        id: "doc-resume",
        title: "resume.pdf (Technical Resume)",
        subtitle: "Open printable PDF curriculum vitae",
        category: "Dossiers",
        icon: <FileText size={15} className={styles.iconDoc} />,
        action: () => {
          window.open("/resume.pdf", "_blank");
          onClose();
        },
      },
    ];

    // Add Projects
    PROJECTS_DATA.forEach((proj) => {
      list.push({
        id: `proj-${proj.id}`,
        title: `${proj.name} (Project)`,
        subtitle: proj.tagline || proj.summary,
        category: "Projects & Tools",
        icon: <Shield size={15} className={styles.iconProject} />,
        action: () => {
          navigate("/home/husain/projects");
          openFileNodeById(proj.id);
          onClose();
        },
      });
    });

    // Add Writeups
    WRITEUPS_DATA.forEach((w) => {
      list.push({
        id: `writeup-${w.id}`,
        title: `${w.title} (CTF Writeup)`,
        subtitle: `${w.categoryLabel} • ${w.difficulty} • ${w.readTime}`,
        category: "Writeups & Research",
        icon: <ShieldAlert size={15} className={styles.iconWriteup} />,
        action: () => {
          navigate("/home/husain/writeups");
          openFileNodeById(w.id);
          onClose();
        },
      });
    });

    // Add Blogs
    BLOGS_DATA.forEach((b) => {
      list.push({
        id: `blog-${b.id}`,
        title: `${b.title} (Blog)`,
        subtitle: `${b.readTime} • ${b.topics?.join(", ") || b.publication}`,
        category: "Writeups & Research",
        icon: <BookOpen size={15} className={styles.iconBlog} />,
        action: () => {
          navigate("/home/husain/blogs");
          openFileNodeById(b.id);
          onClose();
        },
      });
    });

    return list;
  }, [
    mode,
    toggleMode,
    navigate,
    openFileNodeById,
    unlockedCount,
    totalCount,
    openPanel,
    startTour,
    openHelpModal,
    unlock,
    toggleTheme,
    currentNode,
    resetModifications,
    onClose,
  ]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase().trim();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.subtitle?.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [query, allCommands]);

  // Handle keyboard navigation inside command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.paletteOverlay} onClick={onClose}>
      <div
        className={styles.paletteContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        {/* Search Header Bar */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Type a command, tool, project, or hotkey..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.searchActions}>
            <span className={styles.escBadge} onClick={onClose} title="Close palette">
              ESC
            </span>
          </div>
        </div>

        {/* Results List */}
        <div className={styles.resultsList} ref={listRef}>
          {filteredCommands.length === 0 ? (
            <div className={styles.emptyState}>
              <span>No commands or items found for &quot;{query}&quot;</span>
              <p>Try searching for &quot;terminal&quot;, &quot;vault&quot;, &quot;scanner&quot;, or &quot;resume&quot;</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                data-index={idx}
                className={`${styles.commandItem} ${
                  idx === selectedIndex ? styles.commandItemActive : ""
                }`}
                onClick={() => cmd.action()}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={styles.commandIcon}>{cmd.icon}</div>
                <div className={styles.commandText}>
                  <div className={styles.commandTitleRow}>
                    <span className={styles.commandTitle}>{cmd.title}</span>
                    <span className={styles.commandCategory}>{cmd.category}</span>
                  </div>
                  {cmd.subtitle && (
                    <span className={styles.commandSubtitle}>{cmd.subtitle}</span>
                  )}
                </div>
                {cmd.shortcut && (
                  <kbd className={styles.shortcutTag}>{cmd.shortcut}</kbd>
                )}
                {idx === selectedIndex && (
                  <CornerDownLeft size={13} className={styles.enterHintIcon} />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className={styles.paletteFooter}>
          <div className={styles.footerHints}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>ESC</kbd> to close</span>
          </div>
          <div className={styles.footerBrand}>
            <span>HusainOS Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
