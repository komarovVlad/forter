import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigurationService } from 'modules/configuration/configuration.service';
import { ANSWER_BOT_NAME, QUESTIONS_ES_INDEX } from './elasticsearch.constants';
import {
  ElasticsearchQuestion,
  ElasticsearchReply,
} from './elasticsearch.types';
import { flatten } from 'lodash';
import { setTimeout } from 'timers/promises';

@Injectable()
export class ElasticsearchService implements OnApplicationBootstrap {
  private elasticsearchClient: Client;

  constructor(private configurationService: ConfigurationService) {
    const { elasticsearch } = this.configurationService.getConfig();
    const { host, port } = elasticsearch;
    this.elasticsearchClient = new Client({
      node: `http://${host}:${port}`,
    });
  }

  async onApplicationBootstrap() {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.createIndex();
    } catch (err) {
      await setTimeout(2000);
      return this.initialize();
    }
  }

  private async createIndex() {
    const questionIndexExists = await this.elasticsearchClient.indices.exists({
      index: QUESTIONS_ES_INDEX,
    });

    if (!questionIndexExists) {
      await this.elasticsearchClient.indices.create({
        index: QUESTIONS_ES_INDEX,
        mappings: {
          properties: {
            id: {
              type: 'text',
            },
            author: {
              type: 'text',
            },
            content: {
              type: 'text',
            },
            replies: {
              type: 'nested',
              properties: {
                id: {
                  type: 'text',
                },
                author: {
                  type: 'text',
                },
                content: {
                  type: 'text',
                },
              },
            },
          },
        },
      });
    }
  }

  async createQuestion({
    id,
    author,
    content,
  }: Omit<ElasticsearchQuestion, 'replies'>): Promise<ElasticsearchQuestion> {
    const replies = await this.searchForPossibleReplies(content);

    const document: ElasticsearchQuestion = {
      id,
      content,
      author,
      replies: replies.map((reply) => ({
        ...reply,
        author: ANSWER_BOT_NAME,
      })),
    };

    await this.elasticsearchClient.index({
      index: QUESTIONS_ES_INDEX,
      id,
      document,
    });

    return {
      ...document,
      id,
    };
  }

  async replyToQuestion(
    questionId: string,
    message: ElasticsearchReply,
  ): Promise<ElasticsearchQuestion> {
    await this.elasticsearchClient.update<
      ElasticsearchQuestion,
      ElasticsearchReply,
      ElasticsearchQuestion
    >({
      index: QUESTIONS_ES_INDEX,
      id: questionId,
      script: {
        source: 'ctx._source.replies.add(params.reply)',
        params: {
          reply: message,
        },
      },
    });

    const getResult = await this.elasticsearchClient.get<ElasticsearchQuestion>(
      {
        index: QUESTIONS_ES_INDEX,
        id: questionId,
      },
    );

    return getResult._source;
  }

  async getAllQuestions(): Promise<ElasticsearchQuestion[]> {
    const searchResult =
      await this.elasticsearchClient.search<ElasticsearchQuestion>({
        index: QUESTIONS_ES_INDEX,
        query: {
          match_all: {},
        },
      });

    return searchResult.hits.hits.map((hit) => hit._source);
  }

  private async searchForPossibleReplies(
    query: string,
  ): Promise<ElasticsearchReply[]> {
    const slop = Math.max(query.split(' ').length - 3, 0);
    const searchResult =
      await this.elasticsearchClient.search<ElasticsearchQuestion>({
        index: QUESTIONS_ES_INDEX,
        query: {
          match_phrase: {
            content: {
              query,
              slop,
            },
          },
        },
      });

    return flatten(searchResult.hits.hits.map((hit) => hit._source.replies));
  }
}
