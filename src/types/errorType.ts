import { HttpStatusCode } from './HTTP-Response';

export type ErrorType = {
  message: string;
  field: string;
};

export class HttpError extends Error {
  public readonly statusCode: HttpStatusCode;

  constructor(message: string, statusCode: HttpStatusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
