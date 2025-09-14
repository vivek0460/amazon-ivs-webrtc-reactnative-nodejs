# React Native app (Amazon IVS)

## Install

```bash
cd mobile
npm i
# iOS
cd ios && pod install && cd ..
```

## Run

```bash
npm run ios   # or npm run android
```

Edit `App.tsx` and set:
- `API_BASE` to your server URL
- `rtmpsUrl` and `streamKey` (for demo broadcasting)
- `playbackUrl` (channel playback URL returned from server provisioning)
