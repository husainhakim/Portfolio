"use client";

import React, { useState, useEffect } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { GuiWorkspace } from "@/components/gui/GuiWorkspace";
import { Terminal } from "@/components/cli/Terminal";
import { BootSequence } from "@/components/BootSequence";
import { ModeTransitionOverlay } from "@/components/ModeTransitionOverlay";
import { PROFILE_DATA } from "@/data/profileData";
import { PROJECTS_DATA } from "@/data/projectsData";
import { WRITEUPS_DATA } from "@/data/writeupsData";
import { BLOGS_DATA } from "@/data/blogsData";

export default function WorkspacePage() {
  const { mode } = useFilesystem();
  const [bootCompleted, setBootCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Check if session already booted
    const hasBooted = sessionStorage.getItem("vfs_booted");
    if (hasBooted) {
      setBootCompleted(true);
    }
  }, []);

  return (
    <>
      {/* Interactive Bootloader on initial session load */}
      {!bootCompleted && (
        <BootSequence onComplete={() => setBootCompleted(true)} />
      )}

      {/* Mode Transition CRT Raster Glitch Effect */}
      <ModeTransitionOverlay />

      {/* Primary Interactive Workspace (GUI or CLI based on mode) */}
      {mode === "gui" ? <GuiWorkspace /> : <Terminal />}

      {/* Crawlable Semantic Layer for SEO and Assistive Technologies (visually hidden) */}
      <section
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        aria-hidden="true"
      >
        <h1>{PROFILE_DATA.name} — {PROFILE_DATA.title}</h1>
        <p>{PROFILE_DATA.summary}</p>
        <p>Current Education: B.Tech CSE at ITM Skills University (2023 - 2027)</p>
        <p>Experience: Backend Developer at LetsUpgrade (Sept 2025 - Present)</p>
        <p>Contact Email: {PROFILE_DATA.email}</p>
        <p>GitHub: {PROFILE_DATA.github}</p>
        <p>LinkedIn: {PROFILE_DATA.linkedin}</p>

        <h2>Offensive Security Projects</h2>
        {PROJECTS_DATA.map((proj) => (
          <article key={proj.id}>
            <h3>{proj.name}</h3>
            <p>{proj.summary}</p>
            <p>Technologies: {proj.technologies.join(", ")}</p>
          </article>
        ))}

        <h2>Security Research Writeups</h2>
        {WRITEUPS_DATA.map((w) => (
          <article key={w.id}>
            <h3>{w.title}</h3>
            <p>{w.summary}</p>
          </article>
        ))}

        <h2>Medium Technical Publications</h2>
        {BLOGS_DATA.map((b) => (
          <article key={b.id}>
            <h3>{b.title}</h3>
            <p>{b.summary}</p>
          </article>
        ))}
      </section>
    </>
  );
}
