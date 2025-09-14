import { SignJWT, importPKCS8 } from 'jose';

const pkBase64 = process.env.PLAYBACK_PRIVATE_PEM_BASE64 || '';
let pkCache: CryptoKey | null = null;

async function loadKey() {
  if (pkCache) return pkCache;
  if (!pkBase64) throw new Error('PLAYBACK_PRIVATE_PEM_BASE64 missing');
  const pem = Buffer.from(pkBase64, 'base64').toString('utf8');
  pkCache = await importPKCS8(pem, 'RS256');
  return pkCache;
}

export async function mintPlaybackToken(viewerId: string) {
  const pk = await loadKey();
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({
    'aws:channel-arn': process.env.CHANNEL_ARN,
    'aws:viewer-id': viewerId,
    'aws:playback-key-pair-arn': process.env.PLAYBACK_KEYPAIR_ARN
  })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 10 * 60)
    .sign(pk);
  return token;
}
