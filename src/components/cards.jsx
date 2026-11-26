import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaPlay, FaDownload, FaUsers, FaTrophy, FaClock, FaShoppingCart } from 'react-icons/fa';
import { Avatar, Cover, LiveBadge, Rating, Tilt, Countdown } from './ui.jsx';
import { useStore } from '../store.jsx';
import { gameById, fmt, fmtPlayers } from '../data.js';

export function GameCard({ g, compact }) {
  const { favs, toggleFav } = useStore();
  const fav = favs.includes(g.id);
  return (
    <Tilt max={7} className="h-full">
      <article className="glass glow-card group relative h-full overflow-hidden">
        <Link to={`/games/${g.id}`} className="block" aria-label={g.title}>
          <div className={`relative overflow-hidden ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-110"><Cover seed={g.id} colors={g.colors} label={g.title} image={g.coverUrl} /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#080817] via-transparent to-transparent" />
            <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">{g.genre}</span>
          </div>
        </Link>
        <button onClick={() => toggleFav(g.id)} aria-pressed={fav} aria-label={fav ? 'Remove favorite' : 'Add favorite'}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur transition hover:scale-110">
          {fav ? <FaHeart className="text-pink" /> : <FaRegHeart />}
        </button>
        <div className="p-3">
          <h3 className="truncate text-lg font-bold leading-tight">{g.title}</h3>
          <p className="text-xs text-mute">{g.genre} · {g.year}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <Rating v={g.rating} /><span className="inline-flex items-center gap-1 text-mute"><FaUsers />{fmtPlayers(g.players)}</span>
          </div>
          {!compact && <p className="mt-2 line-clamp-2 text-xs text-mute">{g.desc}</p>}
          <a href={g.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm mt-3 w-full"><FaDownload />Official Store</a>
        </div>
      </article>
    </Tilt>
  );
}

export function StreamCard({ s, big }) {
  const { follows, toggleFollow } = useStore();
  const g = gameById(s.game), on = follows.includes(s.id);
  return (
    <article className="glass glow-card group overflow-hidden">
      <Link to={`/live/${s.id}`} className="relative block aspect-video overflow-hidden" aria-label={`Watch ${s.name}`}>
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110"><Cover seed={s.id + s.game} colors={g?.colors} label={g?.title} image={g?.coverUrl} /></div>
        <div className="scanlines absolute inset-0" />
        <div className="absolute left-2 top-2"><LiveBadge viewers={fmt(s.viewers)} /></div>
        <span className="absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/20 backdrop-blur"><FaPlay /></span></span>
      </Link>
      <div className="flex items-center gap-3 p-3">
        <Avatar name={s.name} size={big ? 48 : 38} ring live />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold leading-tight">{s.title}</h3>
          <p className="truncate text-xs text-mute">{s.name} · {g?.title}</p>
        </div>
        <button className={`btn btn-sm ${on ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(s.id)} aria-pressed={on}>{on ? 'Following' : 'Follow'}</button>
      </div>
    </article>
  );
}

export const TStatus = ({ s }) => {
  const m = { live: 'bg-red-500/90', upcoming: 'bg-cyber/90 text-black', completed: 'bg-white/20' }[s];
  return <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${m}`}>{s}</span>;
};

export function TournamentCard({ t }) {
  const { joinedT, toggleT } = useStore();
  const g = gameById(t.game), joined = joinedT.includes(t.id);
  return (
    <article className="glass glow-card group overflow-hidden">
      <Link to={`/tournaments/${t.id}`} className="relative block h-36 overflow-hidden">
        <div className="h-full transition-transform duration-700 group-hover:scale-110"><Cover seed={t.id} colors={['#ff9d32', '#ff3d81']} label={g?.title} image={g?.coverUrl} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080817] to-transparent" />
        <span className="absolute left-3 top-3"><TStatus s={t.status} /></span>
        <FaTrophy className="absolute right-3 top-3 text-3xl text-amber-300 drop-shadow-[0_0_12px_#ff9d32]" />
      </Link>
      <div className="p-4">
        <h3 className="text-xl font-bold">{t.name}</h3>
        <p className="text-sm text-mute">{g?.title} · {t.type}</p>
        <div className="mt-3 flex items-end justify-between">
          <div><div className="text-[11px] text-mute">Prize pool</div><div className="font-display text-xl font-bold text-amber-300">${t.prize.toLocaleString()}</div></div>
          <div className="text-right text-xs text-mute"><FaUsers className="mr-1 inline" />{t.teams}/{t.slots} teams<br />{new Date(t.start).toLocaleDateString()}</div>
        </div>
        <button disabled={t.status === 'completed'} onClick={() => toggleT(t.id)} className={`btn btn-sm mt-3 w-full ${joined ? 'btn-ghost' : 'btn-primary'} disabled:opacity-40`}>
          {t.status === 'completed' ? 'Finished' : joined ? 'Registered ✓ (cancel)' : 'Join Tournament'}
        </button>
      </div>
    </article>
  );
}

export function NewsCard({ n, big }) {
  const g = gameById(n.game);
  return (
    <Link to={`/news/${n.id}`} className={`glass glow-card group block overflow-hidden ${big ? 'md:flex' : ''}`}>
      <div className={`overflow-hidden ${big ? 'md:w-1/2 aspect-video md:aspect-auto md:min-h-[260px]' : 'aspect-video'}`}>
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110"><Cover seed={n.id} colors={g?.colors} label={g?.title} image={g?.coverUrl} /></div>
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-center gap-2 text-xs"><span className="rounded-md px-2 py-0.5 font-bold" style={{ background: 'color-mix(in srgb, var(--a2) 30%, transparent)' }}>{n.cat}</span><span className="text-mute">{n.date}</span></div>
        <h3 className={`mt-2 font-bold leading-tight ${big ? 'text-3xl' : 'text-lg'}`}>{n.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-mute">{n.sum}</p>
      </div>
    </Link>
  );
}

export function CourseCard({ c }) {
  const g = gameById(c.game);
  const lv = { Beginner: 'text-laser', Intermediate: 'text-energy', Advanced: 'text-pink' }[c.level];
  return (
    <Link to={`/academy/${c.id}`} className="glass glow-card group block overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <div className="h-full transition-transform duration-700 group-hover:scale-110"><Cover seed={c.id} colors={g?.colors} label={g?.title} image={g?.coverUrl} /></div>
        <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-black/50 backdrop-blur transition group-hover:scale-125 group-hover:bg-[var(--a1)]"><FaPlay /></span></span>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 text-xs"><FaClock className="mr-1 inline" />{c.dur}</span>
      </div>
      <div className="p-3">
        <h3 className="font-bold leading-tight">{c.title}</h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-mute"><Avatar name={c.creator} size={22} />{c.creator}</div>
        <div className="mt-2 flex items-center justify-between text-xs"><span className={`font-bold ${lv}`}>{c.level}</span><Rating v={c.rating} /></div>
      </div>
    </Link>
  );
}

export function ProductCard({ p }) {
  const { addCart, wish, toggleWish } = useStore();
  const w = wish.includes(p.id);
  return (
    <article className="glass glow-card group relative overflow-hidden">
      <div className="aspect-square overflow-hidden"><div className="h-full transition-transform duration-700 group-hover:scale-110"><Cover seed={p.id} colors={p.colors} label={p.name} image={p.image} big /></div></div>
      <button onClick={() => toggleWish(p.id)} aria-pressed={w} aria-label="Wishlist" className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur">{w ? <FaHeart className="text-pink" /> : <FaRegHeart />}</button>
      <div className="p-3">
        <p className="text-xs text-mute">{p.cat}</p><h3 className="font-bold leading-tight">{p.name}</h3>
        <div className="mt-2 flex items-center justify-between"><span className="font-display text-lg font-bold">${p.price}</span><Rating v={p.rating} /></div>
        <button className="btn btn-primary btn-sm mt-3 w-full" onClick={() => addCart(p.id)}><FaShoppingCart />Add to cart</button>
      </div>
    </article>
  );
}

export { Countdown };
