"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Achievement,
  AchievementId,
  ACHIEVEMENTS,
  NON_META_ACHIEVEMENTS,
  TOTAL_ACHIEVEMENTS,
  getAchievement,
} from "@/data/achievementsData";

export const ACHIEVEMENTS_STORAGE_KEY = "portfolio_achievements_v1";

export interface UnlockedRecord {
  unlockedAt: string;
}

export interface FlightCoordinates {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

interface AchievementContextType {
  unlockedMap: Record<string, UnlockedRecord>;
  unlockedCount: number;
  totalCount: number;
  unlock: (id: AchievementId) => void;
  isUnlocked: (id: AchievementId) => boolean;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  resetAchievements: () => void;
  activePopup: { achievement: Achievement; key: string } | null;
  flightCoords: FlightCoordinates | null;
  isFlying: boolean;
  trophyBounceKey: number;
  trophyButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined
);

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlockedMap, setUnlockedMap] = useState<
    Record<string, UnlockedRecord>
  >({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<{
    achievement: Achievement;
    key: string;
  } | null>(null);
  const [flightCoords, setFlightCoords] = useState<FlightCoordinates | null>(
    null
  );
  const [isFlying, setIsFlying] = useState(false);
  const [trophyBounceKey, setTrophyBounceKey] = useState(0);

  const trophyButtonRef = useRef<HTMLButtonElement | null>(null);
  const queueRef = useRef<AchievementId[]>([]);
  const isAnimatingRef = useRef(false);
  const unlockedMapRef = useRef<Record<string, UnlockedRecord>>({});

  // Keep ref synchronized
  useEffect(() => {
    unlockedMapRef.current = unlockedMap;
  }, [unlockedMap]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setUnlockedMap(parsed);
          unlockedMapRef.current = parsed;
        }
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  const saveToStorage = (map: Record<string, UnlockedRecord>) => {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // localStorage fallback
    }
  };

  const processQueue = useCallback(() => {
    if (isAnimatingRef.current || queueRef.current.length === 0) {
      return;
    }

    const nextId = queueRef.current.shift();
    if (!nextId) return;

    const ach = getAchievement(nextId);
    if (!ach) {
      processQueue();
      return;
    }

    isAnimatingRef.current = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setTrophyBounceKey((k) => k + 1);
      setTimeout(() => {
        isAnimatingRef.current = false;
        processQueue();
      }, 300);
      return;
    }

    // Step 1: Center popup holds for ~1.6s
    setActivePopup({ achievement: ach, key: `${nextId}-${Date.now()}` });
    setIsFlying(false);
    setFlightCoords(null);

    setTimeout(() => {
      // Step 2: Compute flight target coordinates
      const buttonEl =
        trophyButtonRef.current ||
        (typeof document !== "undefined"
          ? (document.getElementById(
              "header-trophy-button"
            ) as HTMLButtonElement | null)
          : null);

      const vpW = window.innerWidth;
      const vpH = window.innerHeight;

      let targetX = vpW - 120;
      let targetY = 24;

      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      const startX = vpW / 2;
      const startY = vpH * 0.4;

      setFlightCoords({ startX, startY, targetX, targetY });
      setIsFlying(true);

      // Step 3: Flight duration 650ms -> Landing Pulse
      setTimeout(() => {
        setIsFlying(false);
        setActivePopup(null);
        setFlightCoords(null);
        setTrophyBounceKey((k) => k + 1);

        // Gap before next item
        setTimeout(() => {
          isAnimatingRef.current = false;
          processQueue();
        }, 250);
      }, 650);
    }, 1600);
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      // Check if already unlocked
      if (unlockedMapRef.current[id]) {
        return;
      }

      const now = new Date().toISOString();
      const updatedMap = {
        ...unlockedMapRef.current,
        [id]: { unlockedAt: now },
      };

      setUnlockedMap(updatedMap);
      unlockedMapRef.current = updatedMap;
      saveToStorage(updatedMap);

      // Queue for animation
      queueRef.current.push(id);

      // Check if all 8 non-meta achievements are now unlocked -> unlock completionist!
      if (id !== "completionist") {
        const allOthersUnlocked = NON_META_ACHIEVEMENTS.every(
          (a) => updatedMap[a.id]
        );
        if (allOthersUnlocked && !updatedMap["completionist"]) {
          const metaNow = new Date().toISOString();
          const withMeta = {
            ...updatedMap,
            completionist: { unlockedAt: metaNow },
          };
          setUnlockedMap(withMeta);
          unlockedMapRef.current = withMeta;
          saveToStorage(withMeta);
          queueRef.current.push("completionist");
        }
      }

      processQueue();
    },
    [processQueue]
  );

  const isUnlocked = useCallback(
    (id: AchievementId) => {
      return !!unlockedMap[id];
    },
    [unlockedMap]
  );

  const resetAchievements = useCallback(() => {
    setUnlockedMap({});
    unlockedMapRef.current = {};
    queueRef.current = [];
    isAnimatingRef.current = false;
    setActivePopup(null);
    setIsFlying(false);
    setFlightCoords(null);
    try {
      localStorage.removeItem(ACHIEVEMENTS_STORAGE_KEY);
    } catch {
      // fallback
    }
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const unlockedCount = Object.keys(unlockedMap).length;

  return (
    <AchievementContext.Provider
      value={{
        unlockedMap,
        unlockedCount,
        totalCount: TOTAL_ACHIEVEMENTS,
        unlock,
        isUnlocked,
        isPanelOpen,
        openPanel,
        closePanel,
        resetAchievements,
        activePopup,
        flightCoords,
        isFlying,
        trophyBounceKey,
        trophyButtonRef,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider"
    );
  }
  return context;
}
