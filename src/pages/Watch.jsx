import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle, FaExpand, FaVolumeUp, FaVolumeMute, FaPlay, FaPause, FaPaperPlane, FaHeart, FaShare } from 'react-icons/fa';
import { Avatar, Cover, Empty, LiveBadge, YouTubeEmbed } from '../components/ui.jsx';
import { StreamCard } from '../components/cards.jsx';
import { STREAMERS, fmt, gameById } from '../data.js';
import { useStore } from '../store.jsx';
import { STREAM_CONFIG } from '../services/streaming.js';

const BOTS = ['ShadowFrost', 'GamexUz', 'PixelDream', 'NovaQueen', 'RaceKing', 'LunaPlays'];
const MSGS = ['Insane play! 🔥', "Let's goooo", 'GG', 'What a clutch!', 'W streamer', 'No way 😱', 'LUL', 'Prediction: win', 'Nice aim', 'Hello from Tashkent 👋'];

export default function Watch() {
  const { id } = useParams(); const s = STREAMERS.find((x) => x.id === id);
  const { follows, toggleFollow, user, toast } = useStore();
  const [chat, setChat] = useState([]); const [msg, setMsg] = useState(''); const [playing, setPlaying] = useState(true); const [muted, setMuted] = useState(true);
  const [viewers, setViewers] = useState(s?.viewers || 0); const box = useRef(null); const stage = useRef(null);
  useEffect(() => {
    if (!s) return; setViewers(s.viewers); setChat([]);
    const i = setInterval(() => { setChat((c) => [...c.slice(-60), { u: BOTS[(Math.random() * BOTS.length) | 0], m: MSGS[(Math.random() * MSGS.length) | 0], bot: true, k: Math.random() }]); setViewers((v) => v + Math.round((Math.random() - 0.4) * 30)); }, 1800);
    return () => clearInterval(i);
  }, [s]);
  useEffect(() => { box.current?.scrollTo({ top: 1e6 }); }, [chat]);
  if (!s) return <Empty title="Stream not found" />;
  const g = gameById(s.game), on = follows.includes(s.id);
  const send = (e) => { e.preventDefault(); if (!msg.trim()) return; setChat((c) => [...c, { u: user.name, m: msg.trim().slice(0, 200), me: true, k: Math.random() }]); setMsg(''); };
  return (
    <div style={{ '--a1': '#00d9ff', '--a2': '#8b5cf6' }} className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div>
        <div ref={stage} className="neon-border glass relative aspect-video overflow-hidden bg-black">
          {playing ? (
            <YouTubeEmbed query={`${g.title} live gameplay ${s.title}`} title={`${s.name} live stream`} />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-black/70"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/20"><FaPlay /></span></div>
          )}
          <div className="scanlines absolute inset-0" />
          <div className="absolute left-4 top-4 flex gap-2"><LiveBadge viewers={fmt(viewers)} /></div>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 p-3">
            <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'} className="grid h-10 w-10 place-items-center rounded-full bg-white/10">{playing ? <FaPause /> : <FaPlay />}</button>
            <button onClick={() => setMuted(!muted)} aria-label="Mute" className="grid h-10 w-10 place-items-center rounded-full bg-white/10">{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>
            <span className="flex-1 text-xs text-mute">{STREAM_CONFIG.configured ? 'Connected to ' + STREAM_CONFIG.provider : 'Connect LiveKit/Mux in services/streaming.js for a real stream'}</span>
            <button onClick={() => stage.current?.requestFullscreen?.()} aria-label="Fullscreen" className="grid h-10 w-10 place-items-center rounded-full bg-white/10"><FaExpand /></button></div>
        </div>
        <div className="glass mt-4 flex flex-wrap items-center gap-4 p-4">
          <Avatar name={s.name} size={56} ring live /><div className="min-w-[180px] flex-1"><h1 className="text-2xl font-bold">{s.title}</h1><div className="flex items-center gap-1 text-sm text-mute"><b className="text-white">{s.name}</b>{s.verified && <FaCheckCircle className="text-cyber" />} · <Link className="underline" to={`/games/${g.id}`}>{g.title}</Link> · {fmt(s.followers)} followers</div></div>
          <button className={`btn ${on ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(s.id)}><FaHeart />{on ? 'Following' : 'Follow'}</button>
          <button className="btn btn-ghost" onClick={() => toast('Subscriptions need the backend (Stripe) — coming soon', 'info')}>Subscribe</button>
          <button className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied'); }}><FaShare />Share</button>
        </div>
        <h2 className="mb-3 mt-8 text-2xl font-bold">Related streams</h2>
        <div className="grid gap-4 md:grid-cols-3">{STREAMERS.filter((x) => x.id !== s.id).slice(0, 3).map((x) => <StreamCard key={x.id} s={x} />)}</div>
      </div>
      <aside className="glass flex h-[560px] flex-col p-3 xl:sticky xl:top-[76px] xl:h-[calc(100vh-100px)]" aria-label="Live chat">
        <h2 className="mb-2 border-b border-white/10 pb-2 text-center font-bold">Live Chat</h2>
        <div ref={box} className="flex-1 space-y-1.5 overflow-y-auto pr-1 text-sm">{chat.map((c) => <div key={c.k}><b style={{ color: c.me ? '#a3ff4f' : '#00d9ff' }}>{c.u}</b> <span className="text-mute">{c.m}</span></div>)}</div>
        <form onSubmit={send} className="mt-2 flex gap-2"><input className="input" placeholder="Send a message" value={msg} onChange={(e) => setMsg(e.target.value)} aria-label="Chat message" maxLength={200} /><button className="btn btn-primary" aria-label="Send"><FaPaperPlane /></button></form>
      </aside>
    </div>
  );
}
