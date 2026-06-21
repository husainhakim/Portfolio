import { line, blank, section, muted } from './helpers.js';
import { ACHIEVEMENTS } from '../data/content.js';

export const achievementsCommand = {
  name: 'achievements',
  aliases: ['awards', 'certs'],
  description: 'Awards, certifications & extracurriculars',
  execute: () => {
    const out = [blank(), section('▸ ACHIEVEMENTS & CERTIFICATIONS'), blank()];
    ACHIEVEMENTS.forEach((a, i) => {
      out.push(line(`  ${i + 1}. ${a}`, 'info'));
    });
    out.push(blank());
    return out;
  },
};
