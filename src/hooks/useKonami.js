import { useEffect, useRef } from 'react';

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a'
];

export function useKonami(onActivate) {
  const seq = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      seq.current.push(e.key);
      if (seq.current.length > KONAMI.length) {
        seq.current.shift();
      }
      if (seq.current.join(',') === KONAMI.join(',')) {
        seq.current = [];
        onActivate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onActivate]);
}
