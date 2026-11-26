// REAL STREAMING INTEGRATION POINT
// Set in .env:  VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
// The token must be minted by YOUR backend (never in the browser):  POST /api/stream/token -> { token }
// Then use `livekit-client`:  const room = new Room(); await room.connect(url, token);
//   await room.localParticipant.publishTrack(videoTrack)   // broadcaster
//   room.on(RoomEvent.TrackSubscribed, ...)                // viewer
export const STREAM_CONFIG = {
  provider: 'livekit',
  url: import.meta.env.VITE_LIVEKIT_URL || '',
  get configured() { return Boolean(this.url); },
};

// Local capture works in any browser right now (camera / screen / mic).
export async function captureMedia(kind, withMic) {
  const video = kind === 'screen'
    ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
    : await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
  if (withMic) {
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      mic.getAudioTracks().forEach((t) => video.addTrack(t));
    } catch { /* mic denied: continue without audio */ }
  }
  return video;
}
