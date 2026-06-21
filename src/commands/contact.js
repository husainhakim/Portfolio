import { line, blank, section } from './helpers.js';
import { IDENTITY } from '../data/content.js';

// Fixed width = 58:  "  ┌─ GET IN TOUCH ──...──┐"
//               2 + 1 + 2 + 13 + 1 + fill + 2 = 58 → fill = 37
const INNER = 54;
const LABEL = 'GET IN TOUCH';
const fill = Math.max(1, INNER - 4 - LABEL.length);
const topLine = `  ┌─ ${LABEL} ${'─'.repeat(fill)}─┐`;
const bottomLine = `  └${'─'.repeat(INNER)}┘`;

export const contactCommand = {
  name: 'contact',
  aliases: ['reach', 'socials'],
  description: 'Contact info & social links',
  execute: () => [
    blank(),
    section('▸ CONTACT'),
    blank(),
    line(topLine, 'section'),
    line(`  │  📧  Email    : ${IDENTITY.email}`, 'info'),
    line(`  │  📞  Phone    : ${IDENTITY.phone}`, 'info'),
    { text: `  │  🐙  GitHub   : <a href="${IDENTITY.github}" target="_blank" rel="noopener">${IDENTITY.github}</a>`, type: 'link' },
    { text: `  │  💼  LinkedIn : <a href="${IDENTITY.linkedin}" target="_blank" rel="noopener">${IDENTITY.linkedin}</a>`, type: 'link' },
    line(bottomLine, 'section'),
    blank(),
  ],
};
