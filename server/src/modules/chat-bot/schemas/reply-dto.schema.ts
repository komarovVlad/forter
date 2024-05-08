import { ReplyDto } from '../dto/reply.dto';
import * as Joi from 'joi';

export const ReplyDtoSchema = Joi.object<ReplyDto>({
  id: Joi.string().uuid().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
  questionId: Joi.string().required(),
});
