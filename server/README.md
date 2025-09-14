# Live Bids — Node backend

- **/api/mint-token** — returns a short‑TTL playback JWT for IVS private channels
- **/api/lot/open** — emits timed metadata `{ type: 'lot_open', endsAtMs }`
- **/api/lot/hammer** — emits `{ type: 'hammer', winner, amount }`
- **/ws** — WebSocket endpoint for authoritative bids (demo)

## Setup

```bash
cd server
cp .env.example .env
# Fill CHANNEL_ARN, PLAYBACK_KEYPAIR_ARN, and base64 of your PEM (PLAYBACK_PRIVATE_PEM_BASE64)
npm i
npm run dev
```

Create channel / key pair (one‑time):

```bash
npm run create:channel
npm run create:playback-keypair
```

Security: never expose stream keys to clients. Keep JWT TTLs short.
