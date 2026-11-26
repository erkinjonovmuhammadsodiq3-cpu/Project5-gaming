import { motion } from 'framer-motion';
import { FaCrown, FaCheck, FaTimes } from 'react-icons/fa';
import { PageHead, Reveal } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

const FEATURES = [['Exclusive profile themes', 0, 1, 1], ['Special badges & frames', 0, 1, 1], ['Advanced profile customization', 0, 1, 1], ['Ad-free browsing', 0, 1, 1], ['Priority tournament slots', 0, 0, 1], ['Creator analytics tools', 0, 0, 1], ['Premium community rooms', 0, 1, 1]];
const PLANS = [['Free', 0, 'Everything to get started'], ['Premium', 6.99, 'Most popular'], ['Elite', 14.99, 'For creators & pros']];

export default function Premium() {
  const { premium, setPremium } = useStore();
  return (
    <div style={{ '--a1': '#ffcf4a', '--a2': '#ff3d81' }}>
      <PageHead title="VYRON PREMIUM" sub="Stand out with exclusive themes, badges and creator tools." tags={['👑', 'VIP', 'GOLD', 'ELITE']} art="👑" />
      <div className="grid gap-5 md:grid-cols-3">{PLANS.map(([n, p, d], i) => (
        <Reveal key={n} delay={i * 0.1}><motion.div whileHover={{ y: -8 }} className={`glass relative h-full p-6 ${i === 1 ? 'neon-border' : ''}`}>
          {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-300 to-pink px-3 py-0.5 text-xs font-bold text-black">MOST POPULAR</span>}
          <FaCrown className="text-3xl text-amber-300" /><h2 className="mt-2 text-2xl font-bold">{n}</h2><p className="text-sm text-mute">{d}</p>
          <div className="my-4 font-display text-4xl font-black">${p}<span className="text-sm font-normal text-mute">/mo</span></div>
          <button className={`btn w-full ${i === 1 ? 'btn-primary' : 'btn-ghost'}`} onClick={() => (i === 0 ? setPremium(false) : setPremium(true))}>{i === 0 ? 'Current free plan' : premium ? 'Activated' : `Upgrade to ${n}`}</button>
        </motion.div></Reveal>))}</div>
      <div className="glass mt-8 overflow-x-auto p-5"><table className="w-full min-w-[480px] text-left"><thead><tr><th className="p-2">Feature</th>{PLANS.map(([n]) => <th key={n} className="p-2 text-center">{n}</th>)}</tr></thead>
        <tbody>{FEATURES.map(([f, ...v]) => <tr key={f} className="border-t border-white/10"><td className="p-3">{f}</td>{v.map((x, i) => <td key={i} className="p-3 text-center">{x ? <FaCheck className="mx-auto text-laser" /> : <FaTimes className="mx-auto text-mute" />}</td>)}</tr>)}</tbody></table>
        <p className="mt-3 text-xs text-mute">Demo only: no payment is taken. Connect Stripe through services/api.js.</p></div>
    </div>
  );
}
