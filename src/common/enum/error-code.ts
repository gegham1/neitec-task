// 400
export enum BadRequestErrorCode {
  API_VALIDATION = 'API_VALIDATION',
  INVALID_TRANSACTION_STATUS = 'INVALID_TRANSACTION_STATUS',
}

// 401
export enum UnauthorizedErrorCode {
  UNAUTHORIZED_USER = 'UNAUTHORIZED_USER',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  OVERLAPPING_SESSION = 'OVERLAPPING_SESSION',
}

// 403
export enum ForbiddenErrorCode {
  TOKEN_IS_MISSING = 'TOKEN_IS_MISSING',
}

// 404
export enum NotFoundErrorCode {
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
}

// 500
export enum InternalServerErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export type ErrorCode =
  | BadRequestErrorCode
  | NotFoundErrorCode
  | InternalServerErrorCode
  | UnauthorizedErrorCode;

export const ErrorCodeValues = Object.assign(
  {},
  BadRequestErrorCode,
  InternalServerErrorCode,
  NotFoundErrorCode,
  UnauthorizedErrorCode,
);
