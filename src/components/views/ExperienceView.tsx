"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { EXPERIENCE_DATA, ContractProof } from "@/data/experienceData";
import {
  Briefcase,
  Calendar,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  Server,
  Layers,
  CheckCircle2,
  Download,
  ExternalLink,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import styles from "./Views.module.css";

export function ExperienceView() {
  const [activeProof, setActiveProof] = useState<ContractProof | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProof) return;
      if (e.key === "Escape") {
        setActiveProof(null);
        setZoomLevel(1);
      } else if (e.key === "ArrowLeft") {
        handlePrevProof();
      } else if (e.key === "ArrowRight") {
        handleNextProof();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProof]);

  const allContracts = EXPERIENCE_DATA.flatMap((exp) => exp.contracts || []);

  const handleOpenProof = (proof: ContractProof) => {
    setActiveProof(proof);
    setZoomLevel(1);
  };

  const handleNextProof = () => {
    if (!activeProof || allContracts.length === 0) return;
    const currentIndex = allContracts.findIndex((c) => c.id === activeProof.id);
    const nextIndex = (currentIndex + 1) % allContracts.length;
    setActiveProof(allContracts[nextIndex]);
    setZoomLevel(1);
  };

  const handlePrevProof = () => {
    if (!activeProof || allContracts.length === 0) return;
    const currentIndex = allContracts.findIndex((c) => c.id === activeProof.id);
    const prevIndex = (currentIndex - 1 + allContracts.length) % allContracts.length;
    setActiveProof(allContracts[prevIndex]);
    setZoomLevel(1);
  };

  return (
    <div className={styles.viewContainer}>
      {/* Header */}
      <div className={styles.projectHeader}>
        <div className={styles.badgeRow}>
          <span className="badge badge-experience">Professional Background</span>
          <span className="badge badge-default">Backend &amp; Distributed Systems</span>
          <span className="badge badge-skills">10 Months Continuous Tenancy</span>
        </div>
        <h1 className={styles.projectTitle}>Experience &amp; Engineering Impact</h1>
        <p className={styles.projectTagline}>
          Proven record architecting high-scale backend microservices, event-driven worker architectures, and reducing cloud infrastructure compute costs across three consecutive production contracts.
        </p>
      </div>

      <div className={styles.experienceList}>
        {EXPERIENCE_DATA.map((exp) => (
          <div key={exp.id} className={styles.sectionCard}>
            {/* Top metadata */}
            <div className={styles.experienceTopRow}>
              <div>
                <div className={styles.badgeRow}>
                  <span className="badge badge-experience">{exp.type}</span>
                  <span className={styles.metaWithIcon}>
                    <Calendar size={12} />
                    {exp.period} ({exp.duration})
                  </span>
                  <span className={styles.metaWithIcon}>
                    <MapPin size={12} />
                    {exp.location}
                  </span>
                </div>
                <h2 className={styles.experienceRole}>{exp.role}</h2>
                <div className={styles.experienceOrg}>{exp.organization}</div>
              </div>
            </div>

            <p className={styles.bodyParagraph}>{exp.summary}</p>

            {/* 10-Month Timeline & Contract Progression */}
            {exp.contracts && exp.contracts.length > 0 && (
              <div className={styles.contractsSectionWrapper}>
                <div className={styles.contractsHeaderRow}>
                  <div className={styles.contractsHeaderLeft}>
                    <div className={styles.contractsTitle}>
                      <ShieldCheck size={16} color="#10b981" />
                      <span>Verified Tenancy &amp; Contract Milestones (10 Months Total)</span>
                    </div>
                    <span className={styles.contractsSubtitle}>
                      Continuous 10-month engagement at LetsUpgrade spanning 3 consecutive terms with verified documentation
                    </span>
                  </div>
                  <div className={styles.contractsBadgePill}>
                    <CheckCircle2 size={13} />
                    <span>3 / 3 Terms Documented &amp; Verified</span>
                  </div>
                </div>

                {/* Visual Contract Progression Strip */}
                <div className={styles.contractTimelineBar}>
                  {exp.contracts.map((contract, cIdx) => (
                    <div key={contract.id} className={styles.contractTimelineStep}>
                      <span className={styles.timelineStepIndex}>Contract Term 0{cIdx + 1}</span>
                      <span className={styles.timelineStepDates}>{contract.period}</span>
                      <span className={styles.timelineStepDuration}>Duration: {contract.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Verified Proofs Gallery Cards */}
                <div className={styles.proofCardsGrid}>
                  {exp.contracts.map((contract) => (
                    <div key={contract.id} className={styles.proofCard}>
                      {/* Document Thumbnail with Preview & Zoom Overlay */}
                      <div
                        className={styles.proofThumbnailContainer}
                        onClick={() => handleOpenProof(contract)}
                        title={`Click to inspect proof document for ${contract.termTitle}`}
                      >
                        <Image
                          src={contract.fileUrl}
                          alt={`Proof of Work Certificate for ${contract.termTitle} - LetsUpgrade`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={styles.proofThumbnailImg}
                          priority={contract.termNumber === 1}
                        />
                        <div className={styles.proofStatusBadge}>
                          <CheckCircle2 size={11} />
                          <span>Verified Proof</span>
                        </div>
                        <div className={styles.proofHoverOverlay}>
                          <Maximize2 size={22} />
                          <span>Inspect High-Res Proof</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className={styles.proofCardBody}>
                        <span className={styles.proofTermBadge}>{contract.badge}</span>
                        <h4 className={styles.proofTermTitle}>{contract.termTitle}</h4>
                        <div className={styles.proofDateRow}>
                          <Calendar size={12} />
                          <span>{contract.period} ({contract.duration})</span>
                        </div>
                        <p className={styles.proofSummaryText}>{contract.summary}</p>

                        <div className={styles.proofFileMetaRow}>
                          <span>{contract.fileName}</span>
                          <span>{contract.fileSize}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.proofCardActionsWrapper}>
                          <button
                            type="button"
                            onClick={() => handleOpenProof(contract)}
                            className={`${styles.proofActionBtn} ${styles.proofActionBtnPrimary}`}
                            title="Inspect high-resolution proof document"
                          >
                            <Maximize2 size={13} />
                            <span>View Full Proof</span>
                          </button>
                          <div className={styles.proofCardSubActions}>
                            <a
                              href={contract.fileUrl}
                              download={contract.fileName}
                              className={styles.proofActionBtn}
                              title="Download proof image"
                            >
                              <Download size={13} />
                              <span>Download</span>
                            </a>
                            <a
                              href={contract.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.proofActionBtn}
                              title="Open original image in new tab"
                            >
                              <ExternalLink size={13} />
                              <span>Open Tab</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Metrics Banner */}
            <div className={styles.metricsGrid} style={{ marginTop: "20px" }}>
              {exp.technicalImpact.map((metric, mIdx) => (
                <div key={mIdx} className={styles.metricCard}>
                  <div className={styles.metricValue}>{metric.metric}</div>
                  <div className={styles.metricDesc}>{metric.description}</div>
                </div>
              ))}
            </div>

            {/* Key Responsibilities */}
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Core Engineering Contributions:</h3>
              <ul className={styles.detailsList}>
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Key Takeaways */}
            {exp.keyTakeaways && exp.keyTakeaways.length > 0 && (
              <div className={styles.subSection}>
                <h3 className={styles.subHeading}>Key Engineering Learnings:</h3>
                <ul className={styles.detailsList}>
                  {exp.keyTakeaways.map((takeaway, kIdx) => (
                    <li key={kIdx}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            <div className={styles.subSection}>
              <h3 className={styles.subHeading}>Technologies Utilized:</h3>
              <div className={styles.tagsFlex}>
                {exp.technologies.map((t, tIdx) => (
                  <span key={tIdx} className={styles.techTag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High-Resolution Document Lightbox Modal */}
      {activeProof && (
        <div
          className={styles.proofLightboxOverlay}
          onClick={() => {
            setActiveProof(null);
            setZoomLevel(1);
          }}
        >
          <div
            className={styles.proofLightboxContainer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Proof Document: ${activeProof.termTitle}`}
          >
            {/* Header */}
            <div className={styles.proofLightboxHeader}>
              <div className={styles.proofLightboxTitleGroup}>
                <FileCheck size={16} color="#10b981" />
                <span className={styles.proofLightboxTitle}>
                  {activeProof.termTitle} ({activeProof.period})
                </span>
              </div>
              <div className={styles.proofLightboxControls}>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                  className={styles.proofLightboxBtn}
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={13} />
                  <span>Zoom -</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                  className={styles.proofLightboxBtn}
                  title="Zoom In (+)"
                >
                  <ZoomIn size={13} />
                  <span>Zoom +</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className={styles.proofLightboxBtn}
                  title="Reset Zoom"
                >
                  <span>Reset</span>
                </button>
                <a
                  href={activeProof.fileUrl}
                  download={activeProof.fileName}
                  className={styles.proofLightboxBtn}
                  title="Download Certificate"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
                <a
                  href={activeProof.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.proofLightboxBtn}
                  title="Open Original Image in New Tab"
                >
                  <ExternalLink size={13} />
                  <span>Original</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setActiveProof(null);
                    setZoomLevel(1);
                  }}
                  className={styles.proofLightboxCloseBtn}
                  title="Close (ESC)"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image Preview Body */}
            <div className={styles.proofLightboxBody}>
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: "transform 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image
                  src={activeProof.fileUrl}
                  alt={`Proof of Work Document: ${activeProof.termTitle}`}
                  width={800}
                  height={1100}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "65vh",
                    objectFit: "contain",
                    borderRadius: "2px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
                  }}
                  priority
                />
              </div>
            </div>

            {/* Footer Navigation */}
            <div className={styles.proofLightboxFooter}>
              <span>
                Document: {activeProof.fileName} • {activeProof.fileSize} • Verified Authentic
              </span>
              <div className={styles.proofLightboxNav}>
                <button
                  type="button"
                  onClick={handlePrevProof}
                  className={styles.proofLightboxBtn}
                  title="Previous Contract Proof (Left Arrow)"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextProof}
                  className={styles.proofLightboxBtn}
                  title="Next Contract Proof (Right Arrow)"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

