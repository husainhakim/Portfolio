import JSZip from "jszip";
import { FSNode, FSFile, FSDirectory } from "@/data/filesystemData";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";

/**
 * Resolves the raw Markdown / text representation for any virtual file.
 */
export function getNodeContent(node: FSFile): string {
  if (node.content) {
    return node.content;
  }

  if (node.fileType === "project" && node.dataRef) {
    const proj = PROJECTS_DATA.find((p) => p.id === node.dataRef);
    if (proj) {
      return `# ${proj.name}
**${proj.tagline}**

- **Category:** ${proj.category}
- **Status:** ${proj.status}
- **Date:** ${proj.date}
${proj.githubUrl ? `- **GitHub:** ${proj.githubUrl}\n` : ""}${proj.demoUrl ? `- **Live Demo:** ${proj.demoUrl}\n` : ""}
## Overview
${proj.summary}

## Problem Statement
${proj.problemStatement}

## Technologies & Stack
${proj.technologies.map((t) => `- ${t}`).join("\n")}

## Security Concepts
${proj.securityConcepts.map((s) => `- ${s}`).join("\n")}

## Architecture Details
${proj.architectureDetails.map((a) => `- ${a}`).join("\n")}

## Key Features
${proj.keyFeatures.map((f) => `- ${f}`).join("\n")}

${proj.lessonsLearned && proj.lessonsLearned.length > 0 ? `## Lessons Learned\n${proj.lessonsLearned.map((l) => `- ${l}`).join("\n")}\n` : ""}
${proj.futureRoadmap && proj.futureRoadmap.length > 0 ? `## Future Roadmap\n${proj.futureRoadmap.map((r) => `- ${r}`).join("\n")}\n` : ""}`;
    }
  }

  if (node.fileType === "writeup" && node.dataRef) {
    const w = WRITEUPS_DATA.find((item) => item.id === node.dataRef);
    if (w) {
      if (w.markdownContent) return w.markdownContent;
      return `# ${w.title}
**Category:** ${w.categoryLabel} | **Difficulty:** ${w.difficulty} | **Target:** ${w.targetSystem}
**Date:** ${w.date} | **Read Time:** ${w.readTime}

## Summary
${w.summary}

## Table of Contents
${w.tableOfContents.map((t) => `- ${t}`).join("\n")}

${w.content ? `
## Objective
${w.content.objective}

## Reconnaissance & Enumeration
${w.content.reconnaissance}
${w.content.enumeration}

## Vulnerability Analysis
${w.content.vulnerabilityAnalysis}

## Exploitation Steps
${w.content.exploitationSteps.map((s) => `### Step ${s.stepNumber}: ${s.title}\n${s.command ? `\`\`\`bash\n${s.command}\n\`\`\`\n` : ""}${s.explanation}\n${s.output ? `\`\`\`text\n${s.output}\n\`\`\`\n` : ""}`).join("\n")}

## Root Cause & Mitigation
**Root Cause:** ${w.content.rootCause}

**Mitigation Steps:**
${w.content.mitigation.map((m) => `- ${m}`).join("\n")}

## Lessons Learned
${w.content.lessonsLearned.map((l) => `- ${l}`).join("\n")}
` : ""}`;
    }
  }

  if (node.fileType === "blog" && node.dataRef) {
    const blog = BLOGS_DATA.find((b) => b.id === node.dataRef);
    if (blog) {
      return `# ${blog.title}
**Publication:** ${blog.publication} | **Date:** ${blog.date} | **Read Time:** ${blog.readTime}
${blog.mediumUrl ? `**Original Link:** ${blog.mediumUrl}\n` : ""}
## Summary
${blog.summary}

${blog.content ? `\n${blog.content}\n` : ""}

## Key Takeaways
${blog.keyTakeaways.map((t) => `- ${t}`).join("\n")}`;
    }
  }

  return `# ${node.name}\n\n${node.description || "Virtual workspace file"}`;
}

/**
 * Initiates a browser file download using an anchor tag and Blob / direct URL.
 */
function triggerBrowserDownload(blobOrUrl: Blob | string, filename: string) {
  const isUrl = typeof blobOrUrl === "string";
  const url = isUrl ? blobOrUrl : URL.createObjectURL(blobOrUrl);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (!isUrl) {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Resolves the download filename.
 * All files strictly get the .md extension so they open in markdown editors,
 * except the resume which is always HusainHakim_Resume.pdf.
 */
export function getDownloadFilename(node: FSFile): string {
  if (node.name.toLowerCase().includes("resume") || node.fileType === "pdf") {
    return "HusainHakim_Resume.pdf";
  }

  if (node.name.toLowerCase().endsWith(".md")) {
    return node.name;
  }

  // Strip existing non-md extension (e.g. .txt) and ensure .md
  const baseName = node.name.replace(/\.[^/.]+$/, "");
  return `${baseName || node.name}.md`;
}

/**
 * Downloads a single file from the virtual filesystem.
 * Ensures resume is downloaded as binary PDF with filename HusainHakim_Resume.pdf,
 * and all other files download with a .md extension.
 */
export async function downloadSingleFile(node: FSFile): Promise<void> {
  const filename = getDownloadFilename(node);

  // If this is the resume PDF file
  if (node.name.toLowerCase().includes("resume") || node.fileType === "pdf") {
    triggerBrowserDownload("/resume.pdf", filename);
    return;
  }

  // Text/Markdown files
  const content = getNodeContent(node);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  triggerBrowserDownload(blob, filename);
}

/**
 * Recursively adds directory contents to a JSZip instance.
 */
async function addFolderToZip(zipFolder: JSZip, directory: FSDirectory): Promise<void> {
  for (const child of directory.children) {
    if (child.type === "file") {
      const filename = getDownloadFilename(child);
      if (child.name.toLowerCase().includes("resume") || child.fileType === "pdf") {
        try {
          const res = await fetch("/resume.pdf");
          const arrayBuffer = await res.arrayBuffer();
          zipFolder.file(filename, arrayBuffer);
        } catch {
          // fallback text placeholder if fetch fails
          zipFolder.file("HusainHakim_Resume.pdf", "Resume binary available at /resume.pdf");
        }
      } else {
        const textContent = getNodeContent(child);
        zipFolder.file(filename, textContent);
      }
    } else if (child.type === "directory") {
      const subZip = zipFolder.folder(child.name);
      if (subZip) {
        await addFolderToZip(subZip, child);
      }
    }
  }
}

/**
 * Downloads an entire directory as a .zip file.
 */
export async function downloadDirectoryAsZip(directory: FSDirectory): Promise<void> {
  const zip = new JSZip();
  await addFolderToZip(zip, directory);

  const zipBlob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const zipFilename = `${directory.name}.zip`;
  triggerBrowserDownload(zipBlob, zipFilename);
}

/**
 * Master entry point for downloading any FSNode (file or directory).
 */
export async function downloadNode(node: FSNode): Promise<void> {
  if (node.type === "file") {
    await downloadSingleFile(node);
  } else {
    await downloadDirectoryAsZip(node);
  }
}
