export type FileType =
  | "markdown"
  | "project"
  | "writeup"
  | "blog"
  | "skills"
  | "experience"
  | "contact"
  | "pdf"
  | "json"
  | "script"
  | "vault";

export interface BaseFSNode {
  id: string;
  name: string;
  path: string; // e.g. "/home/husain/projects"
  permissions: string; // e.g. "drwxr-xr-x" or "-rw-r--r--"
  owner: string;
  group: string;
  updatedAt: string;
  createdAt?: string;
  description?: string;
}

export interface FSDirectory extends BaseFSNode {
  type: "directory";
  children: (FSDirectory | FSFile)[];
  icon?: string;
}

export interface FSFile extends BaseFSNode {
  type: "file";
  fileType: FileType;
  size: number; // in bytes
  dataRef?: string; // id to reference item in data sets
  content?: string; // raw content if standalone file
  externalUrl?: string;
}

export type FSNode = FSDirectory | FSFile;

export const ROOT_PATH = "/home/husain";

// Build the Virtual Filesystem Hierarchy
export const VIRTUAL_FS: FSDirectory = {
  id: "root-dir",
  name: "husain",
  path: "/home/husain",
  type: "directory",
  permissions: "drwxr-xr-x",
  owner: "husain",
  group: "staff",
  updatedAt: "2026-09-23",
  description: "Husain Hakim's Primary Cybersecurity Workspace",
  children: [
    // 📁 vault/
    {
      id: "vault-dir",
      name: "vault",
      path: "/home/husain/vault",
      type: "directory",
      permissions: "drwx------",
      owner: "husain",
      group: "staff",
      updatedAt: "2026-09-23",
      description: "Personal Vault",
      children: [
        {
          id: "vault-file",
          name: "personal_vault.md",
          path: "/home/husain/vault/personal_vault.md",
          type: "file",
          fileType: "vault",
          permissions: "-rw-------",
          owner: "husain",
          group: "staff",
          size: 1024,
          updatedAt: "2026-09-23",
          description: "Personal Vault Content",
        },
      ],
    },

    // 📄 MANUAL.md (Workstation Guide & Cheat Sheet)
    {
      id: "readme-file",
      name: "MANUAL.md",
      path: "/home/husain/MANUAL.md",
      type: "file",
      fileType: "markdown",
      permissions: "-rw-r--r--",
      owner: "husain",
      group: "staff",
      size: 3420,
      updatedAt: "2026-09-23",
      description: "Workstation Superpowers, CLI Hotkeys, CTF Vault, and Achievements Guide",
      content: `# HUSAIN.OS v2.4 • INTERACTIVE WORKSTATION GUIDE

Welcome to Husain Hakim's Interactive Portfolio Workstation.
This system is an interactive Linux desktop simulation (/home/husain).

## Key Capabilities & Hotkeys:
- [Alt + T / Ctrl + \`] : Toggle between GUI Desktop & Interactive Linux Terminal Shell
- [Ctrl + K / Cmd + K]  : Open Global Command Palette & Feature Spotlight
- [Vault Challenge]    : Unlock the riddle-protected Personal Vault (/home/husain/vault)
- [10 Achievements]    : Discover hidden Easter eggs, CLI secrets, and unlock all 10 trophy badges
- [Drag & Drop]        : Reorganize files, pin items to Quick Access, or right-click to customize`,
    },

    // 📄 about.md
    {
      id: "about-file",
      name: "about.md",
      path: "/home/husain/about.md",
      type: "file",
      fileType: "markdown",
      permissions: "-rw-r--r--",
      owner: "husain",
      group: "staff",
      size: 4850,
      updatedAt: "2026-09-23",
      description: "Personal background, technical focus, and systems mindset",
      content: `# Husain Hakim
**Cybersecurity Student | Offensive & Defensive Security**

I am a Computer Science student currently building my foundation in cybersecurity, focusing on understanding how systems operate underneath their interfaces and why they fail under unexpected conditions.

Long before I was analyzing network packets or auditing source code, my academic path started in the PCMB stream. At the time, studying physics, chemistry, mathematics, and biology felt like an intensive exercise in natural sciences, but looking back, it fundamentally shaped how I analyze problems. It gave me a systems-level way of thinking: observing interconnected components, tracking how small state changes propagate through an entire environment, and looking for root causes rather than treating superficial symptoms.

My transition into computing grew out of raw curiosity. Growing up, I was fascinated by aviation and once imagined a future where I would become a pilot, drawn to the intricate cockpits, navigation systems, and disciplined procedures required to keep complex machinery operating smoothly. While my trajectory eventually shifted from navigating airspace to exploring computer networks, that same appreciation for mission-critical systems and technical architecture carried straight into computing.

When I first started writing code, my early programming days were spent grappling with C++, where figuring out standard input, output, and memory allocation felt like solving an intricate puzzle. That rush of making something work from scratch (understanding what was actually happening beneath the code, how variables sit in memory, and how compilers translate instructions) is what originally got me hooked on technology.

Naturally, that curiosity didn't stop at building software; it drove me to ask where the boundaries break. How do computers talk to each other across an untrusted network? What happens under the hood when a single terminal command is executed? What assumptions do developers make that leave doors open for exploitation? Those questions led me directly into cybersecurity.

## Academic Background
- **ITM Skills University** | Bachelor of Technology in Computer Science & Engineering (B.Tech CSE), 2023 – 2027
  - Coursework focusing on operating systems, network protocols, distributed systems, and computer architecture.
  - Organized three university hackathons with prize pools exceeding ₹6,85,000; mentored student teams at ITM Buildathon 3.0.
- **SIES College of Arts, Science & Commerce** | Higher Secondary Certificate (Junior College / Science), 2021 – 2023
- **St. Mary's High School** | Secondary School Certificate (SSC), 2011 – 2021

## What I Actually Work With
To be completely clear: I do not consider myself an expert in these domains. Cybersecurity is vast, and these are the specific areas where I am actively investing time, getting my hands dirty, and building genuine technical depth:

- **Linux & the Command Line:** Working in Linux daily as my primary environment: navigating filesystems, inspecting process trees, understanding SUID permissions, writing Bash automation scripts, and auditing system logs.
- **Networking & Protocol Analysis:** Studying Layer 2 and Layer 3 traffic mechanics, TCP handshakes, ARP cache behavior, DNS queries, mDNS multicast resolution, and packet inspection using tools like Wireshark and tcpdump.
- **Python & Security Scripting:** Developing custom network probes, protocol parsers, automated reconnaissance utilities, and forensic tools from scratch using standard libraries and asynchronous concurrency.
- **Reconnaissance & Enumeration:** Mapping out attack surfaces through active and passive asset discovery, port auditing, service fingerprinting, and sub-domain discovery.
- **Web Application Security:** Analyzing web traffic, investigating authentication workflows, testing access control boundaries (IDOR), and understanding common vulnerability classes like SQL injection and cross-site scripting.
- **Vulnerability Discovery & Ethical Hacking:** Following structured testing methodologies to identify logic flaws and misconfigurations within authorized environments.
- **Intrusion Detection & Telemetry:** Ingesting web and system logs, aggregating connection metrics across sliding time windows, and writing logic to flag suspicious brute-force or injection activity.
- **Security Tooling & Developer Utilities:** Writing lightweight, local-first CLI tools that avoid heavy external dependencies, respect user privacy, and run deterministically.
- **Backend Systems & APIs:** Building and inspecting REST APIs using Node.js, Express, and FastAPI, paying close attention to input sanitization, database query parameterization, and secure state handling.
- **Security Labs & Vulnerable Sandboxes:** Practicing regularly across platforms like TryHackMe and PortSwigger Web Security Academy, as well as running custom local Docker containers to experiment safely.

## Projects & Experiments
A massive part of my learning happens through building. Reading documentation and theory is essential, but until I actually write code to interact with a protocol or parse a raw binary format, the knowledge doesn't fully click.

One project that played a pivotal role in shaping my perspective was building a multi-tier **Intrusion Detection System & Honeypot**. I wanted to see how web applications look to both an attacker attempting an intrusion and a defender trying to detect it in real time. The architecture paired a deliberately flawed honeypot portal (using raw SQL string concatenation, unescaped inputs, and weak credentials) with a hardened production server implementing parameterized queries and password hashing.

Between them ran a real-time log-monitoring IDS engine that continuously tailed access logs, maintained sliding time windows per session ID, and raised high-severity alerts when brute-force thresholds were exceeded. Building the accompanying attack testing scripts (especially comparing an aggressive brute-force mode against a delayed, stealth mode designed to evade detection thresholds) was eye-opening. It pushed me heavily toward the defensive side of security because it proved that effective defense requires understanding the exact operational signatures an attack leaves behind.

Other key projects include:
- **CYBER // SONAR (Network Scanner):** A zero-dependency tactical intranet discovery utility in Python. Sweeps subnets with parallel socket sweeps, parses kernel ARP tables for authentic physical MAC addresses, resolves hardware vendors via IEEE OUI databases and hostnames via mDNS, visualized in an HTML5 Canvas radar.
- **File Signature Identifier:** A forensics utility that inspects true binary magic numbers to detect extension spoofing and masquerading, with a built-in hex viewer.
- **PassGuard:** A local-first password security analyzer estimating Shannon entropy and performing k-Anonymity breach checking with the Web Crypto API.
- **RepoChecker:** A local-only CLI tool that checks Git repositories for accidentally committed secrets, API keys, and missing .gitignore rules.
- **QuickRef:** An offline, terminal-first documentation lookup CLI formatted with ANSI escape codes and packaged via setuptools.

## How I Learn
My learning process revolves around a practical, four-stage feedback loop: **LEARN → BUILD → TEST → DOCUMENT**.

1. **LEARN (Read the Fundamentals):** I start by understanding underlying concepts, reading RFCs, Linux man pages, protocol specifications, and technical documentation rather than skipping straight to high-level automation tools.
2. **BUILD (Write Tools from Scratch):** Once I understand the theory, I try to write a small utility or script to interact with it directly in Python, Bash, or standard libraries. Writing zero-dependency code forces me to handle data streams, parse packets, and deal with edge cases that frameworks usually hide.
3. **TEST (Break Things in Authorized Labs):** I take that knowledge into isolated virtual machines, local Docker containers, or authorized lab environments. Running commands myself and seeing what breaks is essential. Failed scripts, syntax errors, and misconfigured test environments are where the real learning happens.
4. **DOCUMENT (Analyze & Write Postmortems):** Finally, I write down what I learned in detailed writeups, project postmortems, or technical blogs. Explaining the root cause of a vulnerability, the exploitation steps, and the mitigation strategy proves whether I genuinely understand a concept or just memorized a command.

## What I'm Currently Exploring
Here is a snapshot of specific topics currently sitting on my desk for active study:
- **Network Protocols:** Deep-diving into TCP/IP state machines, handshake sequences, DNS query mechanics, and HTTP/HTTPS header analysis.
- **Linux Internals & Privilege Escalation:** Auditing file permissions, SUID/SGID binaries, Linux capabilities, cron job configurations, and path hijacking vectors in lab machines.
- **Reconnaissance & Enumeration:** Refining structured discovery workflows, service fingerprinting, and asset mapping.
- **Web Vulnerabilities:** Analyzing OWASP Top 10 vulnerabilities, authentication bypasses, broken object-level authorization (IDOR), and parameter tampering.
- **Network Traffic Analysis:** Capturing and inspecting live packet captures with Wireshark and tcpdump to understand what payloads look like over the wire.
- **Intrusion Detection Concepts:** Studying sliding-window thresholding, log aggregation, and the balance between alert sensitivity and false positives.
- **Python Security Automation:** Writing modular scripts to automate asset scanning, header validation, and local security audits.
- **Attacker Techniques vs. Defensive Indicators:** Comparing offensive execution steps with corresponding forensic traces left in system and web server logs.

## Why Purple Teaming Interests Me
Offensive security teaches how systems can be probed and exploited, while defensive security teaches how those attacks can be recognized, investigated, and mitigated. I am most fascinated by the space where both meet.

> I don't just want to know how to perform an attack. I also want to understand what that attack looks like from the other side.

When an attacker runs an automated directory scan, what does that look like in web server access logs? When an exploitation payload touches an endpoint, what events are recorded in system audit logs? When an attacker introduces deliberate delays to slip past rate limits, how do detection rules need to evolve to catch that behavior?

Exploring adversary simulation, detection engineering, network analysis, and security monitoring allows offense to sharpen defense, while defense provides the realistic constraints that make offensive testing meaningful. While I am not claiming to work professionally as a purple teamer today, this collaborative, holistic approach is the clear direction my learning is heading toward.

## What's Next
My immediate goal is straightforward: **get really good at the fundamentals.**

Cybersecurity is broad, and I don't have my entire career mapped out to the final milestone, nor do I think I need to right now. I know the direction I am heading in, and I want to spend my university years building real depth across networking, Linux, web security, and defensive telemetry before deciding where to specialize.

As I progress, I want to expand my lab work into more complex environments, exploring Active Directory, Kerberos authentication, domain privilege escalation, red and blue teaming workflows, adversary simulation, vulnerability research, and detection engineering.

At the end of the day, I don't want to become someone who simply knows how to run pre-packaged security tools. I want to understand systems well enough to know where to look, what to question, what to break, and what the evidence means afterwards.

That is why I keep following the loop: **LEARN → BUILD → TEST → DOCUMENT**. Keep learning, keep breaking things in authorized environments, understand why they broke, and get better at building them securely.`,
    },

    // 📁 projects/
    {
      id: "projects-dir",
      name: "projects",
      path: "/home/husain/projects",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "husain",
      group: "staff",
      updatedAt: "2026-09-23",
      description: "Offensive & defensive security tools, network scanners, and analyzers",
      children: [
        {
          id: "proj-fid",
          name: "file-sign-identifier",
          path: "/home/husain/projects/file-sign-identifier",
          type: "file",
          fileType: "project",
          dataRef: "file-identifier",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 2840,
          updatedAt: "2026-08-20",
          description: "Web-based forensics tool for true file type detection and spoofing analysis",
        },
        {
          id: "proj-sonar",
          name: "network-device-scanner",
          path: "/home/husain/projects/network-device-scanner",
          type: "file",
          fileType: "project",
          dataRef: "network-device-scanner",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 4210,
          updatedAt: "2026-07-15",
          description: "CYBER // SONAR - Intranet telemetry and hardware discovery appliance",
        },
        {
          id: "proj-passguard",
          name: "password-strength-checker",
          path: "/home/husain/projects/password-strength-checker",
          type: "file",
          fileType: "project",
          dataRef: "passguard",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 3410,
          updatedAt: "2026-08-12",
          description: "PassGuard - Privacy-first password strength analyzer and k-anonymity checker",
        },
        {
          id: "proj-quickref",
          name: "quickref",
          path: "/home/husain/projects/quickref",
          type: "file",
          fileType: "project",
          dataRef: "quickref",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 2150,
          updatedAt: "2026-07-28",
          description: "QuickRef - Offline, terminal-first command reference tool",
        },
        {
          id: "proj-repochecker",
          name: "repochecker",
          path: "/home/husain/projects/repochecker",
          type: "file",
          fileType: "project",
          dataRef: "repochecker",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 3000,
          updatedAt: "2026-08-25",
          description: "RepoChecker - Local-only CLI for repository hygiene and secret detection",
        },
        {
          id: "proj-ids",
          name: "intrusion-detection-system",
          path: "/home/husain/projects/intrusion-detection-system",
          type: "file",
          fileType: "project",
          dataRef: "intrusion-detection-system",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 3820,
          updatedAt: "2026-07-10",
          description: "Intrusion Detection System - Multi-tier Honeypot, IDS & Main Server simulation",
        },
      ],
    },

    // 📁 writeups/
    {
      id: "writeups-dir",
      name: "writeups",
      path: "/home/husain/writeups",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "husain",
      group: "staff",
      updatedAt: "2026-09-23",
      description: "Technical security research writeups and lab walkthroughs",
      children: [
        {
          id: "writeup-file-identifier",
          name: "file-identifier.md",
          path: "/home/husain/writeups/file-identifier.md",
          type: "file",
          fileType: "writeup",
          dataRef: "file-identifier-writeup",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 4230,
          updatedAt: "2026-08-25",
          description: "Writeup: File Type Identifier",
        },
        {
          id: "writeup-network-scanner",
          name: "network-device-scanner.md",
          path: "/home/husain/writeups/network-device-scanner.md",
          type: "file",
          fileType: "writeup",
          dataRef: "network-scanner-writeup",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 7820,
          updatedAt: "2026-08-25",
          description: "Writeup: CYBER // SONAR",
        },
        {
          id: "writeup-quickref",
          name: "quickref.md",
          path: "/home/husain/writeups/quickref.md",
          type: "file",
          fileType: "writeup",
          dataRef: "quickref-writeup",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 5840,
          updatedAt: "2026-08-25",
          description: "Writeup: QuickRef | CLI Tooling & Python Packaging",
        },
        {
          id: "writeup-ids",
          name: "intrusion-detection-system.md",
          path: "/home/husain/writeups/intrusion-detection-system.md",
          type: "file",
          fileType: "writeup",
          dataRef: "intrusion-detection-writeup",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 6420,
          updatedAt: "2026-08-25",
          description: "Writeup: Honeypot + IDS + Main Server Simulation",
        }
      ],
    },

    // 📁 blogs/
    {
      id: "blogs-dir",
      name: "blogs",
      path: "/home/husain/blogs",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "husain",
      group: "staff",
      updatedAt: "2026-09-23",
      description: "Technical articles published on Medium",
      children: [
        {
          id: "blog-clean-code",
          name: "clean-code-was-never-the-hard-part.md",
          path: "/home/husain/blogs/clean-code-was-never-the-hard-part.md",
          type: "file",
          fileType: "blog",
          dataRef: "clean-code-was-never-the-hard-part",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 1540,
          updatedAt: "2026-09-23",
          description: "Markdown: Clean Code Was Never the Hard Part",
        },
        {
          id: "blog-auth-mistakes",
          name: "silly-authentication-mistakes.md",
          path: "/home/husain/blogs/silly-authentication-mistakes.md",
          type: "file",
          fileType: "blog",
          dataRef: "silly-authentication-mistakes",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 4230,
          updatedAt: "2026-09-23",
          description: "Markdown: The Devil is in the Details: Authentication Flaws",
        },
        {
          id: "blog-vibe-coding",
          name: "vibe-coding-when-it-works-isnt-the-same-as-it-s-secure.md",
          path: "/home/husain/blogs/vibe-coding-when-it-works-isnt-the-same-as-it-s-secure.md",
          type: "file",
          fileType: "blog",
          dataRef: "vibe-coding-when-it-works-isnt-the-same-as-it-s-secure",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 2850,
          updatedAt: "2026-09-23",
          description: "Markdown: Vibe Coding: When It Works Isn't the Same as It's Secure",
        }
      ],
    },

    // 📄 skills/
    {
      id: "skills-file",
      name: "skills.md",
      path: "/home/husain/skills.md",
      type: "file",
      fileType: "skills",
      permissions: "-rw-r--r--",
      owner: "husain",
      group: "staff",
      size: 4890,
      updatedAt: "2026-09-23",
      description: "Categorized breakdown of technical tools, languages, and soft skills",
      content: `# Technical Skills & Competencies
**Husain Hakim | Cybersecurity Student & Backend Developer**

- **Medium**: https://medium.com/@husainhakim
- **GitHub**: https://github.com/husainhakim
- **LinkedIn**: https://www.linkedin.com/in/husainhakim/
- **Email**: husain.m.hakim.533@gmail.com

## Programming Languages
- Python
- JavaScript
- C++

## Networking & Infrastructure
- TCP/IP & Network Protocols
- Subnetting & CIDR
- DNS & DHCP
- NAT / PAT
- VLANs
- Network Scanning & Enumeration
- Network Traffic Analysis

## Linux & Systems
- Linux Administration
- Linux CLI
- File Permissions & Ownership
- User & Group Management
- Process & Service Management
- SSH
- Filesystem & Mount Management
- Bash/Shell

## Development / Backend
- React.js
- Node.js
- Express.js
- REST API Development
- MongoDB
- SQL
- MERN Stack
- Event-Driven Backend Development
- API Testing
- Django
- FastAPI

## Cybersecurity
- ARP Spoof Detection
- JWT Security Analysis
- SUID/Privilege Escalation Auditing
- Vulnerability Scanning & Enumeration

## DevOps / Engineering
- Git
- GitHub
- CI/CD
- Jenkins
- Docker
- Vercel
- MongoDB Atlas
- Automated Testing
- RabbitMQ

## Testing & Tools
- Postman
- VS Code
- Selenium
- Cypress
- JMeter
- OpenCV

## Soft Skills
- Problem-Solving
- Team Collaboration
- Critical Thinking
- Time Management
- Adaptability`,
    },

    // 📁 experience/
    {
      id: "experience-dir",
      name: "experience",
      path: "/home/husain/experience",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "husain",
      group: "staff",
      updatedAt: "2026-09-23",
      description: "Professional software engineering and community leadership",
      children: [
        {
          id: "exp-backend",
          name: "letsupgrade-backend-engineer.md",
          path: "/home/husain/experience/letsupgrade-backend-engineer.md",
          type: "file",
          fileType: "experience",
          dataRef: "letsupgrade-backend",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 2980,
          updatedAt: "2026-09-23",
          description: "Backend Engineer at LetsUpgrade (Sept 2025 – July 2026)",
          content: `# Backend Developer - LetsUpgrade Edtech Pvt Ltd

- **Role:** Backend Developer
- **Organization:** LetsUpgrade Edtech Pvt Ltd
- **Engagement Type:** Full-Time / Internship
- **Period:** Sept 2025 - July 2026 (10 Months)
- **Location:** Mumbai, India (Hybrid)

## Executive Summary
Core backend developer responsible for architecting scalable microservices, re-engineering database trigger infrastructure into resilient event-driven workers, and maintaining production services supporting high-throughput educational workflows.

## Technologies & Stack
- Node.js
- Express.js
- MongoDB Atlas
- Distributed Event Architecture
- RESTful APIs
- FastAPI
- Django
- Postman

## Key Responsibilities
- Migrated 30+ MongoDB Atlas Triggers to Node.js event-driven services, reducing infrastructure costs by up to 95% while improving scalability and maintainability.
- Developed and maintained backend services for a platform with 300+ REST APIs and 10M+ MongoDB documents, delivering production features and working with large-scale data systems.
- Collaborated cross-functionally with product managers and frontend teams to translate technical requirements into robust database schemas and high-performance API endpoints.
- Implemented stringent server-side payload validation, sanitized database queries, and tuned indexing strategies to eliminate query bottlenecks.
- Authored comprehensive API documentation and Postman collections to ensure smooth client and mobile client integration.

## Technical Impact & Metrics
### ~95% Cost Reduction
Successfully migrated 30+ MongoDB Atlas triggers into decoupled Node.js event listeners, mitigating cloud trigger execution overhead and reducing infrastructure compute expenses.

### 300+ REST APIs & 10M+ Docs
Developed and maintained backend services for a platform with 300+ REST APIs and 10M+ MongoDB documents, delivering production features and working with large-scale data systems.

### Client Architecture Meetings
Actively participated in core client meetings to capture technical requirements, bridging the gap between business needs and robust backend architectural solutions.

## Key Engineering Takeaways
- Deep understanding of distributed backend systems, event loops, and asynchronous I/O at production scale.
- Practical experience in defensive API design, ensuring authorization checks and payload validation are strictly enforced at the service tier.
- Experience optimizing high-concurrency database queries against large datasets.`,
        },
      ],
    },

    // 📄 contact/
    {
      id: "contact-file",
      name: "contact-info.md",
      path: "/home/husain/contact-info.md",
      type: "file",
      fileType: "contact",
      permissions: "-rw-r--r--",
      owner: "husain",
      group: "staff",
      size: 890,
      updatedAt: "2026-09-23",
      description: "Direct email, GitHub, LinkedIn, Medium, and X links",
      content: `# Contact Information

- **Email**: husain.m.hakim.533@gmail.com
- **GitHub**: https://github.com/husainhakim
- **LinkedIn**: https://www.linkedin.com/in/husainhakim/
- **Medium**: https://medium.com/@husainhakim
- **X (Twitter)**: https://x.com/Husain533
- **Portfolio**: https://husainhakim.me`,
    },

    // 📄 resume.pdf
    {
      id: "resume-pdf",
      name: "resume.pdf",
      path: "/home/husain/resume.pdf",
      type: "file",
      fileType: "pdf",
      permissions: "-rwxr-xr-x",
      owner: "husain",
      group: "staff",
      size: 280224,
      updatedAt: "2026-09-23",
      description: "Husain Hakim's Official Technical Resume (PDF Document)",
      externalUrl: "/resume.pdf",
    },
  ],
};

// Filesystem Navigation Utilities
export function normalizePath(path: string): string {
  if (!path || path === "~" || path === "/~" || path === "/" || path === "/home") return ROOT_PATH;

  if (path.startsWith("~/")) {
    path = ROOT_PATH + path.slice(1);
  } else if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Resolve "." and ".."
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }
  let resolved = "/" + stack.join("/");

  if (resolved === "/" || resolved === "/home") {
    return ROOT_PATH;
  }

  // If path does not start with /home/husain, prefix it
  if (!resolved.startsWith(ROOT_PATH)) {
    resolved = ROOT_PATH + resolved;
  }

  // Common alias mappings 
  if (resolved === "/home/husain/about") return "/home/husain/about.md";
  if (resolved === "/home/husain/skills") return "/home/husain/skills.md";
  if (resolved === "/home/husain/contact") return "/home/husain/contact-info.md";
  if (resolved === "/home/husain/contact-info") return "/home/husain/contact-info.md";
  if (resolved === "/home/husain/resume") return "/home/husain/resume.pdf";

  return resolved;
}

export function getNodeDisplayName(
  node: FSNode | null | undefined,
  customNames?: Record<string, string>
): string {
  if (!node) return "";
  if (customNames && customNames[node.id]) {
    return customNames[node.id];
  }
  return node.name;
}

export function findNodeByPath(
  path: string,
  root: FSDirectory = VIRTUAL_FS,
  customNames?: Record<string, string>
): FSNode | null {
  const norm = normalizePath(path);
  if (norm === root.path) return root;

  // Split target path relative to root
  if (!norm.startsWith(root.path)) return null;
  const relative = norm.slice(root.path.length).split("/").filter(Boolean);

  let current: FSNode = root;
  for (let i = 0; i < relative.length; i++) {
    const segment = relative[i];
    const isLast = i === relative.length - 1;
    if (current.type !== "directory") return null;

    // Look for match by customName, original name, or node id
    let found: FSNode | undefined = current.children.find((child) => {
      const currentName = customNames && customNames[child.id] ? customNames[child.id] : child.name;
      return currentName === segment || child.name === segment || child.id === segment;
    });

    if (!found && isLast) {
      found = current.children.find((child) => {
        const currentName = customNames && customNames[child.id] ? customNames[child.id] : child.name;
        return (
          currentName === `${segment}.md` ||
          currentName === `${segment}.pdf` ||
          child.name === `${segment}.md` ||
          child.name === `${segment}.pdf`
        );
      });
    }
    if (!found) return null;
    current = found;
  }
  return current;
}

export function getParentPath(path: string): string {
  const norm = normalizePath(path);
  if (norm === ROOT_PATH) return ROOT_PATH;
  const parts = norm.split("/").filter(Boolean);
  parts.pop();
  const parent = "/" + parts.join("/");
  if (parent.length < ROOT_PATH.length) return ROOT_PATH;
  return parent;
}

export function listDirectory(path: string, customNames?: Record<string, string>): FSNode[] {
  const node = findNodeByPath(path, VIRTUAL_FS, customNames);
  if (!node || node.type !== "directory") return [];
  return node.children;
}

export function generateTree(
  node: FSDirectory = VIRTUAL_FS,
  prefix: string = "",
  customNames?: Record<string, string>,
  deletedNodeIds?: string[]
): string[] {
  const lines: string[] = [];
  const children = node.children.filter((child) => !deletedNodeIds?.includes(child.id));
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const displayName = customNames && customNames[child.id] ? customNames[child.id] : child.name;
    lines.push(`${prefix}${connector}${displayName}${child.type === "directory" ? "/" : ""}`);
    if (child.type === "directory") {
      const extension = isLast ? "    " : "│   ";
      lines.push(...generateTree(child as FSDirectory, prefix + extension, customNames, deletedNodeIds));
    }
  });
  return lines;
}

export function findNodeById(id: string, root: FSDirectory = VIRTUAL_FS): FSNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    if (child.id === id) return child;
    if (child.type === "directory") {
      const found = findNodeById(id, child as FSDirectory);
      if (found) return found;
    }
  }
  return null;
}

