import { Module } from '@nestjs/common';
import { ChatBotModule } from 'modules/chat-bot/chat-bot.module';
import { ConfigurationModule } from 'modules/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, ChatBotModule],
})
export class AppModule {}
