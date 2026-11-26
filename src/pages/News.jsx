import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Empty, PageHead, Tabs } from '../components/ui.jsx';
import { NewsCard } from '../components/cards.jsx';
import { NEWS } from '../data.js';

export default function News() {
  const cats = ['All', ...new Set(NEWS.map((n) => n.cat))]; const [cat, setCat] = useState('All'); const [q, setQ] = useState('');
  const list = NEWS.filter((n) => (cat === 'All' || n.cat === cat) && n.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ '--a1': '#ff3d81', '--a2': '#ff9d32' }}>
      <PageHead title="GAMING NEWS" sub="Updates, esports results, releases and industry announcements." tags={['PATCH', 'BREAKING', 'RELEASE', 'ESPORTS']} art="📰" />
      <div className="mb-6 flex flex-wrap items-center gap-3"><Tabs tabs={cats} value={cat} onChange={setCat} /><label className="glass-flat ml-auto flex items-center gap-2 px-3"><FaSearch className="text-mute" /><input className="h-11 bg-transparent outline-none" placeholder="Search news" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search news" /></label></div>
      {list.length === 0 ? <Empty /> : <div className="space-y-5"><NewsCard n={list[0]} big /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{list.slice(1).map((n) => <NewsCard key={n.id} n={n} />)}</div></div>}
    </div>
  );
}
