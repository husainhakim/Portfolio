import { helpCommand } from './help.js';
import { aboutCommand } from './about.js';
import { skillsCommand } from './skills.js';
import { experienceCommand } from './experience.js';
import { projectsCommand } from './projects.js';
import { educationCommand } from './education.js';
import { contactCommand } from './contact.js';
import { achievementsCommand } from './achievements.js';
import { resumeCommand } from './resume.js';
import { clearCommand } from './clear.js';
import { whoamiCommand } from './whoami.js';
import { matrixCommand } from './matrix.js';
import { coffeeCommand } from './coffee.js';
import { sudoHireMeCommand, themeCommand, soundCommand, crtCommand } from './easterEggs.js';
import { line, blank, error, muted } from './helpers.js';
import { parseInput } from '../utils/parser.js';

// ─── Registry ─────────────────────────────────────────────────
const COMMANDS = [
  helpCommand,
  aboutCommand,
  skillsCommand,
  experienceCommand,
  projectsCommand,
  educationCommand,
  contactCommand,
  achievementsCommand,
  resumeCommand,
  clearCommand,
  whoamiCommand,
  matrixCommand,
  coffeeCommand,
  themeCommand,
  soundCommand,
  crtCommand,
];

// Build lookup maps
const byName = {};
const byAlias = {};

COMMANDS.forEach(cmd => {
  byName[cmd.name] = cmd;
  (cmd.aliases || []).forEach(a => { byAlias[a] = cmd; });
});

// Special compound commands (parsed differently)
const COMPOUND = {
  'sudo hire-me': sudoHireMeCommand,
  'sudo': sudoHireMeCommand, // partial match fallback
};

// ─── Public API ───────────────────────────────────────────────

/** All registered command names (for autocomplete) */
export const COMMAND_NAMES = COMMANDS.map(c => c.name);

/** All commands (for help display) */
export const ALL_COMMANDS = COMMANDS;

/**
 * Dispatch raw input string → array of output line descriptors
 * @param {string} raw  - raw user input
 * @param {object} ctx  - context passed to execute()
 */
export function dispatch(raw, ctx = {}) {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // Check compound commands first
  const lowerRaw = trimmed.toLowerCase();
  for (const [pattern, cmd] of Object.entries(COMPOUND)) {
    if (lowerRaw === pattern || lowerRaw.startsWith(pattern + ' ')) {
      return cmd.execute([], ctx);
    }
  }

  const { command, args } = parseInput(trimmed);

  const cmd = byName[command] || byAlias[command];

  if (!cmd) {
    return [
      blank(),
      error(`  command not found: ${command}`),
      muted('  Type `help` to see available commands.'),
      blank(),
    ];
  }

  return cmd.execute(args, ctx);
}
