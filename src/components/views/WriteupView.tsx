"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { WriteupItem } from "@/data/writeupsData";
import {
  FileText,
  Shield,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import styles from "./Views.module.css";

interface WriteupViewProps {
  writeup: WriteupItem;
}

export function WriteupView({ writeup }: WriteupViewProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic read time calculation
  const getDynamicReadTime = (content: string) => {
    if (!content) return writeup.readTime || "1 min read";
    const textOnly = content.replace(/[#*`_\[\]()]/g, '');
    const wordCount = textOnly.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  const dynamicReadTime = writeup.markdownContent ? getDynamicReadTime(writeup.markdownContent) : writeup.readTime;

  useEffect(() => {
    const scrollContainer = document.getElementById("modal-scroll-container");
    
    const handleScroll = () => {
      if (!scrollContainer) return;
      
      const totalScroll = scrollContainer.scrollTop;
      const windowHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      
      if (windowHeight === 0) {
        setScrollProgress(0);
        return;
      }
      
      const scroll = (totalScroll / windowHeight) * 100;
      setScrollProgress(scroll);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Trigger once on mount to handle initial state
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [writeup.id]); // re-run if writeup changes

  const handleCopyCommand = (cmd: string, stepNum: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedStep(stepNum);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return <span className="badge badge-learning">Easy</span>;
      case "Medium":
        return <span className="badge badge-blog">Medium</span>;
      case "Hard":
        return <span className="badge badge-writeup">Hard</span>;
      default:
        return <span className="badge badge-default">{diff}</span>;
    }
  };

  return (
    <>
      <div className={styles.readProgressBarContainer}>
        <div 
          className={styles.readProgressBar} 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={styles.viewContainer}>
        {/* Writeup Article Header */}
        <div className={styles.projectHeader}>
          <div className={styles.projectMetaTop}>
            <div className={styles.badgeRow}>
              <span className="badge badge-writeup">{writeup.categoryLabel}</span>
              {getDifficultyBadge(writeup.difficulty)}
              <span className={styles.locationBadge}>Target: {writeup.targetSystem}</span>
            </div>

            <div className={styles.metaRowRight}>
              <span className={styles.metaWithIcon}>
                <Calendar size={13} />
                {writeup.date}
              </span>
              <span className={styles.metaWithIcon}>
                <Clock size={13} />
                {dynamicReadTime}
              </span>
            </div>
          </div>

          <h1 className={styles.projectTitle}>{writeup.title}</h1>
          <p className={styles.projectTagline}>{writeup.summary}</p>

          {/* Tags */}
          <div className={styles.tagsFlex} style={{ marginTop: "12px" }}>
            {writeup.tags.map((tag, idx) => (
              <span key={idx} className={styles.securityTag} style={{ fontSize: '10px' }}>
                [{tag.toUpperCase()}]
              </span>
            ))}
          </div>
        </div>

      {/* Table of Contents */}
      {writeup.tableOfContents && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={16} className={styles.sectionIcon} />
            Table of Contents
          </h2>
          <div className={styles.tocGrid}>
            {writeup.tableOfContents.map((toc, idx) => (
              <div key={idx} className={styles.tocItem}>
                {toc}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {writeup.markdownContent ? (
        <div className={styles.sectionCard} style={{ border: 'none', background: 'transparent', padding: '0', marginTop: '24px' }}>
          <div className={styles.markdownBody}>
            <ReactMarkdown>{writeup.markdownContent}</ReactMarkdown>
          </div>
        </div>
      ) : writeup.content ? (
        <>
          {/* Objective & Background */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Shield size={16} className={styles.sectionIcon} />
              1. Objective & Scenario Background
            </h2>
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Assessment Goal</h3>
              <p className={styles.bodyParagraph}>{writeup.content.objective}</p>
            </div>
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Technical Background</h3>
              <p className={styles.bodyParagraphMuted}>{writeup.content.background}</p>
            </div>
          </div>

          {/* Reconnaissance & Enumeration */}
          <div className={styles.twoColumnGrid}>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <Terminal size={16} className={styles.sectionIcon} />
                2. Reconnaissance
              </h2>
              <p className={styles.bodyParagraph}>{writeup.content.reconnaissance}</p>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <FileText size={16} className={styles.sectionIcon} />
                3. Local Host Enumeration
              </h2>
              <p className={styles.bodyParagraph}>{writeup.content.enumeration}</p>
            </div>
          </div>

          {/* Vulnerability Root Cause Analysis */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <AlertTriangle size={16} className={styles.sectionIcon} />
              4. Vulnerability Analysis & Flaw Mechanism
            </h2>
            <p className={styles.bodyParagraph}>{writeup.content.vulnerabilityAnalysis}</p>
          </div>

          {/* Exploitation Walkthrough Steps */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Terminal size={16} className={styles.sectionIcon} />
              5. Proof of Concept & Step-by-Step Exploitation
            </h2>
            <div className={styles.exploitSteps}>
              {writeup.content.exploitationSteps.map((step) => (
                <div key={step.stepNumber} className={styles.exploitStepCard}>
                  <div className={styles.stepHeader}>
                    <span className={styles.stepBadge}>Step 0{step.stepNumber}</span>
                    <span className={styles.stepTitle}>{step.title}</span>
                  </div>
                  <p className={styles.stepExplanation}>{step.explanation}</p>

                  {step.command && (
                    <div className={styles.stepCodeWrapper}>
                      <div className={styles.stepCodeTop}>
                        <span className={styles.stepCommandLabel}>Terminal Command</span>
                        <button
                          onClick={() => handleCopyCommand(step.command!, step.stepNumber)}
                          className={styles.copyButton}
                        >
                          {copiedStep === step.stepNumber ? (
                            <>
                              <Check size={12} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className={styles.terminalCodeBlock}>
                        <code>{step.command}</code>
                      </pre>
                    </div>
                  )}

                  {step.output && (
                    <div className={styles.stepCodeWrapper} style={{ marginTop: "8px" }}>
                      <div className={styles.stepCodeTop}>
                        <span className={styles.stepCommandLabel}>Console Output</span>
                      </div>
                      <pre className={styles.terminalOutputBlock}>
                        <code>{step.output}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause & Mitigation */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <CheckCircle2 size={16} className={styles.sectionIcon} />
              6. Root Cause & Defensive Hardening
            </h2>
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Root Cause Summary</h3>
              <p className={styles.bodyParagraphMuted}>{writeup.content.rootCause}</p>
            </div>

            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Recommended Mitigations</h3>
              <ul className={styles.detailsList}>
                {writeup.content.mitigation.map((mit, idx) => (
                  <li key={idx}>{mit}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lessons Learned */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              <Shield size={16} className={styles.sectionIcon} />
              7. Key Takeaways
            </h2>
            <ul className={styles.detailsList}>
              {writeup.content.lessonsLearned.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
    </>
  );
}
