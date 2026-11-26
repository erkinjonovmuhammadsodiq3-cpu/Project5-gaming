# VYRON — Play. Stream. Compete.
React 19 + Vite + Tailwind 4 + Framer Motion + React Router.

    npm install
    npm run dev

Routes: / · /games · /games/:id · /live · /live/:id · /live/studio · /tournaments · /tournaments/:id · /community · /academy · /academy/:id · /news · /news/:id · /store · /profile · /premium · /auth/(signin|signup|forgot|reset)

- Demo data: src/data.js (107 games, official store links). Swap with API calls in src/services/api.js.
- Streaming: src/services/streaming.js (camera/screen capture works now; LiveKit/Mux publishing needs a token server).
- Payments/auth are NOT connected (demo only).
