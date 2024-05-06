import { object, number, string } from 'joi';
import { Config, RedisConfig } from './configuration.types';

export const RedisConfigValidationSchema = object<RedisConfig>({
  port: number().required(),
  password: string().required(),
  host: string().required(),
});

export const ElasticsearchConfigValidationSchema = object<RedisConfig>({
  host: string().required(),
  port: number().required(),
});

export const ConfigValidationSchema = object<Config>({
  port: number().required(),
  redis: RedisConfigValidationSchema,
  elasticsearch: ElasticsearchConfigValidationSchema,
});
