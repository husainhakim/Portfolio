"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { Check, Trash2 } from "lucide-react";
import styles from "./Gui.module.css";

export function ToastNotification() {
  const { toastMessage } = useFilesystem();
  if (!toastMessage) return null;

  const isCopied = toastMessage.toLowerCase().includes("copied");
  const isDelete = !isCopied;

  return (
    <div
      className={`${styles.guiToast} ${isDelete ? styles.guiToastDanger : ""}`}
      role="status"
      aria-live="polite"
    >
      {isCopied ? (
        <Check size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : (
        <Trash2 size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      )}
      <span className={styles.guiToastText}>{toastMessage}</span>
    </div>
  );
}
