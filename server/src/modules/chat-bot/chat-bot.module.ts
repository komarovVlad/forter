import { Module } from '@nestjs/common';
import { ChatBotGateway } from './chat-bot.gateway';
import { ElasticsearchModule } from 'modules/elasticsearch/elasticsearch.module';

@Module({
  imports: [ElasticsearchModule],
  providers: [ChatBotGateway],
})
export class ChatBotModule {}
