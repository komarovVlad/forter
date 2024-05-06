export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface ElasticsearchConfig {
  host: string;
  port: number;
}

export interface Config {
  port: number;
  redis: RedisConfig;
  elasticsearch: ElasticsearchConfig;
}
