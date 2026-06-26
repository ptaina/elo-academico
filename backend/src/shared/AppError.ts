// SOLID - SRP: responsável apenas por representar erros de negócio da aplicação
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;

    // Mantém o stack trace correto no Node.js
    Error.captureStackTrace(this, this.constructor);
  }
}
