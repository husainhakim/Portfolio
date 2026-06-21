import { line, blank, section, muted, error } from './helpers.js';
import { PROJECTS } from '../data/content.js';

// Consistent box width = 58 chars for all boxes
const INNER = 54;

function boxTop(label) {
  const fill = Math.max(1, INNER - 4 - label.length);
  return `  ┌─ ${label} ${'─'.repeat(fill)}─┐`;
}

function boxBottom() {
  return `  └${'─'.repeat(INNER)}┘`;
}

function renderProjectDetail(project) {
  const out = [
    blank(),
    section(`▸ PROJECT: ${project.name.toUpperCase()}`),
    blank(),
    line(boxTop('DETAILS'), 'section'),
    line(`  │  ${project.description}`, 'info'),
    line('  │', 'info'),
    line(`  │  Tech Stack : ${project.tech.join(' · ')}`, 'info'),
    line('  │', 'info'),
    line('  │  HIGHLIGHTS', 'section'),
  ];
  project.highlights.forEach(h => out.push(line(`  │  ◆  ${h}`, 'info')));
  out.push(line('  │', 'info'));
  if (project.url) {
    out.push({ text: `  │  🌐 Live : <a href="${project.url}" target="_blank" rel="noopener">${project.url}</a>`, type: 'link' });
  }
  if (project.repo) {
    out.push({ text: `  │  📁 Repo : <a href="${project.repo}" target="_blank" rel="noopener">${project.repo}</a>`, type: 'link' });
  }
  out.push(line(boxBottom(), 'section'));
  out.push(blank());
  return out;
}

function renderProjectList() {
  const out = [blank(), section('▸ PROJECTS'), blank()];
  PROJECTS.forEach((p, i) => {
    out.push(line(`  ${i + 1}. ${p.name}`, 'section'));
    out.push(line(`     ${p.tech.join(' · ')}`, 'info'));
    out.push(line(`     ${p.description.slice(0, 80)}${p.description.length > 80 ? '...' : ''}`, 'info'));
    if (p.url) {
      out.push({ text: `     🌐 <a href="${p.url}" target="_blank" rel="noopener">${p.url}</a>`, type: 'link' });
    }
    if (p.repo) {
      out.push({ text: `     📁 <a href="${p.repo}" target="_blank" rel="noopener">${p.repo}</a>`, type: 'link' });
    }
    out.push(blank());
  });
  out.push(muted('  Tip: try `projects smartzone` to see full detail'));
  out.push(blank());
  return out;
}

export const projectsCommand = {
  name: 'projects',
  aliases: ['project'],
  description: 'List projects or view detail with `projects <name>`',
  execute: (args) => {
    if (!args.length) return renderProjectList();

    const query = args.join('-').toLowerCase().replace(/\s+/g, '-');
    const match = PROJECTS.find(p =>
      p.slug === query ||
      p.name.toLowerCase().replace(/\s+/g, '-') === query ||
      p.slug.includes(query) ||
      query.includes(p.slug.split('-')[0])
    );

    if (!match) {
      return [
        blank(),
        error(`  project "${args.join(' ')}" not found.`),
        muted(`  Available: ${PROJECTS.map(p => p.slug).join(', ')}`),
        blank(),
      ];
    }

    return renderProjectDetail(match);
  },
};
