import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { ValidationError, UnauthorizedError } from "../middleware/error.middleware";

/**
 * 登录
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      throw ValidationError("Email and password are required");
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      throw UnauthorizedError("Invalid email or password");
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw UnauthorizedError("Invalid email or password");
    }

    // 生成 token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 返回响应
    res.json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw UnauthorizedError("Not authenticated");
    }

    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      throw UnauthorizedError("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 刷新 Token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw UnauthorizedError("Not authenticated");
    }

    // 生成新 token
    const token = generateToken({
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });

    res.json({
      success: true,
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
