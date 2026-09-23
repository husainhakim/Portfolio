"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { Check, Trash2, Zap, Pin, Sparkles } from "lucide-react";
import styles from "./Gui.module.css";

export function ToastNotification() {
  const { toastMessage } = useFilesystem();
  if (!toastMessage) return null;

  const msg = toastMessage.toLowerCase();
  const isDelete =
    msg.includes("deleted") ||
    msg.includes("recycle") ||
    msg.includes("trash") ||
    msg.includes("destroy") ||
    msg.includes("rekt") ||
    msg.includes("gone") ||
    msg.includes("permanently");

  const isZap = toastMessage.includes("⚡") || msg.includes("autopilot");
  const isPin = toastMessage.includes("📌") || msg.includes("quick access");
  const isSpecial =
    toastMessage.includes("📁") ||
    toastMessage.includes("☕") ||
    toastMessage.includes("🐛") ||
    toastMessage.includes("🚀") ||
    toastMessage.includes("🛡️") ||
    toastMessage.includes("🧙") ||
    toastMessage.includes("💾") ||
    toastMessage.includes("⚠️") ||
    toastMessage.includes("🔒");

  return (
    <div
      className={`${styles.guiToast} ${isDelete ? styles.guiToastDanger : styles.guiToastSuccess}`}
      role="status"
      aria-live="polite"
    >
      {isDelete ? (
        <Trash2 size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : isZap ? (
        <Zap size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : isPin ? (
        <Pin size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : isSpecial ? (
        <Sparkles size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : (
        <Check size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      )}
      <span className={styles.guiToastText}>{toastMessage}</span>
    </div>
  );
}
