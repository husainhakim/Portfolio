"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { GuiWorkspace } from "@/components/gui/GuiWorkspace";
import { Terminal } from "@/components/cli/Terminal";
import { BootSequence } from "@/components/BootSequence";
import { ModeTransitionOverlay } from "@/components/ModeTransitionOverlay";

export function ClientWorkspace() {
  const { mode } = useFilesystem();
  const [bootCompleted, setBootCompleted] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("vfs_booted") === "true") {
        setBootCompleted(true);
      }
    } catch (_) {
      setBootCompleted(true);
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setBootCompleted(true);
  }, []);

  return (
    <>
      {/* Interactive Bootloader on initial session load */}
      {!bootCompleted && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Mode Transition CRT Raster Glitch Effect */}
      <ModeTransitionOverlay />

      {/* Primary Interactive Workspace (GUI or CLI based on mode) */}
      {mode === "gui" ? <GuiWorkspace /> : <Terminal />}
    </>
  );
}
