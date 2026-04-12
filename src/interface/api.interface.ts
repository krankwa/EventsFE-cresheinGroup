//from .NET ProblemDetails / validation error response
export interface ApiError {
  message?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
