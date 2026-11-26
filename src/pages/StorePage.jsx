import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { Empty, Modal, PageHead, Tabs, Cover } from '../components/ui.jsx';
import { ProductCard } from '../components/cards.jsx';
import { PRODUCTS } from '../data.js';
import { useStore } from '../store.jsx';
import { api } from '../services/api.js';

export default function StorePage() {
  const [sp, setSp] = useSearchParams(); const { cart, setQty, clearCart, wish, toast } = useStore();
  const cats = ['All', 'Wishlist', ...new Set(PRODUCTS.map((p) => p.cat))]; const [cat, setCat] = useState('All'); const [q, setQ] = useState(''); const [sort, setSort] = useState('Featured');
  const list = useMemo(() => PRODUCTS.filter((p) => (cat === 'All' || (cat === 'Wishlist' ? wish.includes(p.id) : p.cat === cat)) && p.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => sort === 'Price ↑' ? a.price - b.price : sort === 'Price ↓' ? b.price - a.price : sort === 'Rating' ? b.rating - a.rating : 0), [cat, q, sort, wish]);
  const items = Object.entries(cart).map(([id, n]) => ({ p: PRODUCTS.find((x) => x.id === id), n })).filter((x) => x.p);
  const total = items.reduce((a, { p, n }) => a + p.price * n, 0);
  const checkout = async () => { try { await api.checkout(); } catch (e) { toast(e.message + ' — see services/api.js', 'info'); } };
  return (
    <div style={{ '--a1': '#a855f7', '--a2': '#00d9ff' }}>
      <PageHead title="VYRON STORE" sub="Keyboards, mice, headsets, controllers, chairs and merch." tags={['GEAR', 'NEW DROP', '-20%']} art="🛒" />
      <div className="mb-6 flex flex-wrap items-center gap-3"><Tabs tabs={cats} value={cat} onChange={setCat} />
        <label className="glass-flat ml-auto flex items-center gap-2 px-3"><FaSearch className="text-mute" /><input className="h-11 bg-transparent outline-none" placeholder="Search gear" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" /></label>
        <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">{['Featured', 'Price ↑', 'Price ↓', 'Rating'].map((x) => <option key={x}>{x}</option>)}</select>
        <button className="btn btn-primary" onClick={() => setSp({ cart: '1' })}><FaShoppingCart />Cart ({items.reduce((a, x) => a + x.n, 0)})</button></div>
      {list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <Empty title={cat === 'Wishlist' ? 'Wishlist is empty' : 'Nothing found'} sub="Tap the heart on a product to save it." />}
      <Modal open={sp.get('cart') === '1'} onClose={() => setSp({})} title="Your cart">
        {items.length === 0 ? <Empty title="Cart is empty" sub="Add some gear!" /> : (<>
          {items.map(({ p, n }) => <div key={p.id} className="glass-flat mb-2 flex items-center gap-3 p-2"><div className="h-12 w-12 overflow-hidden rounded-lg"><Cover seed={p.id} colors={p.colors} label={p.name} image={p.image} /></div><div className="min-w-0 flex-1 text-sm"><b className="block truncate">{p.name}</b>${p.price}</div>
            <div className="flex items-center gap-1"><button className="btn btn-ghost btn-sm !px-2" aria-label="Decrease" onClick={() => setQty(p.id, n - 1)}>−</button><span className="w-6 text-center">{n}</span><button className="btn btn-ghost btn-sm !px-2" aria-label="Increase" onClick={() => setQty(p.id, n + 1)}>+</button></div></div>)}
          <div className="mt-4 flex items-center justify-between text-lg font-bold"><span>Total</span><span className="font-display">${total}</span></div>
          <div className="mt-4 flex gap-2"><button className="btn btn-primary flex-1" onClick={checkout}>Checkout</button><button className="btn btn-ghost" aria-label="Clear cart" onClick={clearCart}><FaTrash /></button></div>
          <p className="mt-2 text-xs text-mute">Payments are not connected in this demo.</p></>)}
      </Modal>
    </div>
  );
}
