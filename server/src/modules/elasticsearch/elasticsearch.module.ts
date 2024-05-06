import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { ConfigurationModule } from 'modules/configuration/configuration.module';

@Module({
  imports: [ConfigurationModule],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
