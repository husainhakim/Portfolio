"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFilesystem } from "@/context/FilesystemContext";
import { useTheme } from "@/context/ThemeContext";
import {
  executeCommand,
  getAutocompleteSuggestion,
  CommandOutput,
} from "@/lib/cliCommands";
import { ROOT_PATH } from "@/data/filesystemData";
import {
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  Trash2,
  CornerDownLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
} from "lucide-react";
import styles from "./Terminal.module.css";

export function Terminal() {
  const { currentPath, navigate, openFile, setMode } = useFilesystem();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      id: "init-welcome",
      command: "welcome",
      output: `Husain Hakim — Offensive Security Workspace Terminal [v2.4]
Type 'help' to see all available filesystem & security commands.
Type 'gui' to toggle back to the GUI workspace at any time.`,
      timestamp: new Date().toLocaleTimeString(),
      path: currentPath,
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Focus input automatically on mount and path change
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentPath]);

  // Scroll to bottom when history updates
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Format prompt path (~/projects instead of /home/husain/projects)
  const getDisplayPath = (path: string) => {
    if (path === ROOT_PATH) return "~";
    if (path.startsWith(ROOT_PATH)) {
      return "~" + path.slice(ROOT_PATH.length);
    }
    return path;
  };

  const handleCommandSubmit = (cmdToRun?: string) => {
    const raw = cmdToRun !== undefined ? cmdToRun : input;
    const trimmed = raw.trim();

    if (!trimmed) {
      return;
    }

    if (trimmed.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      return;
    }

    // Execute through command engine
    const result = executeCommand(trimmed, {
      currentPath,
      navigate,
      openFile,
      setMode,
      theme,
      toggleTheme,
      setTheme,
    });

    const newEntry: CommandOutput = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      command: trimmed,
      output: result.text,
      isError: result.isError,
      timestamp: new Date().toLocaleTimeString(),
      path: currentPath,
    };

    setHistory((prev) => [...prev, newEntry]);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput("");

    if (result.action) {
      result.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key: run command
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommandSubmit();
    }

    // Up Arrow: previous command in history
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }

    // Down Arrow: next command in history
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }

    // Tab key: auto-complete
    else if (e.key === "Tab") {
      e.preventDefault();
      const suggestion = getAutocompleteSuggestion(input, currentPath);
      if (suggestion) {
        setInput(suggestion);
      }
    }
  };

  const insertQuickText = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const runQuickCommand = (cmd: string) => {
    handleCommandSubmit(cmd);
  };

  return (
    <div
      className={`${styles.terminalContainer} ${isFullScreen ? styles.terminalFullScreen : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Title Bar */}
      <div className={styles.terminalHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.windowDots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>
          <div className={styles.sessionTitle}>
            <TerminalIcon size={13} className={styles.headerTerminalIcon} />
            <span>husain@portfolio:{getDisplayPath(currentPath)}</span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => setHistory([])}
            className={styles.headerActionBtn}
            title="Clear terminal"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
          <button
            onClick={() => setMode("gui")}
            className={styles.headerActionBtn}
            title="Switch to GUI workspace"
          >
            <LayoutGrid size={13} />
            <span>GUI</span>
          </button>
          <button
            onClick={() => setIsFullScreen((prev) => !prev)}
            className={styles.headerActionBtn}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className={styles.terminalBody}>
        {history.map((item) => (
          <div key={item.id} className={styles.historyBlock}>
            <div className={styles.promptLine}>
              <span className={styles.promptUser}>husain@portfolio</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>{getDisplayPath(item.path)}</span>
              <span className={styles.promptDollar}>$</span>
              <span className={styles.promptCommand}>{item.command}</span>
            </div>

            {item.output && (
              <pre
                className={`${styles.commandOutput} ${item.isError ? styles.outputError : ""}`}
              >
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Live Interactive Input Line */}
        <div className={styles.activeInputLine}>
          <span className={styles.promptUser}>husain@portfolio</span>
          <span className={styles.promptColon}>:</span>
          <span className={styles.promptPath}>{getDisplayPath(currentPath)}</span>
          <span className={styles.promptDollar}>$</span>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.terminalInput}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input prompt"
            />
          </div>
        </div>

        <div ref={terminalBottomRef} />
      </div>

      {/* Mobile Touch Quick Command Shortcut Bar */}
      <div className={styles.mobileQuickBar} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => runQuickCommand("help")} className={styles.quickBtn}>
          help
        </button>
        <button onClick={() => runQuickCommand("ls -l")} className={styles.quickBtn}>
          ls -l
        </button>
        <button onClick={() => runQuickCommand("cd ..")} className={styles.quickBtn}>
          cd ..
        </button>
        <button onClick={() => runQuickCommand("projects")} className={styles.quickBtn}>
          projects
        </button>
        <button onClick={() => runQuickCommand("writeups")} className={styles.quickBtn}>
          writeups
        </button>
        <button onClick={() => runQuickCommand("skills")} className={styles.quickBtn}>
          skills
        </button>
        <button onClick={() => runQuickCommand("whoami")} className={styles.quickBtn}>
          whoami
        </button>
        <button onClick={() => runQuickCommand("tree")} className={styles.quickBtn}>
          tree
        </button>
        <button
          onClick={() => {
            const suggestion = getAutocompleteSuggestion(input, currentPath);
            if (suggestion) setInput(suggestion);
          }}
          className={`${styles.quickBtn} ${styles.quickBtnHighlight}`}
        >
          TAB
        </button>
        <button onClick={() => runQuickCommand("clear")} className={styles.quickBtn}>
          clear
        </button>
      </div>
    </div>
  );
}
