import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "An unexpected error occurred";

  // 记录错误日志
  console.error(`[${new Date().toISOString()}] ${code}: ${message}`, {
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.details && { details: err.details }),
    },
  });
};

// 创建自定义错误的工厂函数
export const createError = (
  message: string,
  statusCode: number,
  code: string,
  details?: Record<string, unknown>
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

// 常用错误
export const NotFoundError = (resource: string) =>
  createError(`${resource} not found`, 404, "NOT_FOUND");

export const ValidationError = (message: string, details?: Record<string, unknown>) =>
  createError(message, 400, "VALIDATION_ERROR", details);

export const UnauthorizedError = (message = "Unauthorized") =>
  createError(message, 401, "UNAUTHORIZED");

export const ForbiddenError = (message = "Forbidden") =>
  createError(message, 403, "FORBIDDEN");
