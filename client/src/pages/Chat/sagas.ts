import { all, takeLatest, select } from 'redux-saga/effects';
import { ChatSlice } from './slices';
import { getAuthor, getSocket } from './selectors';
import { Socket } from 'socket.io-client';
import { askQuestion, replyQuestion } from './ws';

export function* askQuestionWorker({ payload }: ReturnType<typeof ChatSlice.actions.askQuestion>) {
  const socket: Socket = yield select(getSocket);
  const author: string = yield select(getAuthor);

  askQuestion(socket, payload, author);
}

export function* watchAskQuestion() {
  yield takeLatest(ChatSlice.actions.askQuestion, askQuestionWorker);
}

export function* replyQuestionWorker({
  payload
}: ReturnType<typeof ChatSlice.actions.replyQuestion>) {
  const socket: Socket = yield select(getSocket);
  const author: string = yield select(getAuthor);
  const { questionId, content } = payload;

  replyQuestion(socket, content, author, questionId);
}

export function* watchReplyQuestion() {
  yield takeLatest(ChatSlice.actions.replyQuestion, replyQuestionWorker);
}

export function* watchChat() {
  yield all([watchAskQuestion(), watchReplyQuestion()]);
}
