import { line, blank, success, muted } from './helpers.js';

export const resumeCommand = {
  name: 'resume',
  aliases: ['cv'],
  description: 'Download resume PDF',
  execute: () => {
    // Trigger download in browser
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = '/HusainHakim_Resume.pdf';
      a.download = 'HusainHakim_Resume.pdf';
      a.click();
    }, 200);

    return [
      blank(),
      success('  Initiating download: HusainHakim_Resume.pdf'),
      muted('  If download does not start, check your browser settings.'),
      blank(),
    ];
  },
};
