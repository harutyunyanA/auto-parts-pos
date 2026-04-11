export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode?: string | undefined;

  constructor(message: string, statusCode: number = 400, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", errorCode: string = "NOT_FOUND") {
    super(message, 404, errorCode);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", errorCode: string = "BAD_REQUEST") {
    super(message, 400, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", errorCode: string = "UNAUTHORIZED") {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", errorCode: string = "FORBIDDEN") {
    super(message, 403, errorCode);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", errorCode: string = "INTERNAL_SERVER_ERROR") {
    super(message, 500, errorCode);
  }
}
