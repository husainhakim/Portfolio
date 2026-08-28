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

  const [mode, setMode] = useState<WorkspaceMode>("gui");
  const [selectedNode, setSelectedNode] = useState<FSNode | null>(null);
  const [openedFile, setOpenedFile] = useState<FSFile | null>(null);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Derive virtual path from URL pathname
  const virtualPath = pathname === "/" ? ROOT_PATH : normalizePath(pathname);
  const resolvedNode = findNodeByPath(virtualPath, VIRTUAL_FS);

  // If the URL points to a file, current path is the parent directory
  const currentPath = resolvedNode?.type === "file" ? getParentPath(virtualPath) : virtualPath;
  const currentNode = findNodeByPath(currentPath, VIRTUAL_FS);

  // Sync openedFile with URL
  useEffect(() => {
    if (resolvedNode?.type === "file") {
      setOpenedFile(resolvedNode as FSFile);
      setSelectedNode(resolvedNode);
    } else {
      setOpenedFile(null);
      // We don't want to clear selectedNode completely on every directory change 
      // if they just selected something, but usually URL change means a new location.
      setSelectedNode(null);
    }
  }, [virtualPath, resolvedNode]);

  const navigate = useCallback(
    (targetPath: string): boolean => {
      const normalized = normalizePath(targetPath);
      const node = findNodeByPath(normalized, VIRTUAL_FS);

      if (!node) {
        return false;
      }

      // If they are navigating to ROOT_PATH, map it back to "/" to keep URL clean, or just use the exact path
      const urlPath = normalized === ROOT_PATH ? "/" : normalized;
      router.push(urlPath);
      
      return true;
    },
    [router]
  );

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
    // Navigate to the parent directory to close the file
    navigate(currentPath);
  }, [navigate, currentPath]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "gui" ? "cli" : "gui"));
  }, []);

  // Browser handles history, so these are simplifications
  const canGoBack = true; // We can't easily know if browser has back history in Next.js without listening to window events, so we assume true for UI
  const canGoForward = true;
  const canGoUp = currentPath !== ROOT_PATH;
  
  // We no longer strictly track history array in context
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
