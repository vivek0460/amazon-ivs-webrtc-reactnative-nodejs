import { IVSClient, PutMetadataCommand } from '@aws-sdk/client-ivs';

const client = new IVSClient({ region: process.env.AWS_REGION });

export async function emitCue(payload: Record<string, unknown>) {
  if (!process.env.CHANNEL_ARN) throw new Error('CHANNEL_ARN missing');
  const cmd = new PutMetadataCommand({
    channelArn: process.env.CHANNEL_ARN,
    metadata: JSON.stringify(payload) // <= 1KB; 5 rps limit
  });
  await client.send(cmd);
}
