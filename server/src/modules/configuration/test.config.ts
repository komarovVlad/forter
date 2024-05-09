import { Config } from './configuration.types';
import { DevConfig } from './dev.config';

export const TestConfig: Config = {
  ...DevConfig,
  port: 8080,
  redis: {
    host: 'testRedisHost',
    port: 6379,
  },
  elasticsearch: {
    host: 'testElasticsearchHost',
    port: 9200,
  },
};
