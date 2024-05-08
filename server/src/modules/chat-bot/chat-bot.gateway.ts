import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageType } from './chat-bot.constants';
import { QuestionDTO } from './dto/question.dto';
import { ReplyDto } from './dto/reply.dto';
import { ElasticsearchService } from 'modules/elasticsearch/elasticsearch.service';
import { JoiValidationPipe } from 'common/pipes/joi-validation.pipe';
import { QuestionDtoSchema } from './schemas/question-dto.schema';
import { ReplyDtoSchema } from './schemas/reply-dto.schema';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatBotGateway implements OnGatewayConnection {
  constructor(private elasticsearchService: ElasticsearchService) {}

  async handleConnection(socket: Socket) {
    const questions = await this.elasticsearchService.getAllQuestions();

    socket.emit(MessageType.QUESTIONS, questions);
  }

  @SubscribeMessage(MessageType.ASK_QUESTION)
  async handleQuestion(
    @MessageBody(new JoiValidationPipe(QuestionDtoSchema)) message: QuestionDTO,
    @ConnectedSocket() socket: Socket,
  ) {
    const questionDocument =
      await this.elasticsearchService.createQuestion(message);

    socket.broadcast.emit(MessageType.QUESTION_ADD, questionDocument);

    return {
      event: MessageType.QUESTION_ADD,
      data: questionDocument,
    };
  }

  @SubscribeMessage(MessageType.REPLY_QUESTION)
  async handleReply(
    @MessageBody(new JoiValidationPipe(ReplyDtoSchema)) message: ReplyDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { questionId, ...restMessage } = message;
    const questionDocument = await this.elasticsearchService.replyToQuestion(
      questionId,
      restMessage,
    );

    socket.broadcast.emit(MessageType.QUESTION_UPDATE, questionDocument);

    return {
      event: MessageType.QUESTION_UPDATE,
      data: questionDocument,
    };
  }
}
