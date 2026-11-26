// Integration points for a real backend. Swap the demo implementations for fetch() calls.
// Suggested stack: Supabase (auth, db, realtime chat) + LiveKit or Mux (streaming).
import { GAMES, STREAMERS, TOURNAMENTS } from '../data.js';

export const api = {
  games: async () => GAMES,
  streams: async () => STREAMERS,
  tournaments: async () => TOURNAMENTS,
  // auth: supabase.auth.signInWithPassword({ email, password })
  signIn: async ({ email, pw }) => {
    // Demo mode: allow the visitor to enter with any valid email and password.
    const accounts = JSON.parse(localStorage.getItem('vyron:accounts') || '{}');
    const account = accounts[email.toLowerCase()];
    const name = account?.name || email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return { ok: true, name: name || 'Player' };
  },
  signUp: async ({ email, pw, name }) => {
    const key = email.toLower();
    const accounts = JSON.parse(localStorage.getItem('vyron:accounts') || '{}');
    if (accounts[key]) throw new Error('An account with this email already exists');
    accounts[key] = { name: name.trim(), password: pw };
    localStorage.setItem('vyron:accounts', JSON.stringify(accounts));
    return { ok: true, name: name.trim() };
  },
  // checkout: POST /api/checkout -> Stripe session (NOT implemented in demo)
  checkout: async () => { throw new Error('Checkout backend not connected'); },
};
