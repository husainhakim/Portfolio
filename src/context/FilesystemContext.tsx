"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FSNode,
  FSFile,
  ROOT_PATH,
  VIRTUAL_FS,
  findNodeById,
  findNodeByPath,
  getParentPath,
  normalizePath,
  getNodePublicUrl,
} from "@/data/filesystemData";
import { useRouter, usePathname } from "next/navigation";
import { useAchievements } from "@/context/AchievementContext";
import {
  loadSavedState,
  persistSavedState,
  clearSavedState,
  areFilesystemStatesEqual,
  SavedFilesystemData,
} from "@/lib/savedStateHelper";

type WorkspaceMode = "gui" | "cli";
type ViewLayout = "grid" | "list";
export type SortOption = "default" | "a-z" | "z-a";

interface FilesystemContextType {
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  toggleMode: () => void;
  currentPath: string;
  currentNode: FSNode | null;
  selectedNode: FSNode | null;
  setSelectedNode: (node: FSNode | null) => void;
  openedFile: FSFile | null;
  openFile: (file: FSFile) => void;
  closeFile: () => void;
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  navigate: (targetPath: string) => boolean;
  goBack: () => void;
  goForward: () => void;
  goUp: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  history: string[];
  // GUI & CLI In-Memory Modifications & Rename Canonical State
  customNames: Record<string, string>;
  deletedNodeIds: string[];
  folderOrders: Record<string, string[]>;
  isModified: boolean;
  hasSavedState: boolean;
  hasUnsavedChanges: boolean;
  saveState: () => void;
  resetSavedState: (skipConfirm?: boolean) => void;
  getNodeDisplayName: (node: FSNode | null | undefined) => string;
  renameNode: (nodeId: string, newName: string) => void;
  deleteNode: (nodeId: string) => void;
  restoreNode: (nodeId: string) => void;
  reorderNodes: (folderKey: string, sourceId: string, targetId: string) => void;
  setExplicitFolderOrder: (folderKey: string, newOrderedIds: string[]) => void;
  resetModifications: () => void;
  // Shared Actions & Toast State
  toastMessage: string | null;
  showToast: (message: string, duration?: number) => void;
  handleCopyNode: (node: FSNode) => void;
  handleDeleteNode: (node: FSNode) => void;
  justRestoredNodeIds: string[];
  // Quick Access Pinning State
  quickAccessIds: string[];
  addToQuickAccess: (nodeId: string) => void;
  removeFromQuickAccess: (nodeId: string) => void;
  resetQuickAccess: () => void;
  setQuickAccessList: (ids: string[]) => void;
  justPinnedNodeIds: string[];
  // Bootloader State
  isBooted: boolean;
  completeBoot: () => void;
}

export const MAX_QUICK_ACCESS_ITEMS = 5;

export const DEFAULT_QUICK_ACCESS_IDS = [
  "about-file",
  "experience-dir",
  "projects-dir",
  "contact-file",
];

const PUNCHLINE_MESSAGES: Record<string, string> = {
  "resume.pdf": "Bold move deleting the one thing that gets me hired 💀",
  "about.md": "Trying to erase my whole existence? Rude.",
  projects: "Deleting my projects? That's where the magic happens 🪄",
  writeups: "My security writeups... gone? Bold strategy.",
  blogs: "Silencing my blog. Censorship much?",
  "skills.md": "Nice, now I officially have no skills 😔",
  "contact-info.md": "Deleting my contact info? Guess we're not friends anymore.",
  experience: "Wiping my experience? I'm still experienced, I promise.",
};

const FALLBACK_PUNCHLINES = [
  "Deleted. Bold of you.",
  "That's gone. For now 😏",
  "Poof. You're powerful.",
  "Wow, ruthless.",
  "That felt oddly satisfying to watch.",
];

function getDeletePunchline(nodeName: string): string {
  const key = nodeName.toLowerCase();
  if (PUNCHLINE_MESSAGES[key]) {
    return PUNCHLINE_MESSAGES[key];
  }
  const randomIndex = Math.floor(Math.random() * FALLBACK_PUNCHLINES.length);
  return FALLBACK_PUNCHLINES[randomIndex];
}

const FilesystemContext = createContext<FilesystemContextType | undefined>(undefined);

export function FilesystemProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { unlock } = useAchievements();

  const [mode, setModeState] = useState<WorkspaceMode>("gui");
  const [cliPath, setCliPath] = useState<string>(ROOT_PATH);
  const [selectedNode, setSelectedNode] = useState<FSNode | null>(null);
  const [openedFile, setOpenedFile] = useState<FSFile | null>(null);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isBooted, setIsBooted] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("vfs_booted") === "true") {
        setIsBooted(true);
      }
    } catch (_) {
      setIsBooted(true);
    }
  }, []);

  const completeBoot = useCallback(() => {
    try {
      sessionStorage.setItem("vfs_booted", "true");
    } catch (_) {}
    setIsBooted(true);
  }, []);

  // GUI & CLI interactive customization state
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [deletedNodeIds, setDeletedNodeIds] = useState<string[]>([]);
  const [folderOrders, setFolderOrders] = useState<Record<string, string[]>>({});
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>(DEFAULT_QUICK_ACCESS_IDS);
  const [justPinnedNodeIds, setJustPinnedNodeIds] = useState<string[]>([]);
  const [justRestoredNodeIds, setJustRestoredNodeIds] = useState<string[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState<SavedFilesystemData | null>(null);
  const [hasSavedState, setHasSavedState] = useState<boolean>(false);

  // Restore explicit saved state from localStorage on mount
  useEffect(() => {
    try {
      const loaded = loadSavedState();
      if (loaded) {
        setSavedSnapshot(loaded);
        setHasSavedState(true);
        if (loaded.customNames && typeof loaded.customNames === "object") {
          setCustomNames(loaded.customNames);
        }
        if (loaded.folderOrders && typeof loaded.folderOrders === "object") {
          setFolderOrders(loaded.folderOrders);
        }
        if (loaded.quickAccessIds && Array.isArray(loaded.quickAccessIds) && loaded.quickAccessIds.length > 0) {
          setQuickAccessIds(loaded.quickAccessIds);
          quickAccessIdsRef.current = loaded.quickAccessIds;
        }
      }
    } catch (_) {}
  }, []);

  // Toast & auto-restore state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const restoreTimersRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  const currentFilesystemData: SavedFilesystemData = React.useMemo(() => ({
    customNames,
    folderOrders,
    quickAccessIds,
  }), [customNames, folderOrders, quickAccessIds]);

  const hasUnsavedChanges = React.useMemo(() => {
    return !areFilesystemStatesEqual(currentFilesystemData, savedSnapshot, DEFAULT_QUICK_ACCESS_IDS);
  }, [currentFilesystemData, savedSnapshot]);

  const isModified = React.useMemo(() => {
    const isQAChanged =
      quickAccessIds.length !== DEFAULT_QUICK_ACCESS_IDS.length ||
      quickAccessIds.some((id, idx) => id !== DEFAULT_QUICK_ACCESS_IDS[idx]);
    return (
      Object.keys(customNames).length > 0 ||
      deletedNodeIds.length > 0 ||
      Object.keys(folderOrders).length > 0 ||
      isQAChanged ||
      restoreTimersRef.current.size > 0
    );
  }, [customNames, deletedNodeIds, folderOrders, quickAccessIds]);

  const showToast = useCallback((message: string, duration = 5000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  const getNodeDisplayName = useCallback(
    (node: FSNode | null | undefined): string => {
      if (!node) return "";
      return customNames[node.id] || node.name;
    },
    [customNames]
  );

  const renameNode = useCallback(
    (nodeId: string, newName: string) => {
      const trimmed = newName.trim();
      if (trimmed) {
        unlock("master_of_disguise");
      }
      setCustomNames((prev) => {
        let next: Record<string, string>;
        if (!trimmed) {
          next = { ...prev };
          delete next[nodeId];
        } else {
          next = { ...prev, [nodeId]: trimmed };
        }
        return next;
      });
    },
    [unlock]
  );

  const deleteNode = useCallback((nodeId: string) => {
    setDeletedNodeIds((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]));
    setSelectedNode((current) => (current?.id === nodeId ? null : current));
  }, []);

  const restoreNode = useCallback((nodeId: string) => {
    setDeletedNodeIds((prev) => prev.filter((id) => id !== nodeId));
  }, []);

  const handleCopyNode = useCallback(
    (node: FSNode) => {
      if (typeof window === "undefined") return;
      const publicPath = getNodePublicUrl(node);
      const url = `${window.location.origin}${publicPath}`;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).catch(() => { });
      }
      showToast("Link copied to clipboard");
    },
    [showToast]
  );

  const handleDeleteNode = useCallback(
    (node: FSNode) => {
      // Exclude Personal Vault entirely
      if (
        node.id === "vault" ||
        node.name.toLowerCase() === "vault" ||
        node.name.toLowerCase() === "personal vault"
      ) {
        return;
      }

      // Achievement triggers for deleting About.md or Contact-info.md
      const nameLower = node.name.toLowerCase();
      if (nameLower === "about.md" || node.id === "about-file") {
        unlock("identity_thief");
      } else if (nameLower === "contact-info.md" || node.id === "contact-file") {
        unlock("ghosted");
      }

      // 1. Reset timer if this item was already mid-countdown
      const existing = restoreTimersRef.current.get(node.id);
      if (existing) {
        clearTimeout(existing);
        restoreTimersRef.current.delete(node.id);
      }

      // 2. Soft-delete immediately
      deleteNode(node.id);

      // 3. Show punchline toast (persisting for 8s)
      showToast(getDeletePunchline(node.name), 8000);

      // 4. Set 8-second countdown to auto-restore
      const timer = setTimeout(() => {
        restoreNode(node.id);
        restoreTimersRef.current.delete(node.id);

        // Trigger pop-in animation
        setJustRestoredNodeIds((prev) => [...prev, node.id]);
        setTimeout(() => {
          setJustRestoredNodeIds((prev) => prev.filter((id) => id !== node.id));
        }, 450);
      }, 8000);

      restoreTimersRef.current.set(node.id, timer);
    },
    [deleteNode, restoreNode, showToast, unlock]
  );

  const quickAccessIdsRef = React.useRef<string[]>(quickAccessIds);
  useEffect(() => {
    quickAccessIdsRef.current = quickAccessIds;
  }, [quickAccessIds]);

  const reorderNodes = useCallback(
    (folderKey: string, sourceId: string, targetId: string) => {
      if (sourceId === targetId) return;
      let didReorder = false;
      setFolderOrders((prev) => {
        const current = prev[folderKey] || [];
        const newOrder = [...current];
        const sourceIndex = newOrder.indexOf(sourceId);
        const targetIndex = newOrder.indexOf(targetId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          newOrder.splice(sourceIndex, 1);
          newOrder.splice(targetIndex, 0, sourceId);
          didReorder = true;
          return { ...prev, [folderKey]: newOrder };
        }
        return prev;
      });
      if (didReorder) {
        unlock("file_shuffler");
      }
    },
    [unlock]
  );

  const setExplicitFolderOrder = useCallback(
    (folderKey: string, newOrderedIds: string[]) => {
      setFolderOrders((prev) => {
        let next: Record<string, string[]>;
        if (!newOrderedIds || newOrderedIds.length === 0) {
          next = { ...prev };
          delete next[folderKey];
        } else {
          next = { ...prev, [folderKey]: newOrderedIds };
        }
        return next;
      });
      if (newOrderedIds && newOrderedIds.length > 0) {
        unlock("file_shuffler");
      }
    },
    [unlock]
  );

  const setQuickAccessList = useCallback((ids: string[]) => {
    quickAccessIdsRef.current = ids;
    setQuickAccessIds(ids);
  }, []);

  const resetQuickAccess = useCallback(() => {
    quickAccessIdsRef.current = DEFAULT_QUICK_ACCESS_IDS;
    setQuickAccessIds(DEFAULT_QUICK_ACCESS_IDS);
  }, []);

  const addToQuickAccess = useCallback(
    (nodeId: string) => {
      if (quickAccessIdsRef.current.includes(nodeId)) {
        showToast("Item is already pinned to Quick Access", 3000);
        return;
      }

      if (quickAccessIdsRef.current.length >= MAX_QUICK_ACCESS_ITEMS) {
        showToast(`⚠️ Quick Access is full (maximum ${MAX_QUICK_ACCESS_ITEMS} items). Remove one to add a new one.`, 4000);
        return;
      }

      const targetNode = findNodeById(nodeId);
      const name = targetNode ? (customNames[nodeId] || targetNode.name) : "Item";

      setQuickAccessIds((prev) => {
        if (prev.includes(nodeId) || prev.length >= MAX_QUICK_ACCESS_ITEMS) return prev;
        const next = [...prev, nodeId];
        quickAccessIdsRef.current = next;
        return next;
      });

      showToast(`📌 Pinned '${name}' to Quick Access`, 3000);

      if (quickAccessIdsRef.current.length >= MAX_QUICK_ACCESS_ITEMS) {
        unlock("hoarder");
      }

      setJustPinnedNodeIds((prev) => [...prev, nodeId]);
      setTimeout(() => {
        setJustPinnedNodeIds((prev) => prev.filter((id) => id !== nodeId));
      }, 800);
    },
    [customNames, showToast, unlock]
  );

  const removeFromQuickAccess = useCallback((nodeId: string) => {
    setQuickAccessIds((prev) => {
      const next = prev.filter((id) => id !== nodeId);
      quickAccessIdsRef.current = next;
      return next;
    });
  }, []);

  const saveState = useCallback(() => {
    const snapshot: SavedFilesystemData = {
      customNames: { ...customNames },
      folderOrders: { ...folderOrders },
      quickAccessIds: [...quickAccessIds],
    };
    const success = persistSavedState(snapshot);
    if (success) {
      setSavedSnapshot(snapshot);
      setHasSavedState(true);
      showToast("State saved", 3000);
    } else {
      showToast("Failed to save state to local storage", 3000);
    }
  }, [customNames, folderOrders, quickAccessIds, showToast]);

  const resetSavedState = useCallback(
    (skipConfirm = false) => {
      if (!skipConfirm && typeof window !== "undefined") {
        const confirmed = window.confirm(
          "Reset all filesystem customizations and delete saved state? This will restore the original default filesystem."
        );
        if (!confirmed) return;
      }

      restoreTimersRef.current.forEach((timer) => clearTimeout(timer));
      restoreTimersRef.current.clear();

      clearSavedState();

      setCustomNames({});
      setDeletedNodeIds([]);
      setFolderOrders({});
      setQuickAccessIds(DEFAULT_QUICK_ACCESS_IDS);
      quickAccessIdsRef.current = DEFAULT_QUICK_ACCESS_IDS;
      setSavedSnapshot(null);
      setHasSavedState(false);

      showToast("Workspace reset to default state. All names & layouts restored.", 3500);
    },
    [showToast]
  );

  const resetModifications = useCallback(() => {
    resetSavedState(false);
  }, [resetSavedState]);

  // Synchronize restore timers when deletedNodeIds changes (e.g. manual Reset button clicked)
  useEffect(() => {
    if (deletedNodeIds.length === 0 && restoreTimersRef.current.size > 0) {
      restoreTimersRef.current.forEach((timer) => clearTimeout(timer));
      restoreTimersRef.current.clear();
    } else {
      restoreTimersRef.current.forEach((timer, nodeId) => {
        if (!deletedNodeIds.includes(nodeId)) {
          clearTimeout(timer);
          restoreTimersRef.current.delete(nodeId);
        }
      });
    }
  }, [deletedNodeIds]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      restoreTimersRef.current.forEach((timer) => clearTimeout(timer));
      restoreTimersRef.current.clear();
    };
  }, []);

  const modeRef = React.useRef<WorkspaceMode>(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Derive virtual path from URL pathname for GUI mode
  const guiVirtualPath =
    pathname === "/"
      ? ROOT_PATH
      : pathname === "/experience"
      ? "/home/husain/experience/letsupgrade-backend-engineer"
      : normalizePath(pathname);
  const guiResolvedNode = findNodeByPath(guiVirtualPath, VIRTUAL_FS, customNames);
  const guiCurrentPath = guiResolvedNode?.type === "file" ? getParentPath(guiVirtualPath) : guiVirtualPath;

  // Active path and node depending on workspace mode
  const currentPath = mode === "cli" ? cliPath : guiCurrentPath;
  const currentNode = findNodeByPath(currentPath, VIRTUAL_FS, customNames);

  // Sync openedFile with URL in GUI mode
  useEffect(() => {
    if (mode === "gui") {
      if (guiResolvedNode?.type === "file") {
        setOpenedFile(guiResolvedNode as FSFile);
        setSelectedNode(guiResolvedNode);
      } else {
        setOpenedFile(null);
        setSelectedNode(null);
      }
    } else {
      setOpenedFile(null);
    }
  }, [mode, guiVirtualPath, guiResolvedNode]);

  const navigate = useCallback(
    (targetPath: string): boolean => {
      const normalized =
        targetPath === "/experience"
          ? "/home/husain/experience/letsupgrade-backend-engineer"
          : normalizePath(targetPath);
      const node = findNodeByPath(normalized, VIRTUAL_FS, customNames);

      if (!node) {
        return false;
      }

      // If currently in CLI mode, NEVER change the browser URL
      if (modeRef.current === "cli") {
        const destPath = node.type === "file" ? getParentPath(normalized) : normalized;
        setCliPath(destPath);
        return true;
      }

      const publicUrl = getNodePublicUrl(node);
      router.push(publicUrl);

      return true;
    },
    [router, customNames]
  );

  const setMode = useCallback((newMode: WorkspaceMode) => {
    setModeState(newMode);
    modeRef.current = newMode;
    if (newMode === "cli") {
      unlock("old_school");
      setCliPath(guiCurrentPath);
      router.push("/");
    } else {
      const urlPath = cliPath === ROOT_PATH ? "/" : cliPath;
      router.push(urlPath);
    }
  }, [guiCurrentPath, cliPath, router, unlock]);

  const toggleMode = useCallback(() => {
    const nextMode = modeRef.current === "gui" ? "cli" : "gui";
    setModeState(nextMode);
    modeRef.current = nextMode;
    if (nextMode === "cli") {
      unlock("old_school");
      setCliPath(guiCurrentPath);
      router.push("/");
    } else {
      const urlPath = cliPath === ROOT_PATH ? "/" : cliPath;
      router.push(urlPath);
    }
  }, [guiCurrentPath, cliPath, router, unlock]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  const goUp = useCallback(() => {
    if (currentPath !== ROOT_PATH) {
      const parentPath = getParentPath(currentPath);
      navigate(parentPath);
    }
  }, [currentPath, navigate]);

  const openFile = useCallback((file: FSFile) => {
    const publicUrl = getNodePublicUrl(file);
    navigate(publicUrl);
  }, [navigate]);

  const closeFile = useCallback(() => {
    setOpenedFile(null);
    setSelectedNode(null);
    if (openedFile) {
      const parent = getParentPath(openedFile.path);
      const target =
        parent === "/home/husain/vault" || parent === ROOT_PATH || parent === "/vault"
          ? "/"
          : parent.replace(/^\/home\/husain/, "") || "/";
      navigate(target);
    } else {
      navigate("/");
    }
  }, [navigate, openedFile]);

  // Browser handles history, so these are simplifications
  const canGoBack = true;
  const canGoForward = true;
  const canGoUp = currentPath !== ROOT_PATH;

  const history: string[] = [currentPath];

  return (
    <FilesystemContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        currentPath,
        currentNode,
        selectedNode,
        setSelectedNode,
        openedFile,
        openFile,
        closeFile,
        viewLayout,
        setViewLayout,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        navigate,
        goBack,
        goForward,
        goUp,
        canGoBack,
        canGoForward,
        canGoUp,
        history,
        customNames,
        deletedNodeIds,
        folderOrders,
        isModified,
        hasSavedState,
        hasUnsavedChanges,
        saveState,
        resetSavedState,
        getNodeDisplayName,
        renameNode,
        deleteNode,
        restoreNode,
        reorderNodes,
        setExplicitFolderOrder,
        resetModifications,
        toastMessage,
        showToast,
        handleCopyNode,
        handleDeleteNode,
        justRestoredNodeIds,
        quickAccessIds,
        addToQuickAccess,
        removeFromQuickAccess,
        resetQuickAccess,
        setQuickAccessList,
        justPinnedNodeIds,
        isBooted,
        completeBoot,
      }}
    >
      {children}
    </FilesystemContext.Provider>
  );
}

export function useFilesystem() {
  const context = useContext(FilesystemContext);
  if (!context) {
    throw new Error("useFilesystem must be used within a FilesystemProvider");
  }
  return context;
}
