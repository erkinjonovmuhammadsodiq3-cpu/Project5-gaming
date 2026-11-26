import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaUsers } from 'react-icons/fa';
import { Avatar, Countdown, Cover, Empty, Tabs } from '../components/ui.jsx';
import { TStatus } from '../components/cards.jsx';
import { TOURNAMENTS, gameById } from '../data.js';
import { useStore } from '../store.jsx';

const TEAMS = ['Nova Esports', 'Silent Wolves', 'Crimson Tide', 'Pixel Pirates', 'Apex Hunters', 'Neon Ronin', 'Iron Phoenix', 'Aurora Five'];

function Bracket() {
  // Interactive single-elim: click a team to advance it.
  const [r1, setR1] = useState([null, null, null, null]); const [r2, setR2] = useState([null, null]); const [fin, setFin] = useState(null);
  const pick = (setter, arr, i, v) => setter(arr.map((x, j) => (j === i ? v : x)));
  const Match = ({ a, b, win, onPick }) => (
    <div className="glass-flat w-44 overflow-hidden text-sm">{[a, b].map((t, i) => (
      <button key={i} disabled={!t} onClick={() => onPick(t)} className={`flex w-full items-center justify-between px-3 py-2 text-left transition ${win === t && t ? 'bg-[var(--a1)]/40 font-bold' : 'hover:bg-white/10'} ${i ? 'border-t border-white/10' : ''} disabled:opacity-40`}>
        <span className="truncate">{t || 'TBD'}</span>{win === t && t && <FaTrophy className="text-amber-300" />}</button>))}</div>);
  const q = [0, 1, 2, 3].map((i) => [TEAMS[i * 2], TEAMS[i * 2 + 1]]);
  return (
    <div className="no-sb overflow-x-auto"><div className="flex min-w-[640px] items-center justify-around gap-6 py-4">
      <div className="flex flex-col gap-4">{q.map(([a, b], i) => <Match key={i} a={a} b={b} win={r1[i]} onPick={(v) => { pick(setR1, r1, i, v); setR2([null, null]); setFin(null); }} />)}</div>
      <div className="flex flex-col gap-16">{[0, 1].map((i) => <Match key={i} a={r1[i * 2]} b={r1[i * 2 + 1]} win={r2[i]} onPick={(v) => { pick(setR2, r2, i, v); setFin(null); }} />)}</div>
      <div className="text-center"><Match a={r2[0]} b={r2[1]} win={fin} onPick={setFin} />{fin && <div className="mt-3 font-display font-bold text-amber-300">🏆 {fin}</div>}</div>
    </div><p className="text-xs text-mute">Click a team to advance it (demo bracket).</p></div>
  );
}

export default function TournamentDetail() {
  const { id } = useParams(); const t = TOURNAMENTS.find((x) => x.id === id);
  const { joinedT, toggleT, toast, teams, createTeam, teamRegistrations, registerTeam, leaveTeamRegistration } = useStore();
  const [tab, setTab] = useState('Bracket'); const [team, setTeam] = useState('');
  if (!t) return <Empty title="Tournament not found" />;
  const g = gameById(t.game), joined = joinedT.includes(t.id);
  const pay = [['1st', 0.5], ['2nd', 0.25], ['3rd', 0.15], ['4th', 0.1]];
  return (
    <div style={{ '--a1': '#ff9d32', '--a2': '#ff3d81' }}>
      <section className="neon-border glass relative mb-6 overflow-hidden"><div className="absolute inset-0 opacity-40"><Cover seed={t.id} colors={['#ff9d32', '#8b5cf6']} label={g.title} big /></div><div className="absolute inset-0 bg-gradient-to-t from-[#080817]" />
        <div className="relative p-6 pt-24 md:p-10 md:pt-32"><TStatus s={t.status} /><h1 className="font-display mt-2 text-3xl font-black md:text-5xl grad-text">{t.name}</h1>
          <p className="text-mute">{g.title} · {t.type} · <FaUsers className="inline" /> {t.teams}/{t.slots}</p>
          <div className="mt-4 flex flex-wrap items-center gap-8"><div className="font-display text-4xl font-black text-amber-300">${t.prize.toLocaleString()}</div>{t.status === 'upcoming' && <Countdown target={t.start} />}
            <button disabled={t.status === 'completed'} className="btn btn-primary" onClick={() => toggleT(t.id)}>{joined ? 'Registered ✓' : 'Join Tournament'}</button></div></div></section>
      <div className="mb-5"><Tabs tabs={['Bracket', 'Rules', 'Schedule', 'Teams', 'Leaderboard', 'Prizes']} value={tab} onChange={setTab} /></div>
      <div className="glass p-5">
        {tab === 'Bracket' && <Bracket />}
        {tab === 'Rules' && <ul className="list-disc space-y-2 pl-5 text-mute"><li>All players must have an active VYRON account and verified game ID.</li><li>Teams check in 30 minutes before the match.</li><li>Cheating, smurfing or toxic behaviour leads to disqualification.</li><li>Admins settle disputes; decisions are final.</li></ul>}
        {tab === 'Schedule' && <div className="space-y-2">{['Check-in', 'Round of 8', 'Semi-finals', 'Grand Final'].map((r, i) => <div key={r} className="glass-flat flex justify-between p-3"><b>{r}</b><span className="text-mute">{new Date(t.start + i * 36e5 * 3).toLocaleString()}</span></div>)}</div>}
        {tab === 'Teams' && <div>
          <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (createTeam(team, g.id)) setTeam(''); }}>
            <input className="input" placeholder="Create your own team" value={team} onChange={(e) => setTeam(e.target.value)} aria-label="Team name" />
            <button className="btn btn-primary shrink-0">Create team</button>
          </form>
          {teams.length > 0 && <div className="mb-4"><h3 className="mb-2 font-bold">My teams</h3><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((x) => {
              const registered = teamRegistrations[t.id] === x.id;
              return <div key={x.id} className="glass-flat p-3"><div className="flex items-center gap-2"><Avatar name={x.name} /><b className="truncate">{x.name}</b></div><button className={`btn btn-sm mt-3 w-full ${registered ? 'btn-ghost' : 'btn-primary'}`} onClick={() => registered ? leaveTeamRegistration(t.id) : registerTeam(t.id, x.id)}>{registered ? 'Registered ✓ (cancel)' : 'Register team'}</button></div>;
            })}
          </div></div>}
          {teamRegistrations[t.id] && <p className="mb-3 text-sm text-laser">Registered with {teams.find((x) => x.id === teamRegistrations[t.id])?.name || 'your team'}.</p>}
          <h3 className="mb-2 font-bold">Tournament teams</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{TEAMS.map((x) => <div key={x} className="glass-flat flex items-center gap-2 p-3"><Avatar name={x} />{x}</div>)}</div>
        </div>}
        {tab === 'Leaderboard' && <table className="w-full text-left text-sm"><thead className="text-mute"><tr><th className="p-2">#</th><th>Team</th><th>W</th><th>L</th><th>Pts</th></tr></thead><tbody>{TEAMS.map((x, i) => <tr key={x} className="border-t border-white/10"><td className="p-2 font-bold">{i + 1}</td><td>{x}</td><td>{8 - i}</td><td>{i}</td><td className="font-bold">{(8 - i) * 3}</td></tr>)}</tbody></table>}
        {tab === 'Prizes' && <div className="grid gap-3 sm:grid-cols-4">{pay.map(([p, f]) => <div key={p} className="glass-flat p-4 text-center"><FaTrophy className="mx-auto text-2xl text-amber-300" /><div className="font-bold">{p}</div><div className="font-display text-xl">${(t.prize * f).toLocaleString()}</div></div>)}</div>}
      </div>
    </div>
  );
}
