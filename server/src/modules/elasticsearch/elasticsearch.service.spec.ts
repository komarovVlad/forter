import { Test } from '@nestjs/testing';
import { ElasticsearchService } from './elasticsearch.service';
import { ConfigurationModule } from 'modules/configuration/configuration.module';
import { ANSWER_BOT_NAME, QUESTIONS_ES_INDEX } from './elasticsearch.constants';
import {
  ElasticsearchQuestion,
  ElasticsearchReply,
} from './elasticsearch.types';

jest.mock('@elastic/elasticsearch', () => {
  class MockClient {
    indices: {
      exists: () => any;
      create: () => any;
    };
    index: () => any;
    update: () => any;
    get: () => any;
    search: () => any;
  }
  MockClient.prototype.indices = {
    exists: jest.fn(),
    create: jest.fn(),
  };
  MockClient.prototype.index = jest.fn();
  MockClient.prototype.update = jest.fn();
  MockClient.prototype.get = jest.fn();
  MockClient.prototype.search = jest.fn();

  return {
    ...jest.requireActual('@elastic/elasticsearch'),
    Client: MockClient,
  };
});

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigurationModule],
      providers: [ElasticsearchService],
    }).compile();

    service = moduleFixture.get(ElasticsearchService);
  });

  describe('initialize', () => {
    it('should createIndex method', async () => {
      const createIndexSpy = jest
        .spyOn(service, 'createIndex' as any)
        .mockImplementationOnce(() => {});

      await service['initialize']();

      expect(createIndexSpy).toHaveBeenCalled();
    });

    it('should catch error while creating index, wait for 2 seconds and recursively call itself one more time', async () => {
      const error = new Error('test');

      const createIndexSpy = jest
        .spyOn(service, 'createIndex' as any)
        .mockImplementationOnce(() => {
          throw error;
        })
        .mockImplementationOnce(() => {});

      const initializeSpy = jest.spyOn(service, 'initialize' as any);

      await service['initialize']();

      expect(createIndexSpy).toHaveBeenCalledTimes(2);
      expect(initializeSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('createIndex', () => {
    it("should create index if it doesn't exist", async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      Client.prototype.indices.exists.mockResolvedValue(false);

      await service['createIndex']();

      expect(Client.prototype.indices.exists).toHaveBeenCalled();
      expect(Client.prototype.indices.create).toHaveBeenCalledWith({
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
    });

    it('should not create index if it exist', async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      Client.prototype.indices.exists.mockResolvedValue(true);

      await service['createIndex']();

      expect(Client.prototype.indices.exists).toHaveBeenCalled();
      expect(Client.prototype.indices.create).not.toHaveBeenCalled();
    });
  });

  describe('createQuestion', () => {
    it('should search for possible replies and create question', async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      const testQuestion: Omit<ElasticsearchQuestion, 'replies'> = {
        id: 'testQuestionId',
        content: 'testQuestionContent',
        author: 'testQuestionAuthor',
      };
      const testReply: ElasticsearchReply = {
        id: 'testReplyId',
        content: 'testReplyContent',
        author: 'testReplyAuthor',
      };

      const searchForPossibleRepliesSpy = jest
        .spyOn(service, 'searchForPossibleReplies' as any)
        .mockResolvedValueOnce([testReply]);

      const result = await service.createQuestion(testQuestion);

      expect(result).toStrictEqual({
        ...testQuestion,
        replies: [
          {
            ...testReply,
            author: ANSWER_BOT_NAME,
          },
        ],
      });
      expect(searchForPossibleRepliesSpy).toHaveBeenCalledWith(
        testQuestion.content,
      );
      expect(Client.prototype.index).toHaveBeenCalledWith({
        index: QUESTIONS_ES_INDEX,
        id: testQuestion.id,
        document: {
          ...testQuestion,
          replies: [
            {
              ...testReply,
              author: ANSWER_BOT_NAME,
            },
          ],
        },
      });
    });
  });

  describe('replyToQuestion', () => {
    it('should insert reply into question and return it', async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      const testQuestion: ElasticsearchQuestion = {
        id: 'testQuestionId',
        content: 'testQuestionContent',
        author: 'testQuestionAuthor',
        replies: [
          {
            id: 'testReplyId',
            content: 'testReplyContent',
            author: 'testReplyAuthor',
          },
        ],
      };

      Client.prototype.get.mockResolvedValueOnce({ _source: testQuestion });

      const result = await service.replyToQuestion(
        testQuestion.id,
        testQuestion.replies[0],
      );

      expect(result).toStrictEqual(testQuestion);
      expect(Client.prototype.update).toHaveBeenCalledWith({
        index: QUESTIONS_ES_INDEX,
        id: testQuestion.id,
        script: {
          source: 'ctx._source.replies.add(params.reply)',
          params: {
            reply: testQuestion.replies[0],
          },
        },
      });
      expect(Client.prototype.get).toHaveBeenCalledWith({
        index: QUESTIONS_ES_INDEX,
        id: testQuestion.id,
      });
    });
  });

  describe('getAllQuestions', () => {
    it('should get all questions in index', async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      const testQuestion: ElasticsearchQuestion = {
        id: 'testQuestionId',
        content: 'testQuestionContent',
        author: 'testQuestionAuthor',
        replies: [
          {
            id: 'testReplyId',
            content: 'testReplyContent',
            author: 'testReplyAuthor',
          },
        ],
      };

      Client.prototype.search.mockResolvedValueOnce({
        hits: {
          hits: [{ _source: testQuestion }],
        },
      });

      const result = await service.getAllQuestions();

      expect(result).toStrictEqual([testQuestion]);
      expect(Client.prototype.search).toHaveBeenCalledWith({
        index: QUESTIONS_ES_INDEX,
        query: {
          match_all: {},
        },
      });
    });
  });

  describe('searchForPossibleReplies', () => {
    it('should search for replies', async () => {
      const { Client } = jest.requireMock('@elastic/elasticsearch');

      const testQuestion: ElasticsearchQuestion = {
        id: 'testQuestionId',
        content: 'testQuestionContent',
        author: 'testQuestionAuthor',
        replies: [
          {
            id: 'testReplyId',
            content: 'testReplyContent',
            author: 'testReplyAuthor',
          },
        ],
      };
      const testQuery = 'testQuery';

      Client.prototype.search.mockResolvedValueOnce({
        hits: {
          hits: [{ _source: testQuestion }],
        },
      });

      const result = await service['searchForPossibleReplies'](testQuery);

      expect(result).toStrictEqual(testQuestion.replies);
      expect(Client.prototype.search).toHaveBeenCalledWith({
        index: QUESTIONS_ES_INDEX,
        query: {
          match_phrase: {
            content: {
              query: testQuery,
              slop: 0,
            },
          },
        },
      });
    });
  });
});
