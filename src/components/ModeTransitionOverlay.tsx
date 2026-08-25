"use client";

import React, { useEffect, useState } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import styles from "./ModeTransition.module.css";

export function ModeTransitionOverlay() {
  const { mode } = useFilesystem();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevMode, setPrevMode] = useState(mode);

  useEffect(() => {
    if (mode !== prevMode) {
      setIsTransitioning(true);
      setPrevMode(mode);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [mode, prevMode]);

  if (!isTransitioning) return null;

  return (
    <div className={styles.transitionContainer}>
      <div className={styles.glitchScanline} />
      <div className={styles.transitionText}>
        <span>&gt;&gt; SWITCHING CONTEXT // {mode.toUpperCase()}_BUS</span>
      </div>
    </div>
  );
}
