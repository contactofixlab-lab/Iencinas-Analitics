/** Standard envelope every /api route returns. */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  source: string;        // which datasource produced it ("mock" | "crm")
  generatedAt: string;   // ISO timestamp
}

export interface ApiFailure {
  ok: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
