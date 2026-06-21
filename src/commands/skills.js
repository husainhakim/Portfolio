import { line, blank, section } from './helpers.js';
import { SKILLS } from '../data/content.js';

// Total visible box width = 58 chars
// Layout: "  ┌─ LABEL ──...──┐"  and  "  └──...──────────┘"
// Inner dash span = 54  (2 indent + 1 corner + 54 inner + 1 corner = 58)
const INNER = 54;

function boxTop(label) {
  // "  ┌─ " = 4, label, " " = 1, fill dashes, "─┐" = 2  → total = 4 + label + 1 + fill + 2 = 58
  const fill = Math.max(1, INNER - 4 - label.length); // 4 = "─ " + " ─"
  return `  ┌─ ${label} ${'─'.repeat(fill)}─┐`;
}

function boxBottom() {
  return `  └${'─'.repeat(INNER)}┘`;
}

export const skillsCommand = {
  name: 'skills',
  aliases: ['stack', 'tech'],
  description: 'Tech stack grouped by category',
  execute: () => {
    const out = [blank(), section('▸ SKILLS & TECH STACK'), blank()];
    SKILLS.forEach(({ category, items }) => {
      out.push(line(boxTop(category.toUpperCase()), 'section'));
      items.forEach(item => {
        out.push(line(`  │  ◆  ${item}`, 'info'));
      });
      out.push(line(boxBottom(), 'section'));
      out.push(blank());
    });
    return out;
  },
};
