import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigurationService } from 'modules/configuration/configuration.service';
import { QUESTIONS_ES_INDEX } from './elasticsearch.constants';
import {
  ElasticsearchQuestion,
  ElasticsearchReply,
} from './elasticsearch.types';
import flatten from 'lodash/flatten';

@Injectable()
export class ElasticsearchService {
  private elasticsearchClient: Client;

  constructor(private configurationService: ConfigurationService) {
    const { elasticsearch } = this.configurationService.getConfig();
    const { host, port } = elasticsearch;

    this.elasticsearchClient = new Client({
      node: `http://${host}:${port}`,
    });
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
        author: 'AnswerBot',
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
    const updateResult = await this.elasticsearchClient.update<
      ElasticsearchQuestion,
      ElasticsearchReply,
      ElasticsearchQuestion
    >({
      index: QUESTIONS_ES_INDEX,
      id: questionId,
      script: {
        source: 'ctx._source.replies.addAll(params.replies)',
        lang: 'painless',
        params: {
          repliy: message,
        },
      },
    });

    return updateResult.get._source;
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
