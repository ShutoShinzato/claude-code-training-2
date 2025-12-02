/**
 * API成功レスポンス
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

/**
 * APIレスポンス型
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * ヘルスチェックレスポンス
 */
export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
}
