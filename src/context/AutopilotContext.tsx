"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
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
    durationMs: 4500,
    actionType: "rename",
  },
  {
    id: 1,
    category: "02 // POSITION REPLACEMENT",
    title: "Drag Husain_Writeups ➔ Replace Blogs Position",
    subtitle: "Drag Husain_Writeups out of its slot and drop it onto Blogs to replace its position in the workspace grid.",
    durationMs: 4500,
    actionType: "drag-replace-position",
  },
  {
    id: 2,
    category: "03 // SELECTION & DOCKING",
    title: "Equip & Drag to Quick Access",
    subtitle: "Select Husain_Writeups from its new position, then drag it directly into the Quick Access dock.",
    durationMs: 4500,
    actionType: "drag-to-quickaccess",
  },
  {
    id: 3,
    category: "04 // DOCK REORGANIZATION",
    title: "Drag & Drop to Unpin from Quick Access",
    subtitle: "Drag Husain_Writeups out of Quick Access into the drop zone to dynamically unpin it.",
    durationMs: 4400,
    actionType: "drag-remove-quickaccess",
  },
  {
    id: 4,
    category: "05 // UNIX SHELL ENGAGED",
    title: "Switch to CLI Terminal & Run: cat contact-info.md",
    subtitle: "Terminal shell active. Executing live CLI command 'cat contact-info.md' to stream real file contents.",
    durationMs: 5200,
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

export function AutopilotProvider({ children }: { children: React.ReactNode }) {
  const {
    setMode,
    navigate,
    closeFile,
    showToast,
    renameNode,
    addToQuickAccess,
    removeFromQuickAccess,
    setSelectedNode,
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
      (window as any).__IS_AUTOPILOT_ACTIVE__ = isAutopilotActive;
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__IS_AUTOPILOT_ACTIVE__ = false;
      }
    };
  }, [isAutopilotActive]);

  // Execute actions for a specific step
  const executeStepActions = useCallback(
    (stepIdx: number) => {
      switch (stepIdx) {
        case 0: {
          // Step 1: In-Place Rename navigation setup
          setMode("gui");
          navigate("/home/husain");
          closeFile();
          closePanel();
          break;
        }
        case 1: {
          // Step 2: Drag & Replace Position setup
          setMode("gui");
          navigate("/home/husain");
          break;
        }
        case 2: {
          // Step 3: Drag to Quick Access navigation setup
          setMode("gui");
          navigate("/home/husain");
          break;
        }
        case 3: {
          // Step 4: Remove from Quick Access navigation setup
          setMode("gui");
          navigate("/home/husain");
          break;
        }
        case 4: {
          // Step 5: Switch to CLI and engage terminal
          closeFile();
          closePanel();
          setMode("cli");
          break;
        }
        default:
          break;
      }
    },
    [setMode, navigate, closeFile, closePanel]
  );

  const stopAutopilot = useCallback(
    (isCompletedNormally = false) => {
      clearTimers();
      setIsAutopilotActive(false);
      setIsPaused(false);
      setProgressPercent(0);

      if (typeof window !== "undefined") {
        (window as any).__IS_AUTOPILOT_ACTIVE__ = false;
      }

      // Clean up any remaining modifications and return user back to GUI workstation
      renameNode("writeups-dir", "");
      removeFromQuickAccess("writeups-dir");
      renameNode("projects-dir", "");
      removeFromQuickAccess("projects-dir");
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
    [clearTimers, renameNode, removeFromQuickAccess, setExplicitFolderOrder, closeFile, closePanel, setMode, navigate, unlock, showToast]
  );

  const advanceToNext = useCallback(() => {
    clearTimers();
    if (currentStepIndex < AUTOPILOT_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Finished all steps -> return user to GUI mode & award Grand Tourer trophy!
      stopAutopilot(true);
    }
  }, [clearTimers, currentStepIndex, stopAutopilot]);

  const prevStep = useCallback(() => {
    clearTimers();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, [clearTimers]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Step runner effect
  useEffect(() => {
    if (!isAutopilotActive) return;

    if (isPaused) {
      clearTimers();
      return;
    }

    const step = AUTOPILOT_STEPS[currentStepIndex];
    if (!step) return;

    executeStepActions(currentStepIndex);

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
    const totalDuration = step.durationMs;

    // Progress bar ticker (every 30ms)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgressPercent(pct);
    }, 30);

    // Advance timer
    const remainingTime = Math.max(0, totalDuration - elapsedBeforePauseRef.current);
    stepTimerRef.current = setTimeout(() => {
      elapsedBeforePauseRef.current = 0;
      advanceToNext();
    }, remainingTime);

    return () => {
      clearTimers();
    };
  }, [isAutopilotActive, currentStepIndex, isPaused, executeStepActions, advanceToNext, clearTimers]);

  const startAutopilot = useCallback(() => {
    if (typeof window !== "undefined") {
      (window as any).__IS_AUTOPILOT_ACTIVE__ = true;
    }

    closeWelcome();
    endTour();
    closeFile();
    closePanel();
    clearTimers();

    // Reset initial state
    renameNode("writeups-dir", "");
    removeFromQuickAccess("writeups-dir");
    renameNode("projects-dir", "");
    removeFromQuickAccess("projects-dir");
    setExplicitFolderOrder("/home/husain", []);
    setMode("gui");
    navigate("/home/husain");

    setCurrentStepIndex(0);
    setProgressPercent(0);
    elapsedBeforePauseRef.current = 0;
    setIsPaused(false);
    setIsAutopilotActive(true);
  }, [closeWelcome, endTour, closeFile, closePanel, clearTimers, renameNode, removeFromQuickAccess, setExplicitFolderOrder, setMode, navigate]);

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
