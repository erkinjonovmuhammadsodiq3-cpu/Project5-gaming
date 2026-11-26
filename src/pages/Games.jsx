import { useMemo, useState } from 'react';
import { FaSearch, FaGamepad, FaFire, FaRocket } from 'react-icons/fa';
import { Empty, PageHead, Reveal, SectionHead, SkeletonGrid, useLoading } from '../components/ui.jsx';
import { GameCard } from '../components/cards.jsx';
import { GAMES, GENRES } from '../data.js';

const SORTS = { Popularity: (a, b) => b.players - a.players, Rating: (a, b) => b.rating - a.rating, Newest: (a, b) => b.year - a.year, 'A–Z': (a, b) => a.title.localeCompare(b.title) };

export default function Games() {
  const [q, setQ] = useState(''); const [genre, setGenre] = useState('All'); const [plat, setPlat] = useState('All');
  const [mode, setMode] = useState('All'); const [sort, setSort] = useState('Popularity'); const [minR, setMinR] = useState(0); const [year, setYear] = useState('All');
  const [limit, setLimit] = useState(24);
  const loading = useLoading(700);
  const list = useMemo(() => GAMES.filter((g) =>
    (genre === 'All' || g.genre === genre) && (plat === 'All' || g.platforms.includes(plat)) &&
    (mode === 'All' || g.mode === mode || g.mode === 'Both') && g.rating >= minR &&
    (year === 'All' || (year === '2024+' ? g.year >= 2024 : year === '2020–2023' ? g.year >= 2020 && g.year < 2024 : g.year < 2020)) &&
    g.title.toLowerCase().includes(q.toLowerCase())).sort(SORTS[sort]), [q, genre, plat, mode, sort, minR, year]);
  const filtered = q || genre !== 'All' || plat !== 'All' || mode !== 'All' || minR || year !== 'All';
  const sel = 'input !w-auto';
  const rail = (title, icon, arr) => (
    <Reveal><SectionHead icon={icon} title={title} />
      <div tabIndex={0} className="no-sb mb-8 flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing">{arr.map((g) => <div key={g.id} className="w-[180px] shrink-0"><GameCard g={g} compact /></div>)}</div></Reveal>);
  return (
    <>
      <PageHead title="GAME UNIVERSE" sub={`Browse ${GAMES.length} games across every genre. Downloads always go to the official publisher or store.`} tags={['FPS', 'RPG', 'MOBA', 'RACING', '#TOP', 'NEW']} art="🎮" />
      <div className="glass sticky top-[68px] z-20 mb-6 flex flex-wrap items-center gap-3 p-3">
        <label className="glass-flat flex min-w-[220px] flex-1 items-center gap-2 px-3"><FaSearch className="text-mute" /><input className="h-11 w-full bg-transparent outline-none" placeholder="Search games…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search games" /></label>
        <select aria-label="Platform" className={sel} value={plat} onChange={(e) => setPlat(e.target.value)}>{['All', 'PC', 'Console', 'Mobile'].map((x) => <option key={x} value={x}>{x === 'All' ? 'All platforms' : x}</option>)}</select>
        <select aria-label="Mode" className={sel} value={mode} onChange={(e) => setMode(e.target.value)}>{['All', 'Multi', 'Single'].map((x) => <option key={x} value={x}>{x === 'All' ? 'Any mode' : x === 'Multi' ? 'Multiplayer' : 'Single-player'}</option>)}</select>
        <select aria-label="Release year" className={sel} value={year} onChange={(e) => setYear(e.target.value)}>{['All', '2024+', '2020–2023', 'Before 2020'].map((x) => <option key={x} value={x}>{x === 'All' ? 'Any year' : x}</option>)}</select>
        <select aria-label="Minimum rating" className={sel} value={minR} onChange={(e) => setMinR(+e.target.value)}>{[0, 7, 8, 9].map((x) => <option key={x} value={x}>{x ? `${x}.0+ rating` : 'Any rating'}</option>)}</select>
        <select aria-label="Sort" className={sel} value={sort} onChange={(e) => setSort(e.target.value)}>{Object.keys(SORTS).map((x) => <option key={x}>{x}</option>)}</select>
      </div>
      <div className="no-sb mb-6 flex gap-2 overflow-x-auto">{['All', ...GENRES].map((g) => <button key={g} className={`chip ${genre === g ? 'on' : ''}`} onClick={() => setGenre(g)}>{g}</button>)}</div>
      {!filtered && !loading && (<>
        {rail('Featured Games', FaGamepad, GAMES.filter((g) => g.rating >= 9.3).slice(0, 10))}
        {rail('Trending Now', FaFire, [...GAMES].sort((a, b) => b.players - a.players).slice(0, 10))}
        {rail('Recently Released', FaRocket, [...GAMES].filter((g) => g.year >= 2024).slice(0, 10))}
      </>)}
      <SectionHead icon={FaGamepad} title={filtered ? `${list.length} results` : 'All Games'} sub={`Sorted by ${sort.toLowerCase()}`} />
      {loading ? <SkeletonGrid n={12} h={340} cols="grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6" /> : list.length === 0 ? <Empty /> : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">{list.slice(0, limit).map((g) => <GameCard key={g.id} g={g} />)}</div>
          {limit < list.length && <div className="mt-8 text-center"><button className="btn btn-primary" onClick={() => setLimit(limit + 24)}>Load more ({list.length - limit})</button></div>}
        </>)}
    </>
  );
}
