"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTour } from "@/context/TourContext";
import { X, ChevronRight, ChevronLeft, Check, Sparkles, HelpCircle } from "lucide-react";
import styles from "./InteractiveTour.module.css";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function InteractiveTour() {
  const {
    isTourActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    endTour,
  } = useTour();

  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number }>({ top: 100, left: 100 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Dedicated portal container
  useEffect(() => {
    setMounted(true);
    const container = document.createElement("div");
    container.className = styles.tourPortalRoot;
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Update target bounding box and card position
  const updatePositions = useCallback(() => {
    if (!isTourActive || !currentStep) return;

    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      // Add generous padding around target
      const pad = 6;
      const targetBounds: TargetRect = {
        top: Math.max(0, rect.top - pad),
        left: Math.max(0, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      };
      setTargetRect(targetBounds);

      // Compute card coordinates
      const cardWidth = 380;
      const cardHeight = 260; // approximate
      const gap = 14;

      let top = 0;
      let left = 0;

      const vpW = window.innerWidth;
      const vpH = window.innerHeight;

      switch (currentStep.preferredPosition) {
        case "bottom":
          top = targetBounds.top + targetBounds.height + gap;
          left = Math.min(
            Math.max(16, targetBounds.left + targetBounds.width / 2 - cardWidth / 2),
            vpW - cardWidth - 16
          );
          if (top + cardHeight > vpH - 16) {
            // Flip to top if overflowing bottom
            top = Math.max(16, targetBounds.top - cardHeight - gap);
          }
          break;
        case "top":
          top = Math.max(16, targetBounds.top - cardHeight - gap);
          left = Math.min(
            Math.max(16, targetBounds.left + targetBounds.width / 2 - cardWidth / 2),
            vpW - cardWidth - 16
          );
          break;
        case "right":
          left = targetBounds.left + targetBounds.width + gap;
          top = Math.min(
            Math.max(16, targetBounds.top + targetBounds.height / 2 - cardHeight / 2),
            vpH - cardHeight - 16
          );
          if (left + cardWidth > vpW - 16) {
            left = Math.max(16, targetBounds.left - cardWidth - gap);
          }
          break;
        case "left":
          left = Math.max(16, targetBounds.left - cardWidth - gap);
          top = Math.min(
            Math.max(16, targetBounds.top + targetBounds.height / 2 - cardHeight / 2),
            vpH - cardHeight - 16
          );
          break;
        default:
          // Center
          top = vpH / 2 - cardHeight / 2;
          left = vpW / 2 - cardWidth / 2;
      }

      setCardPos({ top, left });
    } else {
      // If target element is not found, fallback to center overlay
      setTargetRect(null);
      setCardPos({
        top: Math.max(20, window.innerHeight / 2 - 130),
        left: Math.max(16, window.innerWidth / 2 - 190),
      });
    }
  }, [isTourActive, currentStep]);

  useEffect(() => {
    if (!isTourActive) return;
    updatePositions();

    const handleResize = () => updatePositions();
    const handleScroll = () => updatePositions();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isTourActive, currentStepIndex, updatePositions]);

  // Keyboard navigation: ESC to close, Arrow keys for next/prev
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        endTour();
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
  }, [isTourActive, nextStep, prevStep, endTour]);

  if (!isTourActive || !mounted || !portalContainer) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;

  const clipPathStyle = targetRect
    ? `polygon(0 0, 0 100%, ${targetRect.left}px 100%, ${targetRect.left}px ${targetRect.top}px, ${targetRect.left + targetRect.width}px ${targetRect.top}px, ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px, ${targetRect.left}px ${targetRect.top + targetRect.height}px, ${targetRect.left}px 100%, 100% 100%, 100% 0)`
    : undefined;

  const content = (
    <>
      {/* Semi-transparent backdrop: Dims and blurs entire viewport EXCEPT the exact target element */}
      <div
        className={styles.tourBackdrop}
        style={{
          clipPath: clipPathStyle,
          WebkitClipPath: clipPathStyle,
        }}
        onClick={endTour}
      />

      {/* Target spotlight cutout frame */}
      {targetRect && (
        <div
          className={styles.spotlightFrame}
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
          }}
        />
      )}

      {/* Floating Tour Card */}
      <div
        ref={cardRef}
        className={styles.tourCard}
        style={{
          top: `${cardPos.top}px`,
          left: `${cardPos.left}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Tour: ${currentStep.title}`}
      >
        <div className={styles.tourHeader}>
          <div className={styles.tourHeaderMeta}>
            <span className={styles.tourBadge}>{currentStep.badge || `Step ${currentStepIndex + 1} of ${totalSteps}`}</span>
            <h3 className={styles.tourTitle}>{currentStep.title}</h3>
          </div>
          <button
            onClick={endTour}
            className={styles.tourCloseBtn}
            title="Skip / Close tour (ESC)"
            aria-label="Close tour"
          >
            <X size={15} />
          </button>
        </div>

        <p className={styles.tourDescription}>{currentStep.description}</p>

        {currentStep.featureTips && currentStep.featureTips.length > 0 && (
          <ul className={styles.tourTipsList}>
            {currentStep.featureTips.map((tip, i) => (
              <li key={i} className={styles.tourTipItem}>
                <Sparkles size={12} className={styles.tourTipIcon} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.tourFooter}>
          <div className={styles.tourProgress}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`${styles.tourProgressDot} ${
                  i === currentStepIndex ? styles.tourProgressDotActive : ""
                }`}
              />
            ))}
          </div>

          <div className={styles.tourActions}>
            {currentStepIndex > 0 && (
              <button onClick={prevStep} className={styles.tourBtnSecondary}>
                <ChevronLeft size={13} />
                <span>Back</span>
              </button>
            )}
            <button onClick={nextStep} className={styles.tourBtnPrimary}>
              <span>{isLastStep ? "Got it!" : "Next"}</span>
              {isLastStep ? <Check size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, portalContainer);
}
