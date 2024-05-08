import { Socket } from 'socket.io-client';
import { MessageType } from './constants';
import { v4 as uuid } from 'uuid';

export const askQuestion = (socket: Socket, content: string, author: string) => {
  socket.emit(MessageType.ASK_QUESTION, {
    id: uuid(),
    content,
    author
  });
};

export const replyQuestion = (
  socket: Socket,
  content: string,
  author: string,
  questionId: string
) => {
  socket.emit(MessageType.REPLY_QUESTION, {
    id: uuid(),
    content,
    author,
    questionId
  });
};
