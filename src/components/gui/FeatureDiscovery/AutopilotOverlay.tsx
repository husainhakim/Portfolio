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

  const { addToQuickAccess, removeFromQuickAccess, showToast } = useFilesystem();

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

  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    container.className = styles.autopilotPortalRoot;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

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

  // Step Animation Sub-timeline Orchestrator
  useEffect(() => {
    if (!isAutopilotActive) {
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);
      setTargetFocusRect(null);
      window.dispatchEvent(new CustomEvent("vfs-autopilot-cancel-drag"));
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    if (currentStepIndex === 0) {
      // Step 1: In-Place Rename (writeups ➔ Husain_Writeups via REAL context menu)
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);

      // 1. Move to writeups card
      const t1 = setTimeout(() => {
        const bounds =
          getTargetBounds('[data-node-id="writeups-dir"]') ||
          getTargetBounds('[data-node-name="writeups"]') ||
          { centerX: 480, centerY: 240, top: 200, left: 420, width: 140, height: 90 };

        setCursorPos({ x: bounds.centerX, y: bounds.centerY });
        setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
      }, 150);
      timers.push(t1);

      // 2. Select & Equip Writeups Card
      const tSelect = setTimeout(() => {
        triggerClickRipple("CLICK: SELECT");
        const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
        if (el) el.click();
      }, 650);
      timers.push(tSelect);

      // 3. Right-Click on Writeups to open the REAL context menu
      const t2 = setTimeout(() => {
        triggerClickRipple("RIGHT CLICK");
        const bounds =
          getTargetBounds('[data-node-id="writeups-dir"]') ||
          getTargetBounds('[data-node-name="writeups"]') ||
          { centerX: 480, centerY: 240 };
        // Dispatch event to open REAL context menu in DirectoryGrid
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-open-context-menu", {
            detail: { nodeId: "writeups-dir", x: bounds.centerX + 15, y: bounds.centerY + 10 },
          })
        );
      }, 1100);
      timers.push(t2);

      // 4. Move to REAL "Rename" item in the opened context menu
      const t3 = setTimeout(() => {
        const renameBtn = getTargetBounds('button[data-action="rename"]') || {
          centerX: 480 + 80,
          centerY: 240 + 48,
        };
        setCursorPos({ x: renameBtn.centerX, y: renameBtn.centerY });
      }, 1650);
      timers.push(t3);

      // 5. Click REAL "Rename" button -> triggers real inline rename input
      const t4 = setTimeout(() => {
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
      }, 2150);
      timers.push(t4);

      // 6. Move cursor to inline input box
      const tFocus = setTimeout(() => {
        const inputBounds =
          getTargetBounds('[data-node-id="writeups-dir"] input') ||
          getTargetBounds('[data-node-id="writeups-dir"]') ||
          { centerX: 480, centerY: 250 };
        setCursorPos({ x: inputBounds.centerX, y: inputBounds.centerY });
      }, 2450);
      timers.push(tFocus);

      // 7. Type "Husain_Writeups" letter by letter in the real input
      const targetName = "Husain_Writeups";
      const letters: string[] = [""];
      for (let i = 1; i <= targetName.length; i++) {
        letters.push(targetName.substring(0, i));
      }
      letters.forEach((val, idx) => {
        const typeTimer = setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-type-rename", {
              detail: { value: val },
            })
          );
        }, 2550 + idx * 75);
        timers.push(typeTimer);
      });

      // 8. Commit the real rename
      const tCommit = setTimeout(() => {
        triggerClickRipple("ENTER ↵ (COMMITTED)");
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-commit-rename", {
            detail: { nodeId: "writeups-dir", finalValue: "Husain_Writeups" },
          })
        );
      }, 3950);
      timers.push(tCommit);
    } else if (currentStepIndex === 1) {
      // Step 2: Drag Husain_Writeups ➔ Replace Blogs Position
      setShowSimulatedMenu(false);

      // 1. Move onto renamed Husain_Writeups card
      const t1 = setTimeout(() => {
        const bounds =
          getTargetBounds('[data-node-id="writeups-dir"]') ||
          getTargetBounds('[data-node-name="Husain_Writeups"]') ||
          getTargetBounds('[data-node-name="writeups"]') ||
          { centerX: 480, centerY: 240, top: 200, left: 420, width: 140, height: 90 };

        setCursorPos({ x: bounds.centerX, y: bounds.centerY });
        setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
      }, 150);
      timers.push(t1);

      // 2. Equip / Select folder
      const t2 = setTimeout(() => {
        triggerClickRipple("EQUIP FOLDER");
        const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
        if (el) el.click();
      }, 650);
      timers.push(t2);

      // 3. Grab and start drag
      const tGrab = setTimeout(() => {
        triggerClickRipple("GRAB & DRAG");
        setIsDraggingGhost(true);
      }, 1150);
      timers.push(tGrab);

      // 4. Physically glide over to the Blogs position
      const t3 = setTimeout(() => {
        const blogsBounds =
          getTargetBounds('[data-node-id="blogs-dir"]') ||
          getTargetBounds('[data-node-name="blogs"]') ||
          { centerX: 620, centerY: 240, top: 200, left: 560, width: 140, height: 90 };

        setCursorPos({ x: blogsBounds.centerX, y: blogsBounds.centerY });
        setTargetFocusRect({ top: blogsBounds.top - 4, left: blogsBounds.left - 4, width: blogsBounds.width + 8, height: blogsBounds.height + 8 });
      }, 1650);
      timers.push(t3);

      // 5. Drop onto Blogs -> Reorders Husain_Writeups to take Blogs position
      const t4 = setTimeout(() => {
        triggerClickRipple("DROP: REPLACE BLOGS POSITION");
        setIsDraggingGhost(false);
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-drop-reorder", {
            detail: { sourceId: "writeups-dir", targetId: "blogs-dir" },
          })
        );
        showToast("✨ 'Husain_Writeups' moved to Blogs position", 3000);
      }, 2900);
      timers.push(t4);
    } else if (currentStepIndex === 2) {
      // Step 3: Equip & Drag to Quick Access
      setShowSimulatedMenu(false);

      // 1. Move onto Husain_Writeups in its new position
      const t1 = setTimeout(() => {
        const bounds =
          getTargetBounds('[data-node-id="writeups-dir"]') ||
          getTargetBounds('[data-node-name="Husain_Writeups"]') ||
          getTargetBounds('[data-node-name="writeups"]') ||
          { centerX: 620, centerY: 240, top: 200, left: 560, width: 140, height: 90 };

        setCursorPos({ x: bounds.centerX, y: bounds.centerY });
        setTargetFocusRect({ top: bounds.top - 4, left: bounds.left - 4, width: bounds.width + 8, height: bounds.height + 8 });
      }, 150);
      timers.push(t1);

      // 2. Equip / Select folder
      const t2 = setTimeout(() => {
        triggerClickRipple("EQUIP FOLDER");
        const el = document.querySelector('[data-node-id="writeups-dir"]') as HTMLElement | null;
        if (el) el.click();
      }, 650);
      timers.push(t2);

      // 3. Grab
      const tGrab = setTimeout(() => {
        triggerClickRipple("GRAB & DRAG");
        setIsDraggingGhost(true);
      }, 1150);
      timers.push(tGrab);

      // 4. Physically glide up into Quick Access section
      const t3 = setTimeout(() => {
        const qaBounds =
          getTargetBounds('[data-tour="quick-access-section"]') ||
          getTargetBounds('[data-tour="sidebar-vault-btn"]') ||
          { centerX: 420, centerY: 140, top: 90, left: 260, width: 380, height: 110 };

        setCursorPos({ x: qaBounds.centerX, y: qaBounds.centerY });
        setTargetFocusRect({ top: qaBounds.top - 4, left: qaBounds.left - 4, width: qaBounds.width + 8, height: qaBounds.height + 8 });
      }, 1750);
      timers.push(t3);

      // 5. Drop into Quick Access -> Literally pins Husain_Writeups upon drop
      const t4 = setTimeout(() => {
        triggerClickRipple("DROP IN QUICK ACCESS");
        setIsDraggingGhost(false);
        addToQuickAccess("writeups-dir");
        showToast("📌 Pinned 'Husain_Writeups' to Quick Access", 3000);
      }, 2900);
      timers.push(t4);
    } else if (currentStepIndex === 3) {
      // Step 4: Drag out of Quick Access & Drop on "Drop here to unpin" zone
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);

      // 1. Move to pinned item in Quick Access
      const t1 = setTimeout(() => {
        const qaBounds =
          getTargetBounds('[data-tour="quick-access-section"] [data-node-id="writeups-dir"]') ||
          getTargetBounds('[data-tour="quick-access-section"]') ||
          { centerX: 360, centerY: 150, top: 110, left: 300, width: 120, height: 80 };

        setCursorPos({ x: qaBounds.centerX, y: qaBounds.centerY });
        setTargetFocusRect({ top: qaBounds.top - 4, left: qaBounds.left - 4, width: qaBounds.width + 8, height: qaBounds.height + 8 });
      }, 150);
      timers.push(t1);

      // 2. Equip / Select pinned item
      const tSelect = setTimeout(() => {
        triggerClickRipple("EQUIP PINNED ITEM");
        const pinnedCard = document.querySelector('[data-tour="quick-access-section"] [data-node-id="writeups-dir"]') as HTMLElement | null;
        if (pinnedCard) pinnedCard.click();
      }, 650);
      timers.push(tSelect);

      // 3. Grab and start dragging out of Quick Access (triggers "Drop here to unpin" zone)
      const tGrab = setTimeout(() => {
        triggerClickRipple("GRAB & DRAG OUT");
        setIsDraggingGhost(true);
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-start-drag-qa", {
            detail: { nodeId: "writeups-dir" },
          })
        );
      }, 1100);
      timers.push(tGrab);

      // 4. Glide down onto the "Drop here to unpin from Quick Access" drop zone
      const tGlide = setTimeout(() => {
        const dropZoneBounds =
          getTargetBounds('[data-tour="qa-remove-drop-zone"]') ||
          getTargetBounds(`.${styles.qaRemoveDropZone}`) ||
          { centerX: 420, centerY: 240, top: 200, left: 260, width: 380, height: 75 };

        setCursorPos({ x: dropZoneBounds.centerX, y: dropZoneBounds.centerY });
        setTargetFocusRect({ top: dropZoneBounds.top - 4, left: dropZoneBounds.left - 4, width: dropZoneBounds.width + 8, height: dropZoneBounds.height + 8 });
        window.dispatchEvent(new CustomEvent("vfs-autopilot-drag-over-remove"));
      }, 1800);
      timers.push(tGlide);

      // 5. Drop right onto the unpin drop zone -> Literally removes from Quick Access
      const tDrop = setTimeout(() => {
        triggerClickRipple("DROP TO UNPIN");
        setIsDraggingGhost(false);
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-drop-remove", {
            detail: { nodeId: "writeups-dir" },
          })
        );
        setTargetFocusRect(null);
      }, 2900);
      timers.push(tDrop);
    } else if (currentStepIndex === 4) {
      // Step 5: Engage CLI Terminal & Execute 'cat contact-info.md'
      setShowSimulatedMenu(false);
      setIsDraggingGhost(false);

      // 1. Move up to Header Mode Switch
      const t1 = setTimeout(() => {
        const headerBtn =
          getTargetBounds('#mode-btn-cli') ||
          getTargetBounds('button[title*="CLI"]') ||
          { centerX: window.innerWidth / 2 + 30, centerY: 35, top: 10, left: window.innerWidth / 2, width: 60, height: 36 };

        setCursorPos({ x: headerBtn.centerX, y: headerBtn.centerY });
        setTargetFocusRect({ top: headerBtn.top - 2, left: headerBtn.left - 2, width: headerBtn.width + 4, height: headerBtn.height + 4 });
      }, 200);
      timers.push(t1);

      // 2. Click real CLI button
      const t2 = setTimeout(() => {
        triggerClickRipple("CLICK: CLI MODE");
        const btn = document.querySelector('#mode-btn-cli') as HTMLButtonElement | null;
        if (btn) {
          btn.click();
        }
      }, 700);
      timers.push(t2);

      // 3. Move cursor to terminal active prompt input
      const t3 = setTimeout(() => {
        const inputBounds =
          getTargetBounds('[data-tour="terminal-input"]') ||
          getTargetBounds('input[aria-label="Terminal input prompt"]') ||
          { centerX: 350, centerY: 260, top: 240, left: 180, width: 400, height: 32 };

        setCursorPos({ x: inputBounds.centerX, y: inputBounds.centerY });
        setTargetFocusRect({ top: inputBounds.top - 3, left: inputBounds.left - 3, width: inputBounds.width + 6, height: inputBounds.height + 6 });
        triggerClickRipple("FOCUS TERMINAL");
      }, 1200);
      timers.push(t3);

      // 4. Live type "cat contact-info.md" letter by letter
      const targetCmd = "cat contact-info.md";
      const letters: string[] = [""];
      for (let i = 1; i <= targetCmd.length; i++) {
        letters.push(targetCmd.substring(0, i));
      }
      letters.forEach((val, idx) => {
        const typeTimer = setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("vfs-autopilot-type-cli", {
              detail: { value: val },
            })
          );
        }, 1450 + idx * 60);
        timers.push(typeTimer);
      });

      // 5. Execute command (Enter ↵)
      const tExec = setTimeout(() => {
        triggerClickRipple("ENTER ↵ (EXECUTE)");
        window.dispatchEvent(
          new CustomEvent("vfs-autopilot-run-cli", {
            detail: { command: "cat contact-info.md" },
          })
        );
        setTargetFocusRect(null);
      }, 2850);
      timers.push(tExec);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isAutopilotActive, currentStepIndex, getTargetBounds, triggerClickRipple, addToQuickAccess, showToast]);

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
