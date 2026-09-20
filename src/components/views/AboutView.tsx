"use client";

import React from "react";
import Image from "next/image";
import { PROFILE_DATA } from "@/data/profileData";
import {
  GraduationCap,
  Shield,
  Terminal,
  Target,
  MapPin,
  Mail,
  Layers,
  Cpu,
  RefreshCw,
  Compass,
  Crosshair,
  ArrowRight,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, MediumIcon, TwitterIcon } from "@/components/ui/Icons";
import styles from "./Views.module.css";

export function AboutView() {
  return (
    <div className={styles.viewContainer}>
      {/* Header Profile Section */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <Image
            src={PROFILE_DATA.avatarUrl}
            alt="Husain Hakim - Cybersecurity Student & Offensive/Defensive Security Avatar"
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
            <span className="badge badge-default">Offensive & Defensive Security</span>
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
              href={PROFILE_DATA.medium}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              title="Medium Profile"
            >
              <MediumIcon size={14} />
              <span>Medium</span>
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

      {/* Profile Summary Narrative */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Shield size={16} className={styles.sectionIcon} />
          Profile Summary
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            I am a Computer Science student currently building my foundation in cybersecurity, focusing on understanding how systems operate underneath their interfaces and why they fail under unexpected conditions.
          </p>
          <p>
            Long before I was analyzing network packets or auditing source code, my academic path started in the PCMB stream. At the time, studying physics, chemistry, mathematics, and biology felt like an intensive exercise in natural sciences, but looking back, it fundamentally shaped how I analyze problems. It gave me a systems-level way of thinking: observing interconnected components, tracking how small state changes propagate through an entire environment, and looking for root causes rather than treating superficial symptoms.
          </p>
          <p>
            My transition into computing grew out of raw curiosity. Growing up, I was fascinated by aviation and once imagined a future where I would become a pilot, drawn to the intricate cockpits, navigation systems, and disciplined procedures required to keep complex machinery operating smoothly. While my trajectory eventually shifted from navigating airspace to exploring computer networks, that same appreciation for mission-critical systems and technical architecture carried straight into computing.
          </p>
          <p>
            When I first started writing code, my early programming days were spent grappling with C++, where figuring out standard input, output, and memory allocation felt like solving an intricate puzzle. That rush of making something work from scratch (understanding what was actually happening beneath the code, how variables sit in memory, and how compilers translate instructions) is what originally got me hooked on technology.
          </p>
          <p>
            Naturally, that curiosity didn&apos;t stop at building software; it drove me to ask where the boundaries break. How do computers talk to each other across an untrusted network? What happens under the hood when a single terminal command is executed? What assumptions do developers make that leave doors open for exploitation? Those questions led me directly into cybersecurity.
          </p>
        </div>
      </div>

      {/* Academic Background */}
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

      {/* What I Actually Work With */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Cpu size={16} className={styles.sectionIcon} />
          What I Actually Work With
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "14px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            To be completely clear: I do not consider myself an expert in these domains. Cybersecurity is vast, and these are the specific areas where I am actively investing time, getting my hands dirty, and building genuine technical depth:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>Linux &amp; the Command Line:</strong> Working in Linux daily as my primary environment: navigating filesystems, inspecting process trees, understanding SUID permissions, writing Bash automation scripts, and auditing system logs.
            </li>
            <li>
              <strong>Networking &amp; Protocol Analysis:</strong> Studying Layer 2 and Layer 3 traffic mechanics, TCP handshakes, ARP cache behavior, DNS queries, mDNS multicast resolution, and packet inspection using tools like Wireshark and tcpdump.
            </li>
            <li>
              <strong>Python &amp; Security Scripting:</strong> Developing custom network probes, protocol parsers, automated reconnaissance utilities, and forensic tools from scratch using standard libraries and asynchronous concurrency.
            </li>
            <li>
              <strong>Reconnaissance &amp; Enumeration:</strong> Mapping out attack surfaces through active and passive asset discovery, port auditing, service fingerprinting, and sub-domain discovery.
            </li>
            <li>
              <strong>Web Application Security:</strong> Analyzing web traffic, investigating authentication workflows, testing access control boundaries (IDOR), and understanding common vulnerability classes like SQL injection and cross-site scripting.
            </li>
            <li>
              <strong>Vulnerability Discovery &amp; Ethical Hacking:</strong> Following structured testing methodologies to identify logic flaws and misconfigurations within authorized environments.
            </li>
            <li>
              <strong>Intrusion Detection &amp; Telemetry:</strong> Ingesting web and system logs, aggregating connection metrics across sliding time windows, and writing logic to flag suspicious brute-force or injection activity.
            </li>
            <li>
              <strong>Security Tooling &amp; Developer Utilities:</strong> Writing lightweight, local-first CLI tools that avoid heavy external dependencies, respect user privacy, and run deterministically.
            </li>
            <li>
              <strong>Backend Systems &amp; APIs:</strong> Building and inspecting REST APIs using Node.js, Express, and FastAPI, paying close attention to input sanitization, database query parameterization, and secure state handling.
            </li>
            <li>
              <strong>Security Labs &amp; Vulnerable Sandboxes:</strong> Practicing regularly across platforms like TryHackMe and PortSwigger Web Security Academy, as well as running custom local Docker containers to experiment safely.
            </li>
          </ul>
        </div>
      </div>

      {/* Projects & Experiments */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Layers size={16} className={styles.sectionIcon} />
          Projects &amp; Experiments
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            A massive part of my learning happens through building. Reading documentation and theory is essential, but until I actually write code to interact with a protocol or parse a raw binary format, the knowledge doesn&apos;t fully click.
          </p>
          <p>
            One project that played a pivotal role in shaping my perspective was building a multi-tier <strong>Intrusion Detection System &amp; Honeypot</strong>. I wanted to see how web applications look to both an attacker attempting an intrusion and a defender trying to detect it in real time. The architecture paired a deliberately flawed honeypot portal (using raw SQL string concatenation, unescaped inputs, and weak credentials) with a hardened production server implementing parameterized queries and password hashing.
          </p>
          <p>
            Between them ran a real-time log-monitoring IDS engine that continuously tailed access logs, maintained sliding time windows per session ID, and raised high-severity alerts when brute-force thresholds were exceeded. Building the accompanying attack testing scripts (especially comparing an aggressive brute-force mode against a delayed, stealth mode designed to evade detection thresholds) was eye-opening. It pushed me heavily toward the defensive side of security because it proved that effective defense requires understanding the exact operational signatures an attack leaves behind.
          </p>
          <p>
            Other projects have focused on different layers of the stack:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>CYBER // SONAR (Network Scanner):</strong> A zero-dependency tactical intranet discovery utility in Python. It sweeps local subnets using parallel socket sweeps, parses kernel ARP tables to capture authentic physical MAC addresses, resolves vendor identities using offline IEEE OUI databases, and resolves hostnames via mDNS/Bonjour, visualizing the local topology through a 60 FPS HTML5 Canvas radar.
            </li>
            <li>
              <strong>File Signature Identifier:</strong> A forensics tool designed to combat file extension spoofing. It ignores superficial file extensions, reads raw binary headers (magic numbers), decodes the first 256 bytes into a formatted hex dump, and programmatically flags deceptive files.
            </li>
            <li>
              <strong>PassGuard:</strong> A privacy-first password analyzer that calculates Shannon entropy and performs k-Anonymity breach audits against known compromised hash databases entirely within the browser using the Web Crypto API.
            </li>
            <li>
              <strong>RepoChecker:</strong> A local-only, read-only CLI tool that inspects Git working trees for accidentally committed API keys, secrets, and broken <code>.gitignore</code> rules before code is pushed to remote repositories.
            </li>
            <li>
              <strong>QuickRef:</strong> An offline, terminal-first command reference tool built in standard-library Python with custom ANSI escape formatting, eliminating browser context-switching while working in the terminal.
            </li>
          </ul>
        </div>
      </div>

      {/* How I Learn */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <RefreshCw size={16} className={styles.sectionIcon} />
          How I Learn
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            My learning process revolves around a practical, four-stage feedback loop: <strong>LEARN → BUILD → TEST → DOCUMENT</strong>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p>
              <strong>1. LEARN (Read the Fundamentals):</strong> I start by understanding the underlying concepts, reading RFCs, Linux man pages, protocol specifications, and technical documentation rather than skipping straight to high-level automation tools.
            </p>
            <p>
              <strong>2. BUILD (Write Tools from Scratch):</strong> Once I understand the theory, I try to write a small utility or script to interact with it directly in Python, Bash, or standard libraries. Writing zero-dependency code forces me to handle data streams, parse packets, and deal with edge cases that frameworks usually hide.
            </p>
            <p>
              <strong>3. TEST (Break Things in Authorized Labs):</strong> I take that knowledge into isolated virtual machines, local Docker containers, or authorized lab environments. Running commands myself and seeing what breaks is essential. Failed scripts, syntax errors, and misconfigured test environments are not roadblocks; they are where the real learning happens.
            </p>
            <p>
              <strong>4. DOCUMENT (Analyze &amp; Write Postmortems):</strong> Finally, I write down what I learned in detailed writeups, project postmortems, or technical blogs. Explaining the root cause of a vulnerability, the exploitation steps, and the mitigation strategy proves whether I genuinely understand a concept or just memorized a command.
            </p>
          </div>
        </div>
      </div>

      {/* What I'm Currently Exploring */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Compass size={16} className={styles.sectionIcon} />
          What I&apos;m Currently Exploring
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "14px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            Here is a snapshot of the specific topics and concepts currently sitting on my desk for active study:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <strong>Network Protocols:</strong> Deep-diving into TCP/IP state machines, handshake sequences, DNS query mechanics, and HTTP/HTTPS header analysis.
            </li>
            <li>
              <strong>Linux Internals &amp; Privilege Escalation:</strong> Auditing file permissions, SUID/SGID binaries, Linux capabilities, cron job configurations, and path hijacking vectors in controlled lab machines.
            </li>
            <li>
              <strong>Reconnaissance &amp; Enumeration:</strong> Refining structured discovery workflows, service fingerprinting, and asset mapping.
            </li>
            <li>
              <strong>Web Vulnerabilities:</strong> Analyzing OWASP Top 10 vulnerabilities, authentication bypasses, broken object-level authorization (IDOR), and parameter tampering.
            </li>
            <li>
              <strong>Network Traffic Analysis:</strong> Capturing and inspecting live packet captures with Wireshark and tcpdump to understand what various application payloads look like over the wire.
            </li>
            <li>
              <strong>Intrusion Detection Concepts:</strong> Studying sliding-window thresholding, log aggregation, and the balance between alert sensitivity and false-positive rates.
            </li>
            <li>
              <strong>Python Security Automation:</strong> Writing modular scripts to automate asset scanning, header validation, and local security audits.
            </li>
            <li>
              <strong>Attacker Techniques vs. Defensive Indicators:</strong> Comparing offensive execution steps with the corresponding forensic traces left in syslog, auth.log, and web server logs.
            </li>
          </ul>
        </div>
      </div>

      {/* Why Purple Teaming Interests Me */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Crosshair size={16} className={styles.sectionIcon} />
          Why Purple Teaming Interests Me
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            Offensive security teaches how systems can be probed and exploited, while defensive security teaches how those attacks can be recognized, investigated, and mitigated. I am most fascinated by the space where both meet.
          </p>
          <p>
            To me, the core appeal of purple teaming is simple:
          </p>
          <div className={styles.quoteBlock}>
            I don&apos;t just want to know how to perform an attack. I also want to understand what that attack looks like from the other side.
          </div>
          <p>
            When an attacker runs an automated directory scan, what does that look like in web server access logs? When an exploitation payload touches an endpoint, what events are recorded in system audit logs? When an attacker introduces deliberate delays to slip past rate limits, how do detection rules need to evolve to catch that behavior?
          </p>
          <p>
            Exploring adversary simulation, detection engineering, network analysis, and security monitoring allows offense to sharpen defense, while defense provides the realistic constraints that make offensive testing meaningful. While I am not claiming to work professionally as a purple teamer today, this collaborative, holistic approach is the clear direction my learning is heading toward.
          </p>
        </div>
      </div>

      {/* What's Next & Grounded Closing */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Target size={16} className={styles.sectionIcon} />
          What&apos;s Next
        </h2>
        <div className={styles.textBlock} style={{ display: "flex", flexDirection: "column", gap: "16px", lineHeight: "1.65", color: "var(--text-secondary)" }}>
          <p>
            My immediate goal is straightforward: <strong>get really good at the fundamentals.</strong>
          </p>
          <p>
            Cybersecurity is broad, and I don&apos;t have my entire career mapped out to the final milestone, nor do I think I need to right now. I know the direction I am heading in, and I want to spend my university years building real depth across networking, Linux, web security, and defensive telemetry before deciding where to specialize.
          </p>
          <p>
            As I progress, I want to expand my lab work into more complex environments, exploring Active Directory, Kerberos authentication, domain privilege escalation, red and blue teaming workflows, adversary simulation, vulnerability research, and detection engineering.
          </p>
          <p>
            At the end of the day, I don&apos;t want to become someone who simply knows how to run pre-packaged security tools. I want to understand systems well enough to know where to look, what to question, what to break, and what the evidence means afterwards.
          </p>
          <p>
            That is why I keep following the loop: <strong>LEARN → BUILD → TEST → DOCUMENT</strong>. Keep learning, keep breaking things in authorized environments, understand why they broke, and get better at building them securely.
          </p>
        </div>
      </div>
    </div>
  );
}

