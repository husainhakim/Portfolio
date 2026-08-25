"use client";

import React, { useEffect } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { FSFile } from "@/data/filesystemData";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";
import { AboutView } from "@/components/views/AboutView";
import { ProjectView } from "@/components/views/ProjectView";
import { WriteupView } from "@/components/views/WriteupView";
import { BlogView } from "@/components/views/BlogView";
import { BlogDetailView } from "@/components/views/BlogDetailView";
import { SkillsView } from "@/components/views/SkillsView";
import { ExperienceView } from "@/components/views/ExperienceView";
import { ContactView } from "@/components/views/ContactView";
import { ResumeView } from "@/components/views/ResumeView";
import { PersonalVaultView } from "@/components/views/PersonalVaultView";
import { formatFileSize } from "@/lib/fileHelpers";
import {
  X,
  FileText,
  Shield,
  Code,
  Download,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import styles from "./Gui.module.css";

export function FileViewerModal() {
  const { openedFile, closeFile, currentPath } = useFilesystem();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFile]);

  if (!openedFile) return null;

  // Resolve matching view
  const renderContent = () => {
    // Project View
    if (openedFile.fileType === "project" && openedFile.dataRef) {
      const project = PROJECTS_DATA.find((p) => p.id === openedFile.dataRef);
      if (project) return <ProjectView project={project} />;
    }

    // Writeup View
    if (openedFile.fileType === "writeup" && openedFile.dataRef) {
      const writeup = WRITEUPS_DATA.find((w) => w.id === openedFile.dataRef);
      if (writeup) return <WriteupView writeup={writeup} />;
    }

    // Blog View
    if (openedFile.fileType === "blog") {
      if (openedFile.dataRef) {
        const blog = BLOGS_DATA.find((b) => b.id === openedFile.dataRef);
        if (blog) return <BlogDetailView blog={blog} />;
      }
      return <BlogView />;
    }

    // Skills View
    if (openedFile.fileType === "skills") {
      return <SkillsView />;
    }

    // Experience View
    if (openedFile.fileType === "experience") {
      return <ExperienceView />;
    }

    // Contact View
    if (openedFile.fileType === "contact") {
      return <ContactView />;
    }

    // PDF Resume View
    if (openedFile.fileType === "pdf") {
      return <ResumeView />;
    }

    // About Profile View
    if (openedFile.path.startsWith("/home/husain/about")) {
      return <AboutView />;
    }

    // Personal Vault View
    if (openedFile.fileType === "vault") {
      return <PersonalVaultView />;
    }

    // Standalone Markdown or generic file
    return (
      <div className={styles.genericFileViewer}>
        <div className={styles.genericFileHeader}>
          <h2>{openedFile.name}</h2>
          <span className={styles.genericFileMeta}>
            {openedFile.permissions} • {formatFileSize(openedFile.size)}
          </span>
        </div>
        <pre className={styles.genericFileCode}>
          <code>{openedFile.content || "Empty file content"}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={closeFile}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`File Viewer: ${openedFile.name}`}
      >
        {/* Modal Top Header Bar */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <button
              onClick={closeFile}
              className={styles.modalBackBtn}
              title="Close viewer (ESC)"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <div className={styles.modalFileMeta}>
              <span className={styles.modalFileName}>{openedFile.name}</span>
              <span className={styles.modalFilePath}>{openedFile.path}</span>
            </div>
          </div>

          <div className={styles.modalHeaderRight}>
            <span className={styles.modalPermsBadge}>{openedFile.permissions}</span>
            <button
              onClick={closeFile}
              className={styles.modalCloseBtn}
              title="Close (ESC)"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div id="modal-scroll-container" className={styles.modalBody}>{renderContent()}</div>
      </div>
    </div>
  );
}
