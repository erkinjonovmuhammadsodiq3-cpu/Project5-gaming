import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { Avatar, Empty, Rating, YouTubeEmbed } from '../components/ui.jsx';
import { CourseCard } from '../components/cards.jsx';
import { COURSES, gameById } from '../data.js';
import { useStore } from '../store.jsx';

const LESSON_VIDEO_IDS = {
  c0: ['bJ1Flcla3SE', 'Fp3k9WRJupY', 'GdbP0N7wmFY', 'F74qK2UBybc', 'F74qK2UBybc', 'pMXjsO3NE6w', 'bJ1Flcla3SE', 'Bcxoi0SU2-w'],
  c1: ['PuDTZfIaXiA', 'NDIY4sBFyNo', 'MaVsnwh8SqA', 'hwVhTQdjW_8', 'MaVsnwh8SqA', 'sh39q4YToU4', '5TdG2bGIB2w', 'ydpEF-MSK2M'],
  c2: ['aUskpepWlf8', 't5gOWycM484', 'wLfu1-ZdC-Q', 'zOj0K-kFq8Q', 'FiqiMV2u7Qo', 'AO2otvWt_mc', 'FiqiMV2u7Qo', 'T9r6kjVBTok'],
  c3: ['sG9g9-9uPNc', 'uwRFkDuj5rY', 'uwRFkDuj5rY', 'zq2PaeGRRTg', 'Ei22iabSaRU', 'BUL4YvIM12s', 'uwRFkDuj5rY', 'PrPEWVHNkPw'],
  c4: ['-9V-6hY0HuU', 'kqp_pvsMlDQ', 'BNHYjtk3iIs', 'egycCBDrxSA', 'egycCBDrxSA', 'BNHYjtk3iIs', 'MWSRp4gAp6o', 'joTCPPhISkw'],
  c5: ['bUudx1cPiAA', '6zq0Q4Viy3Q', 'I2YUodxTqnY', 'BaK4B6ZN7LM', 'tC1QDZhPDJY', 'n00boKX69Fo', '-1Sy6iz43vg', 'olakF9Xbisc'],
  c6: ['KGcCXEEP-u8', 'L7mYevtyWQ0', 'EDyMH4-n318', 'F2541LAjF-I', '8UuzwPpcaSM', 'xgWqQ4XdYW4', 'HnsxbwbLxJg', 'KGcCXEEP-u8'],
  c7: ['9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ', '9ZLQCRs3WVQ'],
  c8: ['T3b5dZIuq1Q', 'NDIY4sBFyNo', 'MaVsnwh8SqA', 'hwVhTQdjW_8', '5TdG2bGIB2w', 'ydpEF-MSK2M', '5TdG2bGIB2w', 'ydpEF-MSK2M'],
};

export default function CourseDetail() {
  const { id } = useParams(); const c = COURSES.find((x) => x.id === id);
  const [done, setDone] = useState([]); const [cur, setCur] = useState(0);
  const { courseVideos } = useStore();
  if (!c) return <Empty title="Course not found" />;
  const g = gameById(c.game); const lessons = Array.from({ length: c.lessons }, (_, i) => `Lesson ${i + 1}: ${['Fundamentals', 'Positioning', 'Practice routine', 'Common mistakes', 'Pro examples', 'Advanced drills', 'Review', 'Final challenge'][i % 8]}`);
  const videoId = LESSON_VIDEO_IDS[c.id]?.[cur % 8];
  const pct = Math.round((done.length / lessons.length) * 100);
  return (
    <div style={{ '--a1': '#00d9ff', '--a2': '#a855f7' }} className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div>
        <div className="neon-border glass relative aspect-video overflow-hidden bg-black">
          <YouTubeEmbed
            query={videoId ? `https://www.youtube.com/watch?v=${videoId}` : `${g.title} ${lessons[cur].replace(/^Lesson \d+: /, '')} tutorial lesson`}
            title={lessons[cur]}
          />
          <button className="absolute bottom-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-black/70 backdrop-blur" aria-label="Mark lesson complete" onClick={() => setDone((d) => (d.includes(cur) ? d : [...d, cur]))}><FaCheckCircle className="text-laser" /></button>
          <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 text-xs">{lessons[cur]}</span>
        </div>
        <h1 className="mt-5 text-3xl font-bold">{c.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-mute"><span className="flex items-center gap-2"><Avatar name={c.creator} size={28} />{c.creator}</span><Rating v={c.rating} /><span>{c.level}</span><span>{c.dur}</span></div>
        <p className="mt-4 max-w-2xl text-mute">Master {g.title} with a structured, step-by-step course. Watch each lesson, apply the drills in-game and track your progress.</p>
        <div className="mt-8"><h2 className="mb-3 text-2xl font-bold">Related courses</h2><div className="grid gap-4 sm:grid-cols-2">{COURSES.filter((x) => x.id !== c.id).slice(0, 2).map((x) => <CourseCard key={x.id} c={x} />)}</div></div>
      </div>
      <aside className="glass h-fit p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Lessons</h2><span className="text-sm text-mute">{pct}% complete</span></div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full transition-all duration-500" style={{ width: pct + '%', background: 'linear-gradient(90deg,var(--a1),var(--a2))' }} /></div>
        {lessons.map((l, i) => <button key={l} onClick={() => setCur(i)} className={`mb-1.5 flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition ${cur === i ? 'bg-[var(--a1)]/25 ring-1 ring-[var(--a1)]' : 'hover:bg-white/5'}`}>
          {done.includes(i) ? <FaCheckCircle className="text-laser" /> : courseVideos[c.id]?.[i] ? <FaCheckCircle className="text-cyber" /> : <FaRegCircle className="text-mute" />}
          <span className="flex-1">{l}</span>
          {courseVideos[c.id]?.[i] && <span className="text-[10px] text-cyber">VIDEO</span>}
        </button>)}</aside>
    </div>
  );
}
