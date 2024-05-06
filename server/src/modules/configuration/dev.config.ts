import { Config } from './configuration.types';

export const DevConfig: Config = {
  port: +process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST,
    port: +process.env.ELASTICSEARCH_PORT,
  },
};
