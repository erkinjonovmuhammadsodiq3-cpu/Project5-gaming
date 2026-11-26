import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegComment, FaShare, FaUsers, FaFire, FaPlus, FaImage, FaVideo, FaTimes, FaPlay } from 'react-icons/fa';
import { Avatar, PageHead, SectionHead, Modal, Cover, MediaVideo } from '../components/ui.jsx';
import { COMMUNITIES, POSTS, STREAMERS, fmt, gameById } from '../data.js';
import { useStore } from '../store.jsx';
import { saveMedia } from '../services/media.js';

export default function Community() {
  const { liked, toggleLike, joinedC, toggleC, follows, toggleFollow, user, toast, stories, addStory, addProfilePost } = useStore();
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vyron:communityPosts')) || POSTS; } catch { return POSTS; }
  });
  const [text, setText] = useState('');
  const [open, setOpen] = useState(null);
  const [cmts, setCmts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vyron:communityComments')) || {}; } catch { return {}; }
  });
  const [cm, setCm] = useState('');
  const [image, setImage] = useState('');
  const [storyImage, setStoryImage] = useState('');
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyViewer, setStoryViewer] = useState(null);
  const [postVideo, setPostVideo] = useState('');
  const [activePost, setActivePost] = useState(null);
  useEffect(() => {
    try { localStorage.setItem('vyron:communityPosts', JSON.stringify(posts)); } catch { /* storage unavailable */ }
  }, [posts]);
  useEffect(() => {
    try { localStorage.setItem('vyron:communityComments', JSON.stringify(cmts)); } catch { /* storage unavailable */ }
  }, [cmts]);
  const readImage = (file, setValue) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      toast('Choose an image smaller than 2 MB', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue(reader.result);
    reader.readAsDataURL(file);
  };
  const readVideo = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) return toast('Choose a video file', 'info');
    try { setPostVideo(await saveMedia(file)); } catch (error) { toast(error.message, 'info'); }
  };
  const post = (e) => {
    e.preventDefault();
    if (!text.trim() && !image && !postVideo) return toast('Write something or add photo/video', 'info');
    const next = { id: Date.now(), user: user.name, game: 'counter-strike-2', text: text.trim(), image, video: postVideo, likes: 0, comments: 0, time: 'now' };
    setPosts([next, ...posts]);
    addProfilePost(next);
    setText('');
    setImage('');
    setPostVideo('');
  };
  const publishStory = () => {
    if (!storyImage) return toast('Add a photo for your story', 'info');
    addStory({ image: storyImage, title: text.trim() || 'Today in game' });
    setStoryImage('');
    setText('');
    setStoryOpen(false);
  };
  const c = open && COMMUNITIES.find((x) => x.id === open);
  return (
    <div style={{ '--a1': '#a3ff4f', '--a2': '#00d9ff' }}>
      <PageHead title="COMMUNITY HUB" sub="Post clips, find teammates and join groups built around the games you love." tags={['LFG', '#CLIPS', 'SQUAD', 'GG']} art="💬" />
      <section className="glass mb-5 p-4">
        <div className="no-sb flex gap-3 overflow-x-auto">
          <button onClick={() => setStoryOpen(true)} className="shrink-0 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-[var(--a1)] bg-white/5"><FaPlus /></span>
            <span className="mt-1 block text-xs font-bold">Your story</span>
          </button>
          {stories.map((story) => (
            <button key={story.id} onClick={() => setStoryViewer(story)} className="shrink-0 text-center">
              <span className="mx-auto block h-16 w-16 overflow-hidden rounded-full ring-2 ring-[var(--a1)] ring-offset-2 ring-offset-[#080817]">
                <img src={story.image} alt="" className="h-full w-full object-cover" />
              </span>
              <span className="mt-1 block max-w-20 truncate text-xs font-bold">{story.title}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <form onSubmit={post} className="glass p-4">
            <div className="flex gap-3"><Avatar name={user.name} /><textarea className="input min-h-[80px]" placeholder="Share a clip, a tip or look for a team…" value={text} onChange={(e) => setText(e.target.value)} aria-label="New post" maxLength={400} /></div>
            {image && <div className="mt-3 relative aspect-[21/8] overflow-hidden rounded-xl"><img src={image} alt="Post preview" className="h-full w-full object-cover" /><button type="button" onClick={() => setImage('')} aria-label="Remove image" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70"><FaTimes /></button></div>}
            {postVideo && <div className="mt-3 relative aspect-[21/8] overflow-hidden rounded-xl"><MediaVideo src={postVideo} className="h-full w-full object-cover" /><button type="button" onClick={() => setPostVideo('')} aria-label="Remove video" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70"><FaTimes /></button></div>}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex gap-2"><label className="btn btn-ghost btn-sm cursor-pointer"><FaImage />Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setImage)} /></label><label className="btn btn-ghost btn-sm cursor-pointer"><FaVideo />Video<input type="file" accept="video/*" className="hidden" onChange={(e) => readVideo(e.target.files?.[0])} /></label></div>
              <button className="btn btn-primary btn-sm">Post</button>
            </div>
          </form>
          {posts.map((p) => { const l = liked.includes(p.id); return (
            <article key={p.id} className="glass p-4"><div className="flex items-center gap-3"><Avatar name={p.user} /><div><b>{p.user}</b><div className="text-xs text-mute">{gameById(p.game)?.title} · {p.time}</div></div></div>
              <p className="mt-3">{p.text}</p>
              <div className="mt-3 aspect-[21/8] overflow-hidden rounded-xl">
                {p.video ? <button type="button" onClick={() => setActivePost(p)} className="h-full w-full"><MediaVideo src={p.video} controls={false} muted className="h-full w-full object-cover" /><span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-black/50 backdrop-blur"><FaPlay /></span></span></button> : p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <Cover seed={'post' + p.id} colors={gameById(p.game)?.colors} label={gameById(p.game)?.title} image={gameById(p.game)?.coverUrl} />}
              </div>
              <div className="mt-3 flex gap-5 text-sm text-mute"><button onClick={() => toggleLike(p.id)} aria-pressed={l} className="flex items-center gap-1.5 hover:text-white">{l ? <FaHeart className="text-pink" /> : <FaRegHeart />}{p.likes + (l ? 1 : 0)}</button>
                <button onClick={() => setCm(cm === p.id ? '' : p.id)} className="flex items-center gap-1.5 hover:text-white"><FaRegComment />{p.comments + (cmts[p.id]?.length || 0)}</button>
                <button onClick={() => { navigator.clipboard?.writeText(location.href); toast('Link copied'); }} className="flex items-center gap-1.5 hover:text-white"><FaShare />Share</button></div>
              {cm === p.id && <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = e.target.c.value.trim(); if (!v) return; setCmts({ ...cmts, [p.id]: [...(cmts[p.id] || []), v] }); e.target.reset(); }}><input name="c" className="input" placeholder="Write a comment" aria-label="Comment" /><button className="btn btn-ghost btn-sm">Send</button></form>}
              {(cmts[p.id] || []).map((x, i) => <p key={i} className="mt-2 rounded-lg bg-white/5 p-2 text-sm"><b>{user.name}</b> {x}</p>)}
            </article>); })}
        </div>
        <aside className="space-y-6">
          <div className="glass p-4"><SectionHead icon={FaUsers} title="Popular groups" />{COMMUNITIES.map((g) => <div key={g.id} className="glass-flat mb-2 flex items-center gap-3 p-2.5"><button className="flex flex-1 items-center gap-3 text-left" onClick={() => setOpen(g.id)}><div className="h-11 w-11 overflow-hidden rounded-lg"><Cover seed={g.id} colors={gameById(g.game).colors} label={g.name} /></div><div><b className="text-sm">{g.name}</b><div className="text-xs text-mute">{fmt(g.members)} members</div></div></button><button className={`btn btn-sm ${joinedC.includes(g.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleC(g.id)}>{joinedC.includes(g.id) ? 'Joined' : 'Join'}</button></div>)}</div>
          <div className="glass p-4"><SectionHead icon={FaFire} title="People to follow" />{STREAMERS.slice(3, 10).map((s) => <div key={s.id} className="mb-2 flex items-center gap-3"><Link to={`/profile/${s.id}`}><Avatar name={s.name} live /></Link><Link to={`/profile/${s.id}`} className="min-w-0 flex-1"><b className="block truncate text-sm">{s.name}</b><span className="block truncate text-xs text-mute">{gameById(s.game)?.title}</span></Link><button className={`btn btn-sm ${follows.includes(s.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(s.id)}>{follows.includes(s.id) ? 'Following' : 'Follow'}</button></div>)}</div>
          <div className="glass p-4"><h3 className="mb-2 font-bold">Trending topics</h3><div className="flex flex-wrap gap-2">{['#CS2Update', '#VYRONCup', '#ClutchOfTheDay', '#Valorant', '#EldenRing', '#LFG'].map((t) => <span key={t} className="chip">{t}</span>)}</div></div>
        </aside>
      </div>
      <Modal open={!!c} onClose={() => setOpen(null)} title={c?.name} wide>{c && <div><div className="aspect-[21/8] overflow-hidden rounded-xl"><Cover seed={c.id} colors={gameById(c.game).colors} label={c.name} big /></div>
        <p className="mt-3 text-mute">A community for {gameById(c.game).title} fans · {c.members.toLocaleString()} members.</p><h4 className="mt-3 font-bold">Rules</h4><ol className="list-decimal pl-5 text-sm text-mute"><li>Be respectful.</li><li>No spam or cheats.</li><li>Tag spoilers.</li></ol>
        <button className="btn btn-primary mt-4" onClick={() => toggleC(c.id)}>{joinedC.includes(c.id) ? 'Leave community' : 'Join community'}</button></div>}</Modal>
      <Modal open={storyOpen} onClose={() => setStoryOpen(false)} title="Add to your story">
        {storyImage ? <div className="mx-auto aspect-[9/16] max-h-[520px] overflow-hidden rounded-2xl"><img src={storyImage} alt="Story preview" className="h-full w-full object-cover" /></div> : <label className="grid aspect-[9/16] max-h-[520px] cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5"><span className="text-center text-mute"><FaImage className="mx-auto mb-2 text-4xl" />Choose photo</span><input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setStoryImage)} /></label>}
        <input className="input mt-3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Story caption" maxLength={80} />
        <div className="mt-3 flex gap-2">{storyImage && <button className="btn btn-ghost flex-1" onClick={() => setStoryImage('')}>Change</button>}<button className="btn btn-primary flex-1" onClick={publishStory}>Publish story</button></div>
      </Modal>
      <Modal open={!!storyViewer} onClose={() => setStoryViewer(null)} title={storyViewer?.title || 'Story'}>
        {storyViewer && <div className="mx-auto aspect-[9/16] max-h-[620px] overflow-hidden rounded-2xl"><img src={storyViewer.image} alt={storyViewer.title} className="h-full w-full object-cover" /></div>}
      </Modal>
      <Modal open={!!activePost} onClose={() => setActivePost(null)} title={activePost?.text || 'Video'} wide>
        {activePost?.video && <div className="aspect-video overflow-hidden rounded-xl"><MediaVideo src={activePost.video} autoPlay className="h-full w-full object-contain" /></div>}
      </Modal>
    </div>
  );
}
