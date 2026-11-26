import { useEffect, useRef, useState } from 'react';
import { FaVideo, FaDesktop, FaMicrophone, FaStop, FaPlay } from 'react-icons/fa';
import { PageHead } from '../components/ui.jsx';
import { GAMES } from '../data.js';
import { captureMedia, STREAM_CONFIG } from '../services/streaming.js';
import { useStore } from '../store.jsx';

export default function Studio() {
  const vid = useRef(null); const stream = useRef(null);
  const { toast } = useStore();
  const [src, setSrc] = useState('camera'); const [mic, setMic] = useState(false); const [on, setOn] = useState(false); const [err, setErr] = useState('');
  const [title, setTitle] = useState('My first VYRON stream'); const [game, setGame] = useState('counter-strike-2'); const [live, setLive] = useState(false);
  const stop = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; if (vid.current) vid.current.srcObject = null; setOn(false); setLive(false); };
  useEffect(() => stop, []);
  const start = async () => {
    setErr('');
    try {
      stream.current = await captureMedia(src, mic);
      vid.current.srcObject = stream.current;
      setOn(true);
      stream.current.getVideoTracks()[0].onended = stop;
      toast(src === 'screen' ? 'Screen sharing started' : 'Camera preview started');
    }
    catch (e) {
      const message = e.name === 'NotAllowedError'
        ? (src === 'screen' ? 'Screen sharing was cancelled or permission was denied.' : 'Camera permission was denied. Allow camera access in browser settings.')
        : e.name === 'NotReadableError'
          ? 'Camera or screen is already being used by another application.'
          : 'Could not start capture: ' + e.message;
      setErr(message);
      toast(message, 'info');
    }
  };
  const toggleMic = async () => {
    setErr('');
    if (!mic && !stream.current) {
      setMic(true);
      toast('Microphone will be enabled when preview starts');
      return;
    }
    if (mic) {
      stream.current?.getAudioTracks().forEach((track) => { track.enabled = false; });
      setMic(false);
      toast('Microphone muted', 'info');
      return;
    }
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getAudioTracks().forEach((track) => stream.current?.addTrack(track));
      stream.current?.getAudioTracks().forEach((track) => { track.enabled = true; });
      setMic(true);
      toast('Microphone enabled');
    } catch (e) {
      const message = e.name === 'NotAllowedError' ? 'Microphone permission was denied.' : 'Could not enable microphone: ' + e.message;
      setErr(message);
      toast(message, 'info');
    }
  };
  const goLive = () => {
    if (!STREAM_CONFIG.configured) { toast('Preview works. Publishing needs VITE_LIVEKIT_URL + token server.', 'info'); return; }
    setLive(true); toast('Publishing…');
  };
  return (
    <div style={{ '--a1': '#00d9ff', '--a2': '#ff3d81' }}>
      <PageHead title="GO LIVE STUDIO" sub="Real camera or screen capture right in your browser. Connect LiveKit or Mux to publish to viewers." tags={['REC', 'ON AIR', 'OBS-FREE']} art="🎥" />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="neon-border glass relative aspect-video overflow-hidden bg-black">
          <video ref={vid} autoPlay muted playsInline className="h-full w-full object-contain" />
          {!on && <div className="absolute inset-0 grid place-items-center text-center text-mute"><div><FaVideo className="mx-auto mb-2 text-5xl" />Preview appears here</div></div>}
          {on && <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold">{live ? '● LIVE' : '● PREVIEW'}</span>}
        </div>
        <div className="glass space-y-4 p-5">
          <label className="block text-sm font-semibold">Stream title<input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} /></label>
          <label className="block text-sm font-semibold">Game<select className="input mt-1" value={game} onChange={(e) => setGame(e.target.value)}>{GAMES.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}</select></label>
          <div className="flex flex-wrap gap-2"><button type="button" className={`chip ${src === 'camera' ? 'on' : ''}`} onClick={() => setSrc('camera')} disabled={on}><FaVideo />Camera</button><button type="button" className={`chip ${src === 'screen' ? 'on' : ''}`} onClick={() => setSrc('screen')} disabled={on}><FaDesktop />Screen</button>
            <button type="button" className={`chip ${mic ? 'on' : ''}`} onClick={toggleMic} aria-pressed={mic}><FaMicrophone />Mic</button></div>
          {err && <p role="alert" className="rounded-lg bg-red-500/15 p-2 text-sm text-red-300">{err}</p>}
          {!on ? <button className="btn btn-primary w-full" onClick={start}><FaPlay />Start preview</button> : <div className="flex gap-2"><button className="btn btn-primary flex-1" onClick={goLive} disabled={live}>Go Live</button><button className="btn btn-ghost" onClick={stop}><FaStop />Stop</button></div>}
          <p className="text-xs text-mute">Status: {STREAM_CONFIG.configured ? `${STREAM_CONFIG.provider} configured` : 'Streaming provider not configured (see src/services/streaming.js)'}</p>
        </div>
      </div>
    </div>
  );
}
