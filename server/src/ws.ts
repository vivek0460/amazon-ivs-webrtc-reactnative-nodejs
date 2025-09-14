import type { FastifyInstance } from 'fastify';
import { WebSocketStream } from 'fastify-websocket';
import Redis from 'ioredis';

export function initWs(app: FastifyInstance) {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  app.get('/ws', { websocket: true }, (connection: WebSocketStream, req) => {
    const { socket } = connection;
    socket.on('message', async (raw: any) => {
      let msg: any;
      try { msg = JSON.parse(raw.toString()); } catch { return; }
      if (msg.type === 'bid') {
        // TODO: validate increments, bidder eligibility, lot state etc.
        const id = await redis.xadd(`bids:${msg.lotId}`, '*', 'bid', JSON.stringify({ ...msg, ts: Date.now() }));
        const update = { type: 'leading', lotId: msg.lotId, amount: msg.amount, bidderId: msg.bidderId, id };
        // broadcast
        (app.websocketServer.clients as any).forEach((c: any) => {
          if (c.readyState === 1) c.send(JSON.stringify(update));
        });
      }
    });
  });
}
