export enum MessageType {
  QUESTIONS = 'questions',
  ASK_QUESTION = 'ask_question',
  REPLY_QUESTION = 'reply_question',
  QUESTION_ADD = 'question_add',
  QUESTION_UPDATE = 'question_update'
}

export enum LoadingState {
  PENDING = 'pending',
  REQUEST = 'request',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export enum SocketStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected'
}
