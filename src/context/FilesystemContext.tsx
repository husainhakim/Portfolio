"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FSNode,
  FSDirectory,
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

  const modeRef = React.useRef<WorkspaceMode>(mode);
  modeRef.current = mode;

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
  }, [mode, guiVirtualPath, guiResolvedNode]);

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
    navigate(currentPath);
  }, [navigate, currentPath]);

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
