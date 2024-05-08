import { Socket } from 'socket.io-client';
import { LoadingState, SocketStatus } from './constants';

export interface Reply {
  id: string;
  author: string;
  content: string;
}

export interface Question extends Reply {
  replies: Reply[];
}

export interface ChatSliceState {
  questions: Question[];
  loading: Loading;
  author?: string;
}

export interface Loading {
  state: LoadingState;
  info?: string;
}

export interface ReplyQuestionPayload {
  questionId: string;
  content: string;
}

export interface SocketSliceState {
  socket: Socket;
  status: SocketStatus;
}
