import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_ASCII = `
██╗  ██╗ ██████╗ ███╗   ██╗ █████╗ ███╗   ███╗██╗
██║ ██╔╝██╔═══██╗████╗  ██║██╔══██╗████╗ ████║██║
█████╔╝ ██║   ██║██╔██╗ ██║███████║██╔████╔██║██║
██╔═██╗ ██║   ██║██║╚██╗██║██╔══██║██║╚██╔╝██║██║
██║  ██╗╚██████╔╝██║ ╚████║██║  ██║██║ ╚═╝ ██║██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝

  ↑ ↑ ↓ ↓ ← → ← → B A  — CHEAT CODE ACTIVATED
  You found the secret. Respect.
`;

export default function KonamiEasterEgg({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        className="konami-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onDone}
        role="dialog"
        aria-label="Konami code easter egg"
      >
        <pre style={{
          color: '#00ff41',
          textShadow: '0 0 12px rgba(0,255,65,0.8)',
          fontFamily: 'monospace',
          fontSize: 'clamp(6px, 1.2vw, 14px)',
          lineHeight: 1.3,
          textAlign: 'center',
          whiteSpace: 'pre',
          animation: 'konami-flicker 0.4s steps(1) 5',
        }}>
          {KONAMI_ASCII}
        </pre>
        <div style={{
          marginTop: 24,
          color: 'rgba(0,255,65,0.5)',
          fontSize: 12,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
        }}>
          [ click to dismiss ]
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
