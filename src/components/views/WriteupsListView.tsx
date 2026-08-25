"use client";

import React from "react";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import styles from "./Views.module.css";
import { useFilesystem } from "@/context/FilesystemContext";

export function WriteupsListView() {
  const { navigate } = useFilesystem();

  return (
    <div className={styles.viewContainer}>
      <div className={styles.projectHeader}>
        <div className={styles.badgeRow}>
          <span className="badge badge-writeup">Technical Writeups</span>
          <span className="badge badge-default">Platform: Local</span>
        </div>
        <h1 className={styles.projectTitle}>Security Research & Writeups</h1>
        <p className={styles.projectTagline}>
          Detailed postmortems, CTF walkthroughs, and security tooling technical deep dives. Click on any writeup below to read it directly in this workspace.
        </p>
      </div>

      <div className={styles.blogsGrid}>
        {WRITEUPS_DATA.map((writeup) => (
          <div 
            key={writeup.id} 
            className={styles.blogCard} 
            onClick={() => navigate(`/home/husain/writeups/${writeup.slug}.md`)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.blogCardHeader}>
              <div className={styles.badgeRow}>
                <span className="badge badge-writeup">{writeup.categoryLabel}</span>
                <span className={styles.metaWithIcon}>
                  <Calendar size={12} />
                  {writeup.date}
                </span>
                <span className={styles.metaWithIcon}>
                  <Clock size={12} />
                  {writeup.readTime}
                </span>
              </div>
            </div>

            <h2 className={styles.blogCardTitle}>{writeup.title}</h2>
            <p className={styles.blogCardSummary}>{writeup.summary}</p>

            <div className={styles.tagsFlex} style={{ marginTop: "12px" }}>
              {writeup.tags.map((t, idx) => (
                <span key={idx} className={styles.securityTag} style={{ fontSize: '10px' }}>
                  [{t.toUpperCase()}]
                </span>
              ))}
            </div>
            
            <div className={styles.blogCardFooter} style={{ borderTop: "1px dashed var(--border-color)", marginTop: "16px", paddingTop: "12px" }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: '500' }}>
                 <span>Read Writeup</span>
                 <ArrowRight size={14} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
