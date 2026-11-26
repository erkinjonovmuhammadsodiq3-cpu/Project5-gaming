import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaDiscord, FaApple } from 'react-icons/fa';
import { Logo, Toasts } from '../components/Layout.jsx';
import Particles from '../components/Particles.jsx';
import { api } from '../services/api.js';
import { useStore } from '../store.jsx';

const TITLES = { signin: 'Welcome back', signup: 'Create your account', forgot: 'Forgot password', reset: 'Reset password' };

export default function Auth() {
  const { mode } = useParams(); const m = TITLES[mode] ? mode : 'signin'; const nav = useNavigate(); const { signIn, toast } = useStore();
  const [f, setF] = useState({ email: '', pw: '', pw2: '', name: '', remember: true }); const [show, setShow] = useState(false); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false); const [done, setDone] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const validate = () => {
    const e = {};
    if (m !== 'reset' && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address';
    if (m === 'signup' && f.name.trim().length < 3) e.name = 'Username must be at least 3 characters';
    if (m !== 'forgot' && f.pw.length < 8) e.pw = 'Password must be at least 8 characters';
    if ((m === 'signup' || m === 'reset') && f.pw !== f.pw2) e.pw2 = 'Passwords do not match';
    setErr(e); return !Object.keys(e).length;
  };
  const submit = async (ev) => {
    ev.preventDefault(); if (!validate()) return; setBusy(true);
    try {
      const r = m === 'signup' ? await api.signUp(f) : m === 'signin' ? await api.signIn(f) : { ok: true };
      await new Promise((r2) => setTimeout(r2, 700));
      if (m === 'signin' || m === 'signup') { signIn(m === 'signup' ? f.name : r.name); nav('/'); }
      else setDone(m === 'forgot' ? `Reset link sent to ${f.email} (demo)` : 'Password updated. You can sign in now.');
    } catch (x) { setErr({ form: x.message }); } finally { setBusy(false); }
  };
  const field = (k, label, type = 'text', ph = '') => (
    <label className="block text-sm font-semibold">{label}
      <div className="relative mt-1"><input type={type.startsWith('pw') ? (show ? 'text' : 'password') : type} className="input pr-11" placeholder={ph} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} autoComplete={type === 'email' ? 'email' : undefined} />
        {type === 'pw' && <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute">{show ? <FaEyeSlash /> : <FaEye />}</button>}</div>
      {err[k] && <span role="alert" className="mt-1 block text-xs text-pink">{err[k]}</span>}</label>);
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-void p-4" style={{ '--a1': '#8b5cf6', '--a2': '#ff3d81' }}>
      <div className="absolute -left-32 top-0 h-[60vh] w-[60vh] animate-pulse rounded-full bg-violet/40 blur-[120px]" /><div className="absolute -right-32 bottom-0 h-[60vh] w-[60vh] rounded-full bg-pink/30 blur-[120px]" /><Particles />
      <form onSubmit={submit} noValidate className="neon-border glass relative z-10 w-full max-w-md space-y-4 p-7">
        <div className="flex justify-center"><Logo /></div><h1 className="text-center text-3xl font-bold">{TITLES[m]}</h1>
        {done ? <p role="status" className="rounded-xl bg-laser/15 p-4 text-center text-laser">{done}</p> : (<>
          {m === 'signup' && field('name', 'Username', 'text', 'Sodiq_07')}
          {m !== 'reset' && field('email', 'Email', 'email', 'you@example.com')}
          {m !== 'forgot' && field('pw', m === 'reset' ? 'New password' : 'Password', 'pw', '••••••••')}
          {(m === 'signup' || m === 'reset') && field('pw2', 'Confirm password', 'pw', '••••••••')}
          {m === 'signin' && <div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={f.remember} onChange={set('remember')} className="h-4 w-4 accent-violet" />Remember me</label><Link className="text-cyber underline" to="/auth/forgot">Forgot password?</Link></div>}
          {err.form && <p role="alert" className="text-sm text-pink">{err.form}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : { signin: 'Sign in', signup: 'Create account', forgot: 'Send reset link', reset: 'Update password' }[m]}</button>
          {(m === 'signin' || m === 'signup') && <><div className="text-center text-xs text-mute">or continue with</div><div className="grid grid-cols-3 gap-2">{[[FaGoogle, 'Google'], [FaDiscord, 'Discord'], [FaApple, 'Apple']].map(([I, n]) => <button type="button" key={n} className="btn btn-ghost" aria-label={n} onClick={() => { signIn(n + ' Player'); nav('/'); }}><I /></button>)}</div></>}
        </>)}
        <p className="text-center text-sm text-mute">{m === 'signin' ? <>New here? <Link className="text-cyber underline" to="/auth/signup">Create account</Link></> : <>Back to <Link className="text-cyber underline" to="/auth/signin">Sign in</Link></>}{' · '}<Link className="underline" to="/">Home</Link>{m === 'forgot' && <> · <Link className="underline" to="/auth/reset">Reset</Link></>}</p>
      </form><Toasts />
    </div>
  );
}
