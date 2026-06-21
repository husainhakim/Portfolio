import { useRef, useCallback } from 'react';

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.08, gainPeak = 0.12, startFreq = null }) {
  try {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFreq || frequency, ctx.currentTime);
    if (startFreq) {
      oscillator.frequency.linearRampToValueAtTime(frequency, ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + 0.005);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration + 0.01);
  } catch (_) {
    // Silently fail if audio isn't available
  }
}

export function useSound() {
  const enabledRef = useRef(false);

  const setEnabled = useCallback((val) => {
    enabledRef.current = val;
    if (val) {
      // Prime the AudioContext on first enable (requires user gesture)
      try { getAudioCtx(); } catch (_) {}
    }
  }, []);

  const playKeyClick = useCallback(() => {
    if (!enabledRef.current) return;
    playTone({ frequency: 1800, type: 'square', duration: 0.018, gainPeak: 0.04 });
  }, []);

  const playSuccess = useCallback(() => {
    if (!enabledRef.current) return;
    playTone({ frequency: 1200, type: 'sine', duration: 0.09, gainPeak: 0.1 });
  }, []);

  const playError = useCallback(() => {
    if (!enabledRef.current) return;
    playTone({ frequency: 180, type: 'sawtooth', duration: 0.06, gainPeak: 0.08 });
  }, []);

  const playBoot = useCallback(() => {
    if (!enabledRef.current) return;
    playTone({ frequency: 880, type: 'sine', duration: 0.15, gainPeak: 0.08, startFreq: 440 });
  }, []);

  return { setEnabled, playKeyClick, playSuccess, playError, playBoot };
}
