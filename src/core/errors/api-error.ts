export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request", details?: any) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation Failed", details?: any) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}
