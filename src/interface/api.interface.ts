// Mirrors: .NET ProblemDetails / validation error response shape
export interface ApiError {
  message?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>; // ASP.NET model validation errors
}
