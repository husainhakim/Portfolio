import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootSequence from './components/BootSequence.jsx';
import Terminal from './components/Terminal.jsx';
import SeoContent from './components/SeoContent.jsx';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [crt, setCrt] = useState(false);

  const handleBootDone = useCallback(() => {
    setBooted(true);
  }, []);

  const toggleCrt = useCallback(() => {
    setCrt(prev => !prev);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Visually hidden semantic HTML for SEO — always in DOM for crawlers */}
      <SeoContent />
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <BootSequence onDone={handleBootDone} />
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Terminal crt={crt} onCrtToggle={toggleCrt} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
