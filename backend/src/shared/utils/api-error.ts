export class ApiError extends Error {
  statusCode = 400;

  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}