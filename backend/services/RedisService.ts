import Redis from 'ioredis';
import logger from '../logger';
import * as Config from '../config/config';

const redis = new Redis({
    host: Config.instance().redisUrl,
    port: 6379,
});

redis.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

export default redis;
