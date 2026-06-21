import { line, blank, section } from './helpers.js';
import { EDUCATION } from '../data/content.js';

const INNER = 54;

function boxTop(label) {
  const fill = Math.max(1, INNER - 4 - label.length);
  return `  ┌─ ${label} ${'─'.repeat(fill)}─┐`;
}

function boxBottom() {
  return `  └${'─'.repeat(INNER)}┘`;
}

export const educationCommand = {
  name: 'education',
  aliases: ['edu', 'degree'],
  description: 'Education background',
  execute: () => {
    const out = [blank(), section('▸ EDUCATION'), blank()];
    EDUCATION.forEach(edu => {
      out.push(line(boxTop(edu.degree.toUpperCase()), 'section'));
      out.push(line(`  │  Institution : ${edu.institution}`, 'info'));
      out.push(line(`  │  Period      : ${edu.period}`, 'info'));
      out.push(line(`  │  CGPA        : ${edu.cgpa}`, 'success'));
      out.push(line(boxBottom(), 'section'));
      out.push(blank());
    });
    return out;
  },
};
