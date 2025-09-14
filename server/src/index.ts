import 'dotenv/config';
import Fastify from 'fastify';
import fastifyWebsocket from 'fastify-websocket';
import cors from '@fastify/cors';
import { routes } from './routes.js';
import { initWs } from './ws.js';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });
await app.register(fastifyWebsocket);

routes(app);
initWs(app);

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
