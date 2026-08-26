"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { buildBreadcrumbs } from "@/lib/fileHelpers";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Folder,
  Home,
  Search,
  RotateCcw,
  Menu,
} from "lucide-react";
import styles from "./Gui.module.css";

interface BreadcrumbBarProps {
  onToggleSidebar?: () => void;
}

export function BreadcrumbBar({ onToggleSidebar }: BreadcrumbBarProps) {
  const {
    currentPath,
    navigate,
    goBack,
    goForward,
    goUp,
    canGoBack,
    canGoForward,
    canGoUp,
    searchQuery,
    setSearchQuery,
  } = useFilesystem();

  const breadcrumbs = buildBreadcrumbs(currentPath);

  return (
    <div className={styles.breadcrumbBar}>
      {/* Navigation Buttons (Back, Forward, Up) */}
      <div className={styles.navControls}>
        <button
          onClick={onToggleSidebar}
          className={`${styles.navBtn} ${styles.mobileMenuBtn}`}
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu size={16} />
        </button>
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={styles.navBtn}
          title="Back (Alt+Left)"
          aria-label="Navigate back"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={styles.navBtn}
          title="Forward (Alt+Right)"
          aria-label="Navigate forward"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={goUp}
          disabled={!canGoUp}
          className={styles.navBtn}
          title="Up to Parent Directory (Alt+Up)"
          aria-label="Navigate to parent directory"
        >
          <ArrowUp size={15} />
        </button>
        <button
          onClick={() => {}}
          className={styles.navBtn}
          title="Refresh"
          aria-label="Refresh"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Path Breadcrumbs Display */}
      <nav className={styles.breadcrumbPath} aria-label="Breadcrumb Path">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.path}>
            {idx === 0 && <Home size={14} className={styles.breadcrumbHomeIcon} />}
            {idx > 0 && <span className={styles.pathSeparator}>›</span>}
            <button
              onClick={() => navigate(crumb.path)}
              className={`${styles.pathSegment} ${crumb.isLast ? styles.pathSegmentActive : ""}`}
              title={`Jump to ${crumb.path}`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Explorer Search Box */}
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder={`Search ${currentPath === '/home/husain' ? 'Husain' : currentPath.split('/').pop()}`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput} 
        />
        <Search size={14} className={styles.searchIcon} />
      </div>
    </div>
  );
}
