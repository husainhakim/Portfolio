"use client";

import React, { useState, useEffect } from "react";
import styles from "./BootSequence.module.css";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "[    0.000000] Linux kernel 6.8.0-sec-research x86_64 initialized", delay: 80 },
  { text: "[    0.042180] CPU0: AMD EPYC Security Processor (4 cores, 4.20 GHz)", delay: 140 },
  { text: "[    0.110450] Initializing memory encryption & secure isolation...", delay: 200 },
  { text: "[    0.245010] [OK] Mounted virtual root VFS at /home/husain", delay: 300 },
  { text: "[    0.412030] [OK] Loaded toolchains: scapy, libpcap, zxcvbn-v2, binwalk", delay: 440 },
  { text: "[    0.620000] [OK] Initializing offensive security lab environment...", delay: 600 },
  { text: "[    0.850000] [OK] Authenticated operator: husain (uid=1000, gid=1000)", delay: 800 },
  { text: "[    1.050000] [OK] Virtual filesystem synchronized with CLI & GUI buses.", delay: 1000 },
  { text: "[    1.250000] > Starting Husain Hakim Cybersecurity Workspace...", delay: 1200 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Check if user already booted this session
    if (sessionStorage.getItem("vfs_booted") === "true") {
      onComplete();
      return;
    }

    const clearAllTimeouts = () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];
    };

    clearAllTimeouts();

    BOOT_LINES.forEach((line) => {
      const t = setTimeout(() => {
        setDisplayedLines((prev) => {
          if (prev.includes(line.text)) return prev;
          return [...prev, line.text];
        });
      }, line.delay);
      timeoutsRef.current.push(t);
    });

    const endTimeout = setTimeout(() => {
      setIsDone(true);
      sessionStorage.setItem("vfs_booted", "true");
      setTimeout(() => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 350);
    }, 1550);
    timeoutsRef.current.push(endTimeout);

    const handleSkip = () => {
      clearAllTimeouts();
      setIsDone(true);
      sessionStorage.setItem("vfs_booted", "true");
      if (typeof onComplete === 'function') {
        onComplete();
      }
    };

    window.addEventListener("keydown", handleSkip);

    return () => {
      clearAllTimeouts();
      window.removeEventListener("keydown", handleSkip);
    };
  }, []);

  return (
    <div
      className={`${styles.bootOverlay} ${isDone ? styles.bootFadeOut : ""}`}
      onClick={() => {
        sessionStorage.setItem("vfs_booted", "true");
        onComplete();
      }}
    >
      <div className={styles.bootScanline} />
      <div className={styles.bootContainer}>
        <div className={styles.bootHeader}>
          <span className={styles.bootLogo}>HUSAIN_OS // VFS_BOOT_LOADER</span>
          <span className={styles.bootSkipHint}>[CLICK OR PRESS ANY KEY TO SKIP]</span>
        </div>

        <div className={styles.bootLog}>
          {displayedLines.map((line, idx) => (
            <div key={idx} className={styles.bootLine}>
              {line}
            </div>
          ))}
          <div className={styles.bootCursor} />
        </div>
      </div>
    </div>
  );
}
