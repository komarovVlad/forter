import { QuestionDTO } from '../dto/question.dto';
import { string, object } from 'joi';

export const QuestionDtoSchema = object<QuestionDTO>({
  id: string().uuid(),
  content: string(),
  author: string(),
});
