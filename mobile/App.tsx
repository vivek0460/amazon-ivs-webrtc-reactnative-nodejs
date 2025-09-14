import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, Button, TextInput, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import IVSPlayer, { PlayerState } from 'amazon-ivs-react-native-player';
import { IVSBroadcastCameraView } from 'amazon-ivs-react-native-broadcast';

const API_BASE = 'http://10.0.2.2:4000'; // Android emulator -> host; use your LAN IP on device

export default function App() {
  const [viewerToken, setViewerToken] = useState<string>('');
  const [playbackUrl, setPlaybackUrl] = useState<string>('');
  const [lotId, setLotId] = useState<string>('L-100');
  const [streamUrl, setStreamUrl] = useState<string>(''); // IVS playbackUrl + ?token=...
  const [broadcastReady, setBroadcastReady] = useState<boolean>(false);

  // Fill your IVS ingest details (from server/create-channel output)
  const rtmpsUrl = 'rtmps://<ingest-endpoint>:443/app/';
  const streamKey = '<NEVER hardcode in production — for demo only>';

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      ]);
    }
  }, []);

  async function fetchToken() {
    const r = await fetch(`${API_BASE}/api/mint-token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ viewerId: 'rn-viewer-1' }) });
    const { token } = await r.json();
    setViewerToken(token);
    // get your channel playbackUrl from provisioning; for demo pass via .env or paste below
    const url = '<your IVS channel playbackUrl>';
    setPlaybackUrl(url);
    setStreamUrl(`${url}?token=${encodeURIComponent(token)}`);
  }

  async function openLot() {
    await fetch(`${API_BASE}/api/lot/open`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lotId, endsInSec: 30 }) });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>Live Bids — RN + IVS</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>1) Viewer</Text>
        <Button title="Get playback token" onPress={fetchToken} />
        {streamUrl ? (
          <View style={{ height: 220, backgroundColor: '#000', marginTop: 10 }}>
            <IVSPlayer
              streamUrl={streamUrl}
              autoPlay
              onPlayerStateChange={(s: PlayerState) => console.log('state=', s)}
              onRebuffering={(e) => console.log('rebuffer', e)}
              onError={(e) => console.warn('player err', e)}
              onTextMetadataCue={(e: any) => {
                try {
                  const data = JSON.parse(e.text || '{}');
                  console.log('TIMED METADATA', data);
                } catch {}
              }}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>2) Broadcaster (RTMPS mobile demo)</Text>
        <IVSBroadcastCameraView
          style={{ width: '100%', height: 260, backgroundColor: '#111', borderRadius: 8 }}
          rtmpsUrl={rtmpsUrl}
          streamKey={streamKey}
          onIsBroadcastReady={setBroadcastReady}
          onBroadcastStateChanged={(s) => console.log('broadcast=', s)}
          isMuted={false}
        />
        <Text style={{ marginTop: 8 }}>Ready: {String(broadcastReady)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>3) Emit lot metadata</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Text>Lot ID:</Text>
          <TextInput value={lotId} onChangeText={setLotId} style={styles.input} />
          <Button title="Open (30s)" onPress={openLot} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  h1: { fontSize: 22, fontWeight: '700' },
  h2: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, minWidth: 100 }
});
