import Link from "next/link";
import { AlertTriangle, Home, Terminal as TerminalIcon, Shield, FileText } from "lucide-react";
import styles from "@/components/NotFound.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404: Node Not Found",
  description: "The requested virtual path or security research document was not found in Husain Hakim's workspace.",
};

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.terminalCard}>
        <div className={styles.cardHeader}>
          <div className={styles.windowControls}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.cardTitle}>VFS // ERROR: 404_ENOENT</span>
        </div>

        <div className={styles.cardBody}>
          <h1 className={styles.errorHeading}>
            <AlertTriangle className={styles.errorIcon} size={26} />
            <span>404: Virtual Path Not Found</span>
          </h1>

          <p className={styles.errorMessage}>
            The virtual filesystem node or research document you requested could not be resolved.
            The path may have been relocated, renamed, or requires authorized security credentials.
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeLine}>
              <span className={styles.codePrompt}>husain@sec-ws:~$</span>
              <span>resolve-path --target $REQUEST_URI</span>
            </div>
            <div className={styles.codeLine} style={{ color: "#ff8597" }}>
              <span>[!] ENOENT: No such file or directory in /home/husain</span>
            </div>
            <div className={styles.codeLine} style={{ color: "#a0aec0" }}>
              <span>[i] System status: Operational. Available roots: /about, /projects, /writeups</span>
            </div>
          </div>

          <div className={styles.actionsGrid}>
            <Link href="/" className={`${styles.actionButton} ${styles.primaryAction}`}>
              <Home size={15} />
              <span>Return to /home/husain</span>
            </Link>

            <Link href="/projects" className={`${styles.actionButton} ${styles.secondaryAction}`}>
              <Shield size={15} />
              <span>Browse Projects</span>
            </Link>

            <Link href="/writeups" className={`${styles.actionButton} ${styles.secondaryAction}`}>
              <FileText size={15} />
              <span>Security Writeups</span>
            </Link>

            <Link href="/contact" className={`${styles.actionButton} ${styles.secondaryAction}`}>
              <TerminalIcon size={15} />
              <span>Contact Husain</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
