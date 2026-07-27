export class ApiClientError extends Error {
    constructor(public statusCode: number, message: string, public details?: unknown) {
        super(message);  // Ithu parent class aaya Error-inte constructor call cheyyunnu.
        this.name = 'ApiClientError';
    }
}