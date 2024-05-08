import { QuestionDTO } from '../dto/question.dto';
import * as Joi from 'joi';

export const QuestionDtoSchema = Joi.object<QuestionDTO>({
  id: Joi.string().uuid().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
});
