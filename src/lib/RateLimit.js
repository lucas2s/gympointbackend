import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';

const rateLimite = new RateLimit({
  store: new RateLimitRedis({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  }),
  windowMs: 1000 * 60 * 15, // 15 minutos
  max: 100, // 100 requisições em 15 minutos
});

export default rateLimite;
