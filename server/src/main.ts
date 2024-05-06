import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from 'common/adapters/redis.adapter';
import { ConfigurationService } from 'modules/configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  const configService = app.get(ConfigurationService);
  const { port } = configService.getConfig();
  await app.listen(port);
}
bootstrap();
