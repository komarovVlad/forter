import * as Joi from 'joi';
import { Config, RedisConfig } from './configuration.types';

export const RedisConfigValidationSchema = Joi.object<RedisConfig>({
  port: Joi.number().required(),
  host: Joi.string().required(),
});

export const ElasticsearchConfigValidationSchema = Joi.object<RedisConfig>({
  host: Joi.string().required(),
  port: Joi.number().required(),
});

export const ConfigValidationSchema = Joi.object<Config>({
  port: Joi.number().required(),
  redis: RedisConfigValidationSchema,
  elasticsearch: ElasticsearchConfigValidationSchema,
});
