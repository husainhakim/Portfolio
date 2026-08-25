import React, { useState, useEffect } from "react";
import styles from "./Views.module.css";
import { Lock, Unlock, ShieldAlert } from "lucide-react";

export function PersonalVaultView() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authText, setAuthText] = useState("> Incoming connection detected...");

  useEffect(() => {
    const timer1 = setTimeout(() => setAuthText("> IDS Alert: Suspicious activity from user"), 1000);
    const timer2 = setTimeout(() => setAuthText("> Whitelisting known operator..."), 2200);
    const timer3 = setTimeout(() => setAuthText("> ACCESS GRANTED"), 3200);
    const timer4 = setTimeout(() => setIsUnlocked(true), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (!isUnlocked) {
    return (
      <div className={styles.viewContainer} style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
          <Lock size={48} className="animate-pulse" color="var(--accent-primary)" />
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.1em' }}>
            {authText}
          </h2>
        </div>
      </div>
    );
  }

  const boxStyle = {
    padding: '20px',
    backgroundColor: 'var(--bg-panel-hover)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.viewHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Unlock size={28} color="var(--status-success)" />
          <h1 className={styles.viewTitle}>Personal Vault</h1>
        </div>
        <div className={styles.viewMeta}>
          <span>Type: Confidential</span>
          <span>•</span>
          <span className="badge badge-writeups" style={{ backgroundColor: 'var(--status-warning-bg)', color: 'var(--status-warning)' }}>
            <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Unfiltered
          </span>
        </div>
      </div>

      <div className={styles.viewContent}>
        <p className={styles.leadText} style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
          This is the part of my portfolio that isn't meant to sound like a resume. It's a little more personal and a little less polished.
        </p>

        <div style={boxStyle}>
          <h2 className={styles.sectionTitle}>Outside the Terminal</h2>
          <div className={styles.textBlock}>
            <p>Not everything I do revolves around a terminal.</p>
            <p style={{ marginTop: '8px' }}>I've lost more than <strong>14 kg through the gym</strong>, and getting into fitness has become a pretty important part of my life. I also love running — sometimes for the workout, sometimes just to get away from a screen for a while.</p>
            <p style={{ marginTop: '8px' }}>And when I'm not doing either of those things, there's a good chance I'm playing <strong>BGMI</strong>.</p>
            <p style={{ marginTop: '8px' }}>I've learned a lot from the process of getting fitter, especially about consistency, patience, and actually sticking with something even when progress feels slow.</p>
            <p style={{ marginTop: '8px' }}>If you're working on your fitness and feel like you don't know where to start, <strong>feel free to reach out.</strong> I've been there, and if I can help from my own experience, I'll be happy to.</p>
          </div>
        </div>

        <div style={boxStyle}>
          <h2 className={styles.sectionTitle}>How I Got Here</h2>
          <div className={styles.textBlock}>
            <p>I started out more interested in understanding technology than in cybersecurity specifically. I liked figuring out how things worked behind the interface — what happens in a network, how operating systems manage things, what actually happens when you run a command, and why something behaves the way it does.</p>
            <p style={{ marginTop: '8px' }}>As I started learning more about Linux, networking, and security, I became increasingly interested in the offensive side of things.</p>
            <p style={{ marginTop: '8px' }}>The idea that you can look at a system, understand how it works, find where it is weak, and then prove that weakness actually exists is what pulled me toward ethical hacking.</p>
            <p style={{ marginTop: '8px' }}>I'm still early in that journey. I'm not going to pretend I've mastered it. Right now, I'm focused on building the fundamentals properly and getting as much hands-on experience as I can.</p>
          </div>
        </div>

        <div style={boxStyle}>
          <h2 className={styles.sectionTitle}>What Keeps Me Learning</h2>
          <div className={styles.textBlock}>
            <p>One thing I've realized pretty quickly is that cybersecurity has a way of exposing what you <em>don't</em> understand.</p>
            <p style={{ marginTop: '8px' }}>I'll sometimes spend a ridiculous amount of time trying to figure something out, only to realize that I was missing a basic concept underneath it.</p>
            <p style={{ marginTop: '8px' }}>Linux and networking have taught me this repeatedly.</p>
            <p style={{ marginTop: '8px' }}>Something that looks like a complicated security problem can often become much easier once you actually understand what's happening underneath it.</p>
            <p style={{ marginTop: '8px' }}>That's one of the things I enjoy most about learning ethical hacking: every difficult problem usually points toward something I need to understand better.</p>
          </div>
        </div>



      </div>
    </div>
  );
}
