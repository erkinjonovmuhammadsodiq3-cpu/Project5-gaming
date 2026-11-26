import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTrophy } from 'react-icons/fa';
import { Countdown, Empty, PageHead, Reveal, Tabs } from '../components/ui.jsx';
import { TournamentCard } from '../components/cards.jsx';
import { TOURNAMENTS, gameById } from '../data.js';
import { useStore } from '../store.jsx';

export default function Tournaments() {
  const [tab, setTab] = useState('All'); const [q, setQ] = useState(''); const [game, setGame] = useState('all'); const [prize, setPrize] = useState(0);
  const { joinedT, toggleT } = useStore();
  const f = TOURNAMENTS[0];
  const list = TOURNAMENTS.filter((t) => (tab === 'All' || t.status === tab.toLowerCase()) && (game === 'all' || t.game === game) && t.prize >= prize && t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHead title="ESPORTS ARENA" sub="Compete in open tournaments, build your team and win prize pools." tags={['$$$', '5v5', '1v1', 'BRACKET', 'MVP']} art="🏆" />
      <Reveal><section className="neon-border glass relative mb-8 overflow-hidden p-6 md:p-10">
        <div className="absolute -right-10 -top-10 h-80 w-80 rounded-full blur-3xl opacity-50" style={{ background: 'var(--a1)' }} />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div><span className="chip">Featured championship</span><h2 className="font-display mt-3 text-3xl font-black md:text-5xl grad-text">{f.name}</h2>
            <p className="mt-1 text-mute">{gameById(f.game).title} · {f.type} · {f.teams}/{f.slots} teams</p>
            <div className="mt-3 font-display text-5xl font-black text-amber-300 drop-shadow-[0_0_20px_#ff9d32]">${f.prize.toLocaleString()}</div>
            <div className="mt-4"><Countdown target={f.start} /></div>
            <div className="mt-5 flex gap-3"><button className="btn btn-primary" onClick={() => toggleT(f.id)}>{joinedT.includes(f.id) ? 'Registered ✓' : 'Join Tournament'}</button><Link to={`/tournaments/${f.id}`} className="btn btn-ghost">Details</Link></div></div>
          <FaTrophy className="floaty hidden text-[10rem] text-amber-300 md:block" style={{ filter: 'drop-shadow(0 0 30px #ff9d32)' }} />
        </div></section></Reveal>
      <div className="glass mb-6 flex flex-wrap items-center gap-3 p-3">
        <Tabs tabs={['All', 'Live', 'Upcoming', 'Completed']} value={tab} onChange={setTab} />
        <label className="glass-flat ml-auto flex items-center gap-2 px-3"><FaSearch className="text-mute" /><input className="h-11 bg-transparent outline-none" placeholder="Search tournaments" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tournaments" /></label>
        <select className="input !w-auto" value={game} onChange={(e) => setGame(e.target.value)} aria-label="Game"><option value="all">All games</option>{[...new Set(TOURNAMENTS.map((t) => t.game))].map((g) => <option key={g} value={g}>{gameById(g).title}</option>)}</select>
        <select className="input !w-auto" value={prize} onChange={(e) => setPrize(+e.target.value)} aria-label="Prize pool">{[[0, 'Any prize'], [10000, '$10K+'], [25000, '$25K+'], [50000, '$50K+']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      {list.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{list.map((t) => <TournamentCard key={t.id} t={t} />)}</div> : <Empty />}
    </>
  );
}
