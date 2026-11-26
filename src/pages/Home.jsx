import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FaGamepad, FaTrophy, FaUsers, FaPlay, FaBroadcastTower, FaGraduationCap, FaNewspaper, FaStar, FaChevronLeft, FaChevronRight, FaApple, FaGooglePlay, FaCheckCircle, FaFire, FaArrowRight, FaCrown, FaHeadset, FaCrosshairs, FaBolt } from 'react-icons/fa';
import { Avatar, Counter, Countdown, Cover, LiveBadge, Reveal, SectionHead, Tilt, useLoading, SkeletonGrid } from '../components/ui.jsx';
import { GameCard, NewsCard, CourseCard } from '../components/cards.jsx';
import { GAMES, GENRES, STREAMERS, TOURNAMENTS, COURSES, NEWS, COMMUNITIES, gameById, fmt, ACHIEVEMENTS } from '../data.js';
import { useStore } from '../store.jsx';

function HeroCharacter() {
  return (
    <svg viewBox="0 0 400 460" className="h-full w-full drop-shadow-[0_0_40px_rgba(139,92,246,.6)]" aria-label="VYRON gamer character">
      <defs>
        <linearGradient id="hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a1a5e" /><stop offset="1" stopColor="#0b0824" /></linearGradient>
        <linearGradient id="rim" x1="0" x2="1"><stop offset="0" stopColor="#00d9ff" /><stop offset="1" stopColor="#a855f7" /></linearGradient>
        <radialGradient id="halo"><stop offset="0" stopColor="#8b5cf6" stopOpacity=".7" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="200" cy="210" r="190" fill="url(#halo)" />
      <path d="M268 40a110 110 0 1 0 0 190a85 85 0 1 1 0-190z" fill="none" stroke="#a855f7" strokeWidth="7" opacity=".85" />
      <path d="M40 460c0-120 50-190 160-200s160 80 160 200z" fill="url(#hood)" stroke="url(#rim)" strokeWidth="3" />
      <path d="M95 210c0-85 45-150 105-150s105 65 105 150c0 60-40 95-105 95S95 270 95 210z" fill="url(#hood)" stroke="url(#rim)" strokeWidth="4" />
      <path d="M135 205c0-45 28-70 65-70s65 25 65 70c0 40-28 62-65 62s-65-22-65-62z" fill="#05040f" />
      <path d="M150 195l40 10h20l40-10-8 22h-84z" fill="#00d9ff" opacity=".9"><animate attributeName="opacity" values=".9;.5;.9" dur="3s" repeatCount="indefinite" /></path>
      <path d="M160 245h80l-10 22h-60z" fill="#1c1540" />
      <path d="M200 330l-34-48h18l16 24 16-24h18z" fill="url(#rim)" />
      <path d="M120 150c-20 20-26 50-24 80M280 150c20 20 26 50 24 80" stroke="#a855f7" strokeWidth="3" fill="none" opacity=".7" />
    </svg>
  );
}

function Hero() {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 }), sy = useSpring(my, { stiffness: 80, damping: 20 });
  const x1 = useTransform(sx, [-1, 1], [-24, 24]), y1 = useTransform(sy, [-1, 1], [-14, 14]);
  const x2 = useTransform(sx, [-1, 1], [30, -30]), y2 = useTransform(sy, [-1, 1], [18, -18]);
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width - 0.5) * 2); my.set(((e.clientY - r.top) / r.height - 0.5) * 2); };
  const tags = [['GAME ON!', '58%', '14%', 'text-pink', -8], ['#CLUTCH', '40%', '66%', 'text-cyber', 5], ['GG WP', '82%', '58%', 'text-laser', -4], ['LEVEL UP', '66%', '82%', 'text-energy', 6]];
  return (
    <section onMouseMove={onMove} className="neon-border glass relative min-h-[520px] overflow-hidden p-6 md:p-10 xl:pr-[390px]">
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(60% 80% at 60% 40%, rgba(139,92,246,.45), transparent 70%), radial-gradient(40% 50% at 90% 90%, rgba(0,217,255,.3), transparent 70%)' }} />
      <motion.div style={{ x: x1, y: y1 }} className="absolute bottom-0 right-[18%] hidden h-[98%] w-[380px] md:block xl:right-[32%]"><HeroCharacter /></motion.div>
      <motion.div style={{ x: x2, y: y2 }} className="floaty absolute left-[48%] top-[12%] hidden text-7xl text-violet drop-shadow-[0_0_20px_#8b5cf6] lg:block" aria-hidden="true"><FaGamepad /></motion.div>
      <motion.div style={{ x: x2, y: y1 }} className="floaty absolute right-[26%] top-[55%] hidden text-5xl text-amber-300 drop-shadow-[0_0_18px_#ff9d32] xl:block" aria-hidden="true"><FaTrophy /></motion.div>
      <motion.div style={{ x: x1, y: y2 }} className="floaty absolute right-[44%] top-[70%] hidden text-5xl text-cyber drop-shadow-[0_0_18px_#00d9ff] xl:block" aria-hidden="true"><FaHeadset /></motion.div>
      {tags.map(([t, l, tp, c, r], i) => <span key={t} className={`floaty absolute hidden font-display text-lg font-black md:block ${c}`} style={{ left: l, top: tp, '--r': `${r}deg`, animationDelay: `${i * 0.8}s`, textShadow: '0 0 16px currentColor' }}>{t}</span>)}

      <div className="relative max-w-xl">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-4xl font-black italic leading-[1.05] sm:text-5xl md:text-6xl">
          ENTER THE<br /><span className="grad-text text-5xl sm:text-6xl md:text-7xl">GAMING UNIVERSE</span></motion.h1>
        <h2 className="mt-5 text-2xl font-bold">Play. Stream. Compete. Connect.</h2>
        <p className="mt-2 max-w-md text-mute">The ultimate gaming universe where players, streamers and esports unite. Experience next-level entertainment.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/games" className="btn btn-primary">Explore Universe <FaArrowRight /></Link>
          <Link to="/live" className="btn btn-ghost"><FaPlay />Watch Live</Link>
        </div>
        <div className="mt-6 flex items-center gap-3 text-sm text-mute"><div className="flex -space-x-2">{['Z', 'F', 'N', 'S'].map((n) => <Avatar key={n} name={n} size={34} />)}</div>5M+ Active Gamers</div>
      </div>
      <LiveNowCard />
    </section>
  );
}

function LiveNowCard() {
  const s = STREAMERS[0], g = gameById(s.game);
  const { follows, toggleFollow } = useStore();
  const lines = [['ShadowFrost', 'Insane play! 🔥'], ['GamexUz', "Let's goo!"], ['PixelDream', 'GG 💜'], ['DotaKing', 'What a clutch!'], ['NovaQueen', 'ACE incoming'], ['RaceKing', 'W streamer']];
  const [chat, setChat] = useState(lines.slice(0, 4));
  useEffect(() => { let i = 4; const t = setInterval(() => { setChat((c) => [...c.slice(-3), lines[i++ % lines.length]]); }, 2600); return () => clearInterval(t); }, []); // eslint-disable-line
  const on = follows.includes(s.id);
  return (
    <aside className="glass relative mt-8 w-full p-3 xl:absolute xl:right-5 xl:top-5 xl:mt-0 xl:w-[340px]" aria-label="Live now preview">
      <div className="mb-2 flex items-center justify-between px-1 text-sm font-bold"><span className="flex items-center gap-2"><span className="live-dot" />Live Now</span><span className="text-xs text-mute">◈ {fmt(s.viewers)}</span></div>
      <Link to={`/live/${s.id}`} className="relative block aspect-video overflow-hidden rounded-xl"><Cover seed={s.id + s.game} colors={g.colors} label={g.title} image={g.coverUrl} /><div className="scanlines absolute inset-0" /><div className="absolute right-2 top-2"><LiveBadge /></div></Link>
      <div className="mt-3 flex items-center gap-3"><Avatar name={s.name} size={42} ring live /><div className="min-w-0 flex-1"><div className="flex items-center gap-1 font-bold">{s.name}<FaCheckCircle className="text-xs text-cyber" /></div><div className="truncate text-xs text-mute">{s.title}</div></div>
        <button className={`btn btn-sm ${on ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(s.id)}>{on ? 'Following' : 'Follow'}</button></div>
      <div className="mt-3 h-[112px] space-y-1.5 overflow-hidden rounded-xl bg-black/30 p-2 text-xs" aria-live="off">
        {chat.map(([u, m], i) => <motion.div key={u + m + i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}><b className="text-cyber">{u}</b> <span className="text-mute">{m}</span></motion.div>)}
      </div>
      <Link to={`/live/${s.id}`} className="btn btn-ghost btn-sm mt-3 w-full">Join the Stream <FaArrowRight /></Link>
    </aside>
  );
}

function Stats() {
  const items = [[FaGamepad, 100, '+', 'Games', 'text-violet'], [FaTrophy, 50, '+', 'Tournaments', 'text-amber-300'], [FaUsers, 5, 'M+', 'Community Members', 'text-pink'], [FaPlay, 10, 'M+', 'Streams Watched', 'text-cyber']];
  return (
    <Reveal><div className="glass neon-border grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">
      {items.map(([I, n, s, l, c]) => (
        <div key={l} className="flex items-center gap-3"><I className={`text-4xl ${c} drop-shadow-[0_0_14px_currentColor]`} /><div><div className="font-display text-2xl font-black"><Counter to={n} suffix={s} /></div><div className="text-xs text-mute">{l}</div></div></div>))}
    </div></Reveal>
  );
}

function TopGames() {
  const [genre, setGenre] = useState('All');
  const loading = useLoading(600);
  const list = (genre === 'All' ? GAMES.filter((g) => g.rating >= 9) : GAMES.filter((g) => g.genre === genre)).slice(0, 14);
  const rail = useRef(null);
  const scroll = (d) => rail.current?.scrollBy({ left: d * 600, behavior: 'smooth' });
  return (
    <Reveal><section className="glass p-5" aria-labelledby="tg">
      <SectionHead icon={FaGamepad} title="Top Games" sub="Discover the most popular games in the community" action={<Link to="/games" className="btn btn-ghost btn-sm">View All Games</Link>} />
      <div className="no-sb mb-4 flex gap-2 overflow-x-auto">{['All', ...GENRES].map((g) => <button key={g} className={`chip ${genre === g ? 'on' : ''}`} onClick={() => setGenre(g)}>{g}</button>)}</div>
      {loading ? <SkeletonGrid n={6} h={300} /> : (
        <div className="relative">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="absolute left-2 top-1/3 z-10 hidden h-10 w-10 place-items-center rounded-full bg-[#10111f] ring-1 ring-white/20 shadow-lg md:grid"><FaChevronLeft /></button>
          <div ref={rail} tabIndex={0} onWheel={(e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) rail.current.scrollLeft += e.deltaY; }} className="no-sb flex cursor-grab snap-x gap-4 overflow-x-auto pb-2 active:cursor-grabbing">{list.map((g) => <div key={g.id} className="w-[185px] shrink-0 snap-start"><GameCard g={g} compact /></div>)}</div>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="absolute right-2 top-1/3 z-10 hidden h-10 w-10 place-items-center rounded-full bg-[#10111f] ring-1 ring-white/20 shadow-lg md:grid"><FaChevronRight /></button>
        </div>)}
    </section></Reveal>
  );
}

function LiveSection() {
  const [f, ...rest] = STREAMERS; const g = gameById(f.game);
  const { follows, toggleFollow } = useStore();
  return (
    <Reveal className="h-full"><section className="glass h-full p-5" style={{ '--a1': '#00d9ff', '--a2': '#8b5cf6' }}>
      <SectionHead icon={FaBroadcastTower} title="Live Streams" sub="Watch the best streamers live" action={<Link to="/live" className="btn btn-ghost btn-sm">View All</Link>} />
      <div className="grid gap-4 lg:grid-cols-5">
        <Link to={`/live/${f.id}`} className="relative aspect-video overflow-hidden rounded-2xl lg:col-span-3 lg:aspect-auto lg:min-h-[240px]"><Cover seed={f.id + f.game} colors={g.colors} label={g.title} image={g.coverUrl} /><div className="scanlines absolute inset-0" />
          <div className="absolute left-3 top-3"><LiveBadge viewers={fmt(f.viewers)} /></div>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 p-3"><Avatar name={f.name} ring /><div className="flex-1"><b>{f.name}</b><div className="text-xs text-mute">{f.title}</div></div>
            <button className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault(); toggleFollow(f.id); }}>{follows.includes(f.id) ? 'Following' : 'Follow'}</button></div></Link>
        <div className="space-y-2 lg:col-span-2">{rest.slice(0, 3).map((s) => (
          <Link key={s.id} to={`/live/${s.id}`} className="glass-flat flex items-center gap-3 p-2.5 transition hover:border-[var(--a1)]"><Avatar name={s.name} live /><div className="min-w-0 flex-1"><div className="font-bold">{s.name}</div><div className="truncate text-xs text-mute">{gameById(s.game)?.title}</div></div><span className="text-sm font-semibold">{fmt(s.viewers)}</span></Link>))}</div>
      </div>
    </section></Reveal>
  );
}

function TournamentSection() {
  const t = TOURNAMENTS[0]; const { joinedT, toggleT } = useStore();
  return (
    <Reveal className="h-full"><section className="neon-border glass relative h-full overflow-hidden p-5" style={{ '--a1': '#ff9d32', '--a2': '#a855f7' }}>
      <div className="absolute -right-10 top-10 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgba(139,92,246,.4)' }} />
      <SectionHead icon={FaTrophy} title="Tournaments" sub="Join epic tournaments and win prizes" action={<Link to="/tournaments" className="btn btn-ghost btn-sm">View All</Link>} />
      <div className="relative grid items-center gap-4 sm:grid-cols-2">
        <div><div className="font-display text-xl font-black italic grad-text">{t.name.toUpperCase()}</div>
          <div className="mt-2 font-display text-4xl font-black text-amber-300 drop-shadow-[0_0_18px_#ff9d32]">${t.prize.toLocaleString()}</div><div className="text-xs font-bold tracking-widest text-mute">PRIZE POOL</div>
          <div className="mt-4"><Countdown target={t.start} size="sm" /></div>
          <button className="btn btn-primary mt-4" onClick={() => toggleT(t.id)}>{joinedT.includes(t.id) ? 'Registered ✓' : 'Join Tournament'}</button></div>
        <motion.div animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity }} className="grid place-items-center"><FaTrophy className="text-[9rem] text-violet drop-shadow-[0_0_40px_#8b5cf6]" style={{ filter: 'drop-shadow(0 0 30px #a855f7) drop-shadow(0 0 10px #ff9d32)' }} /></motion.div>
      </div>
    </section></Reveal>
  );
}

function ClipperSection() {
  const [play, setPlay] = useState(false);
  return (
    <Reveal className="h-full"><section className="glass h-full p-5" style={{ '--a1': '#ff9d32', '--a2': '#ff3d81' }}>
      <SectionHead icon={FaStar} title="Top Clipper" sub="Best clips this week" />
      <button onClick={() => setPlay(!play)} className="relative block aspect-video w-full overflow-hidden rounded-2xl text-left" aria-label="Play clip">
        <Cover seed="clip-1v4" colors={['#ff3d81', '#8b5cf6']} label="1v4" big /><div className="scanlines absolute inset-0" />
        {play && <div className="absolute inset-0 grid place-items-end bg-black/30"><div className="h-1.5 w-full bg-white/20"><motion.div className="h-full bg-[var(--a2)]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 45, ease: 'linear' }} /></div></div>}
        <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur">{play ? '❚❚' : <FaPlay />}</span></span>
        <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 text-xs">00:45</span></button>
      <div className="mt-3 flex items-center justify-between"><div><b>Insane 1v4 Clutch! 🔥</b><div className="text-xs text-mute">by ZenixPlay · 1.2M views · CS2</div></div></div>
    </section></Reveal>
  );
}

function ProfilePreview() {
  const { user } = useStore();
  const st = [['Followers', '12.4K'], ['Following', '218'], ['Games', '86'], ['Tournaments', '14']];
  return (
    <Reveal><section className="glass p-5">
      <div className="flex flex-wrap items-center gap-5">
        <Avatar name={user.name} size={72} ring /><div className="min-w-[200px] flex-1"><div className="flex items-center gap-2 text-xl font-bold">{user.name}<FaCheckCircle className="text-cyber" /></div>
          <div className="mt-1 flex items-center gap-2 text-xs text-mute">Lv. {user.level}<div className="h-2 w-40 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,var(--a1),var(--a2))' }} initial={{ width: 0 }} whileInView={{ width: `${user.xp}%` }} transition={{ duration: 1.2 }} /></div>{user.xp}% XP</div></div>
        <div className="grid flex-[2] grid-cols-4 gap-2 text-center">{st.map(([l, v]) => <div key={l} className="glass-flat p-2"><div className="font-display text-lg font-bold">{v}</div><div className="text-[11px] text-mute">{l}</div></div>)}</div>
        <div className="flex gap-1 text-xl">{[FaTrophy, FaCrosshairs, FaBolt, FaCrown].map((Icon, i) => <span key={i} className="grid h-10 w-10 place-items-center rounded-xl bg-white/5"><Icon /></span>)}</div>
        <Link to="/profile" className="btn btn-ghost btn-sm">{ACHIEVEMENTS.length} achievements →</Link>
      </div>
    </section></Reveal>
  );
}

function Community() {
  const { joinedC, toggleC } = useStore();
  return (
    <Reveal className="h-full"><section className="glass h-full p-5" style={{ '--a1': '#a3ff4f', '--a2': '#00d9ff' }}>
      <SectionHead icon={FaUsers} title="Community" sub="Join millions of gamers worldwide" />
      <div className="flex -space-x-3">{['Aziz', 'Bek', 'Cora', 'Dani', 'Eli', 'Fay', 'Gus'].map((n) => <Avatar key={n} name={n} size={46} ring />)}</div>
      <ul className="mt-4 space-y-2">{COMMUNITIES.slice(0, 3).map((c) => <li key={c.id} className="glass-flat flex items-center justify-between p-2.5 text-sm"><span><b>{c.name}</b><span className="ml-2 text-xs text-mute">{fmt(c.members)}</span></span>
        <button className={`btn btn-sm ${joinedC.includes(c.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleC(c.id)}>{joinedC.includes(c.id) ? 'Joined' : 'Join'}</button></li>)}</ul>
      <Link to="/community" className="btn btn-primary mt-4 w-full">Join Community <FaArrowRight /></Link>
    </section></Reveal>
  );
}

function AppCTA() {
  const nav = useNavigate(); const { toast } = useStore();
  return (
    <Reveal className="h-full"><section className="neon-border glass relative h-full overflow-hidden p-6">
      <div className="relative z-10 max-w-[55%]"><h2 className="text-3xl font-black">Download<br />VYRON App</h2><p className="mt-2 text-mute">Play anywhere, anytime!</p>
        <div className="mt-4 flex flex-col gap-2">
          <button className="btn btn-ghost justify-start" onClick={() => toast('iOS app: coming soon', 'info')}><FaApple className="text-xl" />App Store</button>
          <button className="btn btn-ghost justify-start" onClick={() => toast('Android app: coming soon', 'info')}><FaGooglePlay />Google Play</button></div></div>
      <motion.div animate={{ y: [0, -10, 0], rotate: [8, 12, 8] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-4 top-6 grid h-64 w-36 place-items-center rounded-[2rem] border-4 border-[#2a2750] bg-gradient-to-br from-violet via-[#2b1b7a] to-cyber shadow-[0_0_50px_#8b5cf6]">
        <span className="font-display text-4xl font-black">V</span></motion.div>

    </section></Reveal>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <Stats />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]"><TopGames /><AppCTA /></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr_.8fr]"><LiveSection /><TournamentSection />
        <Reveal className="h-full"><section className="glass h-full p-5" style={{ '--a1': '#00d9ff', '--a2': '#a855f7' }}>
          <SectionHead icon={FaGraduationCap} title="Video Academy" sub="Learn. Improve. Be Pro" action={<Link to="/academy" className="btn btn-ghost btn-sm">View All</Link>} />
          <div className="space-y-2">{COURSES.slice(0, 3).map((c) => <Link key={c.id} to={`/academy/${c.id}`} className="glass-flat flex items-center gap-3 p-2 transition hover:border-[var(--a1)]">
            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg"><Cover seed={c.id} colors={gameById(c.game).colors} label={gameById(c.game).title} /><span className="absolute inset-0 grid place-items-center"><FaPlay className="text-sm" /></span></div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{c.title}</div><div className="text-xs text-mute">by {c.creator} · {c.dur}</div></div></Link>)}</div>
        </section></Reveal></div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr_.8fr]">
        <Reveal className="h-full"><section className="glass h-full p-5" style={{ '--a1': '#ff3d81', '--a2': '#ff9d32' }}>
          <SectionHead icon={FaNewspaper} title="Gaming News" sub="Latest updates from the gaming world" action={<Link to="/news" className="btn btn-ghost btn-sm">View All</Link>} />
          <div className="grid gap-3 sm:grid-cols-3">{NEWS.slice(0, 3).map((n) => <Link key={n.id} to={`/news/${n.id}`} className="group block"><div className="aspect-video overflow-hidden rounded-xl"><div className="h-full transition-transform duration-700 group-hover:scale-110"><Cover seed={n.id} colors={gameById(n.game).colors} label={gameById(n.game).title} image={gameById(n.game)?.coverUrl} /></div></div><h3 className="mt-2 text-sm font-bold leading-tight">{n.title}</h3><p className="text-xs text-mute">{n.date}</p></Link>)}</div>
        </section></Reveal>
        <Community /><ClipperSection />
      </div>
      <ProfilePreview />
     
    </div>
  );
}
