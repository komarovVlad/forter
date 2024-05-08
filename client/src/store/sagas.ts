import { all } from 'redux-saga/effects';
import { watchChat } from '../pages/Chat/sagas';

export function* rootSaga() {
  yield all([watchChat()]);
}
