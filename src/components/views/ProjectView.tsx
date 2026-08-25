"use client";

import React, { useState } from "react";
import { ProjectItem } from "@/data/projectsData";
import {
  Code,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Check,
  Copy,
  Lightbulb,
  Compass,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useFilesystem } from "@/context/FilesystemContext";
import styles from "./Views.module.css";

interface ProjectViewProps {
  project: ProjectItem;
}

export function ProjectView({ project }: ProjectViewProps) {
  const { navigate } = useFilesystem();
  const [copied, setCopied] = useState(false);

  const handleCopyCli = () => {
    if (project.cliUsageExample) {
      navigator.clipboard.writeText(project.cliUsageExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.viewContainer}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.projectMetaTop}>
          <div className={styles.badgeRow}>
            <span className="badge badge-project">{project.category}</span>
            <span className="badge badge-default">Status: {project.status}</span>
            <span className={styles.monoTag}>{project.date}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryActionButton}
              >
                <GithubIcon size={15} />
                <span>View on GitHub</span>
                <ExternalLink size={13} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryActionButton}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <ExternalLink size={15} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        <h1 className={styles.projectTitle}>{project.name}</h1>
        <p className={styles.projectTagline}>{project.tagline}</p>
      </div>

      {/* Summary & Problem Statement */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Shield size={16} className={styles.sectionIcon} />
          Project Overview & Threat Context
        </h2>
        <p className={styles.bodyParagraph}>{project.summary}</p>
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>Problem Statement & Objective</h3>
          <p className={styles.bodyParagraphMuted}>{project.problemStatement}</p>
        </div>
      </div>

      {/* Security Concepts & Tech Stack */}
      <div className={styles.twoColumnGrid}>
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Shield size={16} className={styles.sectionIcon} />
            Security Concepts
          </h2>
          <div className={styles.tagsFlex}>
            {project.securityConcepts.map((concept, idx) => (
              <span key={idx} className={styles.securityTag}>
                {concept}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Code size={16} className={styles.sectionIcon} />
            Technologies & Tools
          </h2>
          <div className={styles.tagsFlex}>
            {project.technologies.map((tech, idx) => (
              <span key={idx} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture & Implementation Details */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Layers size={16} className={styles.sectionIcon} />
          Technical Architecture & Mechanics
        </h2>
        <ul className={styles.architectureList}>
          {project.architectureDetails.map((detail, idx) => (
            <li key={idx} className={styles.architectureItem}>
              <span className={styles.archNumber}>0{idx + 1}</span>
              <span className={styles.archText}>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Features */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Layers size={16} className={styles.sectionIcon} />
          Key Capabilities
        </h2>
        <ul className={styles.detailsList}>
          {project.keyFeatures.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* CLI Usage Demonstration */}
      {project.cliUsageExample && (
        <div className={styles.sectionCard}>
          <div className={styles.codeBlockHeader}>
            <h2 className={styles.sectionTitle}>
              <Terminal size={16} className={styles.sectionIcon} />
              CLI Execution & Output Demonstration
            </h2>
            <button
              onClick={handleCopyCli}
              className={styles.copyButton}
              title="Copy terminal command"
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className={styles.terminalCodeBlock}>
            <code>{project.cliUsageExample}</code>
          </pre>
        </div>
      )}

      {/* Lessons Learned & Future Work */}
      <div className={styles.twoColumnGrid}>
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={16} className={styles.sectionIcon} />
            Lessons Learned
          </h2>
          <ul className={styles.detailsList}>
            {project.lessonsLearned.map((lesson, idx) => (
              <li key={idx}>{lesson}</li>
            ))}
          </ul>
        </div>

        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            <Compass size={16} className={styles.sectionIcon} />
            Future Improvements
          </h2>
          <ul className={styles.detailsList}>
            {project.futureRoadmap.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* Deep Dive CTA */}
      {project.writeupPath && (
        <div className={styles.authorBlock}>
          <div className={styles.authorInfo}>
            <span className={styles.authorRole}>Technical Details</span>
            <span className={styles.authorName}>Want to see how this works under the hood?</span>
          </div>
          <button 
            className={styles.primaryActionButton}
            onClick={() => navigate(project.writeupPath as string)}
          >
            <BookOpen size={14} />
            <span>Read Deep Dive</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
