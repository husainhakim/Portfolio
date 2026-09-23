"use client";
 
import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { GuiWorkspace } from "@/components/gui/GuiWorkspace";
import { Terminal } from "@/components/cli/Terminal";
import { BootSequence } from "@/components/BootSequence";
import { ModeTransitionOverlay } from "@/components/ModeTransitionOverlay";
import { AutopilotOverlay } from "@/components/gui/FeatureDiscovery/AutopilotOverlay";

export function ClientWorkspace() {
  const { mode, isBooted, completeBoot } = useFilesystem();

  return (
    <>
      {/* Interactive Bootloader on initial session load */}
      {!isBooted && (
        <BootSequence onComplete={completeBoot} />
      )}

      {/* Mode Transition CRT Raster Glitch Effect */}
      <ModeTransitionOverlay />

      {/* Primary Interactive Workspace (GUI or CLI based on mode) */}
      {mode === "gui" ? <GuiWorkspace /> : <Terminal />}

      {/* Live 20-Second Autopilot Skim HUD Overlay */}
      <AutopilotOverlay />
    </>
  );
}

