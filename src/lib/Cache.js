import Redis from 'ioredis';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      keyPrefix: 'cache:',
    });
  }

  // Método para gravar o cache no banco redis
  set(key, value) {
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  // Método para recuperar o cache
  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  // Método para invalidar uma chave do chache
  invalidate(key) {
    return this.redis.del(key);
  }

  // Método para invalidar um conjunto de chaves
  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map(key => key.replace('cache:', ''));
    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();
