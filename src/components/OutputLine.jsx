import { motion } from 'framer-motion';

/**
 * Single output line with optional animated entrance.
 * Handles all types: info, success, error, warn, section, ascii, link, muted, blank, input
 */
export default function OutputLine({ entry, animate = true, delay = 0 }) {
  const variants = {
    hidden: { opacity: 0, y: 3 },
    visible: { opacity: 1, y: 0 },
  };

  const transition = { duration: 0.12, ease: 'easeOut', delay };

  const className = `out-line type-${entry.type || 'info'}`;

  // Link lines render raw HTML (safe — we control content)
  if (entry.type === 'link') {
    return (
      <motion.div
        className={className}
        dangerouslySetInnerHTML={{ __html: entry.text }}
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
        variants={variants}
        transition={transition}
      />
    );
  }

  // Blank line
  if (entry.type === 'blank') {
    return <div className={className} aria-hidden="true" />;
  }

  // ASCII art (pre-formatted)
  if (entry.type === 'ascii') {
    return (
      <motion.pre
        className={className}
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
        variants={variants}
        transition={transition}
        aria-hidden="true"
      >
        {entry.text}
      </motion.pre>
    );
  }

  // Input echo line
  if (entry.type === 'input') {
    return (
      <motion.div
        className={className}
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
        variants={variants}
        transition={transition}
      >
        <span className="prompt">{entry.prompt}</span>
        <span>{entry.text}</span>
      </motion.div>
    );
  }

  // Default text line
  return (
    <motion.div
      className={className}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      variants={variants}
      transition={transition}
    >
      {entry.text}
    </motion.div>
  );
}
