# Live Bids with Amazon IVS — Starter (Node + React Native)

This starter shows:

- **Private playback** (JWT) for an IVS channel
- **Timed metadata** (lot_open, reserve_met, hammer) for synchronized UI
- **Mobile broadcast** via RTMPS (React Native wrapper around IVS broadcast SDK)
- **Authoritative bidding** demo over WebSocket

## Folders

- `server/` — Fastify API (mint token, emit metadata) + WS for bids
- `mobile/` — React Native app with `IVSPlayer` and `IVSBroadcastCameraView`

## Quick start

1) **Provision on AWS** (one‑time)

```bash
cd server
cp .env.example .env
# set AWS creds in your environment (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)
npm i
npm run create:channel
npm run create:playback-keypair
# Take the output:
# - CHANNEL_ARN
# - PLAYBACK_KEYPAIR_ARN
# - playbackUrl (save to mobile/App.tsx)
# Encode the privateKey to base64 and paste into PLAYBACK_PRIVATE_PEM_BASE64
```

2) **Run server**

```bash
npm run dev
```

3) **Run mobile**

```bash
cd ../mobile
npm i
cd ios && pod install && cd ..
npm run ios # or npm run android
```

4) **Test**

- Tap **Get playback token** → Player should start.
- Tap **Open (30s)** → All players receive a timed metadata cue. Watch console.
- Start **Broadcast** (demo): fill `rtmpsUrl` + `streamKey` and start from the RN preview.

## Notes

- Don’t put CloudFront in front of **live** IVS playback (adds latency). Use CloudFront for replays/VOD only.
- Rotate stream keys; keep JWT TTL small.
- For sub‑second presenter interactions, consider **IVS Real‑Time (stages)** for hosts and mirror outcomes to the audience via timed metadata.

## References
- Amazon IVS React Native **Player**: https://github.com/aws/amazon-ivs-react-native-player
- Amazon IVS React Native **Broadcast** wrapper: https://github.com/apiko-dev/amazon-ivs-react-native-broadcast
- Timed metadata docs: https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/metadata.html
