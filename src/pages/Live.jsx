import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaVideo, FaFire, FaStar, FaHistory } from 'react-icons/fa';
import { Avatar, Cover, LiveBadge, PageHead, Reveal, SectionHead, Tabs, SkeletonGrid, useLoading } from '../components/ui.jsx';
import { StreamCard } from '../components/cards.jsx';
import { GAMES, STREAMERS, fmt, gameById } from '../data.js';
import { useStore } from '../store.jsx';

export default function Live() {
  const { follows, toggleFollow } = useStore();
  const [cat, setCat] = useState('All'); const loading = useLoading(700);
  const cats = ['All', ...new Set(STREAMERS.map((s) => gameById(s.game)?.genre))];
  const list = STREAMERS.filter((s) => cat === 'All' || gameById(s.game)?.genre === cat);
  const f = STREAMERS[0], fg = gameById(f.game);
  return (
    <>
      <PageHead title="LIVE ARENA" sub="Watch top streamers, chat in real time and follow your favorites." tags={['LIVE', 'CLUTCH', 'GG', 'RANKED', '🔴']} art="📡">
        <Link to="/live/studio" className="btn btn-primary"><FaVideo />Go Live</Link>
      </PageHead>
      <Reveal><section className="neon-border glass relative mb-8 grid overflow-hidden lg:grid-cols-[1.6fr_1fr]">
        <Link to={`/live/${f.id}`} className="relative block aspect-video lg:aspect-auto lg:min-h-[340px]"><Cover seed={f.id + f.game} colors={fg.colors} label={fg.title} image={fg.coverUrl} big /><div className="scanlines absolute inset-0" /><div className="absolute left-4 top-4"><LiveBadge viewers={fmt(f.viewers)} /></div></Link>
        <div className="flex flex-col justify-center gap-3 p-6"><span className="chip w-fit">Featured streamer</span>
          <div className="flex items-center gap-3"><Avatar name={f.name} size={60} ring live /><div><h2 className="text-3xl font-bold">{f.name}</h2><p className="text-sm text-mute">{fmt(f.followers)} followers</p></div></div>
          <p className="text-mute">{f.title} · {fg.title}</p>
          <div className="flex gap-3"><Link to={`/live/${f.id}`} className="btn btn-primary">Watch now</Link><button className="btn btn-ghost" onClick={() => toggleFollow(f.id)}>{follows.includes(f.id) ? 'Following ✓' : 'Follow'}</button></div></div>
      </section></Reveal>
      <SectionHead icon={FaFire} title="Trending live streams" action={<Tabs tabs={cats} value={cat} onChange={setCat} />} />
      {loading ? <SkeletonGrid n={6} h={230} cols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3" /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((s) => <StreamCard key={s.id} s={s} />)}</div>}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="glass p-5"><SectionHead icon={FaStar} title="Followed streamers" />
          {follows.length === 0 && <p className="text-sm text-mute">Follow streamers to see them here.</p>}
          {STREAMERS.filter((s) => follows.includes(s.id)).map((s) => <Link key={s.id} to={`/live/${s.id}`} className="glass-flat mb-2 flex items-center gap-3 p-2"><Avatar name={s.name} live /><b className="flex-1">{s.name}</b><span className="text-xs text-red-400">● LIVE</span></Link>)}</div>
        <div className="glass p-5"><SectionHead icon={FaFire} title="Popular categories" /><div className="flex flex-wrap gap-2">{GAMES.slice(0, 14).map((g) => <Link key={g.id} to={`/games/${g.id}`} className="chip">{g.title}</Link>)}</div></div>
        <div className="glass p-5"><SectionHead icon={FaHistory} title="Recently watched" />{STREAMERS.slice(4, 8).map((s) => <Link key={s.id} to={`/live/${s.id}`} className="glass-flat mb-2 flex items-center gap-3 p-2"><Avatar name={s.name} /><div className="min-w-0"><b>{s.name}</b><div className="truncate text-xs text-mute">{s.title}</div></div></Link>)}</div>
      </div>
    </>
  );
}
