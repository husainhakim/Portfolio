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
import { ReadmeView } from "@/components/views/ReadmeView";
import { formatFileSize } from "@/lib/fileHelpers";
import { downloadNode } from "@/lib/downloadHelper";
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
  const { openedFile, closeFile, currentPath, customNames } = useFilesystem();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openedFile) {
        e.preventDefault();
        closeFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFile, openedFile]);

  if (!openedFile) return null;

  const displayName = customNames[openedFile.id] || openedFile.name;

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

    // README / Workstation Manual Guide View
    if (
      openedFile.name.toLowerCase() === "manual.md" ||
      openedFile.name.toLowerCase() === "readme.md" ||
      openedFile.id === "readme-file"
    ) {
      return <ReadmeView />;
    }

    // Personal Vault View
    if (openedFile.fileType === "vault") {
      return <PersonalVaultView />;
    }

    // Image File View (Contract proofs, certificates, screenshots)
    if (
      openedFile.fileType === "image" ||
      Boolean(openedFile.externalUrl) ||
      /\.(jpeg|jpg|png|webp|svg)$/i.test(openedFile.name)
    ) {
      const imgUrl =
        openedFile.externalUrl ||
        (openedFile.name.startsWith("HusainLU_")
          ? `/Experience/${openedFile.name}`
          : openedFile.path);
      return (
        <div
          className={styles.genericFileViewer}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px",
            gap: "16px",
          }}
        >
          <div
            style={{
              maxWidth: "100%",
              maxHeight: "68vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#080c14",
              border: "1px solid var(--border-default)",
              padding: "16px",
              borderRadius: "4px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={imgUrl}
              alt={displayName}
              style={{
                maxWidth: "100%",
                maxHeight: "62vh",
                objectFit: "contain",
              }}
            />
          </div>
          <div
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {openedFile.description && (
              <p style={{ margin: 0, fontWeight: 500, color: "var(--text-primary)" }}>
                {openedFile.description}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <a
                href={imgUrl}
                download={openedFile.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--accent-text)",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  padding: "4px 8px",
                  background: "var(--accent-surface)",
                  border: "1px solid var(--accent-primary)",
                  borderRadius: "3px",
                }}
              >
                <Download size={13} />
                <span>Download Proof ({formatFileSize(openedFile.size)})</span>
              </a>
              <a
                href={imgUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Standalone Markdown or generic file
    return (
      <div className={styles.genericFileViewer}>
        <div className={styles.genericFileHeader}>
          <h2>{displayName}</h2>
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
        aria-label={`File Viewer: ${displayName}`}
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
              <span className={styles.modalFileName}>{displayName}</span>
              <span className={styles.modalFilePath}>{openedFile.path}</span>
            </div>
          </div>

          <div className={styles.modalHeaderRight}>
            <span className={styles.modalPermsBadge}>{openedFile.permissions}</span>
            {openedFile.fileType !== "vault" && (
              <button
                onClick={() => downloadNode(openedFile)}
                className={styles.modalBackBtn}
                title="Download file"
                style={{ padding: "4px 8px", fontSize: "12px", gap: "4px" }}
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            )}
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
