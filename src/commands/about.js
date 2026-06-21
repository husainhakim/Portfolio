import { line, blank, section, muted } from './helpers.js';
import { ABOUT, ACHIEVEMENTS } from '../data/content.js';

export const aboutCommand = {
  name: 'about',
  aliases: ['bio'],
  description: 'Professional summary & background',
  execute: (args) => {
    const showExtra = args.includes('--extra') || args.includes('-e');
    const out = [
      blank(),
      section('▸ ABOUT ME'),
      blank(),
      ...ABOUT.summary.split('\n').map(l => line('  ' + l.trim(), 'info')),
      blank(),
      line(`  "${ABOUT.tagline}"`, 'success'),
      blank(),
    ];

    if (showExtra) {
      out.push(section('▸ ACHIEVEMENTS'));
      out.push(blank());
      ACHIEVEMENTS.forEach(a => out.push(line('  • ' + a, 'info')));
      out.push(blank());
      out.push(muted('  (also try: achievements)'));
      out.push(blank());
    } else {
      out.push(muted('  Tip: try `about --extra` for achievements & certifications'));
      out.push(blank());
    }

    return out;
  },
};
