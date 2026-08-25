"use client";

import React, { useState } from "react";
import { PROFILE_DATA } from "@/data/profileData";
import {
  Mail,
  Globe,
  Copy,
  Check,
  Send,
  ExternalLink,
  Shield,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";
import styles from "./Views.module.css";

export function ContactView() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.projectHeader}>
        <div className={styles.badgeRow}>
          <span className="badge badge-contact">Direct Channels</span>
          <span className="badge badge-default">Status: Open to Inquiries</span>
        </div>
        <h1 className={styles.projectTitle}>Contact & Technical Inquiries</h1>
        <p className={styles.projectTagline}>
          Reach out for offensive security discussions, collaborative lab research, software engineering opportunities, or technical inquiries.
        </p>
      </div>

      <div className={styles.contactGrid}>
        {/* Email Card */}
        <div className={styles.contactCard}>
          <div className={styles.contactCardIcon}>
            <Mail size={22} />
          </div>
          <div className={styles.contactCardBody}>
            <span className={styles.contactCardLabel}>Primary Direct Email</span>
            <div className={styles.contactCardValue}>{PROFILE_DATA.email}</div>
            <div className={styles.contactCardActions}>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className={styles.contactActionPrimary}
              >
                <Send size={13} />
                <span>Send Email</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className={styles.contactActionSecondary}
                title="Copy Email to Clipboard"
              >
                {copiedEmail ? (
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
          </div>
        </div>

        {/* GitHub Card */}
        <div className={styles.contactCard}>
          <div className={styles.contactCardIcon}>
            <GithubIcon size={22} />
          </div>
          <div className={styles.contactCardBody}>
            <span className={styles.contactCardLabel}>Code & Research Repositories</span>
            <div className={styles.contactCardValue}>github.com/husainhakim</div>
            <div className={styles.contactCardActions}>
              <a
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactActionPrimary}
              >
                <ExternalLink size={13} />
                <span>Open GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div className={styles.contactCard}>
          <div className={styles.contactCardIcon}>
            <LinkedinIcon size={22} />
          </div>
          <div className={styles.contactCardBody}>
            <span className={styles.contactCardLabel}>Professional Network</span>
            <div className={styles.contactCardValue}>linkedin.com/in/husainhakim</div>
            <div className={styles.contactCardActions}>
              <a
                href={PROFILE_DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactActionPrimary}
              >
                <ExternalLink size={13} />
                <span>Open LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* X (Twitter) Card */}
        <div className={styles.contactCard}>
          <div className={styles.contactCardIcon}>
            <TwitterIcon size={22} />
          </div>
          <div className={styles.contactCardBody}>
            <span className={styles.contactCardLabel}>X (Twitter)</span>
            <div className={styles.contactCardValue}>x.com/Husain533</div>
            <div className={styles.contactCardActions}>
              <a
                href={PROFILE_DATA.x}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactActionPrimary}
              >
                <ExternalLink size={13} />
                <span>Open X Profile</span>
              </a>
            </div>
          </div>
        </div>

        {/* Portfolio Live Domain */}
        <div className={styles.contactCard}>
          <div className={styles.contactCardIcon}>
            <Globe size={22} />
          </div>
          <div className={styles.contactCardBody}>
            <span className={styles.contactCardLabel}>Live Portfolio Workspace</span>
            <div className={styles.contactCardValue}>{PROFILE_DATA.portfolio}</div>
            <div className={styles.contactCardActions}>
              <a
                href={PROFILE_DATA.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactActionSecondary}
              >
                <ExternalLink size={13} />
                <span>Visit Domain</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Protocol Note */}
      <div className={styles.sectionCard} style={{ marginTop: "24px" }}>
        <h2 className={styles.sectionTitle}>
          <Shield size={16} className={styles.sectionIcon} />
          Responsible Communication & Ethical Conduct
        </h2>
        <p className={styles.bodyParagraphMuted}>
          All research and code samples shared across this workspace are conducted in authorized, controlled lab environments or simulated vulnerable systems for education and defensive improvement.
        </p>
      </div>
    </div>
  );
}
