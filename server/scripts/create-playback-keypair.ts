import 'dotenv/config';
import { IVSClient, CreatePlaybackKeyPairCommand } from '@aws-sdk/client-ivs';

const client = new IVSClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const out = await client.send(new CreatePlaybackKeyPairCommand({ name: 'live-bids-kp' }));
console.log(JSON.stringify(out, null, 2));
console.log('\nSave privateKey in PLAYBACK_PRIVATE_PEM_BASE64 (base64-encoded).');
