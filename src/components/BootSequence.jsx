import { useEffect, useState, useRef } from 'react';
import { ASCII_LOGO, BOOT_LOGS } from '../data/content.js';

export default function BootSequence({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [glitchDone, setGlitchDone] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    // Show ASCII logo with glitch first
    const t0 = setTimeout(() => {
      setVisibleLines([{ type: 'ascii', text: ASCII_LOGO, glitch: true }]);
    }, 80);

    const t1 = setTimeout(() => setGlitchDone(true), 800);

    // Then stagger boot log lines
    const timers = BOOT_LOGS.map((log) => {
      return setTimeout(() => {
        setVisibleLines(prev => [...prev, { type: 'log', text: log.text }]);
      }, 900 + log.delay);
    });

    // Final done
    const lastDelay = 900 + Math.max(...BOOT_LOGS.map(l => l.delay)) + 600;
    const tDone = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, lastDelay);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(tDone);
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <div className="boot-screen" role="status" aria-live="polite" aria-label="Portfolio loading">
      {visibleLines.map((entry, i) => {
        if (entry.type === 'ascii') {
          return (
            <pre
              key={i}
              className={`boot-ascii${entry.glitch && !glitchDone ? ' glitch-text' : ''}`}
              data-text={ASCII_LOGO}
              aria-hidden="true"
            >
              {ASCII_LOGO}
            </pre>
          );
        }

        // Format [OK] lines
        const hasOk = entry.text.includes('[OK]');
        return (
          <div key={i} className={`boot-line${hasOk ? ' ok-line' : ''}`}>
            {hasOk ? (
              <>
                {entry.text.replace('[OK]', '')}
                <span className="ok-tag">[OK]</span>
              </>
            ) : (
              entry.text
            )}
          </div>
        );
      })}
    </div>
  );
}
