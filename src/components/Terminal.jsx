import { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import TerminalOutput from './TerminalOutput.jsx';
import TerminalInput from './TerminalInput.jsx';
import ThemePicker from './ThemePicker.jsx';
import KonamiEasterEgg from './KonamiEasterEgg.jsx';
import { dispatch, COMMAND_NAMES } from '../commands/index.js';
import { useTheme } from '../hooks/useTheme.js';
import { useSound } from '../hooks/useSound.js';
import { useKonami } from '../hooks/useKonami.js';
import { IDENTITY } from '../data/content.js';

const MatrixRain = lazy(() => import('./MatrixRain.jsx'));

let idCounter = 0;
const uid = () => ++idCounter;

const WELCOME_LINES = [
  { id: uid(), type: 'info', text: `Welcome to ${IDENTITY.name}'s portfolio terminal.`, animate: true },
  { id: uid(), type: 'muted', text: `Type 'help' to get started.`, animate: true },
  { id: uid(), type: 'blank', text: '', animate: false },
];

const PROCESSING_DELAY_MS = 80 + Math.random() * 70; // 80–150ms

export default function Terminal({ crt, onCrtToggle }) {
  const [history, setHistory] = useState(WELCOME_LINES);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [konami, setKonami] = useState(false);
  const [autoFocusKey, setAutoFocusKey] = useState(0);
  const [tabTitle, setTabTitle] = useState('husain@portfolio:~');
  const processingRef = useRef(false);

  const { theme, setTheme } = useTheme();
  const sound = useSound();
  const [soundEnabled, setSoundEnabled] = useState(false);

  const updateTitle = useCallback((cmd) => {
    const titles = {
      projects: 'husain@portfolio: ~/projects',
      experience: 'husain@portfolio: ~/work',
      skills: 'husain@portfolio: ~/skills',
      about: 'husain@portfolio: ~/about',
      contact: 'husain@portfolio: ~/contact',
      education: 'husain@portfolio: ~/education',
      achievements: 'husain@portfolio: ~/achievements',
    };
    document.title = titles[cmd]
      ? `${titles[cmd]} — Husain Hakim`
      : 'Husain Hakim — Backend Developer';
  }, []);

  useKonami(useCallback(() => {
    setKonami(true);
  }, []));

  const handleSound = useCallback((enabled) => {
    setSoundEnabled(enabled);
    sound.setEnabled(enabled);
  }, [sound]);

  const handleSubmit = useCallback((raw) => {
    if (processingRef.current) return;
    const trimmed = raw.trim();
    if (!trimmed) return;

    processingRef.current = true;
    setIsProcessing(true);

    // Add input echo to history
    const inputEntry = {
      id: uid(),
      type: 'input',
      text: trimmed,
      prompt: IDENTITY.prompt,
      animate: true,
    };
    setHistory(prev => [...prev, inputEntry]);

    // Add to command history
    setCommandHistory(prev => [trimmed, ...prev.slice(0, 49)]);

    setTimeout(() => {
      const result = dispatch(trimmed);

      // Handle special actions first
      const clearAction = result.find(r => r.action === 'clear');
      if (clearAction) {
        setHistory([]);
        processingRef.current = false;
        setIsProcessing(false);
        setAutoFocusKey(k => k + 1);
        document.title = 'Husain Hakim — Backend Developer';
        return;
      }

      const matrixAction = result.find(r => r.action === 'matrix');
      if (matrixAction) {
        setMatrixActive(true);
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }

      const themeAction = result.find(r => r.action === 'theme');
      if (themeAction) {
        setTheme(themeAction.value);
      }

      const soundAction = result.find(r => r.action === 'sound');
      if (soundAction) {
        handleSound(soundAction.value);
      }

      const crtAction = result.find(r => r.action === 'crt');
      if (crtAction) {
        onCrtToggle?.();
      }

      // Determine if this is an error response
      const hasError = result.some(r => r.type === 'error');
      if (hasError) {
        sound.playError();
      } else {
        sound.playSuccess();
      }

      // Update tab title
      const firstToken = trimmed.split(' ')[0].toLowerCase();
      updateTitle(firstToken);

      // Assign IDs and stagger delays for animation
      const lines = result
        .filter(r => !r.action) // filter out action sentinels
        .map((entry, i) => ({
          ...entry,
          id: uid(),
          animate: true,
          animDelay: i * 0.035,
        }));

      setHistory(prev => [...prev, ...lines]);
      processingRef.current = false;
      setIsProcessing(false);
      setAutoFocusKey(k => k + 1);
    }, PROCESSING_DELAY_MS);
  }, [sound, setTheme, handleSound, onCrtToggle, updateTitle]);

  return (
    <div className={`terminal-container${crt ? ' crt-wrapper' : ''}`}>
      {/* Ambient background */}
      <Suspense fallback={null}>
        <MatrixRain ambient={true} />
      </Suspense>

      {/* Film grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* Terminal chrome header */}
      <div className="terminal-header">
        <div className="terminal-header-dots">
          <div className="terminal-header-dot" style={{ background: '#ff5f57' }} />
          <div className="terminal-header-dot" style={{ background: '#febc2e' }} />
          <div className="terminal-header-dot" style={{ background: '#28c840' }} />
        </div>
        <span className="terminal-header-title">{tabTitle}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemePicker current={theme} onChange={setTheme} />
          <button
            className={`hud-btn${crt ? ' active' : ''}`}
            onClick={onCrtToggle}
            aria-label="Toggle CRT effect"
            title="Toggle CRT scanlines"
          >
            CRT
          </button>
          <button
            className={`hud-btn${soundEnabled ? ' active' : ''}`}
            onClick={() => handleSound(!soundEnabled)}
            aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
            title="Toggle sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Terminal body */}
      <div className="terminal-body">
        <TerminalOutput history={history} />
        <TerminalInput
          onSubmit={handleSubmit}
          onKeyClick={sound.playKeyClick}
          commandHistory={commandHistory}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          isProcessing={isProcessing}
          autoFocusKey={autoFocusKey}
        />
      </div>

      {/* Screen reader mirror */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="false"
        role="log"
        aria-label="Terminal output for screen readers"
      >
        {history
          .filter(e => e.type !== 'blank' && e.type !== 'ascii')
          .slice(-5)
          .map(e => e.text || '')
          .join('. ')}
      </div>

      {/* Matrix full-screen overlay */}
      <AnimatePresence>
        {matrixActive && (
          <Suspense fallback={null}>
            <MatrixRain onExit={() => {
              setMatrixActive(false);
              setAutoFocusKey(k => k + 1);
            }} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Konami easter egg */}
      <AnimatePresence>
        {konami && (
          <KonamiEasterEgg onDone={() => setKonami(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
