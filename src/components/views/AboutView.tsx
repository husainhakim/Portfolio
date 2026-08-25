"use client";

import React from "react";
import Image from "next/image";
import { PROFILE_DATA } from "@/data/profileData";
import {
  GraduationCap,
  Shield,
  Terminal,
  Target,
  ArrowRight,
  MapPin,
  Mail,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";
import styles from "./Views.module.css";

export function AboutView() {
  return (
    <div className={styles.viewContainer}>
      {/* Header Profile Section */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <Image
            src={PROFILE_DATA.avatarUrl}
            alt={PROFILE_DATA.name}
            width={120}
            height={120}
            className={styles.avatarImage}
            priority
          />
          <div className={styles.statusIndicator} title="Status: Active Lab / Research" />
        </div>

        <div className={styles.profileMeta}>
          <div className={styles.badgeRow}>
            <span className="badge badge-writeup">Cybersecurity</span>
            <span className="badge badge-default">Offensive Security</span>
            <span className={styles.locationBadge}>
              <MapPin size={12} />
              {PROFILE_DATA.location}
            </span>
          </div>

          <h1 className={styles.profileName}>{PROFILE_DATA.name}</h1>
          <p className={styles.profileTitle}>{PROFILE_DATA.title}</p>
          <p className={styles.profileStatus}>{PROFILE_DATA.statusLine}</p>

          <div className={styles.quickLinks}>
            <a
              href={`mailto:${PROFILE_DATA.email}`}
              className={styles.iconLink}
              title="Send Email"
            >
              <Mail size={14} />
              <span>Email</span>
            </a>
            <a
              href={PROFILE_DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              title="GitHub Profile"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <a
              href={PROFILE_DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              title="LinkedIn Profile"
            >
              <LinkedinIcon size={14} />
              <span>LinkedIn</span>
            </a>
            <a
              href={PROFILE_DATA.x}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              title="X Profile"
            >
              <TwitterIcon size={14} />
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Shield size={16} className={styles.sectionIcon} />
          Profile Summary
        </h2>
        <div className={styles.textBlock} style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <p>I’m a Computer Science student currently building my way into offensive security and ethical hacking.</p>
          <p>My interest in cybersecurity started with wanting to understand what actually happens underneath the things I use every day — how computers communicate, how operating systems work, what happens behind a command in the terminal, and where systems can go wrong.</p>
          <p>That curiosity eventually led me toward ethical hacking.</p>
        </div>
      </div>

      {/* Education Timeline */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <GraduationCap size={16} className={styles.sectionIcon} />
          Academic Background
        </h2>
        <div className={styles.timeline}>
          {PROFILE_DATA.education.map((edu, idx) => (
            <div key={idx} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.institutionName}>{edu.institution}</h3>
                  <span className={styles.periodBadge}>{edu.period}</span>
                </div>
                <div className={styles.degreeTitle}>{edu.degree}</div>
                {edu.details && edu.details.length > 0 && (
                  <ul className={styles.detailsList}>
                    {edu.details.map((detail, dIdx) => (
                      <li key={dIdx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Target size={16} className={styles.sectionIcon} />
          Right Now
        </h2>
        <div className={styles.textBlock} style={{ display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <p>Right now, I'm building my foundation around:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Linux and the command line</li>
            <li>Networking and how systems communicate</li>
            <li>Python and scripting</li>
            <li>Reconnaissance and enumeration</li>
            <li>Web security</li>
            <li>Vulnerability discovery</li>
            <li>Ethical hacking methodologies</li>
            <li>Building small security tools</li>
            <li>Practicing in labs and intentionally vulnerable environments</li>
          </ul>
          <p style={{ marginTop: '8px' }}>I'm also documenting what I learn through projects, writeups, and technical blogs.</p>
          <p>The goal isn't just to collect tools and memorize commands.</p>
          <p>I want to understand why something works.</p>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Terminal size={16} className={styles.sectionIcon} />
          What's Next
        </h2>
        <div className={styles.textBlock} style={{ display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <p>My immediate goal is simple:</p>
          <p><strong>Get really good at the fundamentals.</strong></p>
          <p>I want to keep progressing through networking, Linux, web security, reconnaissance, exploitation, and privilege escalation, while turning what I learn into actual projects and writeups.</p>
          <p>Eventually, I want to explore areas like Active Directory, red teaming, vulnerability research, and more advanced offensive security.</p>
          <p>I don't have my entire career mapped out yet, and I don't think I need to.</p>
          <p>For now, I want to keep learning, keep breaking things in environments where I'm allowed to, understand why they broke, and get better at putting them back together.</p>
          <p>That's the direction I'm heading in.</p>
        </div>
      </div>


    </div>
  );
}
