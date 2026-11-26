import { useState } from 'react';
import { PageHead, Tabs, Empty } from '../components/ui.jsx';
import { CourseCard } from '../components/cards.jsx';
import { COURSES } from '../data.js';

export default function Academy() {
  const cats = ['All', ...new Set(COURSES.map((c) => c.cat))]; const [cat, setCat] = useState('All'); const [lv, setLv] = useState('All');
  const list = COURSES.filter((c) => (cat === 'All' || c.cat === cat) && (lv === 'All' || c.level === lv));
  return (
    <div style={{ '--a1': '#00d9ff', '--a2': '#a855f7' }}>
      <PageHead title="VYRON ACADEMY" sub="Learn from pro players: aim, strategy, game sense and advanced techniques." tags={['AIM', 'STRATS', 'PRO TIPS', 'GUIDE']} art="🎓" />
      <div className="mb-6 flex flex-wrap items-center gap-3"><Tabs tabs={cats} value={cat} onChange={setCat} /><select className="input !w-auto" value={lv} onChange={(e) => setLv(e.target.value)} aria-label="Level">{['All', 'Beginner', 'Intermediate', 'Advanced'].map((x) => <option key={x}>{x}</option>)}</select></div>
      {list.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{list.map((c) => <CourseCard key={c.id} c={c} />)}</div> : <Empty />}
    </div>
  );
}
