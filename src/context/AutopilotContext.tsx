"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useFilesystem, DEFAULT_QUICK_ACCESS_IDS } from "@/context/FilesystemContext";
import { useAchievements } from "@/context/AchievementContext";
import { useTour } from "@/context/TourContext";

export interface AutopilotStep {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  durationMs: number;
  actionType: "rename" | "drag-replace-position" | "drag-to-quickaccess" | "drag-remove-quickaccess" | "cli-engage";
}

export const AUTOPILOT_STEPS: AutopilotStep[] = [
  {
    id: 0,
    category: "01 // IN-PLACE CUSTOMIZATION",
    title: "Right-Click & Rename: writeups ➔ Husain_Writeups",
    subtitle: "Open the real context menu on Writeups, trigger in-place renaming, and commit updates live to the filesystem.",
    durationMs: 2700,
    actionType: "rename",
  },
  {
    id: 1,
    category: "02 // POSITION REPLACEMENT",
    title: "Drag Husain_Writeups ➔ Replace Blogs Position",
    subtitle: "Drag Husain_Writeups out of its slot and drop it onto Blogs to replace its position in the workspace grid.",
    durationMs: 3600,
    actionType: "drag-replace-position",
  },
  {
    id: 2,
    category: "03 // SELECTION & DOCKING",
    title: "Equip & Drag to Quick Access",
    subtitle: "Select Husain_Writeups from its new position, then drag it directly into the Quick Access dock.",
    durationMs: 3600,
    actionType: "drag-to-quickaccess",
  },
  {
    id: 3,
    category: "04 // DOCK REORGANIZATION",
    title: "Drag & Drop to Unpin from Quick Access",
    subtitle: "Drag Husain_Writeups out of Quick Access into the drop zone to dynamically unpin it.",
    durationMs: 3600,
    actionType: "drag-remove-quickaccess",
  },
  {
    id: 4,
    category: "05 // UNIX SHELL ENGAGED",
    title: "Switch to CLI Terminal & Run: cat contact-info.md",
    subtitle: "Terminal shell active. Executing live CLI command 'cat contact-info.md' to stream real file contents.",
    durationMs: 4400,
    actionType: "cli-engage",
  },
];

interface AutopilotContextType {
  isAutopilotActive: boolean;
  currentStepIndex: number;
  isPaused: boolean;
  startAutopilot: () => void;
  stopAutopilot: () => void;
  togglePause: () => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: AutopilotStep;
  totalSteps: number;
  progressPercent: number;
}

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined);

const SWAPPED_HOME_ORDER = [
  "vault-dir",
  "readme-file",
  "about-file",
  "projects-dir",
  "blogs-dir",
  "writeups-dir",
  "skills-file",
  "contact-file",
  "experience-file",
  "certs-file",
  "resume-pdf",
];

export function AutopilotProvider({ children }: { children: React.ReactNode }) {
  const {
    setMode,
    navigate,
    closeFile,
    showToast,
    renameNode,
    addToQuickAccess,
    removeFromQuickAccess,
    resetQuickAccess,
    setQuickAccessList,
    setExplicitFolderOrder,
  } = useFilesystem();
  const { closePanel, unlock } = useAchievements();
  const { closeWelcome, endTour } = useTour();

  const [isAutopilotActive, setIsAutopilotActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);

  // Clear timers
  const clearTimers = useCallback(() => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    stepTimerRef.current = null;
    progressIntervalRef.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Sync global autopilot flag so intermediate actions are ignored
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__IS_AUTOPILOT_ACTIVE__ = isAutopilotActive;
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as unknown as Record<string, unknown>).__IS_AUTOPILOT_ACTIVE__ = false;
      }
    };
  }, [isAutopilotActive]);

  // Synchronize filesystem invariants for any given step index (Idempotent Chaos-Proof Reconciler)
  const syncStepInvariants = useCallback(
    (stepIdx: number) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-rename"));
        window.dispatchEvent(new CustomEvent("vfs-autopilot-close-context-menu"));
        window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-drag"));
      }

      closeFile();
      closePanel();

      switch (stepIdx) {
        case 0: {
          // Step 1: In-Place Rename navigation setup (starts with original name)
          setMode("gui");
          navigate("/home/husain");
          renameNode("writeups-dir", "");
          setQuickAccessList(DEFAULT_QUICK_ACCESS_IDS);
          setExplicitFolderOrder("/home/husain", []);
          break;
        }
        case 1: {
          // Step 2: Drag & Replace Position setup (must be renamed to Husain_Writeups)
          setMode("gui");
          navigate("/home/husain");
          renameNode("writeups-dir", "Husain_Writeups");
          setQuickAccessList(DEFAULT_QUICK_ACCESS_IDS);
          setExplicitFolderOrder("/home/husain", []);
          break;
        }
        case 2: {
          // Step 3: Drag to Quick Access navigation setup (renamed and in blogs position)
          setMode("gui");
          navigate("/home/husain");
          renameNode("writeups-dir", "Husain_Writeups");
          setQuickAccessList(DEFAULT_QUICK_ACCESS_IDS);
          setExplicitFolderOrder("/home/husain", SWAPPED_HOME_ORDER);
          break;
        }
        case 3: {
          // Step 4: Remove from Quick Access navigation setup (must be pinned so user/tour can unpin)
          setMode("gui");
          navigate("/home/husain");
          renameNode("writeups-dir", "Husain_Writeups");
          setExplicitFolderOrder("/home/husain", SWAPPED_HOME_ORDER);
          setQuickAccessList([...DEFAULT_QUICK_ACCESS_IDS, "writeups-dir"]);
          break;
        }
        case 4: {
          // Step 5: Switch to CLI and engage terminal
          // Note: Starts in GUI mode so the virtual cursor can click the CLI button live!
          setMode("gui");
          navigate("/home/husain");
          renameNode("writeups-dir", "Husain_Writeups");
          setExplicitFolderOrder("/home/husain", SWAPPED_HOME_ORDER);
          setQuickAccessList(DEFAULT_QUICK_ACCESS_IDS);
          break;
        }
        default:
          break;
      }
    },
    [setMode, navigate, closeFile, closePanel, renameNode, setQuickAccessList, setExplicitFolderOrder]
  );

  const stopAutopilot = useCallback(
    (isCompletedNormally = false) => {
      clearTimers();
      setIsAutopilotActive(false);
      setIsPaused(false);
      setProgressPercent(0);
      elapsedBeforePauseRef.current = 0;

      if (typeof window !== "undefined") {
        (window as unknown as Record<string, unknown>).__IS_AUTOPILOT_ACTIVE__ = false;
        window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-rename"));
        window.dispatchEvent(new CustomEvent("vfs-autopilot-close-context-menu"));
        window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-drag"));
      }

      // Clean up any modifications and return user back to pristine GUI workstation
      renameNode("writeups-dir", "");
      renameNode("projects-dir", "");
      setQuickAccessList(DEFAULT_QUICK_ACCESS_IDS);
      setExplicitFolderOrder("/home/husain", []);
      closeFile();
      closePanel();
      setMode("gui");
      navigate("/home/husain");

      // Award Grand Tourer achievement upon full completion
      if (isCompletedNormally) {
        unlock("tour_completer");
        showToast("⚡ Autopilot demo complete. Returned to GUI workstation — explore freely!", 4000);
      } else {
        showToast("Autopilot exited. Returned to GUI workstation.", 2500);
      }
    },
    [clearTimers, renameNode, setQuickAccessList, setExplicitFolderOrder, closeFile, closePanel, setMode, navigate, unlock, showToast]
  );

  const advanceToNext = useCallback(() => {
    clearTimers();
    elapsedBeforePauseRef.current = 0;
    setProgressPercent(0);

    if (currentStepIndex < AUTOPILOT_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      syncStepInvariants(nextIdx);
    } else {
      // Finished all steps -> return user to GUI mode & award Grand Tourer trophy!
      stopAutopilot(true);
    }
  }, [clearTimers, currentStepIndex, syncStepInvariants, stopAutopilot]);

  const prevStep = useCallback(() => {
    clearTimers();
    elapsedBeforePauseRef.current = 0;
    setProgressPercent(0);

    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      syncStepInvariants(prevIdx);
    }
  }, [clearTimers, currentStepIndex, syncStepInvariants]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        // Pausing: calculate elapsed time in current step
        elapsedBeforePauseRef.current = Math.max(0, Date.now() - startTimeRef.current);
        clearTimers();
      }
      return next;
    });
  }, [clearTimers]);

  // Step runner effect
  useEffect(() => {
    if (!isAutopilotActive) return;

    if (isPaused) {
      clearTimers();
      return;
    }

    const step = AUTOPILOT_STEPS[currentStepIndex];
    if (!step) return;

    const totalDuration = step.durationMs;
    const remainingTime = Math.max(100, totalDuration - elapsedBeforePauseRef.current);

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    // Progress bar ticker (every 30ms)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgressPercent(pct);
    }, 30);

    // Advance timer
    stepTimerRef.current = setTimeout(() => {
      elapsedBeforePauseRef.current = 0;
      advanceToNext();
    }, remainingTime);

    return () => {
      clearTimers();
    };
  }, [isAutopilotActive, currentStepIndex, isPaused, advanceToNext, clearTimers]);

  const startAutopilot = useCallback(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__IS_AUTOPILOT_ACTIVE__ = true;
    }

    closeWelcome();
    endTour();
    closeFile();
    closePanel();
    clearTimers();

    setCurrentStepIndex(0);
    setProgressPercent(0);
    elapsedBeforePauseRef.current = 0;
    setIsPaused(false);
    setIsAutopilotActive(true);

    syncStepInvariants(0);
  }, [closeWelcome, endTour, closeFile, closePanel, clearTimers, syncStepInvariants]);

  const currentStep = AUTOPILOT_STEPS[currentStepIndex] || AUTOPILOT_STEPS[0];

  return (
    <AutopilotContext.Provider
      value={{
        isAutopilotActive,
        currentStepIndex,
        isPaused,
        startAutopilot,
        stopAutopilot,
        togglePause,
        nextStep: advanceToNext,
        prevStep,
        currentStep,
        totalSteps: AUTOPILOT_STEPS.length,
        progressPercent,
      }}
    >
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context = useContext(AutopilotContext);
  if (!context) {
    throw new Error("useAutopilot must be used within an AutopilotProvider");
  }
  return context;
}
