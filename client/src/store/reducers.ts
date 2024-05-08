import { combineReducers } from '@reduxjs/toolkit';
import { ChatSlice, SocketSlice } from '../pages/Chat/slices';

export const reducers = combineReducers({
  chat: ChatSlice.reducer,
  socket: SocketSlice.reducer
});
