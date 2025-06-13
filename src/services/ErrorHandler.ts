import { FileReadError, FileReadTimeoutError } from '../utils/errors';

export class ErrorHandler {
  handle(error: unknown): string {
    let message = 'Une erreur inconnue est survenue';
    if (error instanceof FileReadTimeoutError) {
      message = error.message;
    } else if (error instanceof FileReadError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return message.replace(/[<>]/g, '').substring(0, 500);
  }
}

export const errorHandler = new ErrorHandler();
