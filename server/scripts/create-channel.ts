import 'dotenv/config';
import { IVSClient, CreateChannelCommand } from '@aws-sdk/client-ivs';

const client = new IVSClient({ region: process.env.AWS_REGION || 'ap-south-1' });

const out = await client.send(new CreateChannelCommand({
  name: 'live-bids-main',
  latencyMode: 'LOW',
  type: 'STANDARD',
  authorized: true
}));
console.log(JSON.stringify(out, null, 2));
