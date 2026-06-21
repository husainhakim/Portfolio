export const clearCommand = {
  name: 'clear',
  aliases: ['cls', 'reset'],
  description: 'Clear the terminal screen',
  execute: () => [{ action: 'clear' }],
};
