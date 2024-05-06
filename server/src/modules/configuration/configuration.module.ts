import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { DevConfig } from './dev.config';
import { ConfigValidationSchema } from './configuration.schema';

@Module({
  providers: [
    {
      provide: ConfigurationService,
      useFactory: () => {
        const validationResult = ConfigValidationSchema.validate(DevConfig, {
          stripUnknown: true,
        });

        return new ConfigurationService(validationResult.value);
      },
    },
  ],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
