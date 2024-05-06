import { ReplyDto } from '../dto/reply.dto';
import { string, object } from 'joi';

export const ReplyDtoSchema = object<ReplyDto>({
  id: string().uuid().required(),
  content: string().required(),
  author: string().required(),
  questionId: string().required(),
});
