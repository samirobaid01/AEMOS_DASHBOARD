export interface ApiRejectPayload {
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ApiDataWrapper<T> {
  data: T;
}

export interface ApiDeleteResponse {
  status?: string;
}
