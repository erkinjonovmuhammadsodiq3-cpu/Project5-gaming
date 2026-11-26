import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaHome, FaGamepad, FaBroadcastTower, FaTrophy, FaUsers, FaGraduationCap, FaNewspaper, FaStore, FaUser, FaSearch, FaBell, FaBars, FaTimes, FaCrown, FaChevronDown, FaShoppingCart, FaAngleDoubleLeft, FaVideo, FaCog, FaSignOutAlt, FaUserCircle, FaStar, FaComments, FaCrosshairs, FaHeadphones, FaKeyboard, FaShieldAlt } from 'react-icons/fa';
import Particles from './Particles.jsx';
import { Avatar } from './ui.jsx';
import { useStore } from '../store.jsx';
import { GAMES, STREAMERS, TOURNAMENTS, COURSES, NEWS, COMMUNITIES } from '../data.js';

export const Logo = ({ small }) => (
  <Link to="/" className="flex items-center gap-2" aria-label="VYRON home">
    <svg width={small ? 30 : 38} height={small ? 30 : 38} viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#a855f7" /><stop offset="1" stopColor="#00d9ff" /></linearGradient></defs><path d="M2 5h8l6 14 6-14h8L16 29z" fill="url(#lg)" /><path d="M11 8h3l2 5 2-5h3l-5 11z" fill="#080817" opacity=".55" /></svg>
    <span className="font-display text-2xl font-black tracking-wider">VYRON</span>
  </Link>
);

const NAV = [
  ['/', 'Home', FaHome, ['#8b5cf6', '#ff3d81']], ['/games', 'Games', FaGamepad, ['#a855f7', '#ff3d81']], ['/live', 'Live', FaBroadcastTower, ['#00d9ff', '#8b5cf6']],
  ['/tournaments', 'Tournaments', FaTrophy, ['#ff9d32', '#ff3d81']], ['/community', 'Community', FaUsers, ['#a3ff4f', '#00d9ff']], ['/academy', 'Academy', FaGraduationCap, ['#00d9ff', '#a855f7']],
  ['/news', 'News', FaNewspaper, ['#ff3d81', '#ff9d32']], ['/store', 'Store', FaStore, ['#a855f7', '#00d9ff']], ['/profile', 'Profile', FaUser, ['#8b5cf6', '#00d9ff']],
];

function accentFor(path) {
  const hit = NAV.slice(1).find(([to]) => path.startsWith(to));
  if (path.startsWith('/premium')) return ['#ffcf4a', '#ff3d81'];
  return (hit ? hit[3] : NAV[0][3]);
}

function SideNav({ collapsed, onNavigate }) {
  const { premium } = useStore();
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV.map(([to, label, Icon]) => (
        <NavLink key={to} to={to} end={to === '/'} onClick={onNavigate} title={label}
          className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition ${isActive ? 'text-white' : 'text-mute hover:text-white hover:bg-white/5'}`}>
          {({ isActive }) => (<>
            {isActive && <motion.span layoutId="navpill" className="absolute inset-0 rounded-xl border border-white/10" style={{ background: 'linear-gradient(100deg, color-mix(in srgb, var(--a1) 55%, transparent), color-mix(in srgb, var(--a2) 25%, transparent))', boxShadow: '0 0 24px -6px var(--a1)' }} />}
            <Icon className="relative text-lg shrink-0" />{!collapsed && <span className="relative">{label}</span>}
          </>)}
        </NavLink>
      ))}
      {!collapsed && (
        <div className="neon-border glass relative mt-4 p-4 text-center">
          <FaCrown className="floaty mx-auto text-3xl text-amber-300 drop-shadow-[0_0_12px_#ffcf4a]" />
          <h3 className="mt-1 font-bold">{premium ? 'Premium Active' : 'Go Premium'}</h3>
          <p className="text-xs text-mute">Unlock exclusive features & rewards!</p>
          <Link to="/premium" onClick={onNavigate} className="btn btn-primary btn-sm mt-3 w-full">{premium ? 'Manage' : 'Upgrade Now'}</Link>
        </div>
      )}
    </nav>
  );
}

function OnlineCounter({ collapsed }) {
  const [n, setN] = useState(24800);
  useEffect(() => { const i = setInterval(() => setN((v) => v + Math.round((Math.random() - 0.45) * 40)), 2500); return () => clearInterval(i); }, []);
  if (collapsed) return <div className="grid place-items-center"><span className="live-dot" style={{ background: '#a3ff4f' }} /></div>;
  return (
    <div className="glass-flat p-3 text-sm"><div className="text-xs text-mute">Online Now</div>
      <div className="flex items-center gap-2 font-display text-lg font-bold"><span className="h-2.5 w-2.5 rounded-full bg-laser shadow-[0_0_10px_#a3ff4f]" />{n.toLocaleString()}</div></div>
  );
}

// ---------- Global search ----------
function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const inp = useRef(null);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => inp.current?.focus(), 50); } }, [open]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    const m = (t) => t.toLowerCase().includes(s);
    return [
      ['Games', GAMES.filter((g) => m(g.title)).slice(0, 5).map((g) => ({ k: g.id, t: g.title, s: g.genre, to: `/games/${g.id}` }))],
      ['Streamers', STREAMERS.filter((x) => m(x.name) || m(x.title)).slice(0, 4).map((x) => ({ k: x.id, t: x.name, s: x.title, to: `/live/${x.id}` }))],
      ['Tournaments', TOURNAMENTS.filter((x) => m(x.name)).slice(0, 3).map((x) => ({ k: x.id, t: x.name, s: `$${x.prize.toLocaleString()}`, to: `/tournaments/${x.id}` }))],
      ['Videos', COURSES.filter((x) => m(x.title)).slice(0, 3).map((x) => ({ k: x.id, t: x.title, s: x.creator, to: `/academy/${x.id}` }))],
      ['News', NEWS.filter((x) => m(x.title)).slice(0, 3).map((x) => ({ k: x.id, t: x.title, s: x.cat, to: `/news/${x.id}` }))],
      ['Communities', COMMUNITIES.filter((x) => m(x.name)).slice(0, 3).map((x) => ({ k: x.id, t: x.name, s: `${x.members.toLocaleString()} members`, to: '/community' }))],
    ].filter(([, r]) => r.length);
  }, [q]);
  const go = (to) => { onClose(); nav(to); };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] bg-black/70 p-4 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()} className="glass neon-border mx-auto max-w-2xl p-4" initial={{ y: -30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}>
            <div className="flex items-center gap-3"><FaSearch className="text-mute" />
              <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search games, streamers, tournaments, videos, news…" className="w-full bg-transparent text-lg outline-none" aria-label="Search" />
              <kbd className="rounded border border-white/20 px-1.5 text-xs text-mute">Esc</kbd></div>
            <div className="mt-3 max-h-[55vh] overflow-auto">
              {!results && <p className="p-4 text-center text-sm text-mute">Start typing to search the VYRON universe…</p>}
              {results?.length === 0 && <p className="p-6 text-center text-mute">No results for “{q}”.</p>}
              {results?.map(([cat, items]) => (
                <div key={cat} className="mb-2"><div className="px-2 py-1 text-xs font-bold text-mute">{cat}</div>
                  {items.map((r) => <button key={r.k} onClick={() => go(r.to)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-white/10"><span className="font-semibold">{r.t}</span><span className="text-xs text-mute">{r.s}</span></button>)}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

function Notifications() {
  const { notifications, markAllRead } = useStore();
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  const unread = notifications.filter((n) => !n.read).length;
  const ico = { follow: FaUserCircle, live: FaBroadcastTower, tournament: FaTrophy, community: FaComments, achievement: FaStar };
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label={`Notifications, ${unread} unread`} aria-expanded={open} className="relative grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10"><FaBell />
        {unread > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold">{unread}</span>}</button>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} className="glass neon-border absolute right-0 top-14 z-50 w-[min(92vw,360px)] p-3">
          <div className="mb-2 flex items-center justify-between px-1"><h3 className="font-bold">Notifications</h3><button className="text-xs underline text-mute" onClick={markAllRead}>Mark all read</button></div>
          {notifications.map((n) => { const Icon = ico[n.type] || FaStar; return <div key={n.id} className={`flex gap-3 rounded-xl p-2.5 ${n.read ? 'opacity-60' : 'bg-white/5'}`}><Icon className="mt-0.5 shrink-0 text-lg text-cyber" /><div className="flex-1 text-sm">{n.text}<div className="text-xs text-mute">{n.time} ago</div></div></div>; })}
        </motion.div>)}</AnimatePresence>
    </div>
  );
}

function ProfileMenu() {
  const { user, signOut } = useStore(); const nav = useNavigate();
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useOutside(ref, () => setOpen(false));
  if (!user.signedIn) return <Link to="/auth/signin" className="btn btn-primary btn-sm">Sign in</Link>;
  const item = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10';
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-white/10">
        <Avatar name={user.name} size={38} ring /><span className="hidden text-left leading-tight sm:block"><span className="block text-sm font-bold">{user.name}</span><span className="text-xs text-mute">Lv. {user.level}</span></span><FaChevronDown className="text-xs text-mute" /></button>
      <AnimatePresence>{open && (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 top-[58px] z-[100] w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#111127]/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,.65)] backdrop-blur-xl">
          <button className={item} onClick={() => { setOpen(false); nav('/profile'); }}><FaUser />My profile</button>
          <button className={item} onClick={() => { setOpen(false); nav('/live/studio'); }}><FaVideo />Go Live studio</button>
          <button className={item} onClick={() => { setOpen(false); nav('/premium'); }}><FaCrown className="text-amber-300" />Premium</button>
          <button className={item} onClick={() => { setOpen(false); nav('/profile?tab=Settings'); }}><FaCog />Settings</button>
          <button className={item} onClick={() => { setOpen(false); signOut(); nav('/auth/signin'); }}><FaSignOutAlt />Sign out</button>
        </motion.div>)}</AnimatePresence>
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex flex-col gap-2" role="status" aria-live="polite">
      <AnimatePresence>{toasts.map((t) => (
        <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="glass neon-border px-4 py-3 text-sm font-semibold">{t.msg}</motion.div>))}</AnimatePresence>
    </div>
  );
}

export default function Layout() {
  const loc = useLocation();
  const { cartCount } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [a1, a2] = accentFor(loc.pathname);
  const nav = useNavigate();

  useEffect(() => { setDrawer(false); window.scrollTo({ top: 0 }); }, [loc.pathname]);
  useEffect(() => {
    const k = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch((s) => !s); }
      if (e.key === 'Escape') setSearch(false);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, []);

  return (
    <div style={{ '--a1': a1, '--a2': a2 }} className="relative min-h-screen bg-void transition-colors duration-700">
      {/* environment */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[60vh] w-[60vh] rounded-full blur-[120px] opacity-30 transition-colors duration-700" style={{ background: 'var(--a1)' }} />
        <div className="absolute -right-40 bottom-0 h-[60vh] w-[60vh] rounded-full blur-[120px] opacity-25 transition-colors duration-700" style={{ background: 'var(--a2)' }} />
        <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: 'linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at center, #000 20%, transparent 75%)' }} />
        {[FaGamepad, FaTrophy, FaHeadphones, FaKeyboard, FaShieldAlt].map((Icon, i) => (
          <Icon key={i} className="floaty absolute hidden text-4xl opacity-20 lg:block" style={{ left: `${12 + i * 19}%`, top: `${10 + ((i * 37) % 70)}%`, animationDelay: `${i * 1.1}s`, animationDuration: `${6 + i}s` }} />))}
      </div>
      <Particles />

      {/* sidebar (desktop) */}
      <aside className={`fixed left-0 top-0 z-40 hidden h-screen flex-col gap-4 overflow-y-auto border-r border-white/10 bg-[#0a0a1c]/85 p-4 backdrop-blur-xl transition-[width] duration-300 lg:flex ${collapsed ? 'w-[84px]' : 'w-64'}`}>
        <div className="flex items-center justify-between">{collapsed ? <Logo small /> : <Logo />}
          {!collapsed && <button onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className="rounded-lg p-2 text-mute hover:bg-white/10"><FaAngleDoubleLeft /></button>}</div>
        {collapsed && <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar" className="rounded-lg p-2 text-mute hover:bg-white/10"><FaBars /></button>}
        <SideNav collapsed={collapsed} />
        <div className="mt-auto"><OnlineCounter collapsed={collapsed} /></div>
      </aside>

      {/* mobile drawer */}
      <AnimatePresence>{drawer && (<>
        <motion.div className="fixed inset-0 z-50 bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
        <motion.aside role="dialog" aria-label="Menu" className="fixed left-0 top-0 z-[60] flex h-full w-72 flex-col gap-4 overflow-y-auto bg-[#0a0a1c] p-4 lg:hidden" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}>
          <div className="flex items-center justify-between"><Logo /><button aria-label="Close menu" onClick={() => setDrawer(false)} className="rounded-lg p-2"><FaTimes /></button></div>
          <SideNav onNavigate={() => setDrawer(false)} /><div className="mt-auto"><OnlineCounter /></div>
        </motion.aside></>)}</AnimatePresence>

      <div className={`relative z-10 transition-[padding] duration-300 ${collapsed ? 'lg:pl-[84px]' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-white/10 bg-[#080817]/80 px-3 py-2.5 backdrop-blur-xl md:px-6">
          <button className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10 lg:hidden" aria-label="Open menu" onClick={() => setDrawer(true)}><FaBars /></button>
          <div className="lg:hidden"><Logo small /></div>
          <button onClick={() => setSearch(true)} className="glass-flat ml-2 hidden h-11 flex-1 items-center gap-3 px-4 text-left text-sm text-mute hover:border-[var(--a1)] md:flex md:max-w-xl" aria-label="Open search">
            <FaSearch />Search games, streamers, or anything…<kbd className="ml-auto rounded border border-white/20 px-1.5 text-xs">Ctrl + K</kbd></button>
          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <span className="hidden rounded-full border border-laser/30 bg-laser/10 px-2.5 py-1 text-[11px] font-bold text-laser xl:flex xl:items-center xl:gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-laser" />COMMUNITY ONLINE</span>
            <button onClick={() => setSearch(true)} className="grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10 md:hidden" aria-label="Search"><FaSearch /></button>
            <Link to="/live" className="btn btn-sm btn-primary hidden sm:inline-flex"><span className="live-dot" />LIVE</Link>
            <button onClick={() => nav('/store?cart=1')} className="relative grid h-11 w-11 place-items-center rounded-xl hover:bg-white/10" aria-label={`Cart, ${cartCount} items`}><FaShoppingCart />
              {cartCount > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--a1)] px-1 text-[10px] font-bold">{cartCount}</span>}</button>
            <Notifications /><ProfileMenu />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main key={loc.pathname} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1500px] p-3 md:p-6">
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      <Toasts />
    </div>
  );
}

function Footer() {
  const links = ['About', 'Privacy', 'Terms', 'Support', 'Contact'];
  const soc = ['Discord', 'YouTube', 'Telegram', 'Instagram', 'X'];
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-[#080817]/80 px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-5 lg:flex-row">
        <div className="flex items-center gap-3"><Logo /><span className="grad-text font-bold">Play. Stream. Compete.</span></div>
        <nav className="flex flex-wrap justify-center gap-5 text-sm text-mute" aria-label="Footer">{links.map((l) => <Link key={l} to="/news" className="hover:text-white">{l}</Link>)}</nav>
        <div className="flex gap-2">{soc.map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()} className="chip" aria-label={s}>{s}</a>)}</div>
        <div className="flex items-center gap-4 text-xs text-mute">© 2026 VYRON. All rights reserved.
          <button className="btn btn-primary btn-sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div>
      </div>
    </footer>
  );
}
