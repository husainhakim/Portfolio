import { line, blank, section } from './helpers.js';
import { EXPERIENCE } from '../data/content.js';

// Fixed box width = 58 chars total
// "  ┌─ TITLE ──────...──┐" and "  └──────────────...──┘"
const INNER = 54;

function boxTop(label) {
  const fill = Math.max(1, INNER - 4 - label.length);
  return `  ┌─ ${label} ${'─'.repeat(fill)}─┐`;
}

function boxBottom() {
  return `  └${'─'.repeat(INNER)}┘`;
}

export const experienceCommand = {
  name: 'experience',
  aliases: ['exp', 'work'],
  description: 'Work history',
  execute: () => {
    const out = [blank(), section('▸ WORK EXPERIENCE'), blank()];
    EXPERIENCE.forEach((job) => {
      out.push(line(boxTop(job.title.toUpperCase()), 'section'));
      out.push(line(`  │  Company : ${job.company}`, 'info'));
      out.push(line(`  │  Period  : ${job.period}`, 'info'));
      out.push(line('  │', 'info'));

      job.bullets.forEach(bullet => {
        // Word-wrap so lines stay inside ~68 chars
        const words = bullet.split(' ');
        let current = '  │  ▸ ';
        const wrapped = [];
        words.forEach(word => {
          if (current.length + word.length > 68) {
            wrapped.push(current.trimEnd());
            current = '  │    ' + word + ' ';
          } else {
            current += word + ' ';
          }
        });
        if (current.trim()) wrapped.push(current.trimEnd());
        wrapped.forEach(l => out.push(line(l, 'info')));
      });

      out.push(line(boxBottom(), 'section'));
      out.push(blank());
    });
    return out;
  },
};
