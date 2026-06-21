/**
 * Tab autocomplete utility
 * Returns { completed, suggestions }
 * - completed: the completed string if single match, null otherwise
 * - suggestions: all matching command names (for multi-match display)
 */
export function tabComplete(input, commandNames) {
  const lower = input.toLowerCase();
  const matches = commandNames.filter(name => name.startsWith(lower));

  if (matches.length === 0) return { completed: null, suggestions: [] };
  if (matches.length === 1) return { completed: matches[0], suggestions: [] };

  // Find longest common prefix among matches
  let prefix = matches[0];
  for (let i = 1; i < matches.length; i++) {
    let j = 0;
    while (j < prefix.length && j < matches[i].length && prefix[j] === matches[i][j]) j++;
    prefix = prefix.slice(0, j);
  }

  const completed = prefix.length > lower.length ? prefix : null;
  return { completed, suggestions: matches };
}
