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
  | "script";

export interface BaseFSNode {
  id: string;
  name: string;
  path: string; // e.g. "/home/husain/projects"
  permissions: string; // e.g. "drwxr-xr-x" or "-rw-r--r--"
  owner: string;
  group: string;
  updatedAt: string;
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
  updatedAt: "2025-02-20",
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
      updatedAt: "2025-03-01",
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
          updatedAt: "2025-03-01",
          description: "Personal Vault Content",
        },
      ],
    },

    // 📁 about/
    {
      id: "about-dir",
      name: "about",
      path: "/home/husain/about",
      type: "directory",
      permissions: "drwxr-xr-x",
      owner: "husain",
      group: "staff",
      updatedAt: "2025-02-18",
      description: "Personal background, education, and technical mindset",
      children: [
        {
          id: "about-profile",
          name: "profile.md",
          path: "/home/husain/about/profile.md",
          type: "file",
          fileType: "markdown",
          permissions: "-rw-r--r--",
          owner: "husain",
          group: "staff",
          size: 1420,
          updatedAt: "2026-08-23",
          description: "Who I am, focus areas, and offensive security interests",
          content: `# Husain Hakim
**Cybersecurity Student | Offensive Security & Tool Development**

Dedicated to ethical hacking, offensive security, and technical systems research. I specialize in bridging the gap between low-level systems programming and modern application security.

## Core Interests
- Penetration testing methodologies & automated reconnaissance
- Linux operating system internals & local privilege escalation
- Network protocol analysis & Layer 2/3 traffic dissection
- Defensive verification through offensive simulations
- Building tactical telemetry and forensic utilities

## Technical Proficiencies
- **Languages:** Python, C++, TypeScript/JavaScript, Bash
- **Security:** Active Directory Enumeration, Reverse Engineering (Magic Numbers/File Signatures), OSINT, Vulnerability Analysis
- **Frameworks:** React, Next.js, FastAPI, Node.js
- **Networking:** TCP/IP, ARP, mDNS/Bonjour, Socket Programming

## Current Focus
Currently focused on building bespoke security tools (like CYBER // SONAR and File Type Identifiers) that don't rely on existing frameworks, emphasizing zero-dependency architectures and deep-dive technical postmortems to truly understand the underlying protocols.`,
        },

      ],
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
      updatedAt: "2025-02-15",
      description: "Offensive security tools, network scanners, and analyzers",
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
          updatedAt: "2024-11-20",
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
          updatedAt: "2024-05-15",
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
          updatedAt: "2024-12-05",
          description: "PassGuard - Privacy-first password strength analyzer and k-anonymity checker",
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
      updatedAt: "2025-02-12",
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
      updatedAt: "2025-01-15",
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
          updatedAt: "2026-08-25",
          description: "Markdown: Clean Code Was Never the Hard Part",
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
      updatedAt: "2025-02-14",
      description: "Categorized breakdown of technical tools, languages, and soft skills",
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
      updatedAt: "2025-02-10",
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
          updatedAt: "2025-02-10",
          description: "Backend Engineer at LetsUpgrade (Sept 2025 – Present)",
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
      updatedAt: "2026-08-25",
      description: "Direct email, GitHub, and LinkedIn links",
      content: `# Contact Information

- **Email**: husain.m.hakim.533@gmail.com
- **GitHub**: https://github.com/husainhakim
- **LinkedIn**: https://www.linkedin.com/in/husainhakim/
- **X (Twitter)**: https://x.com/Husain533
- **Portfolio**: https://husainhakim.vercel.app`,
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
      size: 96041,
      updatedAt: "2026-08-25",
      description: "Husain Hakim's Official Technical Resume (PDF Document)",
      externalUrl: "/resume.pdf",
    },
  ],
};

// Filesystem Navigation Utilities
export function normalizePath(path: string): string {
  if (!path || path === "~" || path === "/~") return ROOT_PATH;
  if (path.startsWith("~/")) {
    path = ROOT_PATH + path.slice(1);
  }
  if (!path.startsWith("/")) {
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
  const resolved = "/" + stack.join("/");
  // Enforce root boundary or allow root /home/husain
  if (resolved === "/" || resolved === "/home") {
    return ROOT_PATH;
  }
  return resolved;
}

export function findNodeByPath(path: string, root: FSDirectory = VIRTUAL_FS): FSNode | null {
  const norm = normalizePath(path);
  if (norm === root.path) return root;

  // Split target path relative to root
  if (!norm.startsWith(root.path)) return null;
  const relative = norm.slice(root.path.length).split("/").filter(Boolean);

  let current: FSNode = root;
  for (const segment of relative) {
    if (current.type !== "directory") return null;
    const found: FSNode | undefined = current.children.find((child) => child.name === segment);
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

export function listDirectory(path: string): FSNode[] {
  const node = findNodeByPath(path);
  if (!node || node.type !== "directory") return [];
  return node.children;
}

export function generateTree(node: FSDirectory = VIRTUAL_FS, prefix: string = ""): string[] {
  const lines: string[] = [];
  const children = node.children;
  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    const connector = isLast ? "└── " : "├── ";
    lines.push(`${prefix}${connector}${child.name}${child.type === "directory" ? "/" : ""}`);
    if (child.type === "directory") {
      const extension = isLast ? "    " : "│   ";
      lines.push(...generateTree(child, prefix + extension));
    }
  });
  return lines;
}
