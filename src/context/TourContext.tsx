"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { TOUR_STEPS, TourStep } from "@/components/gui/FeatureDiscovery/tourStepsData";
import { useAchievements } from "@/context/AchievementContext";

export const TOUR_STORAGE_KEY = "hasSeenCyberWorkstationTour";

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  startTour: (stepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  isWelcomeOpen: boolean;
  openWelcome: () => void;
  closeWelcome: () => void;
  hasSeenTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { unlock } = useAchievements();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!seen) {
        setHasSeenTour(false);
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  const startTour = useCallback((stepIndex = 0) => {
    setIsHelpModalOpen(false);
    setIsWelcomeOpen(false);
    setCurrentStepIndex(Math.max(0, Math.min(stepIndex, TOUR_STEPS.length - 1)));
    setIsTourActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setHasSeenTour(true);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch {
      // fallback
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      unlock("tour_completer");
      endTour();
    }
  }, [currentStepIndex, endTour, unlock]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const openHelpModal = useCallback(() => {
    setIsTourActive(false);
    setIsWelcomeOpen(false);
    setIsHelpModalOpen(true);
  }, []);

  const closeHelpModal = useCallback(() => {
    setIsHelpModalOpen(false);
  }, []);

  const openWelcome = useCallback(() => {
    setIsTourActive(false);
    setIsHelpModalOpen(false);
    setIsWelcomeOpen(true);
  }, []);

  const closeWelcome = useCallback(() => {
    setIsWelcomeOpen(false);
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        startTour,
        nextStep,
        prevStep,
        endTour,
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        isWelcomeOpen,
        openWelcome,
        closeWelcome,
        hasSeenTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
