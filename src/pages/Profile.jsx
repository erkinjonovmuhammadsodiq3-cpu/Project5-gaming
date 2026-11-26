import { useState } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCrown, FaTrophy, FaBullseye, FaTv, FaShieldAlt, FaChartLine, FaRocket, FaImage, FaVideo } from 'react-icons/fa';
import { Avatar, Cover, Modal, Tabs, MediaVideo } from '../components/ui.jsx';
import { GameCard } from '../components/cards.jsx';
import { ACHIEVEMENTS, GAMES, STREAMERS, TOURNAMENTS, POSTS, gameById } from '../data.js';
import { useStore } from '../store.jsx';
import { saveMedia } from '../services/media.js';

export default function Profile() {
  const [sp] = useSearchParams(); const { id } = useParams();
  const publicUser = id ? STREAMERS.find((s) => s.id === id) : null;
  const { user, favs, premium, toast, teams, teamRegistrations, updateProfile, stories, profilePosts, addProfilePost, clips, addClip, follows, toggleFollow } = useStore();
  const [tab, setTab] = useState(sp.get('tab') || 'Overview'); const [edit, setEdit] = useState(false); const [bio, setBio] = useState(user.bio || 'Competitive CS2 player & part-time streamer. Tashkent 🇺🇿');
  const [draftName, setDraftName] = useState(user.name); const [draftLocation, setDraftLocation] = useState(user.location || '');
  const [avatar, setAvatar] = useState(user.avatar || ''); const [banner, setBanner] = useState(user.banner || '');
  const [postText, setPostText] = useState(''); const [postImage, setPostImage] = useState('');
  const [postVideo, setPostVideo] = useState('');
  const [activeMedia, setActiveMedia] = useState(null);
  const profileName = publicUser?.name || user.name;
  const profileAvatar = publicUser?.name || avatar;
  const isOwnProfile = !publicUser;
  const readImage = (file, setValue) => {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) return toast('Choose an image smaller than 2 MB', 'info');
    const reader = new FileReader(); reader.onload = () => setValue(reader.result); reader.readAsDataURL(file);
  };
  const readVideo = async (file, setValue) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) return toast('Choose a video file', 'info');
    try { setValue(await saveMedia(file)); } catch (error) { toast(error.message, 'info'); }
  };
  const stats = [['Games played', 86], ['Followers', '12.4K'], ['Following', 218], ['Streams watched', '1.2K'], ['Tournaments', 14], ['Achievements', ACHIEVEMENTS.length]];
  return (
    <div style={{ '--a1': '#8b5cf6', '--a2': '#00d9ff' }}>
      <section className="neon-border glass overflow-hidden">
        <div className="relative h-44 md:h-60">{banner ? <img src={banner} alt="Profile banner" className="h-full w-full object-cover" /> : <Cover seed="banner" colors={['#8b5cf6', '#00d9ff']} label="VYRON" big />}<div className="scanlines absolute inset-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#080817]" /></div>
        <div className="relative -mt-14 flex flex-wrap items-end gap-5 p-5 pt-0">
          {publicUser ? <Avatar name={publicUser.name} size={112} ring live /> : avatar ? <img src={avatar} alt={user.name} className="h-28 w-28 rounded-full object-cover ring-2 ring-[var(--a1)] ring-offset-4 ring-offset-[#080817]" /> : <Avatar name={user.name} size={112} ring />}
          <div className="min-w-[220px] flex-1"><h1 className="flex items-center gap-2 text-3xl font-bold">{profileName}<FaCheckCircle className="text-cyber" />{!publicUser && premium && <FaCrown className="text-amber-300" />}</h1><p className="text-sm text-mute">{publicUser ? `${gameById(publicUser.game)?.title} creator · Live now` : bio}</p>
            <div className="mt-2 flex items-center gap-3 text-sm">Level {user.level}<div className="h-2.5 w-52 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full" style={{ background: 'linear-gradient(90deg,var(--a1),var(--a2))' }} initial={{ width: 0 }} animate={{ width: user.xp + '%' }} transition={{ duration: 1.2 }} /></div><span className="text-mute">{user.xp}/100 XP</span></div></div>
          <div className="flex gap-2">{publicUser ? <><button className={`btn ${follows.includes(publicUser.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(publicUser.id)}>{follows.includes(publicUser.id) ? 'Following' : 'Follow'}</button><Link to={`/live/${publicUser.id}`} className="btn btn-ghost">Watch live</Link></> : <><button className="btn btn-primary" onClick={() => setEdit(true)}>Edit profile</button><Link to="/live/studio" className="btn btn-ghost">Go Live</Link></>}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-5 pt-0 md:grid-cols-6">{stats.map(([l, v]) => <div key={l} className="glass-flat p-3 text-center"><div className="font-display text-xl font-bold">{v}</div><div className="text-[11px] text-mute">{l}</div></div>)}</div>
      </section>
      <div className="my-6"><Tabs tabs={['Overview', 'Achievements', 'Tournaments', 'Teams', 'Stories', 'Clips', 'Posts', 'Friends', 'Settings']} value={tab} onChange={setTab} /></div>
      {tab === 'Overview' && <div className="space-y-6"><div><h2 className="mb-3 text-2xl font-bold">Favorite games</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">{favs.length ? favs.slice(0, 6).map((id) => gameById(id)).filter(Boolean).map((g) => <GameCard key={g.id} g={g} compact />) : <p className="text-mute">No favorites yet — heart a game!</p>}</div></div>
        <div className="glass p-4"><h2 className="mb-3 text-xl font-bold">Recent activity</h2>{['Reached level 42', 'Joined Neon Valorant Cup', 'Followed FrostyFPS', 'Unlocked “Clutch Master”'].map((a, i) => <div key={a} className="flex justify-between border-b border-white/10 py-2 text-sm last:border-0"><span>{a}</span><span className="text-mute">{i + 1}d ago</span></div>)}</div></div>}
      {tab === 'Achievements' && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{ACHIEVEMENTS.map((a, i) => { const Icons = [FaTrophy, FaBullseye, FaTv, FaShieldAlt, FaChartLine, FaRocket]; const Icon = Icons[i]; return <div key={a} className="glass flex items-center gap-3 p-4"><Icon className="text-3xl text-[var(--a1)]" /><div><b>{a}</b><div className="text-xs text-mute">Unlocked</div></div></div>; })}</div>}
      {tab === 'Tournaments' && <div className="space-y-2">{TOURNAMENTS.slice(0, 4).map((t, i) => <Link key={t.id} to={`/tournaments/${t.id}`} className="glass flex justify-between p-4"><b>{t.name}</b><span className="text-mute">{['Top 8', 'Champion 🏆', 'Top 16', 'Registered'][i]}</span></Link>)}</div>}
      {tab === 'Teams' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.length ? teams.map((team) => {
          const registrationCount = Object.values(teamRegistrations).filter((id) => id === team.id).length;
          return <div key={team.id} className="glass p-4"><div className="flex items-center gap-3"><Avatar name={team.name} size={56} ring /><div><b className="text-lg">{team.name}</b><div className="text-xs text-mute">Captain: {team.owner} · {team.members.length} member</div></div></div><div className="mt-4 text-sm text-mute">{registrationCount} tournament registration{registrationCount === 1 ? '' : 's'}</div><Link to="/tournaments" className="btn btn-ghost btn-sm mt-3 w-full">Find tournament</Link></div>;
        }) : <div className="glass col-span-full p-8 text-center"><p className="text-mute">No teams yet. Open a tournament's Teams tab to create one.</p><Link to="/tournaments" className="btn btn-primary mt-4">Browse tournaments</Link></div>}
      </div>}
      {tab === 'Stories' && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stories.length ? stories.map((story) => <div key={story.id} className="glass overflow-hidden"><div className="aspect-[9/12]"><img src={story.image} alt={story.title} className="h-full w-full object-cover" /></div><p className="p-3 font-bold">{story.title}</p></div>) : <p className="glass col-span-full p-8 text-center text-mute">No stories yet. Open Community and add your first story.</p>}</div>}
      {tab === 'Clips' && <div className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); const title = e.target.title.value.trim(); if (!title) return toast('Add a clip title', 'info'); if (!postVideo) return toast('Choose a video for this clip', 'info'); addClip({ title, game: 'counter-strike-2', image: postImage, video: postVideo }); setPostImage(''); setPostVideo(''); e.target.reset(); }} className="glass flex flex-wrap gap-3 p-4">
          <input name="title" className="input flex-1" placeholder="Clip title" aria-label="Clip title" />
          <label className="btn btn-ghost cursor-pointer"><FaImage />Cover<input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setPostImage)} /></label>
          <label className="btn btn-ghost cursor-pointer"><FaVideo />Video<input type="file" accept="video/*" className="hidden" onChange={(e) => readVideo(e.target.files?.[0], setPostVideo)} /></label>
          <button className="btn btn-primary">Publish clip</button>
        </form>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{clips.length ? clips.map((clip) => <button key={clip.id} onClick={() => setActiveMedia(clip)} className="glass overflow-hidden text-left"><div className="relative aspect-video">{clip.image ? <img src={clip.image} alt={clip.title} className="h-full w-full object-cover" /> : <Cover seed={clip.id} colors={['#ff3d81', '#8b5cf6']} label={clip.title} />}<FaVideo className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl" /></div><p className="p-3 font-bold">{clip.title}</p></button>) : GAMES.slice(0, 3).map((g) => <div key={g.id} className="glass overflow-hidden"><div className="aspect-video"><Cover seed={'clip' + g.id} colors={g.colors} label={g.title} /></div><p className="p-3 font-bold">Clutch on {g.title}</p></div>)}</div>
      </div>}
      {tab === 'Posts' && <div className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); if (!postText.trim() && !postImage && !postVideo) return toast('Write something or add photo/video', 'info'); addProfilePost({ text: postText.trim(), image: postImage, video: postVideo, game: 'counter-strike-2', likes: 0, comments: 0, time: 'now' }); setPostText(''); setPostImage(''); setPostVideo(''); }} className="glass p-4">
          <textarea className="input min-h-[80px]" value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Share an update..." maxLength={400} />
          {postImage && <img src={postImage} alt="Post preview" className="mt-3 max-h-80 w-full rounded-xl object-cover" />}
          {postVideo && <div className="mt-3 max-h-80 overflow-hidden rounded-xl"><MediaVideo src={postVideo} className="h-full w-full" /></div>}
          <div className="mt-3 flex justify-between"><div className="flex gap-2"><label className="btn btn-ghost btn-sm cursor-pointer"><FaImage />Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setPostImage)} /></label><label className="btn btn-ghost btn-sm cursor-pointer"><FaVideo />Video<input type="file" accept="video/*" className="hidden" onChange={(e) => readVideo(e.target.files?.[0], setPostVideo)} /></label></div><button className="btn btn-primary btn-sm">Publish</button></div>
        </form>
        {profilePosts.length ? profilePosts.map((p) => <article key={p.id} className="glass p-4"><b>{p.user}</b><p className="mt-2">{p.text}</p>{p.video ? <button onClick={() => setActiveMedia(p)} className="mt-3 block aspect-video w-full overflow-hidden rounded-xl"><MediaVideo src={p.video} controls={false} muted className="h-full w-full object-cover" /><span className="relative -mt-20 block text-center text-4xl"><FaVideo /></span></button> : p.image ? <img src={p.image} alt="" className="mt-3 max-h-96 w-full rounded-xl object-cover" /> : null}</article>) : POSTS.slice(0, 2).map((p) => <div key={p.id} className="glass p-4"><b>{p.user}</b><p className="mt-2">{p.text}</p></div>)}
      </div>}
      {tab === 'Friends' && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{STREAMERS.slice(0, 8).map((s) => <div key={s.id} className="glass p-4 text-center"><Link to={`/profile/${s.id}`} className="block"><Avatar name={s.name} size={64} live /><b className="mt-2 block">{s.name}</b><span className="text-xs text-mute">{gameById(s.game)?.title}</span></Link><button className={`btn btn-sm mt-3 w-full ${follows.includes(s.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(s.id)}>{follows.includes(s.id) ? 'Following' : 'Follow'}</button></div>)}</div>}
      {tab === 'Settings' && <div className="glass max-w-xl space-y-4 p-5"><label className="block text-sm font-semibold">Display name<input className="input mt-1" defaultValue={user.name} /></label>
        {[['Email notifications'], ['Show online status'], ['Reduce motion (follows system setting)']].map(([l]) => <label key={l} className="flex items-center justify-between text-sm"><span>{l}</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-violet" /></label>)}
        <button className="btn btn-primary" onClick={() => toast('Settings saved')}>Save</button></div>}
      <Modal open={edit} onClose={() => setEdit(false)} title="Edit profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Display name<input className="input mt-1" value={draftName} onChange={(e) => setDraftName(e.target.value)} maxLength={40} /></label>
          <label className="text-sm font-semibold">Location<input className="input mt-1" value={draftLocation} onChange={(e) => setDraftLocation(e.target.value)} maxLength={60} /></label>
        </div>
        <label className="mt-4 block text-sm font-semibold">Bio<textarea className="input mt-1 min-h-[100px]" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} /></label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="btn btn-ghost cursor-pointer justify-center"><FaImage />Avatar photo<input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setAvatar)} /></label>
          <label className="btn btn-ghost cursor-pointer justify-center"><FaImage />Banner photo<input type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e.target.files?.[0], setBanner)} /></label>
        </div>
        <button className="btn btn-primary mt-4 w-full" onClick={() => { if (draftName.trim().length < 3) return toast('Name must be at least 3 characters', 'info'); updateProfile({ name: draftName.trim(), bio, location: draftLocation, avatar, banner }); setEdit(false); }}>Save changes</button>
      </Modal>
      <Modal open={!!activeMedia} onClose={() => setActiveMedia(null)} title={activeMedia?.title || activeMedia?.text || 'Video'} wide>
        {activeMedia?.video && <div className="aspect-video overflow-hidden rounded-xl"><MediaVideo src={activeMedia.video} autoPlay className="h-full w-full object-contain" /></div>}
      </Modal>
    </div>
  );
}
