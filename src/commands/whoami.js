import { line, blank, success } from './helpers.js';

export const whoamiCommand = {
  name: 'whoami',
  aliases: [],
  description: 'Who are you?',
  execute: () => [
    blank(),
    success('  husain — backend dev, API whisperer, infrastructure cost-slayer.'),
    line('  Currently making 10M MongoDB documents behave themselves.', 'info'),
    line('  Powered by chai and stack traces.', 'info'),
    blank(),
  ],
};
