"use client";

import React from "react";
import Image from "next/image";
import { useFilesystem } from "@/context/FilesystemContext";
import { PROFILE_DATA } from "@/data/profileData";
import { FSFile, FSDirectory } from "@/data/filesystemData";
import { formatFileSize } from "@/lib/fileHelpers";
import {
  Folder,
  FileText,
  Shield,
  Code,
  BookOpen,
  Compass,
  Briefcase,
  Mail,
  User,
  X,
} from "lucide-react";
import styles from "./Gui.module.css";

export function PreviewPanel() {
  const { selectedNode, setSelectedNode } = useFilesystem();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNode(null);
      }
    };
    
    if (selectedNode) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedNode, setSelectedNode]);

  if (!selectedNode) {
    return null;
  }

  const renderContent = () => {
    switch (selectedNode.name) {
      case "about":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <Image
                src={PROFILE_DATA.avatarUrl}
                alt={PROFILE_DATA.name}
                width={64}
                height={64}
                className={styles.previewAvatar}
                priority
              />
              <div className={styles.previewHeaderInfo}>
                <h3>{PROFILE_DATA.name}</h3>
                <span className={styles.previewTag}>{PROFILE_DATA.title}</span>
              </div>
            </div>
            <p className={styles.previewDesc}>{PROFILE_DATA.summary}</p>
            
            <div className={styles.previewGroup}>
              <h4>ACADEMIC PATHWAY</h4>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>B.Tech CSE, ITM Skills University</span>
                <span className={styles.pgSub}>2023 – 2027 (Expected May 2027)</span>
              </div>
            </div>
            
            <div className={styles.previewGroup}>
              <h4>OPERATING PHILOSOPHY</h4>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>LEARN &rarr; BUILD &rarr; TEST &rarr; DOCUMENT</span>
                <span className={styles.pgSub}>Grounded in authorized lab simulations and low-level protocol research</span>
              </div>
            </div>
          </div>
        );

      case "resume.pdf":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <FileText size={48} className={styles.previewBigIcon} />
              <h3>resume.pdf</h3>
              <span className={styles.previewTag}>96.0 KB</span>
            </div>
            <p className={styles.previewDesc}>
              Official CV detailing offensive security focus, 10 months backend engineering at LetsUpgrade, B.Tech CSE at ITM Skills University (2023–2027), and technical leadership.
            </p>
            
            <div className={styles.previewGrid}>
              <div className={styles.previewGridItem}>
                <span className={styles.pgLabel}>Role</span>
                <span className={styles.pgValue}>Backend Engineer</span>
              </div>
              <div className={styles.previewGridItem}>
                <span className={styles.pgLabel}>Impact</span>
                <span className={styles.pgValue}>95% Cost Cut</span>
              </div>
              <div className={styles.previewGridItem}>
                <span className={styles.pgLabel}>Scale</span>
                <span className={styles.pgValue}>500+ APIs</span>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <Code size={48} className={styles.previewBigIcon} />
              <h3>projects/</h3>
              <span className={styles.previewTag}>SECURITY TOOLS</span>
            </div>
            <p className={styles.previewDesc}>
              Password Audit, Network Device Scanner, and File Signature Detector.
            </p>
          </div>
        );

      case "writeups":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <Shield size={48} className={styles.previewBigIcon} />
              <h3>writeups/</h3>
              <span className={styles.previewTag}>LAB RESEARCH</span>
            </div>
            <p className={styles.previewDesc}>
              SUID PATH hijack, Gratuitous ARP spoof detection, and JWT signature bypass.
            </p>
          </div>
        );

      case "experience":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <Briefcase size={48} className={styles.previewBigIcon} />
              <h3>experience/</h3>
              <span className={styles.previewTag}>PROFESSIONAL</span>
            </div>
            <p className={styles.previewDesc}>
              Backend Developer at LetsUpgrade maintaining 500+ REST APIs across 10M+ documents and leading technical hackathons.
            </p>
            <div className={styles.previewGroup}>
              <h4>HIGHLIGHTS</h4>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>Backend Engineer @ LetsUpgrade Edtech</span>
                <span className={styles.pgSub}>95% Compute Cost Cut</span>
              </div>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>Hackathon Lead &amp; Mentor</span>
                <span className={styles.pgSub}>₹6,85,000+ Prize Pool</span>
              </div>
            </div>
          </div>
        );

      case "learning":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <Compass size={48} className={styles.previewBigIcon} />
              <h3>learning/</h3>
              <span className={styles.previewTag}>ROADMAP</span>
            </div>
            <p className={styles.previewDesc}>
              Rigorous 10-phase roadmap: Foundations &rarr; Linux Internals &rarr; Networking &rarr; Web Security &rarr; Active Directory.
            </p>
            <div className={styles.previewGroup}>
              <h4>CURRENT PHASE: 5/10</h4>
              <div className={styles.previewRoadmap}>
                <div className={`${styles.roadmapPill} ${styles.roadmapPillDone}`}>1. Foundations</div>
                <div className={`${styles.roadmapPill} ${styles.roadmapPillDone}`}>2. Linux</div>
                <div className={`${styles.roadmapPill} ${styles.roadmapPillDone}`}>3. Networking</div>
                <div className={`${styles.roadmapPill} ${styles.roadmapPillActive}`}>5. Enumeration</div>
                <div className={`${styles.roadmapPill} ${styles.roadmapPillNext}`}>9. Active Directory</div>
              </div>
            </div>
          </div>
        );

      case "blogs":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <BookOpen size={48} className={styles.previewBigIcon} />
              <h3>blogs/</h3>
              <span className={styles.previewTag}>PUBLICATIONS</span>
            </div>
            <p className={styles.previewDesc}>
              Technical deep dives into Layer 2 protocol anomalies and high-scale backend architectural lessons.
            </p>
          </div>
        );

      case "contact":
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              <Mail size={48} className={styles.previewBigIcon} />
              <h3>contact/</h3>
              <span className={styles.previewTag}>CHANNELS</span>
            </div>
            <p className={styles.previewDesc}>
              Available for offensive security roles, bug bounty collaborations, and technical discussions.
            </p>
            <div className={styles.previewGroup}>
              <h4>REACH OUT</h4>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>{PROFILE_DATA.email}</span>
                <span className={styles.pgSub}>Primary Email</span>
              </div>
              <div className={styles.previewGroupItem}>
                <span className={styles.pgTitle}>github.com/husain</span>
                <span className={styles.pgSub}>Open Source</span>
              </div>
            </div>
          </div>
        );

      default:
        // Generic preview for files or directories not specifically matched above
        const isDir = selectedNode.type === "directory";
        return (
          <div className={styles.previewSection}>
            <div className={styles.previewHeaderCentered}>
              {isDir ? <Folder size={48} className={styles.previewBigIcon} /> : <FileText size={48} className={styles.previewBigIcon} />}
              <h3>{selectedNode.name}</h3>
              <span className={styles.previewTag}>{isDir ? "Folder" : (selectedNode as FSFile).fileType.toUpperCase()}</span>
            </div>
            {selectedNode.description && (
              <p className={styles.previewDesc}>{selectedNode.description}</p>
            )}
            
            <div className={styles.previewMetaTable}>
              <div className={styles.pmRow}>
                <span className={styles.pmLabel}>Size</span>
                <span className={styles.pmValue}>{isDir ? "--" : formatFileSize((selectedNode as FSFile).size)}</span>
              </div>
              <div className={styles.pmRow}>
                <span className={styles.pmLabel}>Modified</span>
                <span className={styles.pmValue}>{selectedNode.updatedAt}</span>
              </div>
              <div className={styles.pmRow}>
                <span className={styles.pmLabel}>Permissions</span>
                <span className={styles.pmValue}>{selectedNode.permissions}</span>
              </div>
              <div className={styles.pmRow}>
                <span className={styles.pmLabel}>Owner</span>
                <span className={styles.pmValue}>{selectedNode.owner}:{selectedNode.group}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.previewPanel}>
      <button 
        className={styles.previewCloseBtn} 
        onClick={() => setSelectedNode(null)} 
        title="Close Preview"
      >
        <X size={18} />
      </button>
      <div className={styles.previewContent}>
        {renderContent()}
      </div>
    </div>
  );
}
