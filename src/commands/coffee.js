import { ascii, blank, muted } from './helpers.js';

const COFFEE_ART = `
       ( (
        ) )
      ........
      |      |]
      \\      /
       '----'
`;

export const coffeeCommand = {
  name: 'coffee',
  aliases: ['☕'],
  description: 'I need this',
  execute: () => [
    blank(),
    ascii(COFFEE_ART),
    muted('  Running on caffeine since 2023.'),
    blank(),
  ],
};
