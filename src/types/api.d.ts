export interface ApiRejectPayload {
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiDataWrapper<T> {
  data: T;
}
