import { useRef, useEffect, useState, useCallback } from 'react';
import { IDENTITY } from '../data/content.js';
import { tabComplete } from '../utils/tabComplete.js';
import { COMMAND_NAMES } from '../commands/index.js';

export default function TerminalInput({
  onSubmit,
  onKeyClick,
  commandHistory,
  historyIndex,
  setHistoryIndex,
  isProcessing,
  autoFocusKey,
}) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus();
  }, [autoFocusKey]);

  // Click anywhere on terminal to focus input
  useEffect(() => {
    const handler = () => inputRef.current?.focus();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    setSuggestions([]);
    onKeyClick?.();
  }, [onKeyClick]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isProcessing || !value.trim()) return;
      setSuggestions([]);
      onSubmit(value);
      setValue('');
      setHistoryIndex(-1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIdx);
      setValue(commandHistory[nextIdx] ?? '');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIdx);
      setValue(nextIdx === -1 ? '' : commandHistory[nextIdx] ?? '');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const { completed, suggestions: suggs } = tabComplete(value, COMMAND_NAMES);
      if (completed) {
        setValue(completed);
        setSuggestions([]);
      } else if (suggs.length > 1) {
        setSuggestions(suggs);
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onSubmit('clear');
      return;
    }
  }, [value, historyIndex, commandHistory, isProcessing, onSubmit, onKeyClick, setHistoryIndex]);

  return (
    <div>
      {suggestions.length > 0 && (
        <div className="autocomplete-list" aria-live="polite" role="listbox">
          {suggestions.map(s => (
            <span
              key={s}
              role="option"
              style={{ cursor: 'pointer', marginRight: 12 }}
              onClick={() => { setValue(s); setSuggestions([]); inputRef.current?.focus(); }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="terminal-input-row">
        <span className="prompt-label" aria-hidden="true">
          {IDENTITY.prompt}
        </span>
        <div className="prompt-input-wrapper">
          <input
            ref={inputRef}
            id="terminal-input"
            className="prompt-input"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Terminal command input"
            aria-autocomplete="list"
            aria-haspopup={suggestions.length > 0}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isProcessing}
          />
          {/* Visual mirror with blinking cursor */}
          <div className="prompt-display" aria-hidden="true">
            <span>{value}</span>
            <span className="cursor-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}
