"use client";

import React from "react";
import Image from "next/image";
import { useFilesystem } from "@/context/FilesystemContext";
import { FSNode, FSDirectory, FSFile, ROOT_PATH, VIRTUAL_FS } from "@/data/filesystemData";
import { formatFileSize, getFileBadgeVariant } from "@/lib/fileHelpers";
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
  Clock,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import styles from "./Gui.module.css";
import { Win11Folder, Win11Pdf } from "./Win11Icons";

interface DirectoryGridProps {
  nodes: FSNode[];
}

export function DirectoryGrid({ nodes }: DirectoryGridProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = React.useState(true);
  const [isRecentOpen, setIsRecentOpen] = React.useState(true);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    currentPath,
    navigate,
    openFile,
    selectedNode,
    setSelectedNode,
    viewLayout,
    searchQuery,
    sortOption,
  } = useFilesystem();

  // Check if we are at root /home/husain
  const isRoot = currentPath === ROOT_PATH;

  const filteredNodes = React.useMemo(() => {
    let results: FSNode[] = [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchDeep = (directory: FSDirectory) => {
        for (const child of directory.children) {
          if (
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

    const finalNodes = searchQuery ? results : [...nodes];

    if (sortOption === "a-z") {
      finalNodes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "z-a") {
      finalNodes.sort((a, b) => b.name.localeCompare(a.name));
    }

    return finalNodes;
  }, [nodes, searchQuery, sortOption]);

  if (!isMounted) return null;

  const quickAccessNames = ["about", "projects", "writeups", "resume.pdf"];
  const quickAccessNodes = isRoot && !searchQuery
    ? quickAccessNames.map(name => nodes.find(n => n.name === name)).filter(Boolean) as FSNode[]
    : [];

  const getRecentItems = () => {
    if (!isRoot || searchQuery) return [];

    const allItems: FSNode[] = [];

    VIRTUAL_FS.children.forEach(child => {
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
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNodeDoubleClick(node);
    }
  };

  const getNodeIconElement = (node: FSNode, size: number = 24, className: string = "") => {
    if (node.type === "directory") {
      switch (node.name) {
        case "about": return <Win11Folder size={size} className={className} colorTheme="blue" badgeIcon={<User size={32} color="#fff" strokeWidth={2.5} />} />;
        case "projects": return <Win11Folder size={size} className={className} colorTheme="blueGray" badgeIcon={<Code size={32} color="#fff" strokeWidth={2.5} />} />;
        case "writeups": return <Win11Folder size={size} className={className} colorTheme="teal" badgeIcon={<Shield size={32} color="#fff" strokeWidth={2.5} />} />;
        case "blogs": return <Win11Folder size={size} className={className} colorTheme="warm" badgeIcon={<BookOpen size={32} color="#fff" strokeWidth={2.5} />} />;
        case "experience": return <Win11Folder size={size} className={className} colorTheme="brown" badgeIcon={<Briefcase size={32} color="#fff" strokeWidth={2.5} />} />;
        default: return <Win11Folder size={size} className={className} colorTheme="yellow" />;
      }
    }

    const file = node as FSFile;
    if (file.fileType === "pdf") return <Win11Pdf size={size} className={className} />;
    if (file.fileType === "contact") return <Mail size={size} className={className} color="var(--accent-primary)" />;
    if (file.fileType === "skills") return <Wrench size={size} className={className} color="#e5a000" />;

    // For other files, use flat icons or Win11 doc placeholder
    return <FileText size={size} className={className} color="#888" />;
  };

  const getNodeIconClass = (node: FSNode) => {
    if (node.type === "directory") {
      if (node.name === "about") return styles.aboutIcon;
      if (node.name === "projects") return styles.projectIcon;
      if (node.name === "writeups") return styles.writeupIcon;
      if (node.name === "blogs") return styles.blogIcon;
      if (node.name === "skills") return styles.skillsIcon;
      if (node.name === "experience") return styles.expIcon;
      if (node.name === "contact") return styles.contactIcon;
      return styles.folderIcon;
    }

    const file = node as FSFile;
    if (file.fileType === "pdf") return styles.pdfIcon;
    if (file.fileType === "project") return styles.projectIcon;
    if (file.fileType === "writeup") return styles.writeupIcon;
    if (file.fileType === "blog") return styles.blogIcon;
    if (file.fileType === "skills") return styles.skillsIcon;
    if (file.fileType === "experience") return styles.expIcon;
    if (file.fileType === "contact") return styles.contactIcon;

    return styles.fileIcon;
  };

  if (filteredNodes.length === 0) {
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

  // Shared function to render a node in Quick Access / Recent layout
  const renderQuickAccessNode = (node: FSNode) => {
    const isSelected = selectedNode?.id === node.id;
    const iconClass = getNodeIconClass(node);

    return (
      <div
        key={node.id}
        tabIndex={0}
        onClick={() => handleNodeClick(node)}
        onDoubleClick={() => handleNodeDoubleClick(node)}
        onKeyDown={(e) => handleKeyDown(e, node)}
        className={`${styles.gridItemCard} ${styles.qaTile} ${isSelected ? styles.gridItemSelected : ""}`}
        role="button"
        aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
      >
        <Pin size={12} className={styles.pinIcon} />
        <div className={styles.qaTileTop}>
          <div className={`${styles.listRowIcon} ${iconClass}`}>
            {getNodeIconElement(node, 24)}
          </div>
        </div>
        <div className={styles.qaTileInfo}>
          <span className={styles.gridItemName}>{node.name}</span>
          <span className={styles.qaTileSub}>
            {node.type === "file" ? formatFileSize((node as FSFile).size) : `${(node as FSDirectory).children.length} items`}
          </span>
        </div>
      </div>
    );
  };

  const renderRecentNode = (node: FSNode) => {
    const isSelected = selectedNode?.id === node.id;
    const iconClass = getNodeIconClass(node);

    // Get parent path
    const pathParts = node.path.split('/');
    const parentPath = pathParts.slice(0, -1).join('/') + '/';

    return (
      <div
        key={node.id}
        tabIndex={0}
        onClick={() => handleNodeClick(node)}
        onDoubleClick={() => handleNodeDoubleClick(node)}
        onKeyDown={(e) => handleKeyDown(e, node)}
        className={`${styles.recentListRow} ${isSelected ? styles.listRowSelected : ""}`}
        role="button"
        aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
      >
        <div className={styles.colName}>
          <div className={styles.listRowIcon}>
            <div className={`${styles.listRowIcon} ${iconClass}`}>{getNodeIconElement(node, 16)}</div>
          </div>
          <div className={styles.listRowNameInfo}>
            <span className={styles.listRowName}>{node.name}</span>
          </div>
        </div>
        <span className={styles.colDate}>{node.updatedAt}</span>
        <span className={styles.colPath}>{parentPath.replace('/home/husain/', '') || '/'}</span>
      </div>
    );
  };

  // Standard Directory Grid Layout
  if (viewLayout === "grid") {
    return (
      <div className={styles.gridContainer}>
        {isRoot && !searchQuery && quickAccessNodes.length > 0 && (
          <div className={styles.sectionContainer}>
            <div
              className={styles.sectionHeader}
              onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
            >
              {isQuickAccessOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className={styles.sectionTitle}>Quick Access</span>
            </div>
            {isQuickAccessOpen && (
              <div className={styles.qaGrid}>
                {quickAccessNodes.map(renderQuickAccessNode)}
              </div>
            )}
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

        <div className={styles.fileGrid}>
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const iconClass = getNodeIconClass(node);

            return (
              <div
                key={node.id}
                tabIndex={0}
                onClick={() => handleNodeClick(node)}
                onDoubleClick={() => handleNodeDoubleClick(node)}
                onKeyDown={(e) => handleKeyDown(e, node)}
                className={`${styles.gridItemCard} ${isSelected ? styles.gridItemSelected : ""}`}
                role="button"
                aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
              >
                <div className={styles.gridItemTop}>
                  <div className={`${styles.gridItemIcon} ${iconClass}`}>
                    {getNodeIconElement(node, 48)}
                  </div>
                </div>

                <div className={styles.gridItemInfo}>
                  <span className={styles.gridItemName}>{node.name}</span>
                </div>

                <div className={styles.gridItemFooter}>
                  <span className={styles.gridItemSize}>
                    {node.type === "directory" ? "File folder" : `${(node as FSFile).fileType.toUpperCase()} File`}
                  </span>
                  <span className={styles.gridItemSize}>
                    {node.type === "file" ? formatFileSize((node as FSFile).size) : `${(node as FSDirectory).children.length} items`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // List Layout (Sharp technical table format)
  return (
    <div className={styles.listContainer}>
      {isRoot && !searchQuery && quickAccessNodes.length > 0 && (
        <div className={styles.sectionContainer}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
          >
            {isQuickAccessOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className={styles.sectionTitle}>Quick Access</span>
          </div>
          {isQuickAccessOpen && (
            <div className={styles.qaGrid}>
              {quickAccessNodes.map(renderQuickAccessNode)}
            </div>
          )}
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

            return (
              <div
                key={node.id}
                tabIndex={0}
                onClick={() => handleNodeClick(node)}
                onDoubleClick={() => handleNodeDoubleClick(node)}
                onKeyDown={(e) => handleKeyDown(e, node)}
                className={`${styles.fileListRow} ${isSelected ? styles.listRowSelected : ""}`}
                role="button"
                aria-label={`${node.type === "directory" ? "Directory" : "File"}: ${node.name}`}
              >
                <div className={styles.colName}>
                  <div className={`${styles.listRowIcon} ${iconClass}`}>{getNodeIconElement(node, 16)}</div>
                  <div className={styles.listRowNameInfo}>
                    <span className={styles.listRowName}>{node.name}</span>
                  </div>
                </div>

                <span className={styles.colPerms}>{node.permissions}</span>
                <span className={styles.colOwner}>
                  {node.owner}:{node.group}
                </span>
                <span className={styles.colSize}>
                  {node.type === "file" ? formatFileSize((node as FSFile).size) : `${(node as FSDirectory).children.length} items`}
                </span>
                <span className={styles.colDate}>{node.updatedAt}</span>
                <div className={styles.colType}>
                  {node.type === "directory" ? (
                    "Folder"
                  ) : (
                    (node as FSFile).fileType
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
