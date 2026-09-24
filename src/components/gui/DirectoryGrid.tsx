"use client";

import React from "react";
import Image from "next/image";
import { useFilesystem, MAX_QUICK_ACCESS_ITEMS } from "@/context/FilesystemContext";
import { FSNode, FSDirectory, FSFile, ROOT_PATH, VIRTUAL_FS, findNodeById } from "@/data/filesystemData";
import { formatFileSize, getFileBadgeVariant } from "@/lib/fileHelpers";
import { downloadNode } from "@/lib/downloadHelper";
import {
  Folder,
  FileText,
  Shield,
  Code,
  BookOpen,
  Compass,
  Briefcase,
  Mail,
  FileCode,
  FileCheck,
  ArrowUpRight,
  Download,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  GraduationCap,
  Target,
  ChevronDown,
  Pin,
  PinOff,
  Clock,
  Star,
  Users,
  Wrench,
  Lock,
  FileEdit,
  Info,
  Copy,
  Trash2,
  Check,
  FolderOpen,
  X,
  Zap,
  ImageIcon,
} from "lucide-react";
import styles from "./Gui.module.css";
import { Win11Folder, Win11Pdf } from "./Win11Icons";

interface DirectoryGridProps {
  nodes: FSNode[];
}

const ITEM_PURPOSE_TAGS: Record<string, string> = {
  "manual.md": "WORKSTATION GUIDE",
  "MANUAL.md": "WORKSTATION GUIDE",
  "README.md": "WORKSTATION GUIDE",
  "readme.md": "WORKSTATION GUIDE",
  "about.md": "PERSONAL INTRO",
  projects: "CODE & BUILDS",
  writeups: "SECURITY WRITEUPS",
  "resume.pdf": "RESUME / CV",
  blogs: "BLOG POSTS",
  "skills.md": "TECH STACK & SKILLS",
  experience: "WORK HISTORY",
  "contact-info.md": "GET IN TOUCH",
  "personal_vault.md": "ENCRYPTED VAULT",
  vault: "PERSONAL VAULT",
  "letsupgrade-backend-engineer.md": "EXPERIENCE DOC",
  "HusainLU_Sept-Dec25.jpeg": "CONTRACT PROOF 1",
  "HusainLU_Jan-Apr26.jpeg": "CONTRACT PROOF 2",
  "HusainLU_Apr-Jul26.jpeg": "CONTRACT PROOF 3",
  "file-sign-identifier": "FORENSICS TOOL",
  "network-device-scanner": "NETWORK SCANNER",
  "password-strength-checker": "SECURITY TOOL",
  quickref: "CLI REFERENCE",
  repochecker: "HYGIENE UTILITY",
  "intrusion-detection-system": "IDS SIMULATION",
  "file-identifier.md": "SECURITY WRITEUP",
  "network-device-scanner.md": "SECURITY WRITEUP",
};

function getItemTag(node: FSNode): string {
  if (ITEM_PURPOSE_TAGS[node.name]) {
    return ITEM_PURPOSE_TAGS[node.name];
  }
  if (node.type === "directory") {
    return "FILE FOLDER";
  }
  const file = node as FSFile;
  switch (file.fileType) {
    case "project":
      return "SECURITY PROJECT";
    case "writeup":
      return "SECURITY WRITEUP";
    case "blog":
      return "BLOG POST";
    case "pdf":
      return "RESUME / CV";
    case "image":
      return "VERIFIED PROOF";
    case "markdown":
      return "MARKDOWN DOC";
    default:
      return `${file.fileType.toUpperCase()} FILE`;
  }
}

function formatDisplayName(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Deterministic, stable hex checksum per item (never randomizes on reopen)
function getStableHash(node: FSNode): string {
  const seed = `${node.id}:${node.path}:${node.name}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (
    (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0")
  ).toLowerCase();
  return `SHA-256: ${hex.slice(0, 8)}...${hex.slice(8, 16)}`;
}
export function DirectoryGrid({ nodes }: DirectoryGridProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = React.useState(true);
  const [isRecentOpen, setIsRecentOpen] = React.useState(true);

  // In-memory state hooks from FilesystemContext
  const {
    currentPath,
    navigate,
    openFile,
    selectedNode,
    setSelectedNode,
    viewLayout,
    searchQuery,
    sortOption,
    customNames,
    deletedNodeIds,
    folderOrders,
    renameNode,
    deleteNode,
    restoreNode,
    setExplicitFolderOrder,
    handleCopyNode,
    handleDeleteNode,
    justRestoredNodeIds,
    quickAccessIds,
    addToQuickAccess,
    removeFromQuickAccess,
    justPinnedNodeIds,
    showToast,
  } = useFilesystem();

  // Inline Rename State
  const [renamingNodeId, setRenamingNodeId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState<string>("");
  const renameInputRef = React.useRef<HTMLInputElement | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{
    isOpen: boolean;
    x: number;
    y: number;
    node: FSNode | null;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    node: null,
  });

  // Get Info Modal State
  const [infoNode, setInfoNode] = React.useState<FSNode | null>(null);

  // Drag and Drop State
  const [draggedNodeId, setDraggedNodeId] = React.useState<string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = React.useState<string | null>(null);
  const [dragFolderKey, setDragFolderKey] = React.useState<string | null>(null);
  const [isDragOverQuickAccess, setIsDragOverQuickAccess] = React.useState(false);
  const [isDragOverRemoveZone, setIsDragOverRemoveZone] = React.useState(false);
  const qaDragCounterRef = React.useRef(0);
  const filteredNodesRef = React.useRef<FSNode[]>([]);

  const isDraggingFromQuickAccess = dragFolderKey === "quick-access" && !!draggedNodeId;

  React.useEffect(() => {
    const handleGlobalDragEnd = () => {
      setDraggedNodeId(null);
      setDragOverNodeId(null);
      setDragFolderKey(null);
      setIsDragOverQuickAccess(false);
      setIsDragOverRemoveZone(false);
      qaDragCounterRef.current = 0;
    };
    window.addEventListener("dragend", handleGlobalDragEnd);
    return () => window.removeEventListener("dragend", handleGlobalDragEnd);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus and select input on rename activation
  React.useEffect(() => {
    if (renamingNodeId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingNodeId]);

  // Autopilot real inline rename event driver
  React.useEffect(() => {
    const handleAutopilotStartRename = (e: CustomEvent<{ nodeId: string; initialValue?: string }>) => {
      if (e.detail?.nodeId) {
        setRenamingNodeId(e.detail.nodeId);
        setRenameValue(e.detail.initialValue || "");
      }
    };
    const handleAutopilotTypeRename = (e: CustomEvent<{ value: string }>) => {
      if (typeof e.detail?.value === "string") {
        setRenameValue(e.detail.value);
      }
    };
    const handleAutopilotCommitRename = (e: CustomEvent<{ nodeId: string; finalValue: string }>) => {
      if (e.detail?.nodeId) {
        renameNode(e.detail.nodeId, e.detail.finalValue);
        setRenamingNodeId(null);
      }
    };
    const handleAutopilotCancelRename = () => {
      setRenamingNodeId(null);
    };

    const handleAutopilotOpenContextMenu = (e: CustomEvent<{ nodeId: string; x?: number; y?: number }>) => {
      if (e.detail?.nodeId) {
        const targetNode = findNodeById(e.detail.nodeId);
        if (targetNode) {
          setSelectedNode(targetNode);
          const x = e.detail.x ?? window.innerWidth / 2;
          const y = e.detail.y ?? window.innerHeight / 2;
          setContextMenu({ isOpen: true, x, y, node: targetNode });
        }
      }
    };
    const handleAutopilotCloseContextMenu = () => {
      setContextMenu((prev) => ({ ...prev, isOpen: false }));
    };

    const handleAutopilotStartDragQa = (e: CustomEvent<{ nodeId?: string }>) => {
      setDraggedNodeId(e.detail?.nodeId || "writeups-dir");
      setDragFolderKey("quick-access");
      setIsDragOverRemoveZone(false);
    };
    const handleAutopilotDragOverRemove = () => {
      setIsDragOverRemoveZone(true);
    };
    const handleAutopilotDropRemove = (e: CustomEvent<{ nodeId?: string }>) => {
      const targetId = e.detail?.nodeId || "writeups-dir";
      if (targetId) {
        removeFromQuickAccess(targetId);
        showToast(`📌 Unpinned '${customNames[targetId] || "Husain_Writeups"}' from Quick Access`, 3000);
      }
      setDraggedNodeId(null);
      setDragOverNodeId(null);
      setDragFolderKey(null);
      setIsDragOverQuickAccess(false);
      setIsDragOverRemoveZone(false);
    };
    const handleAutopilotDropReorder = (e: CustomEvent<{ sourceId: string; targetId: string }>) => {
      if (e.detail?.sourceId && e.detail?.targetId) {
        const currentList = filteredNodesRef.current.length > 0 ? filteredNodesRef.current : nodes;
        handleReorder(currentPath, currentList.map((n) => n.id), e.detail.sourceId, e.detail.targetId);
      }
      setDraggedNodeId(null);
      setDragOverNodeId(null);
      setDragFolderKey(null);
    };
    const handleAutopilotCancelDrag = () => {
      setDraggedNodeId(null);
      setDragOverNodeId(null);
      setDragFolderKey(null);
      setIsDragOverQuickAccess(false);
      setIsDragOverRemoveZone(false);
    };

    window.addEventListener("vfs-autopilot-start-rename" as any, handleAutopilotStartRename);
    window.addEventListener("vfs-autopilot-type-rename" as any, handleAutopilotTypeRename);
    window.addEventListener("vfs-autopilot-commit-rename" as any, handleAutopilotCommitRename);
    window.addEventListener("vfs-autopilot-cancel-rename" as any, handleAutopilotCancelRename);
    window.addEventListener("vfs-autopilot-open-context-menu" as any, handleAutopilotOpenContextMenu);
    window.addEventListener("vfs-autopilot-close-context-menu" as any, handleAutopilotCloseContextMenu);
    window.addEventListener("vfs-autopilot-start-drag-qa" as any, handleAutopilotStartDragQa);
    window.addEventListener("vfs-autopilot-drag-over-remove" as any, handleAutopilotDragOverRemove);
    window.addEventListener("vfs-autopilot-drop-remove" as any, handleAutopilotDropRemove);
    window.addEventListener("vfs-autopilot-drop-reorder" as any, handleAutopilotDropReorder);
    window.addEventListener("vfs-autopilot-cancel-drag" as any, handleAutopilotCancelDrag);

    return () => {
      window.removeEventListener("vfs-autopilot-start-rename" as any, handleAutopilotStartRename);
      window.removeEventListener("vfs-autopilot-type-rename" as any, handleAutopilotTypeRename);
      window.removeEventListener("vfs-autopilot-commit-rename" as any, handleAutopilotCommitRename);
      window.removeEventListener("vfs-autopilot-cancel-rename" as any, handleAutopilotCancelRename);
      window.removeEventListener("vfs-autopilot-open-context-menu" as any, handleAutopilotOpenContextMenu);
      window.removeEventListener("vfs-autopilot-close-context-menu" as any, handleAutopilotCloseContextMenu);
      window.removeEventListener("vfs-autopilot-start-drag-qa" as any, handleAutopilotStartDragQa);
      window.removeEventListener("vfs-autopilot-drag-over-remove" as any, handleAutopilotDragOverRemove);
      window.removeEventListener("vfs-autopilot-drop-remove" as any, handleAutopilotDropRemove);
      window.removeEventListener("vfs-autopilot-drop-reorder" as any, handleAutopilotDropReorder);
      window.removeEventListener("vfs-autopilot-cancel-drag" as any, handleAutopilotCancelDrag);
    };
  }, [renameNode, removeFromQuickAccess, showToast, setSelectedNode, customNames, currentPath, nodes]);

  // Context menu click-outside and Escape listener
  React.useEffect(() => {
    if (!contextMenu.isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.contextMenu}`)) {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu.isOpen]);

  // Get Info Escape key listener
  React.useEffect(() => {
    if (!infoNode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInfoNode(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [infoNode]);

  // Helper to get active display name
  const getNodeDisplayName = (node: FSNode) => {
    if (customNames[node.id]) {
      return customNames[node.id];
    }
    return formatDisplayName(node.name);
  };

  const commitRename = (nodeId: string) => {
    if (renamingNodeId === nodeId) {
      renameNode(nodeId, renameValue);
      setRenamingNodeId(null);
    }
  };

  const cancelRename = () => {
    setRenamingNodeId(null);
  };

  // Reordering helper
  const handleReorder = (
    folderKey: string,
    currentIds: string[],
    sourceId: string,
    targetId: string
  ) => {
    if (sourceId === targetId) return;
    const newIds = [...currentIds];
    const sourceIdx = newIds.indexOf(sourceId);
    const targetIdx = newIds.indexOf(targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    newIds.splice(sourceIdx, 1);
    newIds.splice(targetIdx, 0, sourceId);
    setExplicitFolderOrder(folderKey, newIds);
  };

  // Context menu trigger
  const handleContextMenu = (e: React.MouseEvent, node: FSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNode(node);

    const menuWidth = 195;
    const menuHeight = 250;
    const margin = 12;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth - margin) {
      x = Math.max(margin, window.innerWidth - menuWidth - margin);
    }
    if (y + menuHeight > window.innerHeight - margin) {
      y = Math.max(margin, window.innerHeight - menuHeight - margin);
    }

    setContextMenu({
      isOpen: true,
      x,
      y,
      node,
    });
  };

  // Quick Access container drag-and-drop handlers
  const handleQaDragOver = (e: React.DragEvent) => {
    if (dragFolderKey !== "quick-access") {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleQaDragEnter = (e: React.DragEvent) => {
    if (dragFolderKey !== "quick-access") {
      e.preventDefault();
      qaDragCounterRef.current++;
      setIsDragOverQuickAccess(true);
    }
  };

  const handleQaDragLeave = (e: React.DragEvent) => {
    if (dragFolderKey !== "quick-access") {
      qaDragCounterRef.current--;
      if (qaDragCounterRef.current <= 0) {
        setIsDragOverQuickAccess(false);
        qaDragCounterRef.current = 0;
      }
    }
  };

  const handleQaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverQuickAccess(false);
    qaDragCounterRef.current = 0;
    const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
    if (sourceId && dragFolderKey !== "quick-access") {
      addToQuickAccess(sourceId);
    }
    setDraggedNodeId(null);
    setDragOverNodeId(null);
    setDragFolderKey(null);
  };

  // Check if we are at root /home/husain
  const isRoot = currentPath === ROOT_PATH;

  // Filtered and custom-ordered main nodes
  const filteredNodes = React.useMemo(() => {
    const results: FSNode[] = [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchDeep = (directory: FSDirectory) => {
        for (const child of directory.children) {
          const displayName = (customNames[child.id] || child.name).toLowerCase();
          if (
            displayName.includes(query) ||
            child.name.toLowerCase().includes(query) ||
            (child.description && child.description.toLowerCase().includes(query))
          ) {
            results.push(child);
          }

          if (child.type === "directory") {
            searchDeep(child as FSDirectory);
          }
        }
      };
      searchDeep(VIRTUAL_FS);
    }

    // Filter out soft-deleted nodes
    const baseNodes = (searchQuery ? results : [...nodes]).filter(
      (node) => !deletedNodeIds.includes(node.id)
    );

    if (sortOption === "a-z") {
      baseNodes.sort((a, b) => {
        const nameA = customNames[a.id] || a.name;
        const nameB = customNames[b.id] || b.name;
        return nameA.localeCompare(nameB);
      });
    } else if (sortOption === "z-a") {
      baseNodes.sort((a, b) => {
        const nameA = customNames[a.id] || a.name;
        const nameB = customNames[b.id] || b.name;
        return nameB.localeCompare(nameA);
      });
    } else {
      // Respect manual drag-and-drop reorder for current folder
      const customOrder = folderOrders[currentPath];
      if (customOrder && customOrder.length > 0) {
        baseNodes.sort((a, b) => {
          const idxA = customOrder.indexOf(a.id);
          const idxB = customOrder.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
      }
    }

    return baseNodes;
  }, [nodes, searchQuery, sortOption, deletedNodeIds, customNames, folderOrders, currentPath]);

  filteredNodesRef.current = filteredNodes;

  // Quick Access nodes with custom ordering and delete filtering
  const quickAccessBase =
    isRoot && !searchQuery
      ? (quickAccessIds
          .map((id) => findNodeById(id))
          .filter(Boolean) as FSNode[])
      : [];

  const quickAccessSurviving = quickAccessBase.filter((n) => !deletedNodeIds.includes(n.id));
  const qaCustomOrder = folderOrders["quick-access"];
  const quickAccessNodes =
    qaCustomOrder && qaCustomOrder.length > 0
      ? [...quickAccessSurviving].sort((a, b) => {
          const idxA = qaCustomOrder.indexOf(a.id);
          const idxB = qaCustomOrder.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        })
      : quickAccessSurviving;

  const getRecentItems = () => {
    if (!isRoot || searchQuery) return [];

    const allItems: FSNode[] = [];

    VIRTUAL_FS.children.forEach((child) => {
      // Don't include root folders in recent, only their contents or root files
      if (child.type === "directory") {
        if (child.name !== "vault") {
          allItems.push(...child.children);
        }
      } else {
        allItems.push(child);
      }
    });

    return allItems
      .filter((child) => !deletedNodeIds.includes(child.id))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  };

  const recentNodes = getRecentItems();

  const handleNodeClick = (node: FSNode) => {
    setSelectedNode(node);
  };

  const handleNodeDoubleClick = (node: FSNode) => {
    if (node.type === "directory") {
      navigate(node.path);
    } else {
      openFile(node as FSFile);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, node: FSNode) => {
    if (renamingNodeId === node.id) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNodeDoubleClick(node);
    }
  };

  const getNodeIconElement = (node: FSNode, size: number = 24, className: string = "") => {
    if (node.type === "directory") {
      switch (node.name) {
        case "about":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<User size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        case "projects":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<Code size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        case "writeups":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<Shield size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        case "blogs":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<BookOpen size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        case "experience":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<Briefcase size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        case "vault":
          return (
            <Win11Folder
              size={size}
              className={className}
              colorTheme="yellow"
              badgeIcon={<Lock size={32} color="#fff" strokeWidth={2.5} />}
            />
          );
        default:
          return <Win11Folder size={size} className={className} colorTheme="yellow" />;
      }
    }

    const file = node as FSFile;
    if (file.fileType === "vault" || node.name === "personal_vault.md") {
      return <Lock size={size} className={className} color="#ef4444" />;
    }
    if (file.fileType === "pdf" || node.name.endsWith(".pdf")) {
      return <Win11Pdf size={size} className={className} />;
    }
    if (file.fileType === "image" || /\.(jpeg|jpg|png|webp|svg)$/i.test(node.name)) {
      return <ImageIcon size={size} className={className} color="#10b981" />;
    }

    return <FileText size={size} className={className} color="var(--accent-primary)" />;
  };

  const getNodeIconClass = (node: FSNode) => {
    if (node.type === "directory") {
      if (node.name === "vault") return styles.vaultIcon;
      return styles.folderIcon;
    }

    const file = node as FSFile;
    if (file.fileType === "vault" || node.name === "personal_vault.md") return styles.vaultIcon;
    if (file.fileType === "pdf" || node.name.endsWith(".pdf")) return styles.pdfIcon;

    return styles.fileIcon;
  };

  if (!isMounted) return null;

  if (filteredNodes.length === 0 && (!isRoot || quickAccessNodes.length === 0)) {
    return (
      <div className={styles.emptyState}>
        <Folder size={36} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>
          {searchQuery ? "No matching workspace items" : "Directory is empty"}
        </h3>
        <p className={styles.emptyDesc}>
          {searchQuery
            ? `No workspace items matched filter "${searchQuery}".`
            : "No items in this virtual directory."}
        </p>
      </div>
    );
  }

  // Shared function to render a node in Quick Access
  const renderQuickAccessNode = (node: FSNode) => {
    const isSelected = selectedNode?.id === node.id;
    const iconClass = getNodeIconClass(node);
    const folderKey = "quick-access";
    const isDragging = draggedNodeId === node.id;
    const isDragOver = dragOverNodeId === node.id && dragFolderKey === folderKey;
    const isJustRestored = justRestoredNodeIds.includes(node.id);
    const isJustPinned = justPinnedNodeIds.includes(node.id);
    const isVaultCard =
      node.name === "personal_vault.md" ||
      node.name === "vault" ||
      (node.type === "file" && (node as FSFile).fileType === "vault");
    const isReadmeCard =
      node.name.toLowerCase() === "manual.md" ||
      node.name.toLowerCase() === "readme.md" ||
      node.id === "readme-file";

    return (
      <div
        key={node.id}
        tabIndex={0}
        draggable={renamingNodeId !== node.id}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", node.id);
          setDraggedNodeId(node.id);
          setDragFolderKey(folderKey);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (dragFolderKey === folderKey && dragOverNodeId !== node.id) {
            setDragOverNodeId(node.id);
          }
        }}
        onDragLeave={() => {
          if (dragOverNodeId === node.id) setDragOverNodeId(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
          if (sourceId && sourceId !== node.id && dragFolderKey === folderKey) {
            handleReorder(
              folderKey,
              quickAccessNodes.map((n) => n.id),
              sourceId,
              node.id
            );
          } else if (sourceId && dragFolderKey !== folderKey) {
            addToQuickAccess(sourceId);
          }
          setDraggedNodeId(null);
          setDragOverNodeId(null);
          setDragFolderKey(null);
          setIsDragOverQuickAccess(false);
          qaDragCounterRef.current = 0;
        }}
        onDragEnd={() => {
          setDraggedNodeId(null);
          setDragOverNodeId(null);
          setDragFolderKey(null);
          setIsDragOverQuickAccess(false);
          setIsDragOverRemoveZone(false);
          qaDragCounterRef.current = 0;
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick(node);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleNodeDoubleClick(node);
        }}
        onKeyDown={(e) => handleKeyDown(e, node)}
        onContextMenu={(e) => handleContextMenu(e, node)}
        className={`${styles.gridItemCard} ${isSelected ? styles.gridItemSelected : ""} ${
          isDragging ? styles.draggedItem : ""
        } ${isDragOver ? styles.dragOverTarget : ""} ${
          isJustRestored ? styles.itemPopIn : ""
        } ${isJustPinned ? styles.itemJustPinned : ""} ${
          isVaultCard ? styles.vaultGridCard : ""
        }`}
        data-tour={isReadmeCard ? "readme-card" : undefined}
        data-node-name={node.name}
        data-node-id={node.id}
        role="button"
        aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
      >
        {isReadmeCard && (
          <div className={styles.readmeStartBadge} title="Workstation Feature Matrix & Cheat Sheet">
            <Sparkles size={11.5} className={styles.readmeSparkleIcon} />
            <span>START HERE</span>
          </div>
        )}
        <div className={styles.qaCardPinBadge} title="Pinned to Quick Access">
          <Pin size={14} />
        </div>
        <div className={styles.gridItemTop}>
          <div className={`${styles.gridItemIcon} ${iconClass}`}>
            {getNodeIconElement(node, 48)}
          </div>
        </div>

        <div className={styles.gridItemInfo}>
          {renamingNodeId === node.id ? (
            <input
              ref={renameInputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename(node.id);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelRename();
                }
              }}
              onBlur={() => commitRename(node.id)}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className={styles.inlineRenameInput}
            />
          ) : (
            <span className={styles.gridItemName}>{getNodeDisplayName(node)}</span>
          )}
        </div>

        <div className={styles.gridItemFooter}>
          <span className={styles.gridItemSize}>{getItemTag(node)}</span>
          <span className={isReadmeCard ? styles.readmeFooterBadge : styles.gridItemSize}>
            {isReadmeCard ? (
              <>
                <Zap size={10} className={styles.readmeZapIcon} />
                <span>START MANUAL</span>
              </>
            ) : node.type === "file" ? (
              formatFileSize((node as FSFile).size)
            ) : (
              `${(node as FSDirectory).children.length} items`
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderRecentNode = (node: FSNode) => {
    const isSelected = selectedNode?.id === node.id;
    const iconClass = getNodeIconClass(node);

    // Get parent path
    const pathParts = node.path.split("/");
    const parentPath = pathParts.slice(0, -1).join("/") + "/";
    const isJustRestored = justRestoredNodeIds.includes(node.id);

    return (
      <div
        key={node.id}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick(node);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleNodeDoubleClick(node);
        }}
        onKeyDown={(e) => handleKeyDown(e, node)}
        onContextMenu={(e) => handleContextMenu(e, node)}
        className={`${styles.recentListRow} ${isSelected ? styles.listRowSelected : ""} ${
          isJustRestored ? styles.itemPopIn : ""
        }`}
        role="button"
        aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
      >
        <div className={styles.colName}>
          <div className={styles.listRowIcon}>
            <div className={`${styles.listRowIcon} ${iconClass}`}>
              {getNodeIconElement(node, 16)}
            </div>
          </div>
          <div className={styles.listRowNameInfo}>
            {renamingNodeId === node.id ? (
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitRename(node.id);
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelRename();
                  }
                }}
                onBlur={() => commitRename(node.id)}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                className={`${styles.inlineRenameInput} ${styles.inlineRenameInputList}`}
              />
            ) : (
              <span className={styles.listRowName}>{getNodeDisplayName(node)}</span>
            )}
          </div>
        </div>
        <span className={styles.colDate}>{node.updatedAt}</span>
        <span className={styles.colPath}>{parentPath.replace("/home/husain/", "") || "/"}</span>
      </div>
    );
  };

  // Render context menu element
  const renderContextMenu = () => {
    if (!contextMenu.isOpen || !contextMenu.node) return null;
    const node = contextMenu.node;
    const isPinned = quickAccessIds.includes(node.id);

    return (
      <div
        className={styles.contextMenu}
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.contextMenuItem}
          data-action="open"
          onClick={() => {
            handleNodeDoubleClick(node);
            setContextMenu((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <FolderOpen size={14} />
          <span>Open</span>
        </button>

        <button
          className={styles.contextMenuItem}
          data-action="rename"
          onClick={() => {
            setRenamingNodeId(node.id);
            setRenameValue(customNames[node.id] || node.name);
            setContextMenu((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <FileEdit size={14} />
          <span>Rename</span>
        </button>

        <button
          className={styles.contextMenuItem}
          data-action="info"
          onClick={() => {
            setInfoNode(node);
            setContextMenu((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <Info size={14} />
          <span>Get Info</span>
        </button>

        <button
          className={styles.contextMenuItem}
          data-action="copy-link"
          onClick={() => {
            handleCopyNode(node);
            setContextMenu((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <Copy size={14} />
          <span>Copy Link</span>
        </button>

        {!(node.type === "file" && node.fileType === "vault") && (
          <button
            className={styles.contextMenuItem}
            data-action="download"
            onClick={async () => {
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
              await downloadNode(node);
            }}
          >
            <Download size={14} />
            <span>{node.type === "directory" ? "Download Folder (.zip)" : "Download"}</span>
          </button>
        )}

        {isPinned ? (
          <button
            className={styles.contextMenuItem}
            data-action="unpin"
            onClick={() => {
              removeFromQuickAccess(node.id);
              showToast(`📌 Unpinned '${getNodeDisplayName(node)}' from Quick Access`, 3000);
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
            }}
          >
            <PinOff size={14} />
            <span>Remove from Quick Access</span>
          </button>
        ) : (
          <button
            className={styles.contextMenuItem}
            data-action="pin"
            onClick={() => {
              addToQuickAccess(node.id);
              setContextMenu((prev) => ({ ...prev, isOpen: false }));
            }}
          >
            <Pin size={14} />
            <span>Add to Quick Access</span>
          </button>
        )}

        <div className={styles.contextMenuDivider} />

        <button
          className={`${styles.contextMenuItem} ${styles.contextMenuItemDanger}`}
          onClick={() => {
            handleDeleteNode(node);
            setContextMenu((prev) => ({ ...prev, isOpen: false }));
          }}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    );
  };

  // Render Get Info modal element
  const renderGetInfoModal = () => {
    if (!infoNode) return null;

    return (
      <div className={styles.getInfoBackdrop} onClick={() => setInfoNode(null)}>
        <div className={styles.getInfoModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.getInfoTitleBar}>
            <div className={styles.getInfoTitle}>
              <Info size={15} color="var(--accent-primary)" />
              <span>Info: {getNodeDisplayName(infoNode)}</span>
            </div>
            <button
              className={styles.getInfoCloseBtn}
              onClick={() => setInfoNode(null)}
              title="Close"
            >
              <X size={15} />
            </button>
          </div>

          <div className={styles.getInfoBody}>
            <div className={styles.getInfoHero}>
              <div className={styles.getInfoHeroIcon}>
                {getNodeIconElement(infoNode, 32)}
              </div>
              <div className={styles.getInfoHeroMeta}>
                <span className={styles.getInfoHeroName}>{getNodeDisplayName(infoNode)}</span>
                <span className={styles.getInfoHeroTag}>{getItemTag(infoNode)}</span>
              </div>
            </div>

            <div className={styles.getInfoGrid}>
              <span className={styles.getInfoLabel}>Type:</span>
              <span className={styles.getInfoValue}>
                {infoNode.type === "directory" ? "File Folder" : (infoNode as FSFile).fileType}
              </span>

              <span className={styles.getInfoLabel}>Location:</span>
              <span className={styles.getInfoValue}>{infoNode.path}</span>

              <span className={styles.getInfoLabel}>Size:</span>
              <span className={styles.getInfoValue}>
                {infoNode.type === "file"
                  ? formatFileSize((infoNode as FSFile).size)
                  : `${(infoNode as FSDirectory).children?.length || 0} items`}
              </span>

              <span className={styles.getInfoLabel}>Created:</span>
              <span className={styles.getInfoValue}>{infoNode.createdAt || "Sep 23, 2026"}</span>

              <span className={styles.getInfoLabel}>Modified:</span>
              <span className={styles.getInfoValue}>{infoNode.updatedAt}</span>

              <span className={styles.getInfoLabel}>Checksum:</span>
              <span className={styles.getInfoValue}>
                <code className={styles.getInfoHashBadge}>{getStableHash(infoNode)}</code>
              </span>
            </div>
          </div>

          <div className={styles.getInfoFooter}>
            <button className={styles.getInfoDoneBtn} onClick={() => setInfoNode(null)}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Standard Directory Grid Layout
  if (viewLayout === "grid") {
    return (
      <div className={styles.gridContainer} onClick={() => setSelectedNode(null)}>
        {isRoot && !searchQuery && (
          <div
            className={styles.sectionContainer}
            data-tour="quick-access-section"
            onDragOver={handleQaDragOver}
            onDragEnter={handleQaDragEnter}
            onDragLeave={handleQaDragLeave}
            onDrop={handleQaDrop}
          >
            <div
              className={styles.sectionHeader}
              onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
            >
              {isQuickAccessOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className={styles.sectionTitle}>Quick Access</span>
              <span className={styles.sectionCount}>({quickAccessNodes.length}/{MAX_QUICK_ACCESS_ITEMS})</span>
            </div>
            {isQuickAccessOpen && (
              <div
                className={`${styles.qaGrid} ${isDragOverQuickAccess ? styles.qaGridDropActive : ""}`}
              >
                {quickAccessNodes.length > 0 ? (
                  quickAccessNodes.map(renderQuickAccessNode)
                ) : (
                  <div className={styles.qaEmptyPlaceholder}>
                    <span>No pinned items. Drag items here or use right-click to pin.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isDraggingFromQuickAccess && (
          <div
            className={`${styles.qaRemoveDropZone} ${
              isDragOverRemoveZone ? styles.qaRemoveDropZoneActive : ""
            }`}
            data-tour="qa-remove-drop-zone"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setIsDragOverRemoveZone(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragOverRemoveZone(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDragOverRemoveZone(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
              if (sourceId) {
                removeFromQuickAccess(sourceId);
                showToast("Removed from Quick Access");
              }
              setDraggedNodeId(null);
              setDragOverNodeId(null);
              setDragFolderKey(null);
              setIsDragOverQuickAccess(false);
              setIsDragOverRemoveZone(false);
              qaDragCounterRef.current = 0;
            }}
          >
            <div className={styles.qaRemoveContent}>
              <PinOff size={16} className={styles.qaRemoveIcon} />
              <span className={styles.qaRemoveText}>Remove from Quick Access</span>
            </div>
            <span className={styles.qaRemoveSubtext}>Drop here to unpin from Quick Access</span>
          </div>
        )}

        {isRoot && !searchQuery && recentNodes.length > 0 && (
          <div className={styles.sectionContainer}>
            <div className={styles.qaTabs}>
              <button className={`${styles.qaTabBtn} ${styles.qaTabActive}`}>
                <Clock size={14} /> Recent
              </button>
              <button className={styles.qaTabBtn} disabled>
                <Star size={14} /> Favorites
              </button>
              <button className={styles.qaTabBtn} disabled>
                <Users size={14} /> Shared
              </button>
            </div>

            <div className={styles.recentList}>
              <div className={styles.recentListHeader}>
                <span className={styles.colName}>Name</span>
                <span className={styles.colDate}>Date accessed</span>
                <span className={styles.colPath}>Location</span>
              </div>
              {recentNodes.map(renderRecentNode)}
            </div>
          </div>
        )}

        <div
          data-tour="directory-grid"
          className={styles.fileGrid}
        >
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const iconClass = getNodeIconClass(node);
            const folderKey = currentPath;
            const isDragging = draggedNodeId === node.id;
            const isDragOver = dragOverNodeId === node.id && dragFolderKey === folderKey;
            const isJustRestored = justRestoredNodeIds.includes(node.id);
            const isVaultCard =
              node.name === "personal_vault.md" ||
              node.name === "vault" ||
              (node.type === "file" && (node as FSFile).fileType === "vault");
            const isReadmeCard =
              node.name.toLowerCase() === "manual.md" ||
              node.name.toLowerCase() === "readme.md" ||
              node.id === "readme-file";

            return (
              <div
                key={node.id}
                tabIndex={0}
                draggable={renamingNodeId !== node.id}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", node.id);
                  setDraggedNodeId(node.id);
                  setDragFolderKey(folderKey);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragFolderKey === folderKey && dragOverNodeId !== node.id) {
                    setDragOverNodeId(node.id);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverNodeId === node.id) setDragOverNodeId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
                  if (sourceId && sourceId !== node.id && dragFolderKey === folderKey) {
                    handleReorder(
                      folderKey,
                      filteredNodes.map((n) => n.id),
                      sourceId,
                      node.id
                    );
                  }
                  setDraggedNodeId(null);
                  setDragOverNodeId(null);
                  setDragFolderKey(null);
                }}
                onDragEnd={() => {
                  setDraggedNodeId(null);
                  setDragOverNodeId(null);
                  setDragFolderKey(null);
                  setIsDragOverQuickAccess(false);
                  setIsDragOverRemoveZone(false);
                  qaDragCounterRef.current = 0;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleNodeDoubleClick(node);
                }}
                onKeyDown={(e) => handleKeyDown(e, node)}
                onContextMenu={(e) => handleContextMenu(e, node)}
                className={`${styles.gridItemCard} ${
                  isSelected ? styles.gridItemSelected : ""
                } ${
                  isDragging ? styles.draggedItem : ""
                } ${isDragOver ? styles.dragOverTarget : ""} ${
                  isJustRestored ? styles.itemPopIn : ""
                } ${isVaultCard ? styles.vaultGridCard : ""}`}
                data-tour={isReadmeCard ? "readme-card" : undefined}
                data-node-name={node.name}
                data-node-id={node.id}
                role="button"
                aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
              >
                {isReadmeCard && (
                  <div className={styles.readmeStartBadge} title="Workstation Feature Matrix & Cheat Sheet">
                    <Sparkles size={11.5} className={styles.readmeSparkleIcon} />
                    <span>START HERE</span>
                  </div>
                )}
                <div className={styles.gridItemTop}>
                  <div className={`${styles.gridItemIcon} ${iconClass}`}>
                    {getNodeIconElement(node, 48)}
                  </div>
                </div>

                <div className={styles.gridItemInfo}>
                  {renamingNodeId === node.id ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitRename(node.id);
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          cancelRename();
                        }
                      }}
                      onBlur={() => commitRename(node.id)}
                      onClick={(e) => e.stopPropagation()}
                      onDoubleClick={(e) => e.stopPropagation()}
                      className={styles.inlineRenameInput}
                    />
                  ) : (
                    <span className={styles.gridItemName}>{getNodeDisplayName(node)}</span>
                  )}
                </div>

                <div className={styles.gridItemFooter}>
                  <span className={styles.gridItemSize}>{getItemTag(node)}</span>
                  <span className={isReadmeCard ? styles.readmeFooterBadge : styles.gridItemSize}>
                    {isReadmeCard ? (
                      <>
                        <Zap size={10} className={styles.readmeZapIcon} />
                        <span>START MANUAL</span>
                      </>
                    ) : node.type === "file" ? (
                      formatFileSize((node as FSFile).size)
                    ) : (
                      `${(node as FSDirectory).children.length} items`
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {renderContextMenu()}
        {renderGetInfoModal()}
      </div>
    );
  }

  // List Layout (Sharp technical table format)
  return (
    <div className={styles.listContainer} onClick={() => setSelectedNode(null)}>
      {isRoot && !searchQuery && (
        <div
          className={styles.sectionContainer}
          onDragOver={handleQaDragOver}
          onDragEnter={handleQaDragEnter}
          onDragLeave={handleQaDragLeave}
          onDrop={handleQaDrop}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
          >
            {isQuickAccessOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className={styles.sectionTitle}>Quick Access</span>
            <span className={styles.sectionCount}>({quickAccessNodes.length}/{MAX_QUICK_ACCESS_ITEMS})</span>
          </div>
          {isQuickAccessOpen && (
            <div
              className={`${styles.qaGrid} ${isDragOverQuickAccess ? styles.qaGridDropActive : ""}`}
            >
              {quickAccessNodes.length > 0 ? (
                quickAccessNodes.map(renderQuickAccessNode)
              ) : (
                <div className={styles.qaEmptyPlaceholder}>
                  <span>No pinned items. Drag items here or use right-click to pin.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isDraggingFromQuickAccess && (
        <div
          className={`${styles.qaRemoveDropZone} ${
            isDragOverRemoveZone ? styles.qaRemoveDropZoneActive : ""
          }`}
          data-tour="qa-remove-drop-zone"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setIsDragOverRemoveZone(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragOverRemoveZone(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragOverRemoveZone(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
            if (sourceId) {
              removeFromQuickAccess(sourceId);
              showToast("Removed from Quick Access");
            }
            setDraggedNodeId(null);
            setDragOverNodeId(null);
            setDragFolderKey(null);
            setIsDragOverQuickAccess(false);
            setIsDragOverRemoveZone(false);
            qaDragCounterRef.current = 0;
          }}
        >
          <div className={styles.qaRemoveContent}>
            <PinOff size={16} className={styles.qaRemoveIcon} />
            <span className={styles.qaRemoveText}>Remove from Quick Access</span>
          </div>
          <span className={styles.qaRemoveSubtext}>Drop here to unpin from Quick Access</span>
        </div>
      )}

      {isRoot && !searchQuery && recentNodes.length > 0 && (
        <div className={styles.sectionContainer}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsRecentOpen(!isRecentOpen)}
          >
            {isRecentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className={styles.sectionTitle}>Recent</span>
          </div>
          {isRecentOpen && (
            <div className={styles.recentList}>
              <div className={styles.recentListHeader}>
                <span className={styles.colName}>NAME</span>
                <span className={styles.colDate}>DATE MODIFIED</span>
                <span className={styles.colPath}>PATH</span>
              </div>
              {recentNodes.map(renderRecentNode)}
            </div>
          )}
        </div>
      )}

      <div className={styles.fileListTable}>
        <div className={styles.fileListHeader}>
          <span className={styles.colName}>NAME</span>
          <span className={styles.colPerms}>PERMISSIONS</span>
          <span className={styles.colOwner}>OWNER</span>
          <span className={styles.colSize}>SIZE</span>
          <span className={styles.colDate}>DATE</span>
          <span className={styles.colType}>TYPE</span>
        </div>

        <div className={styles.fileListBody}>
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const iconClass = getNodeIconClass(node);
            const folderKey = currentPath;
            const isDragging = draggedNodeId === node.id;
            const isDragOver = dragOverNodeId === node.id && dragFolderKey === folderKey;
            const isJustRestored = justRestoredNodeIds.includes(node.id);

            return (
              <div
                key={node.id}
                tabIndex={0}
                draggable={renamingNodeId !== node.id}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", node.id);
                  setDraggedNodeId(node.id);
                  setDragFolderKey(folderKey);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragFolderKey === folderKey && dragOverNodeId !== node.id) {
                    setDragOverNodeId(node.id);
                  }
                }}
                onDragLeave={() => {
                  if (dragOverNodeId === node.id) setDragOverNodeId(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const sourceId = e.dataTransfer.getData("text/plain") || draggedNodeId;
                  if (sourceId && sourceId !== node.id && dragFolderKey === folderKey) {
                    handleReorder(
                      folderKey,
                      filteredNodes.map((n) => n.id),
                      sourceId,
                      node.id
                    );
                  }
                  setDraggedNodeId(null);
                  setDragOverNodeId(null);
                  setDragFolderKey(null);
                }}
                onDragEnd={() => {
                  setDraggedNodeId(null);
                  setDragOverNodeId(null);
                  setDragFolderKey(null);
                  setIsDragOverQuickAccess(false);
                  setIsDragOverRemoveZone(false);
                  qaDragCounterRef.current = 0;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleNodeDoubleClick(node);
                }}
                onKeyDown={(e) => handleKeyDown(e, node)}
                onContextMenu={(e) => handleContextMenu(e, node)}
                className={`${styles.fileListRow} ${isSelected ? styles.listRowSelected : ""} ${
                  isDragging ? styles.draggedItem : ""
                } ${isDragOver ? styles.dragOverTarget : ""} ${
                  isJustRestored ? styles.itemPopIn : ""
                }`}
                role="button"
                aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
              >
                <div className={styles.colName}>
                  <div className={`${styles.listRowIcon} ${iconClass}`}>
                    {getNodeIconElement(node, 16)}
                  </div>
                  <div className={styles.listRowNameInfo}>
                    {renamingNodeId === node.id ? (
                      <input
                        ref={renameInputRef}
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitRename(node.id);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelRename();
                          }
                        }}
                        onBlur={() => commitRename(node.id)}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        className={`${styles.inlineRenameInput} ${styles.inlineRenameInputList}`}
                      />
                    ) : (
                      <span className={styles.listRowName}>{getNodeDisplayName(node)}</span>
                    )}
                  </div>
                </div>

                <span className={styles.colPerms}>{node.permissions}</span>
                <span className={styles.colOwner}>
                  {node.owner}:{node.group}
                </span>
                <span className={styles.colSize}>
                  {node.type === "file"
                    ? formatFileSize((node as FSFile).size)
                    : `${(node as FSDirectory).children.length} items`}
                </span>
                <span className={styles.colDate}>{node.updatedAt}</span>
                <div className={styles.colType}>
                  {node.type === "directory" ? "Folder" : (node as FSFile).fileType}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {renderContextMenu()}
      {renderGetInfoModal()}
    </div>
  );
}
