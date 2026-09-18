"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FSNode,
  FSFile,
  ROOT_PATH,
  VIRTUAL_FS,
  findNodeByPath,
  getParentPath,
  normalizePath,
} from "@/data/filesystemData";
import { useRouter, usePathname } from "next/navigation";

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
  // GUI In-Memory Modifications
  customNames: Record<string, string>;
  deletedNodeIds: string[];
  folderOrders: Record<string, string[]>;
  isModified: boolean;
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
}

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

  const [mode, setModeState] = useState<WorkspaceMode>("gui");
  const [cliPath, setCliPath] = useState<string>(ROOT_PATH);
  const [selectedNode, setSelectedNode] = useState<FSNode | null>(null);
  const [openedFile, setOpenedFile] = useState<FSFile | null>(null);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // GUI-only interactive customization state (in-memory, reset on command or refresh)
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [deletedNodeIds, setDeletedNodeIds] = useState<string[]>([]);
  const [folderOrders, setFolderOrders] = useState<Record<string, string[]>>({});

  // Toast & auto-restore state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const restoreTimersRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());
  const [justRestoredNodeIds, setJustRestoredNodeIds] = useState<string[]>([]);

  const isModified =
    Object.keys(customNames).length > 0 ||
    deletedNodeIds.length > 0 ||
    Object.keys(folderOrders).length > 0 ||
    restoreTimersRef.current.size > 0;

  const showToast = useCallback((message: string, duration = 2500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  const renameNode = useCallback((nodeId: string, newName: string) => {
    setCustomNames((prev) => {
      const trimmed = newName.trim();
      if (!trimmed) {
        const next = { ...prev };
        delete next[nodeId];
        return next;
      }
      return { ...prev, [nodeId]: trimmed };
    });
  }, []);

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
      const url = `${window.location.origin}${node.path}`;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).catch(() => {});
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

      // 1. Reset timer if this item was already mid-countdown
      const existing = restoreTimersRef.current.get(node.id);
      if (existing) {
        clearTimeout(existing);
        restoreTimersRef.current.delete(node.id);
      }

      // 2. Soft-delete immediately
      deleteNode(node.id);

      // 3. Show punchline toast (persisting for 4.5s)
      showToast(getDeletePunchline(node.name), 4500);

      // 4. Set 5-second countdown to auto-restore
      const timer = setTimeout(() => {
        restoreNode(node.id);
        restoreTimersRef.current.delete(node.id);

        // Trigger pop-in animation
        setJustRestoredNodeIds((prev) => [...prev, node.id]);
        setTimeout(() => {
          setJustRestoredNodeIds((prev) => prev.filter((id) => id !== node.id));
        }, 450);
      }, 5000);

      restoreTimersRef.current.set(node.id, timer);
    },
    [deleteNode, restoreNode, showToast]
  );

  const reorderNodes = useCallback((folderKey: string, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setFolderOrders((prev) => {
      const current = prev[folderKey] || [];
      const newOrder = [...current];
      const sourceIndex = newOrder.indexOf(sourceId);
      const targetIndex = newOrder.indexOf(targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, sourceId);
      }
      return { ...prev, [folderKey]: newOrder };
    });
  }, []);

  const setExplicitFolderOrder = useCallback((folderKey: string, newOrderedIds: string[]) => {
    setFolderOrders((prev) => ({ ...prev, [folderKey]: newOrderedIds }));
  }, []);

  const resetModifications = useCallback(() => {
    restoreTimersRef.current.forEach((timer) => clearTimeout(timer));
    restoreTimersRef.current.clear();
    setCustomNames({});
    setDeletedNodeIds([]);
    setFolderOrders({});
  }, []);

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
  const guiVirtualPath = pathname === "/" ? ROOT_PATH : normalizePath(pathname);
  const guiResolvedNode = findNodeByPath(guiVirtualPath, VIRTUAL_FS);
  const guiCurrentPath = guiResolvedNode?.type === "file" ? getParentPath(guiVirtualPath) : guiVirtualPath;

  // Active path and node depending on workspace mode
  const currentPath = mode === "cli" ? cliPath : guiCurrentPath;
  const currentNode = findNodeByPath(currentPath, VIRTUAL_FS);

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
  }, [mode, guiVirtualPath]);

  const navigate = useCallback(
    (targetPath: string): boolean => {
      const normalized = normalizePath(targetPath);
      const node = findNodeByPath(normalized, VIRTUAL_FS);

      if (!node) {
        return false;
      }

      // If currently in CLI mode, NEVER change the browser URL
      if (modeRef.current === "cli") {
        const destPath = node.type === "file" ? getParentPath(normalized) : normalized;
        setCliPath(destPath);
        return true;
      }

      // If they are navigating to ROOT_PATH in GUI mode, map it back to "/" to keep URL clean
      const urlPath = normalized === ROOT_PATH ? "/" : normalized;
      router.push(urlPath);

      return true;
    },
    [router]
  );

  const setMode = useCallback((newMode: WorkspaceMode) => {
    setModeState(newMode);
    modeRef.current = newMode;
    if (newMode === "cli") {
      setCliPath(guiCurrentPath);
      router.push("/");
    } else {
      const urlPath = cliPath === ROOT_PATH ? "/" : cliPath;
      router.push(urlPath);
    }
  }, [guiCurrentPath, cliPath, router]);

  const toggleMode = useCallback(() => {
    const nextMode = modeRef.current === "gui" ? "cli" : "gui";
    setModeState(nextMode);
    modeRef.current = nextMode;
    if (nextMode === "cli") {
      setCliPath(guiCurrentPath);
      router.push("/");
    } else {
      const urlPath = cliPath === ROOT_PATH ? "/" : cliPath;
      router.push(urlPath);
    }
  }, [guiCurrentPath, cliPath, router]);

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
    navigate(file.path);
  }, [navigate]);

  const closeFile = useCallback(() => {
    setOpenedFile(null);
    setSelectedNode(null);
    if (openedFile) {
      const parent = getParentPath(openedFile.path);
      const target =
        parent === "/home/husain/vault" || parent === ROOT_PATH || parent === "/vault"
          ? ROOT_PATH
          : parent;
      navigate(target);
    } else {
      navigate(ROOT_PATH);
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
