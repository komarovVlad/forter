import { NodeEnv } from './configuration.constants';
import { Config } from './configuration.types';

export const DevConfig: Config = {
  nodeEnv: process.env.NODE_ENV as NodeEnv,
  port: +process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST,
    port: +process.env.ELASTICSEARCH_PORT,
  },
};
