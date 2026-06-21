import { useEffect, useRef } from 'react';
import OutputLine from './OutputLine.jsx';

export default function TerminalOutput({ history }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div
      className="terminal-output"
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {history.map((entry, i) => (
        <OutputLine
          key={entry.id || i}
          entry={entry}
          animate={entry.animate !== false}
          delay={entry.animDelay || 0}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
