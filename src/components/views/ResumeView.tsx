"use client";

import React, { useState } from "react";
import { PROFILE_DATA } from "@/data/profileData";
import {
  Download,
  ExternalLink,
  FileText,
  Shield,
  Eye,
  CheckCircle2,
  HardDrive,
  Calendar,
} from "lucide-react";
import styles from "./Views.module.css";

export function ResumeView() {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.projectHeader}>
        <div className={styles.projectMetaTop}>
          <div className={styles.badgeRow}>
            <span className="badge badge-pdf">Official Resume</span>
            <span className="badge badge-default">PDF Document</span>
            <span className={styles.monoTag}>96.0 KB</span>
          </div>

          <div className={styles.buttonGroupRow}>
            <a
              href="/resume.pdf"
              download="Husain_Hakim_Resume.pdf"
              className={styles.primaryActionButton}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryActionButton}
            >
              <ExternalLink size={14} />
              <span>Open in New Tab</span>
            </a>
          </div>
        </div>

        <h1 className={styles.projectTitle}>Husain Hakim — Technical Resume</h1>
        <p className={styles.projectTagline}>
          Official CV detailing offensive security learning, backend engineering at LetsUpgrade, university education at ITM Skills University, technical tool builds, and verified accomplishments.
        </p>
      </div>

      {/* PDF Viewer Container */}
      <div className={styles.pdfViewerCard}>
        <div className={styles.pdfViewerHeader}>
          <div className={styles.pdfViewerTitle}>
            <FileText size={15} />
            <span>resume.pdf</span>
          </div>
          <div className={styles.pdfViewerMeta}>
            <span>Format: Application/PDF</span>
            <span>•</span>
            <span>Size: 96.0 KB</span>
          </div>
        </div>

        <div className={styles.pdfEmbedWrapper}>
          {!loadError ? (
            <iframe
              src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
              title="Husain Hakim Resume PDF"
              className={styles.pdfIframe}
              onError={() => setLoadError(true)}
            />
          ) : (
            <div className={styles.pdfFallbackContainer}>
              <FileText size={48} className={styles.pdfFallbackIcon} />
              <h3>PDF Preview Unavailable</h3>
              <p>Your browser may have blocked iframe previewing.</p>
              <a
                href="/resume.pdf"
                download="Husain_Hakim_Resume.pdf"
                className={styles.primaryActionButton}
                style={{ marginTop: "16px" }}
              >
                <Download size={14} />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Document Properties Table */}
      <div className={styles.sectionCard} style={{ marginTop: "24px" }}>
        <h2 className={styles.sectionTitle}>
          <HardDrive size={16} className={styles.sectionIcon} />
          File System Metadata
        </h2>
        <div className={styles.metadataGrid}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Virtual Path</span>
            <span className={styles.metadataValue}>/home/husain/resume.pdf</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Permissions</span>
            <span className={styles.metadataValue}>-rwxr-xr-x (0755)</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Owner / Group</span>
            <span className={styles.metadataValue}>husain:staff</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>File Size</span>
            <span className={styles.metadataValue}>96,041 bytes (96.0 KB)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
