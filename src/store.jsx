import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { NOTIFICATIONS } from './data.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const load = (k, d) => { try { return JSON.parse(localStorage.getItem('vyron:' + k)) ?? d; } catch { return d; } };

function usePersist(key, init) {
  const [v, setV] = useState(() => load(key, init));
  useEffect(() => { try { localStorage.setItem('vyron:' + key, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [key, v]);
  return [v, setV];
}

export function StoreProvider({ children }) {
  const [favs, setFavs] = usePersist('favs', ['counter-strike-2', 'valorant', 'elden-ring']);
  const [follows, setFollows] = usePersist('follows', ['zenixplay']);
  const [cart, setCart] = usePersist('cart', {});
  const [wish, setWish] = usePersist('wish', []);
  const [joinedT, setJoinedT] = usePersist('joinedT', []);
  const [joinedC, setJoinedC] = usePersist('joinedC', ['g0']);
  const [liked, setLiked] = usePersist('liked', []);
  const [premium, setPremium] = usePersist('premium', false);
  const [user, setUser] = usePersist('user', { name: 'Player', level: 1, xp: 0, signedIn: false, bio: 'Competitive gamer & creator. Tashkent 🇺🇿', avatar: '', banner: '', location: 'Tashkent, Uzbekistan' });
  const [readN, setReadN] = usePersist('readN', []);
  const [toasts, setToasts] = useState([]);
  const [teams, setTeams] = usePersist('teams', []);
  const [teamRegistrations, setTeamRegistrations] = usePersist('teamRegistrations', {});
  const [stories, setStories] = usePersist('stories', []);
  const [profilePosts, setProfilePosts] = usePersist('profilePosts', []);
  const [clips, setClips] = usePersist('clips', []);
  const [courseVideos, setCourseVideos] = usePersist('courseVideos', {});

  const toast = useCallback((msg, tone = 'ok') => {
    const id = Math.random();
    setToasts((t) => [...t.slice(-3), { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  const flip = (setter, id, onMsg, offMsg) => setter((arr) => {
    const has = arr.includes(id);
    toast(has ? offMsg : onMsg, has ? 'info' : 'ok');
    return has ? arr.filter((x) => x !== id) : [...arr, id];
  });

  const value = {
    favs, toggleFav: (id) => flip(setFavs, id, 'Added to favorites', 'Removed from favorites'),
    follows, toggleFollow: (id) => flip(setFollows, id, 'Followed ✓', 'Unfollowed'),
    wish, toggleWish: (id) => flip(setWish, id, 'Saved to wishlist', 'Removed from wishlist'),
    joinedT, toggleT: (id) => flip(setJoinedT, id, 'Registered for tournament 🏆', 'Registration cancelled'),
    joinedC, toggleC: (id) => flip(setJoinedC, id, 'Joined community', 'Left community'),
    liked, toggleLike: (id) => setLiked((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id])),
    cart, cartCount: Object.values(cart).reduce((a, b) => a + b, 0),
    addCart: (id) => { setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); toast('Added to cart'); },
    setQty: (id, q) => setCart((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; }),
    clearCart: () => setCart({}),
    premium, setPremium: (p) => { setPremium(p); toast(p ? 'Premium activated 👑' : 'Premium cancelled', 'info'); },
    user,
    updateProfile: (changes) => { setUser((current) => ({ ...current, ...changes })); toast('Profile updated'); },
    signIn: (name) => { setUser((current) => ({ ...current, name: name || current.name, signedIn: true })); toast('Welcome back, ' + (name || user.name)); },
    signOut: () => { setUser((current) => ({ ...current, signedIn: false })); toast('Signed out', 'info'); },
    notifications: NOTIFICATIONS.map((n) => ({ ...n, read: readN.includes(n.id) })),
    markAllRead: () => setReadN(NOTIFICATIONS.map((n) => n.id)),
    toast, toasts,
    teams,
    teamRegistrations,
    stories,
    addStory: (story) => { setStories((items) => [{ id: 'story-' + Date.now(), user: user.name, createdAt: Date.now(), ...story }, ...items].slice(0, 20)); toast('Story published'); },
    removeStory: (id) => setStories((items) => items.filter((story) => story.id !== id)),
    profilePosts,
    addProfilePost: (post) => { setProfilePosts((items) => [{ id: 'post-' + Date.now(), user: user.name, createdAt: Date.now(), likes: 0, comments: 0, ...post }, ...items]); toast('Post published'); },
    clips,
    addClip: (clip) => { setClips((items) => [{ id: 'clip-' + Date.now(), user: user.name, createdAt: Date.now(), views: 0, ...clip }, ...items]); toast('Clip published'); },
    courseVideos,
    setCourseVideo: (courseId, lessonIndex, mediaId) => {
      setCourseVideos((items) => ({ ...items, [courseId]: { ...(items[courseId] || {}), [lessonIndex]: mediaId } }));
      toast('Lesson video uploaded');
    },
    createTeam: (name, game) => {
      const cleanName = name.trim();
      if (cleanName.length < 3) return false;
      if (teams.some((team) => team.name.toLowerCase() === cleanName.toLowerCase())) {
        toast('A team with this name already exists', 'info');
        return false;
      }
      setTeams((items) => [...items, { id: 'team-' + Date.now(), name: cleanName, game, owner: user.name, members: [user.name], createdAt: Date.now() }]);
      toast('Team created');
      return true;
    },
    registerTeam: (tournamentId, teamId) => {
      setTeamRegistrations((items) => ({ ...items, [tournamentId]: teamId }));
      toast('Team registered for tournament');
    },
    leaveTeamRegistration: (tournamentId) => {
      setTeamRegistrations((items) => {
        const next = { ...items };
        delete next[tournamentId];
        return next;
      });
      toast('Tournament registration cancelled', 'info');
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
