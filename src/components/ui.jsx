import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaGamepad, FaNewspaper, FaBroadcastTower, FaTrophy, FaComments, FaGraduationCap, FaVideo, FaStore, FaCrown, FaCrosshairs } from 'react-icons/fa';
import { MediaVideo } from '../services/media.js';
export { MediaVideo };

const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// Generated artwork (no copyrighted images): gradient + geometric shapes + initials
export function Cover({ seed, colors = ['#8b5cf6', '#ff3d81'], label, className = '', big, image }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt={label || ''}
        loading="lazy"
        decoding="async"
        className={`block h-full w-full object-cover ${className}`}
        onError={() => setImageFailed(true)}
      />
    );
  }
  const h = hash(seed);
  const [a, b] = colors;
  const id = 'g' + h;
  const shapes = [0, 1, 2, 3].map((i) => ({ x: (h >> (i * 3)) % 100, y: (h >> (i * 2 + 1)) % 100, r: 14 + ((h >> i) % 28) }));
  const ini = (label || seed).replace(/[^A-Za-z0-9 ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={`block w-full h-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <radialGradient id={id + 'r'}><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
      {shapes.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`url(#${id}r)`} opacity=".5" />)}
      <path d={`M0 ${70 + (h % 20)} L ${30 + (h % 20)} 40 L 60 ${65} L 100 ${30 + (h % 20)} V100 H0Z`} fill="#080817" opacity=".55" />
      <path d={`M0 90 L40 ${60 + (h % 10)} L70 80 L100 ${55 + (h % 15)} V100 H0Z`} fill="#080817" opacity=".7" />
      <text x="50" y={big ? 52 : 46} textAnchor="middle" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize={big ? 26 : 22} fill="#fff" opacity=".92" style={{ paintOrder: 'stroke' }} stroke="#080817" strokeWidth="1.2">{ini}</text>
    </svg>
  );
}

export function Avatar({ name, size = 40, ring, live }) {
  const h = hash(name);
  const c1 = `hsl(${h % 360} 85% 60%)`, c2 = `hsl(${(h >> 3) % 360} 85% 55%)`;
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <span className={`flex items-center justify-center rounded-full font-bold text-white w-full h-full ${ring ? 'ring-2 ring-offset-2 ring-offset-[#080817]' : ''}`}
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, fontSize: size * 0.4, '--tw-ring-color': 'var(--a1)' }}>
        {name.slice(0, 1).toUpperCase()}
      </span>
      {live && <span className="live-dot absolute -bottom-0.5 -right-0.5 ring-2 ring-[#080817]" />}
    </span>
  );
}

export const LiveBadge = ({ viewers }) => (
  <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/90 px-2 py-0.5 text-[11px] font-bold tracking-wide">
    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />LIVE{viewers != null && <span className="opacity-90">· {viewers}</span>}
  </span>
);

export function YouTubeEmbed({ query, title = 'Gaming video', heightClass = 'aspect-video' }) {
  const link = String(query || '');
  const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  const videoId = match?.[1];
  const src = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(link)}&rel=0`;
  return (
    <iframe
      className={`h-full w-full ${heightClass}`}
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    />
  );
}

export const Rating = ({ v }) => (
  <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300"><FaStar className="text-xs" />{Number(v).toFixed(1)}</span>
);

export function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function Tilt({ children, className = '', max = 9 }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 200, damping: 18 }), sy = useSpring(ry, { stiffness: 200, damping: 18 });
  const move = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  return (
    <motion.div className={className} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 900, transformStyle: 'preserve-3d' }}>
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = '', dur = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf; const t0 = performance.now();
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const d = Math.max(0, target - now);
  return { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60, done: d === 0 };
}
export function Countdown({ target, size = 'lg' }) {
  const t = useCountdown(target);
  const items = [['Days', t.d], ['Hours', t.h], ['Min', t.m], ['Sec', t.s]];
  return (
    <div className="flex items-center gap-2" role="timer" aria-label="Countdown">
      {items.map(([l, v], i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="text-center">
            <div className={`font-display font-bold tabular-nums ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}>{String(v).padStart(2, '0')}</div>
            <div className="text-[10px] text-mute">{l}</div>
          </div>
          {i < 3 && <span className="text-mute pb-3">:</span>}
        </div>
      ))}
    </div>
  );
}

export function useLoading(ms = 700) {
  const [l, setL] = useState(true);
  useEffect(() => { const t = setTimeout(() => setL(false), ms); return () => clearTimeout(t); }, [ms]);
  return l;
}
export const SkeletonGrid = ({ n = 6, h = 220, cols = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-6' }) => (
  <div className={`grid gap-4 ${cols}`}>{Array.from({ length: n }, (_, i) => <div key={i} className="skeleton" style={{ height: h }} />)}</div>
);

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
            className={`glass neon-border w-full ${wide ? 'max-w-3xl' : 'max-w-md'} max-h-[90vh] overflow-auto p-6`} initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-2xl font-bold">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-white/10"><FaTimes /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SectionHead = ({ icon: Icon, title, sub, action }) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <div className="flex items-center gap-3">
      {Icon && <span className="grid h-11 w-11 place-items-center rounded-xl text-xl" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--a1) 35%, transparent), color-mix(in srgb, var(--a2) 25%, transparent))', color: 'var(--a1)' }}><Icon /></span>}
      <div><h2 className="text-2xl font-bold leading-none">{title}</h2>{sub && <p className="mt-1 text-sm text-mute">{sub}</p>}</div>
    </div>
    {action}
  </div>
);

export const Empty = ({ title = 'Nothing found', sub = 'Try another filter or search term.' }) => (
  <div className="glass-flat grid place-items-center gap-1 p-12 text-center"><FaCrosshairs className="text-4xl text-mute" /><h3 className="text-xl font-bold">{title}</h3><p className="text-sm text-mute">{sub}</p></div>
);

// Section banner: animated, accent-aware, with floating labels
export function PageHead({ title, sub, tags = [], children, art }) {
  const artMap = {
    '🎮': FaGamepad,
    '📰': FaNewspaper,
    '📡': FaBroadcastTower,
    '🏆': FaTrophy,
    '💬': FaComments,
    '🎓': FaGraduationCap,
    '🎥': FaVideo,
    '🛒': FaStore,
    '👑': FaCrown,
    '🔴': FaCrosshairs,
  };
  const ArtIcon = typeof art === 'string' ? artMap[art] : null;
  return (
    <header className="relative mb-8 overflow-hidden rounded-3xl glass neon-border p-6 md:p-10 min-h-[200px]">
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full blur-3xl opacity-50" style={{ background: 'var(--a1)' }} />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: 'var(--a2)' }} />
      {tags.map((t, i) => (
        <span key={t} className="floaty absolute hidden md:block glass-flat px-3 py-1 text-sm font-bold" style={{ right: `${6 + (i * 17) % 46}%`, top: `${14 + (i * 29) % 62}%`, animationDelay: `${i * 0.7}s`, '--r': `${(i % 2 ? 1 : -1) * 6}deg`, color: 'var(--a1)' }}>{t}</span>
      ))}
      {(art || ArtIcon) && <div className="floaty absolute right-6 top-4 hidden text-8xl opacity-90 lg:block" aria-hidden="true">{ArtIcon ? <ArtIcon /> : art}</div>}
      <div className="relative max-w-2xl">
        <h1 className="font-display text-3xl font-black md:text-5xl grad-text">{title}</h1>
        <p className="mt-3 text-mute md:text-lg">{sub}</p>
        {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
      </div>
    </header>
  );
}

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="no-sb flex gap-2 overflow-x-auto pb-1" role="tablist">
    {tabs.map((t) => <button key={t} role="tab" aria-selected={value === t} className={`chip ${value === t ? 'on' : ''}`} onClick={() => onChange(t)}>{t}</button>)}
  </div>
);
