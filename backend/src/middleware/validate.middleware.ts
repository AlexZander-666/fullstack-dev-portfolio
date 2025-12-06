import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "./error.middleware";

/**
 * 验证中间件工厂函数
 * @param schema Zod 验证 schema
 * @param source 验证来源 (body, query, params)
 */
export const validate = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 验证数据
      const validated = await schema.parseAsync(req[source]);
      
      // 将验证后的数据替换原始数据
      req[source] = validated;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // 格式化 Zod 错误
        const details = error.issues.reduce((acc, err) => {
          const path = err.path.join(".");
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>);

        next(ValidationError("Validation failed", details));
      } else {
        next(error);
      }
    }
  };
};

/**
 * 验证分页参数
 */
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // 限制分页参数范围
  req.query.page = Math.max(1, page).toString();
  req.query.limit = Math.min(Math.max(1, limit), 100).toString();

  next();
};
