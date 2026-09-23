import {
  FSFile,
  ROOT_PATH,
  VIRTUAL_FS,
  findNodeByPath,
  normalizePath,
  generateTree,
} from "@/data/filesystemData";
import { downloadNode } from "@/lib/downloadHelper";
import { PROFILE_DATA } from "@/data/profileData";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";
import { SKILLS_DATA } from "@/data/skillsData";
import { EXPERIENCE_DATA } from "@/data/experienceData";

export interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode | string;
  isError?: boolean;
  timestamp: string;
  path: string;
}

export interface CommandContext {
  currentPath: string;
  navigate: (path: string) => boolean;
  openFile: (file: FSFile) => void;
  setMode: (mode: "gui" | "cli") => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  customNames?: Record<string, string>;
  renameNode?: (nodeId: string, newName: string) => void;
  resetModifications?: () => void;
  deletedNodeIds?: string[];
  folderOrders?: Record<string, string[]>;
  showToast?: (message: string, duration?: number) => void;
}

export const AVAILABLE_COMMANDS = [
  "help",
  "ls",
  "ll",
  "cd",
  "pwd",
  "cat",
  "mv",
  "rename",
  "reset",
  "download",
  "clear",
  "whoami",
  "neofetch",
  "fastfetch",
  "tree",
  "history",
  "projects",
  "writeups",
  "blogs",
  "skills",
  "experience",
  "resume",
  "contact",
  "theme",
  "gui",
  "exit",
  "about",
];

export function executeCommand(
  rawInput: string,
  context: CommandContext
): { text: string; action?: () => void; isError?: boolean } {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { text: "" };
  }

  const parts = trimmed.split(" ").filter(Boolean);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case "neofetch":
    case "fastfetch":
    case "fetch":
      return {
        text: `       _,met$$$$$gg.          husain@husain-os
    ,g$$$$$$$$$$$$$$$P.       ----------------
  ,g$$P"     """Y$$.".        OS: HusainOS v2.4 (x86_64)
 ,$$P'              \`$$$.     Host: Next.js 16 Cybersecurity Workstation
',$$P       ,ggs.     \`$$b:   Kernel: 6.8.0-cyber-hardened
\`d$$'     ,$P"'   .    $$$    Uptime: 42 days, 13 hours
 $$P      d$'     ,    $$P    Shell: husain-sh (interactive VFS)
 $$:      $$.   -    ,d$$'    Resolution: 1920x1080 (HiDPI)
 $$;      Y$b._   _,d$P'      DE: Brutalist Desktop Environment
 Y$$.    \`.\`"Y$$$$P"'         WM: NextWM (Virtual File Explorer)
 \`$$b      "-.__              Terminal: WebPTY (xterm-256color)
  \`Y$$                        CPU: Offensive & Defensive Security Engine
   \`Y$$.                      Memory: 1337MiB / 4096MiB (32%)
     \`$$b.                    CTF Vault: /home/husain/vault [Locked]
       \`Y$$b.                 Trophies: 10 Secret Achievements
          \`"Y$b._             
              \`"""            ███ ███ ███ ███ ███ ███ ███ ███`,
      };

    case "about":
      return {
        text: `# Husain Hakim
**Cybersecurity Student | Offensive & Defensive Security**

Dedicated to ethical hacking, offensive security, and technical systems research.

## Core Interests
- Penetration testing methodologies & automated reconnaissance
- Linux operating system internals & local privilege escalation
- Network protocol analysis & Layer 2/3 traffic dissection
- Defensive verification through offensive simulations`,
      };

    case "help":
      return {
        text: `Husain Hakim | Cybersecurity Workspace Shell (v2.4)
=====================================================
Available Navigation & System Commands:

  neofetch         Display HusainOS system & kernel specs
  ls [-l]          List directory contents (files & folders)
  cd <dir>         Change working directory (e.g. cd projects, cd .., cd ~)
  pwd              Print name of current working directory
  cat <file>       Display file content, project details, or writeups
  mv / rename      Rename file or directory (e.g. mv about.md about-me.md)
  reset            Reset workspace to default state (restore original names)
  download <path>  Download virtual file (.md/.pdf) or folder (.zip)
  tree             Display hierarchical tree structure of filesystem
  whoami           Display operator identity and offensive & defensive security focus
  clear            Clear terminal screen
  history          Display current session command history
  theme [mode]     Switch workspace theme (dark, light, toggle)
  gui / exit       Switch interface back to GUI Workspace Mode

Direct Domain Commands:
  projects         List all offensive & defensive security tools and projects
  writeups         List all technical security writeups & lab reports
  blogs            List Medium engineering & security articles
  skills           Display technical proficiencies and soft skills
  experience       Display professional engineering & leadership background
  resume           Access / download the official PDF resume
  contact          Display email, GitHub, LinkedIn, Medium, and X channels
  about            Display personal background and interests

Tip: Use [TAB] for path/command auto-completion, [↑/↓] for command history.`,
      };

    case "pwd":
      return {
        text: context.currentPath,
      };

    case "whoami":
      return {
        text: `${PROFILE_DATA.name}
Role: ${PROFILE_DATA.title}
Philosophy: ${PROFILE_DATA.statusLine}
Location: ${PROFILE_DATA.location}
Contact: ${PROFILE_DATA.email}`,
      };

    case "ls":
    case "ll":
    case "dir": {
      const isLong = command === "ll" || args.includes("-l") || args.includes("-la");
      const targetDir = args.find((a) => !a.startsWith("-")) || context.currentPath;
      const targetPath = targetDir.startsWith("/")
        ? normalizePath(targetDir)
        : normalizePath(`${context.currentPath}/${targetDir}`);

      const node = findNodeByPath(targetPath, VIRTUAL_FS, context.customNames);
      if (!node) {
        return {
          text: `ls: cannot access '${targetDir}': No such file or directory`,
          isError: true,
        };
      }

      if (node.type === "file") {
        const displayName = context.customNames?.[node.id] || node.name;
        return {
          text: isLong
            ? `${node.permissions} 1 ${node.owner} ${node.group} ${String(node.size).padStart(6, " ")} ${node.updatedAt} ${displayName}`
            : displayName,
        };
      }

      let children = node.children.filter((child) => !context.deletedNodeIds?.includes(child.id));
      if (context.folderOrders && context.folderOrders[node.id]) {
        const order = context.folderOrders[node.id];
        children = [...children].sort((a, b) => {
          const idxA = order.indexOf(a.id);
          const idxB = order.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
      }

      if (children.length === 0) {
        return { text: "(directory is empty)" };
      }

      if (isLong) {
        const header = "total " + children.length;
        const rows = children.map((child) => {
          const displayName = context.customNames?.[child.id] || child.name;
          const size = child.type === "file" ? child.size : 4096;
          const suffix = child.type === "directory" ? "/" : "";
          return `${child.permissions} 1 ${child.owner} ${child.group} ${String(size).padStart(6, " ")} ${child.updatedAt} ${displayName}${suffix}`;
        });
        return { text: [header, ...rows].join("\n") };
      } else {
        const items = children.map((child) => {
          const displayName = context.customNames?.[child.id] || child.name;
          return child.type === "directory" ? `${displayName}/` : displayName;
        });
        return { text: items.join("    ") };
      }
    }

    case "cd": {
      if (args.length === 0 || args[0] === "~" || args[0] === "") {
        context.navigate(ROOT_PATH);
        return { text: "" };
      }

      const target = args[0];
      let targetPath: string;

      if (target.startsWith("/")) {
        targetPath = normalizePath(target);
      } else if (target === "..") {
        const parts = context.currentPath.split("/").filter(Boolean);
        if (parts.length > 2) {
          parts.pop();
          targetPath = "/" + parts.join("/");
        } else {
          targetPath = ROOT_PATH;
        }
      } else if (target === ".") {
        targetPath = context.currentPath;
      } else {
        targetPath = normalizePath(`${context.currentPath}/${target}`);
      }

      const node = findNodeByPath(targetPath, VIRTUAL_FS, context.customNames);
      if (!node) {
        return {
          text: `cd: no such file or directory: ${target}`,
          isError: true,
        };
      }

      if (node.type !== "directory") {
        return {
          text: `cd: not a directory: ${target}`,
          isError: true,
        };
      }

      context.navigate(targetPath);
      return { text: "" };
    }

    case "cat": {
      if (args.length === 0) {
        return {
          text: "cat: missing file operand\nUsage: cat <filename>",
          isError: true,
        };
      }

      const targetFile = args[0];
      const targetPath = targetFile.startsWith("/")
        ? normalizePath(targetFile)
        : normalizePath(`${context.currentPath}/${targetFile}`);

      const node = findNodeByPath(targetPath, VIRTUAL_FS, context.customNames);
      if (!node) {
        return {
          text: `cat: ${targetFile}: No such file or directory`,
          isError: true,
        };
      }

      if (node.type === "directory") {
        return {
          text: `cat: ${targetFile}: Is a directory`,
          isError: true,
        };
      }

      // Check file types and render detailed text representation
      if (node.fileType === "project" && node.dataRef) {
        const proj = PROJECTS_DATA.find((p) => p.id === node.dataRef);
        if (proj) {
          return {
            text: `[PROJECT] ${proj.name} (${proj.status})
Category: ${proj.category}
Date: ${proj.date}
GitHub: ${proj.githubUrl || "N/A"}

SUMMARY:
${proj.summary}

PROBLEM STATEMENT:
${proj.problemStatement}

KEY TECHNOLOGIES & CONCEPTS:
- Tech: ${proj.technologies.join(", ")}
- Concepts: ${proj.securityConcepts.join(", ")}

CLI USAGE EXAMPLE:
${proj.cliUsageExample || "N/A"}

LESSONS LEARNED:
${proj.lessonsLearned.map((l) => "• " + l).join("\n")}

FUTURE ROADMAP:
${proj.futureRoadmap.map((r) => "• " + r).join("\n")}`,
          };
        }
      }

      if (node.fileType === "writeup" && node.dataRef) {
        const w = WRITEUPS_DATA.find((item) => item.id === node.dataRef);
        if (w) {
          if (w.markdownContent) {
            return {
              text: `[WRITEUP] ${w.title}
Category: ${w.categoryLabel} | Difficulty: ${w.difficulty} | Read Time: ${w.readTime}
Target: ${w.targetSystem} | Date: ${w.date}

SUMMARY:
${w.summary}

--------------------------------------------------------------------------------
CONTENT:

${w.markdownContent}

--------------------------------------------------------------------------------
(Type 'gui' to view this writeup in the fully formatted visual workspace)`,
            };
          } else if (w.content) {
            return {
              text: `[WRITEUP] ${w.title}
Category: ${w.categoryLabel} | Difficulty: ${w.difficulty} | Read Time: ${w.readTime}
Target: ${w.targetSystem} | Date: ${w.date}

OBJECTIVE:
${w.content.objective}

SUMMARY:
${w.summary}

ROOT CAUSE:
${w.content.rootCause}

MITIGATION:
${w.content.mitigation.map((m) => "• " + m).join("\n")}

(Type 'writeups' to view the catalog or open in GUI for full formatted code steps)`,
            };
          }
        }
      }

      if (node.fileType === "blog" && node.dataRef) {
        const b = BLOGS_DATA.find((item) => item.id === node.dataRef);
        if (b) {
          return {
            text: `[MEDIUM BLOG] ${b.title}
Publication: ${b.publication} | Date: ${b.date} | ${b.readTime}
Topics: ${b.topics.join(", ")}
URL: ${b.mediumUrl}

SUMMARY:
${b.summary}

KEY TAKEAWAYS:
${b.keyTakeaways.map((t) => "• " + t).join("\n")}

--------------------------------------------------------------------------------
CONTENT:

${b.content || "Content is not available locally."}

--------------------------------------------------------------------------------
(Type 'gui' to view this blog in the fully formatted visual workspace)`,
          };
        }
      }

      if (node.fileType === "pdf") {
        return {
          text: `[PDF DOCUMENT] ${node.name} (${Math.round(node.size / 1024)} KB)
Location: /resume.pdf
Download / View URL: ${node.externalUrl || "/resume.pdf"}
Tip: Type 'resume' to open or view in GUI mode.`,
        };
      }

      if (node.fileType === "skills") {
        const list = SKILLS_DATA.map(
          (cat) =>
            `[${cat.category.toUpperCase()}]\n${cat.skills.map((s) => `  - ${s}`).join("\n")}`
        );
        return {
          text: `Technical & Soft Skills:
--------------------------------------------------------------------------------
${list.join("\n\n")}`,
        };
      }

      if (node.fileType === "contact") {
        return {
          text: `Contact & Public Channels:
--------------------------------------------------------------------------------
• Email: ${PROFILE_DATA.email}
• GitHub: ${PROFILE_DATA.github}
• LinkedIn: ${PROFILE_DATA.linkedin}
• Medium: ${PROFILE_DATA.medium}
• X (Twitter): ${PROFILE_DATA.x}
• Portfolio: ${PROFILE_DATA.portfolio}

Tip: Type 'contact' to view all direct channels.`,
        };
      }

      if (node.content) {
        return { text: node.content };
      }

      return { text: `[${node.name} - ${node.description || "Binary / Data File"}]` };
    }

    case "download": {
      if (args.length === 0) {
        return {
          text: `download: missing file or directory operand\nUsage: download <path | file | directory>\nExamples:\n  download projects\n  download about.md\n  download resume.pdf\n  download .`,
          isError: true,
        };
      }

      const target = args[0];
      let targetPath: string;

      if (target === "." || target === "./") {
        targetPath = context.currentPath;
      } else if (target === "~" || target === "") {
        targetPath = ROOT_PATH;
      } else if (target.startsWith("~/")) {
        targetPath = normalizePath(`${ROOT_PATH}/${target.slice(2)}`);
      } else if (target === "..") {
        const parts = context.currentPath.split("/").filter(Boolean);
        if (parts.length > 2) {
          parts.pop();
          targetPath = "/" + parts.join("/");
        } else {
          targetPath = ROOT_PATH;
        }
      } else if (target.startsWith("/")) {
        targetPath = normalizePath(target);
      } else {
        targetPath = normalizePath(`${context.currentPath}/${target}`);
      }

      const node = findNodeByPath(targetPath, VIRTUAL_FS, context.customNames);
      if (!node) {
        return {
          text: `download: cannot access '${target}': No such file or directory`,
          isError: true,
        };
      }

      const isDir = node.type === "directory";
      const displayName = context.customNames?.[node.id] || node.name;
      const downloadLabel = isDir
        ? `${displayName.startsWith("HusainHakim_") ? displayName : `HusainHakim_${displayName}`}.zip`
        : displayName;

      return {
        text: isDir
          ? `Preparing directory archive '${downloadLabel}'... Download initiated.`
          : `Preparing file '${downloadLabel}'... Download initiated.`,
        action: () => {
          downloadNode(node).catch((err) => {
            console.error("Download failed:", err);
          });
        },
      };
    }

    case "tree": {
      const treeLines = generateTree(VIRTUAL_FS, "", context.customNames, context.deletedNodeIds);
      return {
        text: `/home/husain\n` + treeLines.join("\n"),
      };
    }

    case "projects": {
      const list = PROJECTS_DATA.map(
        (p) => `• [${p.status}] ${p.name.padEnd(24, " ")} | ${p.tagline} (cd ~/projects/${p.slug})`
      );
      return {
        text: `Offensive & Defensive Security Tools & Projects:
--------------------------------------------------------------------------------
${list.join("\n")}

Tip: Type 'cd projects/<name>' to inspect individual directories.`,
      };
    }

    case "writeups": {
      const list = WRITEUPS_DATA.map(
        (w) => `• [${w.category.toUpperCase().padEnd(12, " ")}] [${w.difficulty.padEnd(6, " ")}] ${w.title}`
      );
      return {
        text: `Technical Research Writeups & Lab Walkthroughs:
--------------------------------------------------------------------------------
${list.join("\n")}

Tip: Type 'cd writeups' to navigate writeup directories.`,
      };
    }

    case "blogs": {
      const list = BLOGS_DATA.map(
        (b) => `• ${b.title}\n  ${b.mediumUrl} (${b.date} • ${b.readTime})`
      );
      return {
        text: `Published Technical Blogs (Medium):
--------------------------------------------------------------------------------
${list.join("\n\n")}`,
      };
    }

    case "skills": {
      const list = SKILLS_DATA.map(
        (cat) =>
          `[${cat.category.toUpperCase()}]\n${cat.skills.map((s) => `  - ${s}`).join("\n")}`
      );
      return {
        text: `Technical & Soft Skills:
--------------------------------------------------------------------------------
${list.join("\n\n")}`,
      };
    }

    case "experience": {
      const list = EXPERIENCE_DATA.map((exp) => {
        return `[${exp.role}] @ ${exp.organization} (${exp.period} • ${exp.duration})
Summary: ${exp.summary}
Metrics: ${exp.technicalImpact.map((m) => `${m.metric}: ${m.description}`).join(" | ")}`;
      });
      return {
        text: `Professional Experience & Technical Leadership:
--------------------------------------------------------------------------------
${list.join("\n\n")}`,
      };
    }

    case "resume": {
      if (typeof window !== "undefined") {
        window.open("/resume.pdf", "_blank");
      }
      return {
        text: `Opening official resume: /resume.pdf (280 KB)...
Link: /resume.pdf`,
      };
    }

    case "contact": {
      return {
        text: `Contact & Public Channels:
--------------------------------------------------------------------------------
Email:     ${PROFILE_DATA.email} (mailto:${PROFILE_DATA.email})
GitHub:    ${PROFILE_DATA.github}
LinkedIn:  ${PROFILE_DATA.linkedin}
Medium:    ${PROFILE_DATA.medium}
X:         ${PROFILE_DATA.x}
Portfolio: ${PROFILE_DATA.portfolio}`,
      };
    }

    case "theme": {
      if (args.length === 0 || args[0] === "toggle") {
        context.toggleTheme();
        return { text: `Theme toggled to ${context.theme === "dark" ? "light" : "dark"} mode.` };
      }
      const targetTheme = args[0].toLowerCase();
      if (targetTheme === "dark" || targetTheme === "light") {
        context.setTheme(targetTheme);
        return { text: `Theme set to ${targetTheme} mode.` };
      }
      return {
        text: `Usage: theme [dark | light | toggle]`,
        isError: true,
      };
    }

    case "mv":
    case "rename": {
      if (args.length < 2) {
        return {
          text: `Usage: ${command} <source_file_or_dir> <new_name>\nExample: ${command} about.md about-me.md`,
          isError: true,
        };
      }

      const sourceTarget = args[0];
      const newName = args.slice(1).join(" ").trim();
      if (!newName) {
        return {
          text: `${command}: missing destination file operand after '${sourceTarget}'`,
          isError: true,
        };
      }

      if (newName.includes("/")) {
        return {
          text: `${command}: cannot move across directories. Rename within current directory only (destination name cannot contain '/').`,
          isError: true,
        };
      }

      const sourcePath = sourceTarget.startsWith("/")
        ? normalizePath(sourceTarget)
        : normalizePath(`${context.currentPath}/${sourceTarget}`);

      const node = findNodeByPath(sourcePath, VIRTUAL_FS, context.customNames);
      if (!node) {
        return {
          text: `${command}: cannot stat '${sourceTarget}': No such file or directory`,
          isError: true,
        };
      }

      if (node.id === "root" || node.path === "/home/husain") {
        return {
          text: `${command}: cannot rename the root workspace directory`,
          isError: true,
        };
      }

      const oldDisplayName = context.customNames?.[node.id] || node.name;
      if (context.renameNode) {
        context.renameNode(node.id, newName);
      }

      return {
        text: `Renamed '${oldDisplayName}' -> '${newName}' (canonical session name updated).`,
      };
    }

    case "reset": {
      if (context.resetModifications) {
        context.resetModifications();
      }
      return {
        text: "Workspace filesystem restored to original default state (all renames, folder orders, and deleted items cleared).",
      };
    }

    case "gui":
    case "exit": {
      context.setMode("gui");
      return { text: "Switching to GUI Workspace Mode..." };
    }

    default:
      return {
        text: `Command not found: ${command}\nType 'help' to view available commands.`,
        isError: true,
      };
  }
}

// Autocomplete Handler for TAB Key
export function getAutocompleteSuggestion(
  input: string,
  currentPath: string,
  customNames?: Record<string, string>,
  deletedNodeIds?: string[]
): string | null {
  const parts = input.split(" ");
  const isFirstWord = parts.length === 1;

  if (isFirstWord) {
    const search = parts[0].toLowerCase();
    const match = AVAILABLE_COMMANDS.find((cmd) => cmd.startsWith(search) && cmd !== search);
    return match || null;
  }

  // Completing arguments (files / directories)
  const lastArg = parts[parts.length - 1];

  const node = findNodeByPath(currentPath, VIRTUAL_FS, customNames);
  if (!node || node.type !== "directory") return null;

  const validChildren = node.children.filter((c) => !deletedNodeIds?.includes(c.id));
  const candidateNames = validChildren.map((c) => {
    const displayName = customNames?.[c.id] || c.name;
    return c.type === "directory" ? `${displayName}/` : displayName;
  });

  const match = candidateNames.find((name) => name.startsWith(lastArg) && name !== lastArg);
  if (match) {
    const updatedParts = [...parts.slice(0, -1), match];
    return updatedParts.join(" ");
  }

  return null;
}
