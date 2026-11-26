import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaPlay, FaExternalLinkAlt, FaUsers, FaBroadcastTower, FaTrophy } from 'react-icons/fa';
import { Cover, Empty, Rating, SectionHead, Tabs, Avatar, YouTubeEmbed } from '../components/ui.jsx';
import { GameCard, StreamCard } from '../components/cards.jsx';
import { GAMES, STREAMERS, TOURNAMENTS, fmtPlayers, gameById } from '../data.js';
import { useStore } from '../store.jsx';

const REVIEWS = [['AzizGG', 5, 'Incredible depth. Hundreds of hours in and still learning.'], ['LunaPlays', 4, 'Great game, a few balance issues but updates are frequent.'], ['RaceKing', 5, 'Best in its genre for me. Community is awesome.']];

export default function GameDetail() {
  const { id } = useParams(); const g = gameById(id);
  const { favs, toggleFav } = useStore();
  const [tab, setTab] = useState('Overview'); const [trailer, setTrailer] = useState(false);
  if (!g) return <Empty title="Game not found" sub="It may have been removed from the catalog." />;
  const fav = favs.includes(g.id);
  const similar = GAMES.filter((x) => x.genre === g.genre && x.id !== g.id).slice(0, 6);
  const streams = STREAMERS.filter((s) => s.game === g.id);
  const tours = TOURNAMENTS.filter((t) => t.game === g.id);
  const req = [['OS', 'Windows 10 64-bit'], ['CPU', 'Intel Core i5 / Ryzen 5'], ['RAM', '8 GB (16 GB recommended)'], ['GPU', 'GTX 1060 / RX 580'], ['Storage', '50 GB SSD']];
  return (
    <div style={{ '--a1': g.colors[0], '--a2': g.colors[1] }}>
      <section className="neon-border glass relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 blur-sm"><Cover seed={g.id} colors={g.colors} label={g.title} image={g.coverUrl} big /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080817] via-[#080817]/80 to-transparent" />
        <div className="relative grid gap-6 p-6 md:grid-cols-[240px_1fr] md:p-10">
          <div className="mx-auto aspect-[3/4] w-48 overflow-hidden rounded-2xl shadow-[0_0_50px_var(--a1)] md:w-full"><Cover seed={g.id} colors={g.colors} label={g.title} image={g.coverUrl} big /></div>
          <div className="flex flex-col justify-end">
            <span className="chip w-fit">{g.genre} · {g.year}</span>
            <h1 className="font-display mt-3 text-3xl font-black md:text-5xl grad-text">{g.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm"><Rating v={g.rating} /><span className="text-mute"><FaUsers className="mr-1 inline" />{fmtPlayers(g.players)} players (demo est.)</span><span className="text-mute">{g.platforms.join(' · ')}</span><span className="text-mute">{g.mode === 'Both' ? 'Single & Multiplayer' : g.mode === 'Multi' ? 'Multiplayer' : 'Single-player'}</span></div>
            <p className="mt-3 max-w-2xl text-mute">{g.desc} Explore streams, tournaments and guides for {g.title} on VYRON.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={g.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><FaExternalLinkAlt />Official site / Download</a>
              <button className="btn btn-ghost" onClick={() => setTrailer(true)}><FaPlay />Trailer</button>
              <button className="btn btn-ghost" onClick={() => toggleFav(g.id)} aria-pressed={fav}>{fav ? <FaHeart className="text-pink" /> : <FaRegHeart />}{fav ? 'Favorited' : 'Favorite'}</button>
            </div>
          </div>
        </div>
      </section>
      {trailer && <div className="glass mt-4 p-4"><div className="relative aspect-video overflow-hidden rounded-xl bg-black"><YouTubeEmbed query={`${g.title} official trailer gameplay`} title={`${g.title} trailer`} /><div className="scanlines pointer-events-none absolute inset-0" /></div></div>}
      <div className="my-6"><Tabs tabs={['Overview', 'Screenshots', 'System Requirements', 'Reviews', 'Streams & Tournaments']} value={tab} onChange={setTab} /></div>
      <div className="glass p-5">
        {tab === 'Overview' && <div className="grid gap-4 md:grid-cols-3">{[['Gameplay', g.desc], ['Modes', g.mode === 'Both' ? 'Single-player and online multiplayer' : g.mode === 'Multi' ? 'Online multiplayer' : 'Single-player campaign'], ['Platforms', g.platforms.join(', ')]].map(([t, d]) => <div key={t} className="glass-flat p-4"><h3 className="text-lg font-bold">{t}</h3><p className="text-sm text-mute">{d}</p></div>)}</div>}
        {tab === 'Screenshots' && <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="aspect-video overflow-hidden rounded-xl transition hover:scale-105"><Cover seed={g.id + i} colors={g.colors} label={g.title} /></div>)}<p className="col-span-full text-xs text-mute">Placeholder art — connect official press-kit screenshots via the data layer.</p></div>}
        {tab === 'System Requirements' && <div className="grid gap-2 sm:grid-cols-2">{req.map(([k, v]) => <div key={k} className="glass-flat flex justify-between p-3 text-sm"><b>{k}</b><span className="text-mute">{v}</span></div>)}<p className="col-span-full text-xs text-mute">Typical values for demo. Check the official page for exact requirements.</p></div>}
        {tab === 'Reviews' && <div className="space-y-3">{REVIEWS.map(([u, r, t]) => <div key={u} className="glass-flat flex gap-3 p-3"><Avatar name={u} /><div><b>{u}</b> <Rating v={r} /><p className="text-sm text-mute">{t}</p></div></div>)}</div>}
        {tab === 'Streams & Tournaments' && <div className="grid gap-6 md:grid-cols-2"><div><SectionHead icon={FaBroadcastTower} title="Live streams" />{streams.length ? streams.map((s) => <StreamCard key={s.id} s={s} />) : <Empty title="No live demo streams" sub="Check the Live page." />}</div>
          <div><SectionHead icon={FaTrophy} title="Tournaments" />{tours.length ? tours.map((t) => <Link key={t.id} to={`/tournaments/${t.id}`} className="glass-flat mb-2 block p-3"><b>{t.name}</b> <span className="text-amber-300">${t.prize.toLocaleString()}</span></Link>) : <Empty title="No tournaments yet" />}</div></div>}
      </div>
      <div className="mt-8"><SectionHead title="Similar games" /><div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">{similar.map((x) => <GameCard key={x.id} g={x} compact />)}</div></div>
    </div>
  );
}
