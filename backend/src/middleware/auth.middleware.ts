import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JwtPayload } from "../utils/jwt";
import { UnauthorizedError } from "./error.middleware";

// 扩展 Express Request 类型以包含 user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * 认证中间件 - 验证 JWT Token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从 header 中提取 token
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw UnauthorizedError("No token provided");
    }

    // 验证 token
    const decoded = verifyToken(token);

    // 将用户信息附加到 request 对象
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(UnauthorizedError(error.message));
    } else {
      next(UnauthorizedError("Authentication failed"));
    }
  }
};

/**
 * 可选认证中间件 - 如果有 token 则验证，没有也继续
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // 可选认证失败不抛出错误，继续执行
    next();
  }
};

/**
 * 角色验证中间件
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(UnauthorizedError("Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(UnauthorizedError("Insufficient permissions"));
    }

    next();
  };
};
