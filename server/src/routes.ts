import type { FastifyInstance } from 'fastify';
import { mintPlaybackToken } from './tokens.js';
import { emitCue } from './timed-metadata.js';

export function routes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  app.post('/api/mint-token', async (req, reply) => {
    const { viewerId } = (req.body as any) ?? {};
    if (!viewerId) return reply.code(400).send({ error: 'viewerId required' });
    const token = await mintPlaybackToken(viewerId);
    return { token };
  });

  app.post('/api/lot/open', async (req, reply) => {
    const { lotId, endsInSec = 30 } = (req.body as any) ?? {};
    if (!lotId) return reply.code(400).send({ error: 'lotId required' });
    await emitCue({ type: 'lot_open', lotId, endsAtMs: Date.now() + endsInSec * 1000 });
    return { ok: true };
  });

  app.post('/api/lot/hammer', async (req, reply) => {
    const { lotId, winner, amount } = (req.body as any) ?? {};
    if (!lotId || !winner || !amount) return reply.code(400).send({ error: 'lotId, winner, amount required' });
    await emitCue({ type: 'hammer', lotId, winner, amount });
    return { ok: true };
  });

  app.post('/api/lot/reserve-met', async (req, reply) => {
    const { lotId } = (req.body as any) ?? {};
    if (!lotId) return reply.code(400).send({ error: 'lotId required' });
    await emitCue({ type: 'reserve_met', lotId });
    return { ok: true };
  });
}
