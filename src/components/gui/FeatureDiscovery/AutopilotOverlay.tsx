"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAutopilot, AUTOPILOT_STEPS } from "@/context/AutopilotContext";
import { useFilesystem } from "@/context/FilesystemContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Folder,
} from "lucide-react";
import styles from "./AutopilotOverlay.module.css";

export function AutopilotOverlay() {
  const {
    isAutopilotActive,
    currentStepIndex,
    isPaused,
    stopAutopilot,
    togglePause,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    progressPercent,
  } = useAutopilot();

  const { addToQuickAccess, removeFromQuickAccess, showToast, setMode } = useFilesystem();

  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Simulated Mouse & UI State
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 400, y: 300 });
  const [clickEffect, setClickEffect] = useState<{ active: boolean; label?: string; key: number }>({
    active: false,
    label: undefined,
    key: 0,
  });
  const [showSimulatedMenu, setShowSimulatedMenu] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [menuActiveIdx, setMenuActiveIdx] = useState<number>(-1);
  const [isDraggingGhost, setIsDraggingGhost] = useState(false);
  const [targetFocusRect, setTargetFocusRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const timelineTimersRef = useRef<NodeJS.Timeout[]>([]);
  const stepStartTimeRef = useRef<number>(0);
  const stepElapsedRef = useRef<number>(0);
  const lastStepIndexRef = useRef<number>(currentStepIndex);

  const clearTimelineTimers = useCallback(() => {
    timelineTimersRef.current.forEach((t) => clearTimeout(t));
    timelineTimersRef.current = [];
  }, []);

  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    container.className = styles.autopilotPortalRoot;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      clearTimelineTimers();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [clearTimelineTimers]);

  const triggerClickRipple = useCallback((label?: string) => {
    setClickEffect((prev) => ({
      active: true,
      label,
      key: prev.key + 1,
    }));
    setTimeout(() => {
      setClickEffect((prev) => ({ ...prev, active: false }));
    }, 600);
  }, []);

  // Locate DOM elements on screen
  const getTargetBounds = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      const r = el.getBoundingClientRect();
      return {
        centerX: r.left + r.width / 2,
        centerY: r.top + r.height / 2,
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      };
    }
    return null;
  }, []);

  // Step Animation Sub-timeline Orchestrator (Fully Pause & Skip Aware)
  useEffect(() => {
    if (!isAutopilotActive) {
      clearTimelineTimers();
      stepElapsedRef.current = 0;
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);
      setTargetFocusRect(null);
      setClickEffect({ active: false, label: undefined, key: 0 });
      window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-drag"));
      return;
    }

    // Reset step elapsed when moving between different steps
    if (lastStepIndexRef.current !== currentStepIndex) {
      clearTimelineTimers();
      stepElapsedRef.current = 0;
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);
      setTargetFocusRect(null);
      setClickEffect({ active: false, label: undefined, key: 0 });
      lastStepIndexRef.current = currentStepIndex;
    }

    if (isPaused) {
      // Freezes in-flight animation timers and saves exact elapsed timestamp
      stepElapsedRef.current = Math.max(0, Date.now() - stepStartTimeRef.current);
      clearTimelineTimers();
      return;
    }

    // Start or resume execution from current step elapsed offset
    stepStartTimeRef.current = Date.now() - stepElapsedRef.current;
    clearTimelineTimers();

    interface TimedAction {
      time: number;
      run: () => void;
    }

    const actions: TimedAction[] = [];

    if (currentStepIndex === 0) {
      // Step 1: In-Place Rename (writeups ➔ Husain_Writeups via REAL context menu)
      actions.push({
        time: 150,
        run: () => {
          const bounds =
            getTargetBounds('[data-node-id="writeups-dir"]') ||
            getTargetBounds('[data-node-name="writeups"]') ||
            { centerX: 480, centerY: 240, top: 200, left: 420, width: 140, height: 90 };

          setCursorPos({ x: bounds.centerX, y: bounds.centerY });
          setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
        },
      });

      actions.push({
        time: 650,
        run: () => {
          triggerClickRipple("CLICK: SELECT");
          const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
          if (el) el.click();
        },
      });

      actions.push({
        time: 1100,
        run: () => {
          triggerClickRipple("RIGHT CLICK");
          const bounds =
            getTargetBounds('[data-node-id="writeups-dir"]') ||
            getTargetBounds('[data-node-name="writeups"]') ||
            { centerX: 480, centerY: 240 };
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-open-context-menu", {
              detail: { nodeId: "writeups-dir", x: bounds.centerX + 15, y: bounds.centerY + 10 },
            })
          );
        },
      });

      actions.push({
        time: 1650,
        run: () => {
          const renameBtn = getTargetBounds('button[data-action="rename"]') || {
            centerX: 480 + 80,
            centerY: 240 + 48,
          };
          setCursorPos({ x: renameBtn.centerX, y: renameBtn.centerY });
        },
      });

      actions.push({
        time: 2150,
        run: () => {
          triggerClickRipple("CLICK: RENAME");
          const btn = document.querySelector('button[data-action="rename"]') as HTMLButtonElement | null;
          if (btn) {
            btn.click();
          } else {
            window.dispatchEvent(
              new CustomEvent("vfs-autopilot-start-rename", {
                detail: { nodeId: "writeups-dir", initialValue: "writeups" },
              })
            );
          }
        },
      });

      actions.push({
        time: 2450,
        run: () => {
          const inputBounds =
            getTargetBounds('[data-node-id="writeups-dir"] input') ||
            getTargetBounds('[data-node-id="writeups-dir"]') ||
            { centerX: 480, centerY: 250 };
          setCursorPos({ x: inputBounds.centerX, y: inputBounds.centerY });
        },
      });

      const targetName = "Husain_Writeups";
      for (let i = 1; i <= targetName.length; i++) {
        const val = targetName.substring(0, i);
        actions.push({
          time: 2550 + (i - 1) * 75,
          run: () => {
            window.dispatchEvent(
              new CustomEvent("vfs-autopilot-type-rename", {
                detail: { value: val },
              })
            );
          },
        });
      }

      actions.push({
        time: 3950,
        run: () => {
          triggerClickRipple("ENTER ↵ (COMMITTED)");
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-commit-rename", {
              detail: { nodeId: "writeups-dir", finalValue: "Husain_Writeups" },
            })
          );
          setTargetFocusRect(null);
        },
      });
    } else if (currentStepIndex === 1) {
      // Step 2: Drag Husain_Writeups ➔ Replace Blogs Position
      actions.push({
        time: 150,
        run: () => {
          const bounds =
            getTargetBounds('[data-node-id="writeups-dir"]') ||
            getTargetBounds('[data-node-name="Husain_Writeups"]') ||
            getTargetBounds('[data-node-name="writeups"]') ||
            { centerX: 480, centerY: 240, top: 200, left: 420, width: 140, height: 90 };

          setCursorPos({ x: bounds.centerX, y: bounds.centerY });
          setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
        },
      });

      actions.push({
        time: 650,
        run: () => {
          triggerClickRipple("EQUIP FOLDER");
          const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
          if (el) el.click();
        },
      });

      actions.push({
        time: 1150,
        run: () => {
          triggerClickRipple("GRAB & DRAG");
          setIsDraggingGhost(true);
        },
      });

      actions.push({
        time: 1650,
        run: () => {
          const blogsBounds =
            getTargetBounds('[data-node-id="blogs-dir"]') ||
            getTargetBounds('[data-node-name="blogs"]') ||
            { centerX: 620, centerY: 240, top: 200, left: 560, width: 140, height: 90 };

          setCursorPos({ x: blogsBounds.centerX, y: blogsBounds.centerY });
          setTargetFocusRect({ top: blogsBounds.top - 4, left: blogsBounds.left - 4, width: blogsBounds.width + 8, height: blogsBounds.height + 8 });
        },
      });

      actions.push({
        time: 2900,
        run: () => {
          triggerClickRipple("DROP: REPLACE BLOGS POSITION");
          setIsDraggingGhost(false);
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-drop-reorder", {
              detail: { sourceId: "writeups-dir", targetId: "blogs-dir" },
            })
          );
          showToast("✨ 'Husain_Writeups' moved to Blogs position", 3000);
          setTargetFocusRect(null);
        },
      });
    } else if (currentStepIndex === 2) {
      // Step 3: Equip & Drag to Quick Access
      actions.push({
        time: 150,
        run: () => {
          const bounds =
            getTargetBounds('[data-node-id="writeups-dir"]') ||
            getTargetBounds('[data-node-name="Husain_Writeups"]') ||
            getTargetBounds('[data-node-name="writeups"]') ||
            { centerX: 620, centerY: 240, top: 200, left: 560, width: 140, height: 90 };

          setCursorPos({ x: bounds.centerX, y: bounds.centerY });
          setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
        },
      });

      actions.push({
        time: 650,
        run: () => {
          triggerClickRipple("EQUIP FOLDER");
          const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
          if (el) el.click();
        },
      });

      actions.push({
        time: 1150,
        run: () => {
          triggerClickRipple("GRAB & DRAG");
          setIsDraggingGhost(true);
        },
      });

      actions.push({
        time: 1750,
        run: () => {
          const qaBounds =
            getTargetBounds('[data-tour="quick-access-section"]') ||
            getTargetBounds('[data-tour="sidebar-vault-btn"]') ||
            { centerX: 420, centerY: 140, top: 90, left: 260, width: 380, height: 110 };

          setCursorPos({ x: qaBounds.centerX, y: qaBounds.centerY });
          setTargetFocusRect({ top: qaBounds.top - 4, left: qaBounds.left - 4, width: qaBounds.width + 8, height: qaBounds.height + 8 });
        },
      });

      actions.push({
        time: 2900,
        run: () => {
          triggerClickRipple("DROP IN QUICK ACCESS");
          setIsDraggingGhost(false);
          addToQuickAccess("writeups-dir");
          showToast("📌 Pinned 'Husain_Writeups' to Quick Access", 3000);
          setTargetFocusRect(null);
        },
      });
    } else if (currentStepIndex === 3) {
      // Step 4: Drag out of Quick Access & Drop on "Drop here to unpin" zone
      actions.push({
        time: 150,
        run: () => {
          const qaBounds =
            getTargetBounds('[data-tour="quick-access-section"] [data-node-id="writeups-dir"]') ||
            getTargetBounds('[data-tour="quick-access-section"]') ||
            { centerX: 360, centerY: 150, top: 110, left: 300, width: 120, height: 80 };

          setCursorPos({ x: qaBounds.centerX, y: qaBounds.centerY });
          setTargetFocusRect({ top: qaBounds.top - 4, left: qaBounds.left - 4, width: qaBounds.width + 8, height: qaBounds.height + 8 });
        },
      });

      actions.push({
        time: 650,
        run: () => {
          triggerClickRipple("EQUIP PINNED ITEM");
          const pinnedCard = document.querySelector('[data-tour="quick-access-section"] [data-node-id="writeups-dir"]') as HTMLElement | null;
          if (pinnedCard) pinnedCard.click();
        },
      });

      actions.push({
        time: 1100,
        run: () => {
          triggerClickRipple("GRAB & DRAG OUT");
          setIsDraggingGhost(true);
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-start-drag-qa", {
              detail: { nodeId: "writeups-dir" },
            })
          );
        },
      });

      actions.push({
        time: 1800,
        run: () => {
          const dropZoneBounds =
            getTargetBounds('[data-tour="qa-remove-drop-zone"]') ||
            getTargetBounds(`.${styles.qaRemoveDropZone}`) ||
            { centerX: 420, centerY: 240, top: 200, left: 260, width: 380, height: 75 };

          setCursorPos({ x: dropZoneBounds.centerX, y: dropZoneBounds.centerY });
          setTargetFocusRect({ top: dropZoneBounds.top - 4, left: dropZoneBounds.left - 4, width: dropZoneBounds.width + 8, height: dropZoneBounds.height + 8 });
          window.dispatchEvent(new CustomEvent("vfs-autopilot-drag-over-remove"));
        },
      });

      actions.push({
        time: 2900,
        run: () => {
          triggerClickRipple("DROP TO UNPIN");
          setIsDraggingGhost(false);
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-drop-remove", {
              detail: { nodeId: "writeups-dir" },
            })
          );
          setTargetFocusRect(null);
        },
      });
    } else if (currentStepIndex === 4) {
      // Step 5: Engage CLI Terminal & Execute 'cat contact-info.md'
      actions.push({
        time: 150,
        run: () => {
          const headerBtn =
            getTargetBounds('#mode-btn-cli') ||
            getTargetBounds('button[title*="CLI"]') ||
            { centerX: window.innerWidth / 2 + 30, centerY: 35, top: 10, left: window.innerWidth / 2, width: 60, height: 36 };

          setCursorPos({ x: headerBtn.centerX, y: headerBtn.centerY });
          setTargetFocusRect({ top: headerBtn.top - 2, left: headerBtn.left - 2, width: headerBtn.width + 4, height: headerBtn.height + 4 });
        },
      });

      actions.push({
        time: 800,
        run: () => {
          triggerClickRipple("CLICK: CLI MODE");
          const btn = document.querySelector('#mode-btn-cli') as HTMLButtonElement | null;
          if (btn) {
            btn.click();
          } else {
            setMode("cli");
          }
        },
      });

      actions.push({
        time: 1400,
        run: () => {
          const inputBounds =
            getTargetBounds('[data-tour="terminal-input"]') ||
            getTargetBounds('input[aria-label="Terminal input prompt"]') ||
            { centerX: 350, centerY: 260, top: 240, left: 180, width: 400, height: 32 };

          setCursorPos({ x: inputBounds.centerX, y: inputBounds.centerY });
          setTargetFocusRect({ top: inputBounds.top - 3, left: inputBounds.left - 3, width: inputBounds.width + 6, height: inputBounds.height + 6 });
          triggerClickRipple("FOCUS TERMINAL");
        },
      });

      const targetCmd = "cat contact-info.md";
      for (let i = 1; i <= targetCmd.length; i++) {
        const val = targetCmd.substring(0, i);
        actions.push({
          time: 1650 + (i - 1) * 60,
          run: () => {
            window.dispatchEvent(
              new CustomEvent("vfs-autopilot-type-cli", {
                detail: { value: val },
              })
            );
          },
        });
      }

      actions.push({
        time: 3300,
        run: () => {
          triggerClickRipple("ENTER ↵ (EXECUTE)");
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-run-cli", {
              detail: { command: "cat contact-info.md" },
            })
          );
          setTargetFocusRect(null);
        },
      });
    }

    // Schedule remaining actions
    actions.forEach((act) => {
      if (act.time >= stepElapsedRef.current) {
        const delay = act.time - stepElapsedRef.current;
        const timer = setTimeout(() => {
          act.run();
        }, delay);
        timelineTimersRef.current.push(timer);
      }
    });

    return () => {
      clearTimelineTimers();
    };
  }, [
    isAutopilotActive,
    currentStepIndex,
    isPaused,
    clearTimelineTimers,
    getTargetBounds,
    triggerClickRipple,
    addToQuickAccess,
    showToast,
    setMode,
  ]);

  // Keyboard controls: ESC to exit, Space to pause/resume
  useEffect(() => {
    if (!isAutopilotActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        stopAutopilot();
      } else if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAutopilotActive, stopAutopilot, togglePause, nextStep, prevStep]);

  if (!isAutopilotActive || !mounted || !portalContainer) return null;

  const content = (
    <>
      {/* Target Focus Ring around the active element */}
      {targetFocusRect && (
        <div
          className={styles.targetFocusRing}
          style={{
            top: `${targetFocusRect.top}px`,
            left: `${targetFocusRect.left}px`,
            width: `${targetFocusRect.width}px`,
            height: `${targetFocusRect.height}px`,
          }}
        />
      )}

      {/* Simulated Context Menu Popup */}
      {showSimulatedMenu && (
        <div
          className={styles.simulatedContextMenu}
          style={{
            top: `${menuPos.y}px`,
            left: `${menuPos.x}px`,
          }}
        >
          {currentStepIndex === 3 ? (
            <div className={`${styles.contextMenuItem} ${menuActiveIdx === 0 ? styles.contextMenuItemActive : ""}`}>
              <span>Remove from Quick Access</span>
            </div>
          ) : (
            <>
              <div className={styles.contextMenuItem}>
                <span>Open</span>
              </div>
              <div className={`${styles.contextMenuItem} ${menuActiveIdx === 1 ? styles.contextMenuItemActive : ""}`}>
                <span>Rename (Enter)</span>
              </div>
              <div className={styles.contextMenuDivider} />
              <div className={styles.contextMenuItem}>
                <span>Copy Link</span>
              </div>
              <div className={styles.contextMenuItem}>
                <span>Delete</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hyper-Realistic Simulated Mouse Pointer & Ripple */}
      <div className={styles.simulatedMouseRoot}>
        <div
          className={styles.virtualCursor}
          style={{
            top: `${cursorPos.y}px`,
            left: `${cursorPos.x}px`,
          }}
        >
          {/* Click Ripple wave */}
          {clickEffect.active && (
            <>
              <div key={clickEffect.key} className={styles.clickRing} />
              {clickEffect.label && (
                <div className={styles.clickBadgeLabel}>
                  {clickEffect.label}
                </div>
              )}
            </>
          )}

          {/* Mouse Pointer Arrow SVG */}
          <svg
            className={styles.cursorSvg}
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.702z" />
          </svg>

          {/* Ghost Dragging Card */}
          {isDraggingGhost && (
            <div className={styles.ghostDragCard}>
              <Folder size={14} color="#38bdf8" />
              <span>Husain_Writeups</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cinema HUD Bar */}
      <div className={styles.hudContainer} role="status" aria-live="polite">
        {/* Top Header info */}
        <div className={styles.hudHeader}>
          <div className={styles.hudMeta}>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span>AUTOPILOT LIVE DEMO</span>
            </div>
            <span className={styles.chapterCategory}>{currentStep.category}</span>
          </div>

          <button
            onClick={() => stopAutopilot()}
            className={styles.exitButton}
            title="Exit Autopilot (ESC)"
          >
            <span>Take Manual Control</span>
            <span className={styles.kbdBadge}>ESC</span>
            <X size={13} />
          </button>
        </div>

        {/* Title & Subtitle descriptions */}
        <div className={styles.textContent}>
          <h4 className={styles.stepTitle}>{currentStep.title}</h4>
          <p className={styles.stepSubtitle}>{currentStep.subtitle}</p>
        </div>

        {/* Segmented chapter progress bar */}
        <div className={styles.progressSegments}>
          {AUTOPILOT_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const fillWidth = isCompleted ? 100 : isCurrent ? progressPercent : 0;

            return (
              <div key={step.id} className={styles.segmentTrack}>
                <div
                  className={`${styles.segmentFill} ${isCompleted ? styles.segmentCompleted : ""}`}
                  style={{ width: `${fillWidth}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Control bar */}
        <div className={styles.controlsRow}>
          <div className={styles.controlButtons}>
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={styles.navBtn}
              title="Previous Step"
            >
              <SkipBack size={12} />
              <span>Prev</span>
            </button>

            <button
              onClick={togglePause}
              className={styles.pauseBtn}
              title={isPaused ? "Resume Autopilot (Space)" : "Pause Autopilot (Space)"}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button
              onClick={nextStep}
              className={styles.navBtn}
              title="Next Step"
            >
              <span>Next</span>
              <SkipForward size={12} />
            </button>
          </div>

          <span className={styles.hintText}>
            Chapter {currentStepIndex + 1} of {totalSteps} • [Space] to Pause
          </span>
        </div>
      </div>
    </>
  );

  return createPortal(content, portalContainer);
}
