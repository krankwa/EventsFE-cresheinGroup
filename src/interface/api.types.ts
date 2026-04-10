export interface ProblemDetails {
  status: number;
  title: string;
  detail: string;
  instance: string;
}

export class ApiError extends Error {
  status: number;
  title: string;
  detail: string;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
  }
}
