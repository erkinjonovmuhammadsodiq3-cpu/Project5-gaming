import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

const Games = lazy(() => import('./pages/Games.jsx'));
const GameDetail = lazy(() => import('./pages/GameDetail.jsx'));
const Live = lazy(() => import('./pages/Live.jsx'));
const Watch = lazy(() => import('./pages/Watch.jsx'));
const Studio = lazy(() => import('./pages/Studio.jsx'));
const Tournaments = lazy(() => import('./pages/Tournaments.jsx'));
const TournamentDetail = lazy(() => import('./pages/TournamentDetail.jsx'));
const Community = lazy(() => import('./pages/Community.jsx'));
const Academy = lazy(() => import('./pages/Academy.jsx'));
const CourseDetail = lazy(() => import('./pages/CourseDetail.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const Article = lazy(() => import('./pages/Article.jsx'));
const StorePage = lazy(() => import('./pages/StorePage.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Premium = lazy(() => import('./pages/Premium.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));

const Loader = () => (
  <div className="grid min-h-[50vh] place-items-center"><div className="flex items-end gap-1.5 h-10" aria-label="Loading">
    {[0, 1, 2, 3, 4].map((i) => <span key={i} className="w-2 rounded-full" style={{ background: 'linear-gradient(#a855f7,#00d9ff)', animation: 'eq 0.9s ease-in-out infinite', animationDelay: `${i * 0.12}s`, height: '40%' }} />)}</div></div>
);

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/auth/:mode" element={<Auth />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:id" element={<GameDetail />} />
          <Route path="live" element={<Live />} />
          <Route path="live/studio" element={<Studio />} />
          <Route path="live/:id" element={<Watch />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="tournaments/:id" element={<TournamentDetail />} />
          <Route path="community" element={<Community />} />
          <Route path="academy" element={<Academy />} />
          <Route path="academy/:id" element={<CourseDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<Article />} />
          <Route path="store" element={<StorePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="premium" element={<Premium />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
