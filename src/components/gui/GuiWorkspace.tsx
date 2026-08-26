"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { BreadcrumbBar } from "./BreadcrumbBar";
import { RibbonToolbar } from "./RibbonToolbar";
import { SidebarQuickNav } from "./SidebarQuickNav";
import { DirectoryGrid } from "./DirectoryGrid";
import { FileViewerModal } from "./FileViewerModal";
import { StatusBar } from "./StatusBar";
import { FSNode } from "@/data/filesystemData";
import { BlogView } from "@/components/views/BlogView";
import { WriteupsListView } from "@/components/views/WriteupsListView";
import styles from "./Gui.module.css";

export function GuiWorkspace() {
  const { currentNode, setSelectedNode } = useFilesystem();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const childrenNodes: FSNode[] =
    currentNode && currentNode.type === "directory" 
      ? currentNode.children.filter(child => child.name !== "vault") 
      : [];

  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedNode(null);
    }
  };

  return (
    <div
      className={`${styles.guiWorkspace} explorer-theme`}
      onKeyDown={handleGlobalKeyDown}
    >
      {/* Ribbon Toolbar (Windows 11 Style) */}
      <RibbonToolbar />

      {/* Top Breadcrumb Bar */}
      <BreadcrumbBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className={styles.mobileSidebarOverlay} 
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content Area: Sidebar + Directory Listing + Preview Panel */}
      <div className={styles.mainLayout}>
        <SidebarQuickNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className={styles.contentArea}>
          {currentNode?.path === "/home/husain/blogs" ? (
            <BlogView />
          ) : currentNode?.path === "/home/husain/writeups" ? (
            <WriteupsListView />
          ) : (
            <DirectoryGrid nodes={childrenNodes} />
          )}
        </main>
      </div>

      {/* Persistent File Viewer Modal / Drawer */}
      <FileViewerModal />

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  );
}
