import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChatSliceState, Question, ReplyQuestionPayload, SocketSliceState } from './types';
import { io } from 'socket.io-client';
import { LoadingState, SocketStatus } from './constants';

export const chatReducerInitialState: ChatSliceState = {
  questions: [],
  loading: {
    state: LoadingState.PENDING
  }
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState: chatReducerInitialState,
  reducers: {
    init: (state, { payload }: PayloadAction<Question[]>) => {
      return {
        ...state,
        loadingState: {
          state: LoadingState.SUCCESS
        },
        questions: payload
      };
    },
    setAuthor: (state, { payload }: PayloadAction<string>) => {
      return {
        ...state,
        author: payload
      };
    },
    askQuestion: (state, _action: PayloadAction<string>) => {
      return {
        ...state,
        loadingState: {
          state: LoadingState.REQUEST
        }
      };
    },
    replyQuestion: (state, _action: PayloadAction<ReplyQuestionPayload>) => {
      return {
        ...state,
        loadingState: {
          state: LoadingState.REQUEST
        }
      };
    },
    questionAdd: (state, { payload }: PayloadAction<Question>) => {
      return {
        ...state,
        loadingState: {
          state: LoadingState.SUCCESS
        },
        questions: state.questions.concat(payload)
      };
    },
    questionUpdate: (state, { payload }: PayloadAction<Question>) => {
      return {
        ...state,
        loadingState: {
          state: LoadingState.SUCCESS
        },
        questions: state.questions.map((question) =>
          question.id === payload.id ? payload : question
        )
      };
    }
  }
});

export const socketSliceInitialState: SocketSliceState = {
  socket: io('http://localhost:8080'),
  status: SocketStatus.DISCONNECTED
};

export const SocketSlice = createSlice({
  name: 'socket',
  initialState: socketSliceInitialState,
  reducers: {
    connect: (state, _action: PayloadAction<void>) => {
      return {
        ...state,
        state: SocketStatus.CONNECTED
      };
    },
    disconnect: (state, _action: PayloadAction<void>) => {
      return {
        ...state,
        state: SocketStatus.DISCONNECTED
      };
    }
  }
});
