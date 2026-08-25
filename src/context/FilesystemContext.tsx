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
  const [mode, setMode] = useState<WorkspaceMode>("gui");
  const [currentPath, setCurrentPath] = useState<string>(ROOT_PATH);
  const [selectedNode, setSelectedNode] = useState<FSNode | null>(null);
  const [openedFile, setOpenedFile] = useState<FSFile | null>(null);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Navigation History Stack
  const [history, setHistory] = useState<string[]>([ROOT_PATH]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Sync current node with currentPath
  const currentNode = findNodeByPath(currentPath, VIRTUAL_FS);

  const navigate = useCallback(
    (targetPath: string): boolean => {
      const normalized = normalizePath(targetPath);
      const node = findNodeByPath(normalized, VIRTUAL_FS);

      if (!node) {
        return false;
      }

      if (node.type === "file") {
        // If it's a file, open the file viewer and keep path at the file's parent or path
        setOpenedFile(node);
        setSelectedNode(node);
      } else {
        // Directory navigation
        setCurrentPath(normalized);
        setSelectedNode(null);
        setOpenedFile(null);

        // Update history if different from current history position
        if (normalized !== history[historyIndex]) {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(normalized);
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
      }

      return true;
    },
    [history, historyIndex]
  );

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevPath = history[prevIndex];
      setHistoryIndex(prevIndex);
      setCurrentPath(prevPath);
      setSelectedNode(null);
      setOpenedFile(null);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextPath = history[nextIndex];
      setHistoryIndex(nextIndex);
      setCurrentPath(nextPath);
      setSelectedNode(null);
      setOpenedFile(null);
    }
  }, [history, historyIndex]);

  const goUp = useCallback(() => {
    if (currentPath !== ROOT_PATH) {
      const parentPath = getParentPath(currentPath);
      navigate(parentPath);
    }
  }, [currentPath, navigate]);

  const openFile = useCallback((file: FSFile) => {
    setOpenedFile(file);
    setSelectedNode(file);
  }, []);

  const closeFile = useCallback(() => {
    setOpenedFile(null);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "gui" ? "cli" : "gui"));
  }, []);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const canGoUp = currentPath !== ROOT_PATH;

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
