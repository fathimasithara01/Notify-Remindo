export class ApiClientError extends Error {
    constructor(public statusCode: number, message: string, public details?: unknown) {
        super(message);
        this.name = 'ApiClientError';
    }
}