import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from './selectors';
import { MessageType } from './constants';
import { Question } from './types';
import { ChatSlice, SocketSlice } from './slices';

export const useSocket = () => {
  const dispatch = useDispatch();
  const socket = useSelector(getSocket);

  useEffect(() => {
    const onConnect = () => {
      dispatch(SocketSlice.actions.connect());
    };
    const onDisconnect = () => {
      dispatch(SocketSlice.actions.disconnect());
    };
    const onQuestions = (questions: Question[]) => {
      dispatch(ChatSlice.actions.init(questions));
    };
    const onQuestionAdd = (question: Question) => {
      dispatch(ChatSlice.actions.questionAdd(question));
    };
    const onQuestionUpdate = (question: Question) => {
      setTimeout(() => {
        dispatch(ChatSlice.actions.questionUpdate(question));
      }, 5000);
    };

    socket.on('connect', onConnect);
    socket.on(MessageType.QUESTIONS, onQuestions);
    socket.on(MessageType.QUESTION_ADD, onQuestionAdd);
    socket.on(MessageType.QUESTION_UPDATE, onQuestionUpdate);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off(MessageType.QUESTIONS, onQuestions);
      socket.off(MessageType.QUESTION_ADD, onQuestionAdd);
      socket.off(MessageType.QUESTION_UPDATE, onQuestionUpdate);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  return null;
};
