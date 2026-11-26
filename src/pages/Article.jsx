import { useParams } from 'react-router-dom';
import { FaShare } from 'react-icons/fa';
import { Cover, Empty } from '../components/ui.jsx';
import { NewsCard } from '../components/cards.jsx';
import { NEWS, gameById } from '../data.js';
import { useStore } from '../store.jsx';

export default function Article() {
  const { id } = useParams(); const n = NEWS.find((x) => x.id === id); const { toast } = useStore();
  if (!n) return <Empty title="Article not found" />;
  const g = gameById(n.game);
  return (
    <article style={{ '--a1': '#ff3d81', '--a2': '#ff9d32' }} className="mx-auto max-w-4xl">
      <div className="neon-border glass aspect-[21/9] overflow-hidden"><Cover seed={n.id} colors={g.colors} label={g.title} image={g?.coverUrl} big /></div>
      <span className="chip mt-6">{n.cat}</span><h1 className="font-display mt-3 text-3xl font-black md:text-4xl grad-text">{n.title}</h1>
      <p className="mt-2 text-sm text-mute">By {n.author} · {n.date}</p>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#d4d4e8]"><p>{n.sum}</p><p>This is demo article text. Connect your CMS (Sanity, Strapi, Supabase) through the data layer to publish real stories, and replace this body with rich content.</p><p>Fans of {g.title} can follow the game page, streams and tournaments on VYRON for the latest updates as they happen.</p></div>
      <div className="mt-6 flex gap-2">{['Copy link', 'X', 'Telegram'].map((s) => <button key={s} className="btn btn-ghost btn-sm" onClick={() => { if (s === 'Copy link') navigator.clipboard?.writeText(location.href); toast(s === 'Copy link' ? 'Link copied' : `Share to ${s} (demo)`); }}><FaShare />{s}</button>)}</div>
      <h2 className="mb-3 mt-10 text-2xl font-bold">Related articles</h2><div className="grid gap-4 sm:grid-cols-3">{NEWS.filter((x) => x.id !== n.id).slice(0, 3).map((x) => <NewsCard key={x.id} n={x} />)}</div>
    </article>
  );
}
