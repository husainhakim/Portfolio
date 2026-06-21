import { line, blank, success, muted, error } from './helpers.js';
import { IDENTITY } from '../data/content.js';

export const sudoHireMeCommand = {
  name: 'sudo hire-me',
  aliases: [],
  description: 'Make an offer',
  execute: () => [
    blank(),
    line('  [sudo] password for visitor: ••••••••', 'warn'),
    blank(),
    success('  ✓ Permission granted.'),
    blank(),
    line('  Executing hire_husain.sh...', 'info'),
    line('  > Validating skills.json........................ [PASS]', 'info'),
    line('  > Checking availability......................... [OPEN]', 'info'),
    line('  > Evaluating culture fit........................ [MATCH]', 'info'),
    blank(),
    success('  All checks passed. Redirecting to contact...'),
    blank(),
    { text: `  📧 <a href="mailto:${IDENTITY.email}">${IDENTITY.email}</a>`, type: 'link' },
    { text: `  💼 <a href="${IDENTITY.linkedin}" target="_blank" rel="noopener">${IDENTITY.linkedin}</a>`, type: 'link' },
    blank(),
    muted('  (or just type `contact` — same thing, less drama)'),
    blank(),
  ],
};

export const themeCommand = {
  name: 'theme',
  aliases: [],
  description: 'Switch color theme',
  execute: (args, ctx) => {
    const validThemes = ['green', 'amber', 'matrix', 'solarized'];
    const requested = args[0]?.toLowerCase();
    if (!requested || !validThemes.includes(requested)) {
      return [
        blank(),
        error(`  Usage: theme <name>`),
        muted(`  Available themes: ${validThemes.join(' | ')}`),
        blank(),
      ];
    }
    // Action handled by dispatcher
    return [{ action: 'theme', value: requested }];
  },
};

export const soundCommand = {
  name: 'sound',
  aliases: [],
  description: 'Toggle sound effects',
  execute: (args, ctx) => {
    const val = args[0]?.toLowerCase();
    if (val === 'on') {
      return [{ action: 'sound', value: true }, blank(), success('  Sound enabled. 🔊'), blank()];
    } else if (val === 'off') {
      return [{ action: 'sound', value: false }, blank(), success('  Sound disabled. 🔇'), blank()];
    }
    return [blank(), error('  Usage: sound on | sound off'), blank()];
  },
};

export const crtCommand = {
  name: 'crt',
  aliases: [],
  description: 'Toggle CRT scanline effect',
  execute: () => [{ action: 'crt' }],
};
