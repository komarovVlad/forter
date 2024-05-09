import { NodeEnv } from './configuration.constants';

export interface RedisConfig {
  host: string;
  port: number;
}

export interface ElasticsearchConfig {
  host: string;
  port: number;
}

export interface Config {
  nodeEnv: NodeEnv;
  port: number;
  redis: RedisConfig;
  elasticsearch: ElasticsearchConfig;
}
