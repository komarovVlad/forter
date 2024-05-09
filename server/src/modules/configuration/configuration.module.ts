import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { DevConfig } from './dev.config';
import { TestConfig } from './test.config';
import { ConfigValidationSchema } from './configuration.schema';
import { Config } from './configuration.types';
import { NodeEnv } from './configuration.constants';

@Module({
  providers: [
    {
      provide: ConfigurationService,
      useFactory: () => {
        let config: Config;

        switch (process.env.NODE_ENV) {
          case NodeEnv.TEST:
            config = TestConfig;
            break;
          default:
            config = DevConfig;
        }

        const validationResult = ConfigValidationSchema.validate(config, {
          stripUnknown: true,
        });

        return new ConfigurationService(validationResult.value);
      },
    },
  ],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
