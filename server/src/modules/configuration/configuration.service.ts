import { Injectable } from '@nestjs/common';
import { Config } from './configuration.types';

@Injectable()
export class ConfigurationService {
  constructor(private config: Config) {}

  getConfig(): Config {
    return this.config;
  }
}
