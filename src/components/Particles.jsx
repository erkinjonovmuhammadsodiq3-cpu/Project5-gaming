import { useEffect, useRef } from 'react';

// Ambient canvas: drifting neon particles. Skipped for reduced-motion users; pauses when tab hidden.
export default function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = ref.current, ctx = c.getContext('2d');
    let w, h, raf, mouse = { x: -999, y: -999 };
    const cols = ['#8b5cf6', '#00d9ff', '#ff3d81', '#a3ff4f'];
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    resize();
    const N = innerWidth < 700 ? 28 : 70;
    const ps = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4, vx: (Math.random() - .5) * .25, vy: -Math.random() * .35 - .05, c: cols[(Math.random() * 4) | 0], z: Math.random() * .8 + .2 }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx + (mouse.x - w / 2) * 0.00002 * p.z * 100; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; } if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
        ctx.beginPath(); ctx.fillStyle = p.c; ctx.globalAlpha = .55 * p.z; ctx.shadowColor = p.c; ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const mv = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
    addEventListener('resize', resize); addEventListener('mousemove', mv); document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('mousemove', mv); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
