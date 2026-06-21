import { useEffect, useRef, useCallback } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

export default function MatrixRain({ onExit, ambient = false }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const dropsRef = useRef([]);

  const handleKeyDown = useCallback((e) => {
    if (!ambient && (e.key === 'Escape' || e.key === 'Enter')) {
      onExit?.();
    }
  }, [ambient, onExit]);

  useEffect(() => {
    if (!ambient) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, ambient]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const fontSize = ambient ? 14 : 16;
    let cols, drops;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(1);
      dropsRef.current = drops;
    }

    resize();
    window.addEventListener('resize', resize);

    const color = ambient ? 'rgba(0,255,65,0.85)' : 'rgba(0,255,65,1)';
    const bgAlpha = ambient ? 0.08 : 0.05;

    function draw() {
      if (document.hidden && ambient) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = i % 10 === 0
          ? '#ffffff'
          : ambient
            ? 'rgba(0,255,65,0.6)'
            : 'rgba(0,255,65,0.9)';
        ctx.fillText(char, i * fontSize, dropsRef.current[i] * fontSize);

        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [ambient]);

  if (ambient) {
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          opacity: 0.04,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: '#000',
        cursor: 'crosshair',
      }}
      onClick={onExit}
      role="dialog"
      aria-label="Matrix rain effect. Press Escape or click to exit."
      tabIndex={0}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        bottom: 32,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'monospace',
        fontSize: 12,
        color: 'rgba(0,255,65,0.4)',
        letterSpacing: '0.1em',
      }}>
        [ press ESC or click to exit ]
      </div>
    </div>
  );
}
