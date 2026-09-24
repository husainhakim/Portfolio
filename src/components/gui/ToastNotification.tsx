"use client";

import React from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { Check, Trash2, Zap, Pin, Sparkles, AlertCircle } from "lucide-react";
import styles from "./Gui.module.css";

export function ToastNotification() {
  const { toastMessage } = useFilesystem();
  if (!toastMessage) return null;

  const msg = toastMessage.toLowerCase();

  const isWarningOrFull =
    toastMessage.includes("⚠️") ||
    msg.includes("full") ||
    msg.includes("failed") ||
    msg.includes("error") ||
    msg.includes("cannot");

  const isDelete =
    msg.includes("deleted") ||
    msg.includes("recycle") ||
    msg.includes("trash") ||
    msg.includes("destroy") ||
    msg.includes("rekt") ||
    msg.includes("gone") ||
    msg.includes("permanently");

  const isDanger = isDelete || isWarningOrFull;

  const isZap = !isDanger && (toastMessage.includes("⚡") || msg.includes("autopilot"));
  const isPin = !isDanger && (toastMessage.includes("📌") || msg.includes("quick access"));
  const isSpecial =
    !isDanger &&
    (toastMessage.includes("📁") ||
      toastMessage.includes("☕") ||
      toastMessage.includes("🐛") ||
      toastMessage.includes("🚀") ||
      toastMessage.includes("🛡️") ||
      toastMessage.includes("🧙") ||
      toastMessage.includes("💾") ||
      toastMessage.includes("🔒"));

  return (
    <div
      className={`${styles.guiToast} ${isDanger ? styles.guiToastDanger : styles.guiToastSuccess}`}
      role="status"
      aria-live="polite"
    >
      {isDelete ? (
        <Trash2 size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
      ) : isWarningOrFull ? (
        <AlertCircle size={20} strokeWidth={2.4} className={styles.guiToastIcon} />
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
