import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Views.module.css";
import { Lock, Unlock, ShieldAlert, AlertCircle, HelpCircle, Terminal, Compass, Brain } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const VALID_ANSWERS: Record<string, string[]> = {
  q1: ["pcmb", "physics chemistry maths biology", "pcmb stream", "science pcmb"],
  q2: ["cpp", "c++", "c plus plus"],
  q3: ["pilot", "airline pilot", "fighter pilot"],
};

const QUESTIONS = [
  { key: "q1", label: "What was my major or field of study before security?" },
  { key: "q2", label: "Which language did I write my first 'Hello World' in?" },
  { key: "q3", label: "What's one thing I thought I'd become instead of a developer?" },
];

function normalize(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s+]/g, "").replace(/\s+/g, " ");
}

function checkAnswer(questionKey: string, userInput: string): boolean {
  const normalized = normalize(userInput);
  if (!normalized) return false;
  const validList = VALID_ANSWERS[questionKey];
  if (!validList) return false;
  for (const valid of validList) {
    const nv = normalize(valid);
    if (normalized === nv || normalized.includes(nv) || nv.includes(normalized)) return true;
  }
  return false;
}

export type VaultPhase = "idle" | "submitting" | "vault_unlock" | "dissolve";
export type VaultStep = "wheel_turn" | "bolts_retract" | "door_open";

export function PersonalVaultView() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<VaultPhase>("idle");
  const [vaultStep, setVaultStep] = useState<VaultStep>("wheel_turn");
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [statusText, setStatusText] = useState("[>] ENGAGING PRIMARY LOCKING MECHANISM...");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (mounted && !isUnlocked && firstInputRef.current) firstInputRef.current.focus();
  }, [mounted, isUnlocked]);

  const completeUnlock = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase("dissolve");
    setTimeout(() => {
      setIsUnlocked(true);
      setPhase("idle");
    }, 420);
  }, []);

  // Focus trap & escape listener
  useEffect(() => {
    if (isUnlocked) return;
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (phase === "vault_unlock" || phase === "dissolve")) {
        completeUnlock();
        return;
      }
      if (!overlayRef.current) return;
      if (e.key !== "Tab") return;
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>("input, button");
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [isUnlocked, phase, completeUnlock]);

  const handleInputChange = useCallback((key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (error) setError("");
  }, [error]);

  const handleUnlock = useCallback(() => {
    if (phase !== "idle") return;
    const anyCorrect = QUESTIONS.some(q => checkAnswer(q.key, answers[q.key as keyof typeof answers]));
    if (anyCorrect) {
      setError("");

      // Respect prefers-reduced-motion
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setIsUnlocked(true);
        return;
      }

      // Step 0: Input modal exits (200ms)
      setPhase("submitting");

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      // Step 1 (0.2s): Vault Door Appears & Central Wheel Begins Spinning
      const t0 = setTimeout(() => {
        setPhase("vault_unlock");
        setVaultStep("wheel_turn");
        setStatusText("[>] ENGAGING PRIMARY LOCKING MECHANISM...");
      }, 200);

      // Step 2 (1.1s): Wheel Stops, Heavy Locking Bolts Retract Inward
      const t1 = setTimeout(() => {
        setVaultStep("bolts_retract");
        setStatusText("[✓] HEAVY LOCKING BOLTS RETRACTED");
      }, 1100);

      // Step 3 (1.85s): Massive Vault Door Swings Open in 3D
      const t2 = setTimeout(() => {
        setVaultStep("door_open");
        setStatusText("[✓] VAULT DOOR OPEN — ACCESS GRANTED");
      }, 1850);

      // Step 4 (2.65s): Dissolve into decrypted vault (completes at ~3.05s)
      const t3 = setTimeout(() => {
        completeUnlock();
      }, 2650);

      timersRef.current = [t0, t1, t2, t3];
    } else {
      setError("None of those matched — you only need one right.");
    }
  }, [answers, phase, completeUnlock]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleUnlock(); }
  }, [handleUnlock]);

  // ── Lock Screen ──
  if (!isUnlocked) {
    const isAnimPhase = phase === "vault_unlock" || phase === "dissolve";
    const isAccessGranted = vaultStep !== "wheel_turn";

    // Legitimate Heavy Bank Vault 3D Opening Stage (~3s duration, zero external video/GIF dependency)
    if (isAnimPhase) {
      const animStage = (
        <div
          ref={overlayRef}
          data-theme={theme}
          className={`${styles.vaultFullscreenStage} ${isDark ? styles.vaultStageDark : styles.vaultStageLight} ${phase === "dissolve" ? styles.vaultFullscreenExit : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Personal Vault Decryption Sequence"
        >
          {/* Top Bar HUD */}
          <div className={styles.vaultFullscreenHeader}>
            <div className={styles.vaultFullscreenTitle}>
              <Lock size={16} color={isAccessGranted ? (isDark ? "#22c55e" : "#16a34a") : (isDark ? "#ef4444" : "#dc2626")} />
              <span>{isAccessGranted ? "personal_vault.md [DECRYPTED]" : "personal_vault.md [DECRYPTING...]"}</span>
            </div>
            <button
              type="button"
              className={styles.vaultVideoSkipBtn}
              onClick={completeUnlock}
              title="Skip animation (ESC)"
            >
              SKIP ➔ [ESC]
            </button>
          </div>

          {/* Heavy Cyber / Bank Vault 3D Stage */}
          <div className={`${styles.vaultDoorStage3d} ${isAccessGranted ? styles.vaultDoorStageGranted : ""}`}>
            {/* Ambient Room Backlight */}
            <div className={`${styles.vaultLockAura} ${isAccessGranted ? styles.vaultLockAuraGranted : ""}`} />

            {/* 1 & 2. Static Vault Bulkhead Ring & Chamber Interior (Unified 360x360 SVG) */}
            <svg
              className={styles.vaultPortalOuterSvg}
              viewBox="0 0 360 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                {/* Circular clipping path for interior chamber */}
                <clipPath id="vaultInteriorClip">
                  <circle cx="180" cy="180" r="140" />
                </clipPath>

                {/* Outer Bulkhead Wall Gradient */}
                <linearGradient id="portalWallGrad" x1="20" y1="20" x2="340" y2="340" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#1e293b" : "#ffffff"} />
                  <stop offset="50%" stopColor={isDark ? "#0f172a" : "#e2e8f0"} />
                  <stop offset="100%" stopColor={isDark ? "#020617" : "#cbd5e1"} />
                </linearGradient>

                {/* Left Hinges Gradient */}
                <linearGradient id="hingeMetalGrad" x1="20" y1="70" x2="55" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#64748b" : "#ffffff"} />
                  <stop offset="35%" stopColor={isDark ? "#cbd5e1" : "#f1f5f9"} />
                  <stop offset="70%" stopColor={isDark ? "#475569" : "#cbd5e1"} />
                  <stop offset="100%" stopColor={isDark ? "#1e293b" : "#94a3b8"} />
                </linearGradient>

                {/* Chamber Wall Gradient */}
                <radialGradient id="chamberWallGrad" cx="180" cy="180" r="140" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#1e293b" : "#f8fafc"} />
                  <stop offset="60%" stopColor={isDark ? "#0f172a" : "#e2e8f0"} />
                  <stop offset="100%" stopColor={isDark ? "#020617" : "#cbd5e1"} />
                </radialGradient>

                {/* Safe Deposit Box Metal Gradient */}
                <linearGradient id="boxGrad" x1="0" y1="0" x2="50" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#334155" : "#ffffff"} />
                  <stop offset="40%" stopColor={isDark ? "#1e293b" : "#f8fafc"} />
                  <stop offset="80%" stopColor={isDark ? "#0f172a" : "#e2e8f0"} />
                  <stop offset="100%" stopColor={isDark ? "#1e293b" : "#cbd5e1"} />
                </linearGradient>

                {/* Master Open Safe Box Glow */}
                <linearGradient id="masterBoxGrad" x1="0" y1="0" x2="50" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#064e3b" : "#dcfce7"} />
                  <stop offset="100%" stopColor={isDark ? "#022c22" : "#bbf7d0"} />
                </linearGradient>

                {/* Tactical Red-Team Arsenal & Personal Dossier Gradients */}
                <linearGradient id="pelicanShellGrad" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#1e293b" : "#475569"} />
                  <stop offset="50%" stopColor={isDark ? "#0f172a" : "#334155"} />
                  <stop offset="100%" stopColor={isDark ? "#020617" : "#1e293b"} />
                </linearGradient>

                <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0b0f19" />
                  <stop offset="100%" stopColor="#030712" />
                </linearGradient>

                <linearGradient id="flipperBodyGrad" x1="0" y1="0" x2="42" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>

                <linearGradient id="flipperLcdGrad" x1="0" y1="0" x2="22" y2="15" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>

                <linearGradient id="duckyPcbGrad" x1="0" y1="0" x2="42" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="50%" stopColor="#166534" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>

                <linearGradient id="ctfMedalGrad" x1="0" y1="0" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#fde047" />
                  <stop offset="75%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>

                <linearGradient id="wingsGrad" x1="0" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                <linearGradient id="dossierGrad" x1="0" y1="0" x2="80" y2="50" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#1e293b" : "#f8fafc"} />
                  <stop offset="60%" stopColor={isDark ? "#151e2e" : "#f1f5f9"} />
                  <stop offset="100%" stopColor={isDark ? "#0f172a" : "#e2e8f0"} />
                </linearGradient>

                <linearGradient id="hsmAlloyGrad" x1="0" y1="0" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "#334155" : "#475569"} />
                  <stop offset="40%" stopColor={isDark ? "#1e293b" : "#334155"} />
                  <stop offset="100%" stopColor={isDark ? "#090d16" : "#1e293b"} />
                </linearGradient>

                {/* Volumetric Overhead Security Spotlight */}
                <linearGradient id="spotlightBeam" x1="180" y1="40" x2="180" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={isDark ? "rgba(74, 222, 128, 0.4)" : "rgba(34, 197, 94, 0.3)"} />
                  <stop offset="50%" stopColor={isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)"} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* ── A. THE INTERIOR VAULT CHAMBER (Clipped to r=140 inner opening) ── */}
              <g clipPath="url(#vaultInteriorClip)">
                {/* 1. Chamber Background Wall */}
                <rect x="40" y="40" width="280" height="280" fill="url(#chamberWallGrad)" />

                {/* 2. Security Laser Grid */}
                <g opacity={isDark ? "0.22" : "0.16"}>
                  {[80, 120, 160, 200, 240, 280].map(x => (
                    <line key={`v-${x}`} x1={x} y1="40" x2={x} y2="320" stroke="#22c55e" strokeWidth="0.8" />
                  ))}
                  {[70, 110, 150, 190, 230, 270].map(y => (
                    <line key={`h-${y}`} x1="40" y1={y} x2="320" y2={y} stroke="#22c55e" strokeWidth="0.8" />
                  ))}
                </g>

                {/* 3. 12 Safe Deposit Boxes on Back Wall */}
                <g id="vaultLockersGrid">
                  {[
                    { x: 56, y: 54, id: "01" },
                    { x: 114, y: 54, id: "02" },
                    { x: 172, y: 54, id: "03" },
                    { x: 230, y: 54, id: "04" },
                    { x: 56, y: 88, id: "05" },
                    { x: 114, y: 88, id: "06" },
                    { x: 172, y: 88, id: "07" },
                    { x: 230, y: 88, id: "08" },
                    { x: 56, y: 122, id: "09" },
                    { x: 114, y: 122, id: "10" },
                    { x: 172, y: 122, id: "11" },
                    { x: 230, y: 122, id: "12" },
                  ].map(box => {
                    const isMaster = box.id === "07";
                    return (
                      <g key={box.id} transform={`translate(${box.x}, ${box.y})`}>
                        <rect
                          x="0"
                          y="0"
                          width="48"
                          height="28"
                          rx="2"
                          fill={isMaster ? "url(#masterBoxGrad)" : "url(#boxGrad)"}
                          stroke={isMaster ? "#22c55e" : (isDark ? "#334155" : "#cbd5e1")}
                          strokeWidth={isMaster ? "1.5" : "0.8"}
                        />
                        <rect
                          x="17"
                          y="3"
                          width="14"
                          height="7"
                          rx="1"
                          fill={isDark ? "#0f172a" : "#ffffff"}
                          stroke={isDark ? "#475569" : "#cbd5e1"}
                          strokeWidth="0.5"
                        />
                        <text
                          x="24"
                          y="8.5"
                          textAnchor="middle"
                          fill={isMaster ? "#22c55e" : (isDark ? "#94a3b8" : "#475569")}
                          fontSize="5"
                          fontFamily="var(--font-mono)"
                          fontWeight="bold"
                        >
                          {box.id}
                        </text>
                        <circle cx="12" cy="18" r="1.4" fill={isDark ? "#020617" : "#475569"} />
                        <circle cx="36" cy="18" r="1.4" fill={isDark ? "#020617" : "#475569"} />
                        <rect x="20" y="19" width="8" height="2" rx="0.5" fill={isDark ? "#64748b" : "#94a3b8"} />
                      </g>
                    );
                  })}
                </g>

                {/* 4. Heavy Reinforced Industrial Shelf (y=156) */}
                <rect
                  x="48"
                  y="156"
                  width="264"
                  height="8"
                  rx="1"
                  fill={isDark ? "#334155" : "#94a3b8"}
                  stroke={isDark ? "#475569" : "#64748b"}
                  strokeWidth="1"
                />
                <rect
                  x="50"
                  y="164"
                  width="260"
                  height="14"
                  fill={isDark ? "#0f172a" : "#cbd5e1"}
                  stroke={isDark ? "#1e293b" : "#94a3b8"}
                  strokeWidth="0.5"
                />
                <rect x="52" y="178" width="256" height="8" fill="rgba(0,0,0,0.4)" filter="blur(4px)" />

                {/* 5. Tactical Red-Team Arsenal & Personal Dossier (Option 3 on Shelf) */}
                {/* ITEM A: RUGGED ARMORED PELICAN CASE (Left side of shelf, resting at y=156) */}
                <g id="tacticalPelicanCase">
                  {/* Case Outer Shell */}
                  <rect
                    x="56"
                    y="112"
                    width="118"
                    height="44"
                    rx="4"
                    fill="url(#pelicanShellGrad)"
                    stroke={isDark ? "#475569" : "#64748b"}
                    strokeWidth="1.2"
                  />
                  {/* Rugged Structural Ribs */}
                  <line x1="72" y1="112" x2="72" y2="156" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="1.4" />
                  <line x1="88" y1="112" x2="88" y2="156" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="1.4" />
                  <line x1="142" y1="112" x2="142" y2="156" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="1.4" />
                  <line x1="158" y1="112" x2="158" y2="156" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="1.4" />

                  {/* Heavy Latches */}
                  <rect x="80" y="110" width="8" height="5" rx="1" fill={isDark ? "#020617" : "#0f172a"} stroke="#94a3b8" strokeWidth="0.6" />
                  <rect x="140" y="110" width="8" height="5" rx="1" fill={isDark ? "#020617" : "#0f172a"} stroke="#94a3b8" strokeWidth="0.6" />
                  {/* Carrying Handle */}
                  <rect x="100" y="109" width="30" height="4" rx="2" fill="none" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1.5" />

                  {/* High-Density Custom Foam Insert */}
                  <rect x="60" y="115" width="110" height="38" rx="2.5" fill="url(#foamGrad)" />
                  <rect x="61" y="116" width="108" height="36" rx="2" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                  {/* --- COMPONENT 1: FLIPPER ZERO / SUB-GHZ PENTEST DECK --- */}
                  <g id="flipperZero" transform="translate(64, 118)">
                    {/* Foam Cutout Recess */}
                    <rect x="0" y="0" width="44" height="32" rx="3" fill="#020617" />
                    {/* White Chamfered Body */}
                    <rect x="2" y="2" width="40" height="28" rx="2.5" fill="url(#flipperBodyGrad)" stroke="#94a3b8" strokeWidth="0.6" />
                    {/* Lanyard Eyelet */}
                    <circle cx="5.5" cy="5.5" r="1.4" fill="#64748b" />

                    {/* Backlit Orange LCD Screen */}
                    <rect x="5" y="9" width="21" height="15" rx="1.5" fill="url(#flipperLcdGrad)" stroke="#9a3412" strokeWidth="0.5" />
                    {/* Screen Content: Sub-GHz Waveform & Frequency */}
                    <text x="7" y="14" fill="#431407" fontSize="2.8" fontFamily="var(--font-mono)" fontWeight="900">315.00M</text>
                    <path d="M7 17.5 Q9 15.5 11 17.5 T15 17.5 T19 17.5" fill="none" stroke="#431407" strokeWidth="0.8" />
                    <text x="7" y="22.5" fill="#431407" fontSize="2.5" fontFamily="var(--font-mono)" fontWeight="700">SUB-GHZ</text>

                    {/* D-Pad Controller */}
                    <circle cx="33" cy="16.5" r="5" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />
                    <circle cx="33" cy="16.5" r="1.8" fill="#f8fafc" />
                    <rect x="32.3" y="12.5" width="1.4" height="8" rx="0.5" fill="#64748b" />
                    <rect x="29" y="15.8" width="8" height="1.4" rx="0.5" fill="#64748b" />
                    <circle cx="33" cy="25" r="1.2" fill="#64748b" />

                    {/* Status Cyber LED */}
                    <circle cx="8" cy="5.5" r="1" fill="#22c55e" />
                    <circle cx="8" cy="5.5" r="2.2" fill="none" stroke="#22c55e" strokeWidth="0.4" opacity="0.6" />
                  </g>

                  {/* --- COMPONENT 2: USB RUBBER DUCKY / HARDWARE IMPLANT --- */}
                  <g id="rubberDucky" transform="translate(112, 118)">
                    {/* Foam Cutout Recess */}
                    <rect x="0" y="0" width="54" height="14" rx="2" fill="#020617" />
                    {/* USB-A Male Plug */}
                    <rect x="2" y="3" width="9" height="8" rx="1" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                    <rect x="3.5" y="4.5" width="2" height="2" fill="#eab308" />
                    <rect x="3.5" y="7.5" width="2" height="2" fill="#eab308" />

                    {/* Matte Green PCB Board */}
                    <rect x="10" y="2" width="41" height="10" rx="1.5" fill="url(#duckyPcbGrad)" stroke="#15803d" strokeWidth="0.5" />
                    {/* Gold Traces */}
                    <line x1="12" y1="4.5" x2="20" y2="4.5" stroke="#facc15" strokeWidth="0.4" />
                    <line x1="12" y1="9.5" x2="20" y2="9.5" stroke="#facc15" strokeWidth="0.4" />
                    <circle cx="21" cy="4.5" r="0.6" fill="#facc15" />
                    <circle cx="21" cy="9.5" r="0.6" fill="#facc15" />

                    {/* Microchip */}
                    <rect x="22" y="3.5" width="10" height="7" rx="0.5" fill="#0f172a" stroke="#334155" strokeWidth="0.4" />
                    {/* Silkscreen Text */}
                    <text x="34" y="7.5" fill="#fef08a" fontSize="3.2" fontFamily="var(--font-mono)" fontWeight="900">DUCKY</text>
                    <text x="34" y="10.8" fill="#86efac" fontSize="2.4" fontFamily="var(--font-mono)">HID 2.0</text>
                    {/* Activity Indicator LED */}
                    <circle cx="48" cy="7" r="1" fill="#ef4444" />
                    <circle cx="48" cy="7" r="2" fill="none" stroke="#ef4444" strokeWidth="0.4" opacity="0.5" />
                  </g>

                  {/* --- COMPONENT 3: CTF MEDALLION & PILOT WINGS CREST --- */}
                  <g id="achievements" transform="translate(112, 135)">
                    {/* Foam Cutout Recess */}
                    <rect x="0" y="0" width="54" height="15" rx="2" fill="#020617" />

                    {/* CTF First Blood Medallion */}
                    <g transform="translate(10, 7.5)">
                      {/* Ribbon */}
                      <rect x="-4" y="-7" width="8" height="4" fill="#dc2626" stroke="#1e3a8a" strokeWidth="0.5" />
                      {/* Gold Coin */}
                      <circle cx="0" cy="0" r="5.5" fill="url(#ctfMedalGrad)" stroke="#a16207" strokeWidth="0.7" />
                      <circle cx="0" cy="0" r="4.2" fill="none" stroke="#ca8a04" strokeWidth="0.4" strokeDasharray="1,1" />
                      {/* Embossed Star */}
                      <polygon points="0,-3 0.9,-0.8 3.2,-0.7 1.4,0.6 2.1,2.8 0,1.5 -2.1,2.8 -1.4,0.6 -3.2,-0.7 -0.9,-0.8" fill="#a16207" />
                    </g>
                    <text x="10" y="13.5" textAnchor="middle" fill={isDark ? "#fde047" : "#854d0e"} fontSize="2.4" fontFamily="var(--font-mono)" fontWeight="bold">CTF #1</text>

                    {/* Aviation Wings Crest (Pilot Aspirations) */}
                    <g transform="translate(37, 6.5)">
                      {/* Left Wing */}
                      <path d="M-2 -1 C-6 -4, -11 -2, -14 0 C-10 1.5, -5 1, -2 0.5 Z" fill="url(#wingsGrad)" stroke="#94a3b8" strokeWidth="0.4" />
                      {/* Right Wing */}
                      <path d="M2 -1 C6 -4, 11 -2, 14 0 C10 1.5, 5 1, 2 0.5 Z" fill="url(#wingsGrad)" stroke="#94a3b8" strokeWidth="0.4" />
                      {/* Center Shield */}
                      <path d="M-2.2 -2.5 L2.2 -2.5 L2.2 0.5 C2.2 2, 0 3.2, 0 3.2 C0 3.2, -2.2 2, -2.2 0.5 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="0.4" />
                      <circle cx="0" cy="0" r="0.8" fill="#ffffff" />
                    </g>
                    <text x="37" y="13.5" textAnchor="middle" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="2.4" fontFamily="var(--font-mono)" fontWeight="bold">PILOT</text>
                  </g>
                </g>

                {/* ITEM B: CLASSIFIED TACTICAL DOSSIER & HARDWARE HSM KEY (Right side of shelf) */}
                <g id="tacticalDossierSection">
                  {/* --- CLASSIFIED DOSSIER FOLDER --- */}
                  <g id="dossierFolder" transform="translate(182, 106)">
                    {/* Top Classification Tab */}
                    <path d="M6 0 L6 -6 L34 -6 L37 0 Z" fill={isDark ? "#b91c1c" : "#dc2626"} />
                    <text x="10" y="-1.8" fill="#ffffff" fontSize="3.5" fontFamily="var(--font-mono)" fontWeight="900" letterSpacing="0.08em">RESTRICTED</text>

                    {/* Tactical Binder Body */}
                    <rect
                      x="0"
                      y="0"
                      width="78"
                      height="50"
                      rx="2.5"
                      fill="url(#dossierGrad)"
                      stroke={isDark ? "#475569" : "#94a3b8"}
                      strokeWidth="1.2"
                    />

                    {/* Reinforced Left Spine */}
                    <rect x="0" y="0" width="7" height="50" rx="1" fill={isDark ? "#0f172a" : "#334155"} />
                    <circle cx="3.5" cy="8" r="1.2" fill="#94a3b8" />
                    <circle cx="3.5" cy="42" r="1.2" fill="#94a3b8" />

                    {/* Classification Red Stamp Box */}
                    <rect x="11" y="6" width="62" height="11" rx="1.5" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="0.8" />
                    <text x="42" y="13.5" textAnchor="middle" fill="#ef4444" fontSize="4.2" fontFamily="var(--font-mono)" fontWeight="900" letterSpacing="0.08em">TOP SECRET // LEVEL 5</text>

                    {/* Dossier Document Title */}
                    <text x="11" y="24" fill={isDark ? "#f8fafc" : "#0f172a"} fontSize="5.8" fontFamily="var(--font-mono)" fontWeight="800">personal_vault.md</text>
                    {/* Domain & Background Subtitle */}
                    <text x="11" y="32" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="3.6" fontFamily="var(--font-mono)" fontWeight="bold">OFFENSIVE OPS • PCMB • GYM</text>

                    {/* Military Asset Tracking Barcode */}
                    <g transform="translate(11, 38)">
                      <line x1="0" y1="0" x2="0" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1" />
                      <line x1="3" y1="0" x2="3" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1.6" />
                      <line x1="7" y1="0" x2="7" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="0.8" />
                      <line x1="10" y1="0" x2="10" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="2.2" />
                      <line x1="15" y1="0" x2="15" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1" />
                      <line x1="18" y1="0" x2="18" y2="7" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1.4" />
                      <text x="24" y="5.5" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="3.2" fontFamily="var(--font-mono)">ID: HUS-8849</text>
                    </g>

                    {/* Corner Document Clip */}
                    <path d="M68 -2 L72 -2 L72 7 L68 7" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
                  </g>

                  {/* --- HARDWARE SECURITY MODULE (HSM) / ENCRYPTED KEY --- */}
                  <g id="hsmSecurityKey" transform="translate(266, 114)">
                    {/* Alloy Heatsink Enclosure */}
                    <rect
                      x="0"
                      y="0"
                      width="40"
                      height="42"
                      rx="3"
                      fill="url(#hsmAlloyGrad)"
                      stroke={isDark ? "#22c55e" : "#16a34a"}
                      strokeWidth="1.2"
                    />
                    {/* Cooling Fins */}
                    <line x1="4" y1="6" x2="36" y2="6" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="0.8" />
                    <line x1="4" y1="9" x2="36" y2="9" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="0.8" />
                    <line x1="4" y1="12" x2="36" y2="12" stroke={isDark ? "#090d16" : "#1e293b"} strokeWidth="0.8" />

                    {/* Glowing Activity LED Strip */}
                    <rect x="3" y="16" width="2" height="22" rx="1" fill="#22c55e" />

                    {/* Encrypted OLED Screen */}
                    <rect x="8" y="17" width="28" height="15" rx="1.5" fill="#020617" stroke="#15803d" strokeWidth="0.6" />
                    <text x="22" y="23" textAnchor="middle" fill="#4ade80" fontSize="3.4" fontFamily="var(--font-mono)" fontWeight="900">RSA-4096</text>
                    <text x="22" y="28" textAnchor="middle" fill="#86efac" fontSize="2.8" fontFamily="var(--font-mono)">HSM ACTIVE</text>

                    {/* Lanyard Ring */}
                    <circle cx="34" cy="4" r="1.4" fill={isDark ? "#090d16" : "#1e293b"} />
                  </g>
                </g>

                {/* 6. Volumetric Ceiling Spotlight */}
                <polygon points="120,40 240,40 310,320 50,320" fill="url(#spotlightBeam)" pointerEvents="none" />

                {/* 7. Floating Clearance HUD Card (Lower half of chamber) */}
                <g transform="translate(65, 196)">
                  <rect
                    x="0"
                    y="0"
                    width="230"
                    height="64"
                    rx="8"
                    fill={isDark ? "rgba(10, 15, 29, 0.92)" : "rgba(255, 255, 255, 0.96)"}
                    stroke={isDark ? "rgba(34, 197, 94, 0.6)" : "#16a34a"}
                    strokeWidth="1.4"
                    filter="drop-shadow(0 6px 16px rgba(0,0,0,0.5))"
                  />
                  {/* Glowing Unlock Circle */}
                  <circle cx="30" cy="32" r="18" fill={isDark ? "rgba(34, 197, 94, 0.18)" : "#dcfce7"} stroke={isDark ? "#22c55e" : "#16a34a"} strokeWidth="1.8" />
                  {/* Unlock Shackle & Body */}
                  <path
                    d="M26 27V22a4 4 0 0 1 8 0v2"
                    fill="none"
                    stroke={isDark ? "#22c55e" : "#16a34a"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="22"
                    y="27"
                    width="16"
                    height="11"
                    rx="2"
                    fill={isDark ? "#22c55e" : "#16a34a"}
                  />
                  <circle cx="30" cy="31.5" r="1.6" fill={isDark ? "#020617" : "#ffffff"} />

                  {/* Text Information */}
                  <text
                    x="58"
                    y="25"
                    fill={isDark ? "#4ade80" : "#15803d"}
                    fontSize="11.5"
                    fontFamily="var(--font-mono)"
                    fontWeight="800"
                    letterSpacing="0.14em"
                  >
                    VAULT DECRYPTED
                  </text>
                  <text
                    x="58"
                    y="40"
                    fill={isDark ? "#cbd5e1" : "#334155"}
                    fontSize="7.5"
                    fontFamily="var(--font-mono)"
                    letterSpacing="0.08em"
                  >
                    CLEARANCE LEVEL 5 // FULL ACCESS
                  </text>
                  <text
                    x="58"
                    y="52"
                    fill={isDark ? "#22c55e" : "#16a34a"}
                    fontSize="7"
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                    letterSpacing="0.06em"
                  >
                    ● 12 LOCKERS VERIFIED &bull; ASSETS READY
                  </text>
                </g>
              </g>

              {/* ── B. STATIONARY BULKHEAD DONUT FRAME (r=140 to r=162) ── */}
              {/* Outer Donut Ring: Center hole (r < 140) is 100% HOLLOW! */}
              <path
                d="M 180 18 A 162 162 0 1 0 180 342 A 162 162 0 1 0 180 18 Z M 180 40 A 140 140 0 1 1 180 320 A 140 140 0 1 1 180 40 Z"
                fill="url(#portalWallGrad)"
                fillRule="evenodd"
                stroke={isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(0, 0, 0, 0.18)"}
                strokeWidth="1.5"
              />

              {/* Outer Bevel Line (r=162) */}
              <circle cx="180" cy="180" r="162" fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)"} strokeWidth="2" />
              {/* Inner Door Jamb Rim (r=140) */}
              <circle cx="180" cy="180" r="140" fill="none" stroke={isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.2)"} strokeWidth="3" />

              {/* Bolt Sockets around outer perimeter */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <rect
                  key={deg}
                  x="172"
                  y="20"
                  width="16"
                  height="12"
                  rx="2"
                  fill={isDark ? "#030712" : "#f1f5f9"}
                  stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0, 0, 0, 0.2)"}
                  strokeWidth="1"
                  transform={`rotate(${deg} 180 180)`}
                />
              ))}

              {/* Heavy Left Hinge Brackets (Stationary wall mounts) */}
              <g>
                {/* Top Hinge */}
                <rect x="18" y="75" width="34" height="42" rx="6" fill="url(#hingeMetalGrad)" stroke={isDark ? "#1e293b" : "#94a3b8"} strokeWidth="1.5" />
                <circle cx="35" cy="96" r="6" fill={isDark ? "#334155" : "#e2e8f0"} stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="1.5" />
                {/* Bottom Hinge */}
                <rect x="18" y="243" width="34" height="42" rx="6" fill="url(#hingeMetalGrad)" stroke={isDark ? "#1e293b" : "#94a3b8"} strokeWidth="1.5" />
                <circle cx="35" cy="264" r="6" fill={isDark ? "#334155" : "#e2e8f0"} stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="1.5" />
              </g>

              {/* Perimeter Industrial Rivets */}
              {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(deg => (
                <circle
                  key={deg}
                  cx="180"
                  cy="27"
                  r="3.5"
                  fill={isDark ? "#475569" : "#cbd5e1"}
                  stroke={isDark ? "#1e293b" : "#64748b"}
                  strokeWidth="1"
                  transform={`rotate(${deg} 180 180)`}
                />
              ))}
            </svg>

            {/* 3. The Massive Circular Vault Door (Swings open to the left in 3D) */}
            <div
              className={`${styles.vaultDoorDoor} ${
                vaultStep === "door_open" ? styles.vaultDoorDoorOpen : ""
              }`}
            >
              <svg
                className={styles.vaultDoorSvg}
                viewBox="0 0 360 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Heavy Steel Door Gradient */}
                  <radialGradient id="vaultDoorFace" cx="180" cy="180" r="140" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isDark ? "#334155" : "#ffffff"} />
                    <stop offset="40%" stopColor={isDark ? "#1e293b" : "#f8fafc"} />
                    <stop offset="80%" stopColor={isDark ? "#0f172a" : "#e2e8f0"} />
                    <stop offset="100%" stopColor={isDark ? "#090d16" : "#cbd5e1"} />
                  </radialGradient>

                  {/* Chrome Bolt Gradient */}
                  <linearGradient id="boltChromeGrad" x1="172" y1="18" x2="188" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isDark ? "#94a3b8" : "#ffffff"} />
                    <stop offset="30%" stopColor={isDark ? "#f8fafc" : "#f1f5f9"} />
                    <stop offset="60%" stopColor={isDark ? "#cbd5e1" : "#cbd5e1"} />
                    <stop offset="100%" stopColor={isDark ? "#475569" : "#64748b"} />
                  </linearGradient>

                  {/* Hand Wheel Metallic Gradient */}
                  <linearGradient id="wheelMetalGrad" x1="140" y1="140" x2="220" y2="220" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isDark ? "#e2e8f0" : "#ffffff"} />
                    <stop offset="25%" stopColor={isDark ? "#cbd5e1" : "#f1f5f9"} />
                    <stop offset="50%" stopColor={isDark ? "#64748b" : "#cbd5e1"} />
                    <stop offset="80%" stopColor={isDark ? "#94a3b8" : "#94a3b8"} />
                    <stop offset="100%" stopColor={isDark ? "#334155" : "#64748b"} />
                  </linearGradient>

                  {/* Wheel Handle Grip Gradient */}
                  <linearGradient id="handleGripGrad" x1="174" y1="110" x2="186" y2="136" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={isDark ? "#f8fafc" : "#ffffff"} />
                    <stop offset="50%" stopColor={isDark ? "#94a3b8" : "#cbd5e1"} />
                    <stop offset="100%" stopColor={isDark ? "#334155" : "#475569"} />
                  </linearGradient>

                  {/* LED Indicator Glow */}
                  <filter id="vaultLedGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* --- A. 8 Radial Locking Bolts (Extend into sockets, retract inward) --- */}
                <g className={styles.vaultBoltsLayer}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                    <g key={deg} transform={`rotate(${deg} 180 180)`}>
                      <rect
                        x="172"
                        y="18"
                        width="16"
                        height="26"
                        rx="4"
                        fill="url(#boltChromeGrad)"
                        stroke={isDark ? "#334155" : "#64748b"}
                        strokeWidth="1.2"
                        className={`${styles.vaultBolt} ${
                          vaultStep !== "wheel_turn" ? styles.vaultBoltRetracted : ""
                        }`}
                      />
                    </g>
                  ))}
                </g>

                {/* --- B. Main Circular Heavy Steel Vault Door Body --- */}
                <circle
                  cx="180"
                  cy="180"
                  r="140"
                  fill="url(#vaultDoorFace)"
                  stroke={isAccessGranted ? (isDark ? "#22c55e" : "#16a34a") : (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)")}
                  strokeWidth="3.5"
                  className={styles.vaultDoorBodyCircle}
                />

                {/* Concentric Mechanical Grooves */}
                <circle cx="180" cy="180" r="128" fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"} strokeWidth="1.5" />
                <circle cx="180" cy="180" r="108" fill="none" stroke={isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.15)"} strokeWidth="3" />
                <circle cx="180" cy="180" r="82" fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"} strokeWidth="1.5" />

                {/* Cyber Technical Engraving Ring */}
                <text
                  x="180"
                  y="92"
                  textAnchor="middle"
                  fill={isAccessGranted ? (isDark ? "#86efac" : "#15803d") : (isDark ? "#64748b" : "#475569")}
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.28em"
                  fontWeight="700"
                >
                  TITANIUM VAULT DOOR // 4096-BIT
                </text>
                <text
                  x="180"
                  y="274"
                  textAnchor="middle"
                  fill={isDark ? "#475569" : "#64748b"}
                  fontSize="7.5"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.22em"
                >
                  SECURE ARCHIVE — CONFIDENTIAL
                </text>

                {/* --- C. Heavy Chrome 4-Spoke Central Wheel (Spins 360°) --- */}
                <g
                  className={`${styles.vaultWheelGroup} ${
                    vaultStep !== "wheel_turn" ? styles.vaultWheelSpun : ""
                  }`}
                >
                  {/* Wheel Outer Ring */}
                  <circle
                    cx="180"
                    cy="180"
                    r="46"
                    fill="none"
                    stroke="url(#wheelMetalGrad)"
                    strokeWidth="7"
                    filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))"
                  />

                  {/* 4 Tubular Spokes Connecting Hub to Outer Ring */}
                  <line x1="180" y1="158" x2="180" y2="134" stroke="url(#wheelMetalGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="180" y1="202" x2="180" y2="226" stroke="url(#wheelMetalGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="158" y1="180" x2="134" y2="180" stroke="url(#wheelMetalGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="202" y1="180" x2="226" y2="180" stroke="url(#wheelMetalGrad)" strokeWidth="6" strokeLinecap="round" />

                  {/* 4 Heavy Hand Grips Extending Outward Past Wheel Ring */}
                  <rect x="175" y="112" width="10" height="24" rx="4" fill="url(#handleGripGrad)" stroke={isDark ? "#334155" : "#64748b"} strokeWidth="1" />
                  <rect x="175" y="224" width="10" height="24" rx="4" fill="url(#handleGripGrad)" stroke={isDark ? "#334155" : "#64748b"} strokeWidth="1" />
                  <rect x="112" y="175" width="24" height="10" rx="4" fill="url(#handleGripGrad)" stroke={isDark ? "#334155" : "#64748b"} strokeWidth="1" />
                  <rect x="224" y="175" width="24" height="10" rx="4" fill="url(#handleGripGrad)" stroke={isDark ? "#334155" : "#64748b"} strokeWidth="1" />

                  {/* Central Gear Axle Hub */}
                  <circle cx="180" cy="180" r="24" fill={isDark ? "#0f172a" : "#f1f5f9"} stroke="url(#wheelMetalGrad)" strokeWidth="3" />
                  <circle cx="180" cy="180" r="16" fill={isDark ? "#020617" : "#e2e8f0"} stroke={isDark ? "#475569" : "#94a3b8"} strokeWidth="1.5" />

                  {/* Central Status LED */}
                  <circle
                    cx="180"
                    cy="180"
                    r="6.5"
                    fill={isAccessGranted ? (isDark ? "#22c55e" : "#16a34a") : (isDark ? "#ef4444" : "#dc2626")}
                    filter="url(#vaultLedGlow)"
                    className={styles.vaultDoorLed}
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom HUD Ticker */}
          <div className={styles.vaultFullscreenFooter}>
            <div className={`${styles.vaultFullscreenStatus} ${isAccessGranted ? styles.vaultFullscreenStatusGranted : ""}`}>
              {statusText}
            </div>
            <div className={styles.vaultFullscreenSub}>
              PRESS ESC TO SKIP &bull; ENCRYPTED VAULT CHALLENGE
            </div>
          </div>
        </div>
      );

      return mounted && typeof document !== "undefined" ? createPortal(animStage, document.body) : null;
    }

    // Standard Clean Light Neutral Challenge Modal
    const lockOverlay = (
      <div
        ref={overlayRef}
        className={`${styles.vaultOverlay} ${phase === "submitting" ? styles.vaultOverlayExit : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Personal Vault - Unlock Challenge"
      >
        <div className={styles.vaultPanel}>
          {/* File Header Bar */}
          <div className={styles.vaultPanelHeader}>
            <div className={styles.vaultHeaderLeft}>
              <Lock size={15} className={styles.vaultHeaderIcon} />
              <span className={styles.vaultHeaderTitle}>personal_vault.md</span>
            </div>
            <span className={styles.vaultHeaderPerms}>-rw-------</span>
          </div>

          {/* Panel Body */}
          <div className={styles.vaultPanelBody}>
            <div className={`${styles.vaultFormContent} ${phase === "submitting" ? styles.vaultFormSubmitting : ""}`}>
              {/* Lock icon + status */}
              <div className={styles.vaultLockRow}>
                <div className={styles.vaultLockCircle}>
                  <Lock size={28} />
                </div>
                <div className={styles.vaultLockMeta}>
                  <div className={styles.vaultLockBadgeRow}>
                    <span className={styles.vaultLockLabel}>ENCRYPTED</span>
                  </div>
                  <span className={styles.vaultLockSub}>answer any one to unlock</span>
                </div>
              </div>

              {/* Questions */}
              <div className={styles.vaultQuestions}>
                {QUESTIONS.map((q, idx) => (
                  <div key={q.key} className={styles.vaultQ}>
                    <label htmlFor={`vault-${q.key}`} className={styles.vaultQLabel}>
                      <span className={styles.vaultQNum}>Q{idx + 1}</span>
                      <span>{q.label}</span>
                    </label>
                    <input
                      ref={idx === 0 ? firstInputRef : undefined}
                      id={`vault-${q.key}`}
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      className={styles.vaultQInput}
                      value={answers[q.key as keyof typeof answers]}
                      onChange={e => handleInputChange(q.key, e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="type your answer..."
                      aria-label={q.label}
                    />
                  </div>
                ))}
              </div>

              {/* Error Banner */}
              {error && (
                <div className={styles.vaultErr} role="alert">
                  <AlertCircle size={13} />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions Row */}
              <div className={styles.vaultActions}>
                <button
                  className={styles.vaultSubmitBtn}
                  onClick={handleUnlock}
                  disabled={phase !== "idle"}
                >
                  Unlock
                </button>
                <button
                  type="button"
                  className={styles.vaultHintBtn}
                  onClick={() => setShowHint(prev => !prev)}
                >
                  <HelpCircle size={15} />
                  <span>{showHint ? "Hide hint" : "Need a hint?"}</span>
                </button>
              </div>

              {/* High Contrast Hint Callout Box */}
              {showHint && (
                <div className={styles.vaultHintBox}>
                  <HelpCircle size={16} style={{ flexShrink: 0, marginTop: "1px", color: "#dc2626" }} />
                  <span>These answers are hiding in plain sight in my story.</span>
                </div>
              )}

              {/* Disclaimer */}
              <p className={styles.vaultNote}>not real security, just a personal touch 🙂</p>
            </div>
          </div>
        </div>
      </div>
    );

    return mounted && typeof document !== "undefined" ? createPortal(lockOverlay, document.body) : null;
  }

  // ── Unlocked Content ──
  return (
    <div className={`${styles.viewContainer} ${styles.vaultContentIn}`}>
      {/* File Header Section matching about.md / experience */}
      <div className={styles.projectHeader} style={{ borderTop: "2px solid var(--status-success)" }}>
        <div className={styles.badgeRow}>
          <span className="badge badge-skills">Confidential Archive</span>
          <span className="badge badge-default" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--status-warning)" }}>
            <ShieldAlert size={12} />
            Unfiltered Personal Notes
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
          <Unlock size={22} color="var(--status-success)" />
          <h1 className={styles.projectTitle}>personal_vault.md</h1>
        </div>
        <p className={styles.projectTagline}>
          This is the part of my portfolio that isn&apos;t meant to sound like a resume. It&apos;s a little more personal and a little less polished.
        </p>
      </div>

      {/* Card 1: Outside the Terminal */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Terminal size={16} className={styles.sectionIcon} />
          Outside the Terminal
        </h2>
        <div className={styles.textBlock}>
          <p>Not everything I do revolves around a terminal.</p>
          <p>I&apos;ve lost more than <strong>14 kg through the gym</strong>, and getting into fitness has become a pretty important part of my life. I also love running — sometimes for the workout, sometimes just to get away from a screen for a while.</p>
          <p>And when I&apos;m not doing either of those things, there&apos;s a good chance I&apos;m playing <strong>BGMI</strong>.</p>
          <p>I&apos;ve learned a lot from the process of getting fitter, especially about consistency, patience, and actually sticking with something even when progress feels slow.</p>
          <p>If you&apos;re working on your fitness and feel like you don&apos;t know where to start, <strong>feel free to reach out.</strong> I&apos;ve been there, and if I can help from my own experience, I&apos;ll be happy to.</p>
        </div>
      </div>

      {/* Card 2: How I Got Here */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Compass size={16} className={styles.sectionIcon} />
          How I Got Here
        </h2>
        <div className={styles.textBlock}>
          <p>I started out more interested in understanding technology than in cybersecurity specifically. I liked figuring out how things worked behind the interface — what happens in a network, how operating systems manage things, what actually happens when you run a command, and why something behaves the way it does.</p>
          <p>As I started learning more about Linux, networking, and security, I became increasingly interested in the offensive side of things.</p>
          <p>The idea that you can look at a system, understand how it works, find where it is weak, and then prove that weakness actually exists is what pulled me toward ethical hacking.</p>
          <p>I&apos;m still early in that journey. I&apos;m not going to pretend I&apos;ve mastered it. Right now, I&apos;m focused on building the fundamentals properly and getting as much hands-on experience as I can.</p>
        </div>
      </div>

      {/* Card 3: What Keeps Me Learning */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>
          <Brain size={16} className={styles.sectionIcon} />
          What Keeps Me Learning
        </h2>
        <div className={styles.textBlock}>
          <p>One thing I&apos;ve realized pretty quickly is that cybersecurity has a way of exposing what you <em>don&apos;t</em> understand.</p>
          <p>I&apos;ll sometimes spend a ridiculous amount of time trying to figure something out, only to realize that I was missing a basic concept underneath it.</p>
          <p>Linux and networking have taught me this repeatedly.</p>
          <p>Something that looks like a complicated security problem can often become much easier once you actually understand what&apos;s happening underneath it.</p>
          <p>That&apos;s one of the things I enjoy most about learning ethical hacking: every difficult problem usually points toward something I need to understand better.</p>
        </div>
      </div>
    </div>
  );
}
