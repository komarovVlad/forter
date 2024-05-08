import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../../store';

export const getChatState = (state: AppState) => state.chat;

export const getQuestions = createSelector(getChatState, (chatState) => chatState.questions);

export const getAuthor = createSelector(getChatState, (chatState) => chatState.author);

export const getLoadingState = createSelector(getChatState, (chatState) => chatState.loading);

export const getSocketState = (state: AppState) => state.socket;

export const getSocket = createSelector(getSocketState, (socketState) => socketState.socket);

export const getSocketStatus = createSelector(getSocketState, (socketState) => socketState.status);
