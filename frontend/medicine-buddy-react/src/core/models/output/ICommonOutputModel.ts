export interface ICommonOutputType<T> {
  contextTitle: ContextTitle;
  contextSubTitle: ContextSubTitle;
  contextStatus: ContextStatus;
  message: string;
  model: T;
}

enum ContextTitle {
  AUTH = 1,
  USER,
  HOME,
}
enum ContextSubTitle {
  LOGIN = 1,
  REGISTER,
  REFRESHTOKEN,
  PROFILE,
  HISTORY,
  DISEASE,
  QUESTION,
  MEDICINE,
}
enum ContextStatus {
  INIT = 1,
  PENDING,
  PROGRESS,
  SUCCESS,
  FAIL,
  HOLD,
  CANCELLED,
}
