// Helper to create output line descriptors
export const line = (text, type = 'info') => ({ text, type });
export const blank = () => ({ text: '', type: 'blank' });
export const section = (text) => ({ text, type: 'section' });
export const linkLine = (text) => ({ text, type: 'link' });
export const ascii = (text) => ({ text, type: 'ascii' });
export const success = (text) => ({ text, type: 'success' });
export const error = (text) => ({ text, type: 'error' });
export const warn = (text) => ({ text, type: 'warn' });
export const muted = (text) => ({ text, type: 'muted' });
