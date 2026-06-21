/**
 * Parse raw user input into { command, args }
 * Handles: quoted strings, multiple spaces, case-insensitive command name
 */
export function parseInput(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { command: '', args: [] };

  // Tokenize respecting double-quoted segments
  const tokens = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ' ' && !inQuote) {
      if (current) { tokens.push(current); current = ''; }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);

  const [rawCmd, ...args] = tokens;
  return { command: rawCmd.toLowerCase(), args };
}
