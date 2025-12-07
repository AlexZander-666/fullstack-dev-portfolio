import { Router } from "express";
import { login, getCurrentUser, refreshToken, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../schemas/auth.schema";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    管理员登录
 * @access  Public
 */
router.post("/login", authLimiter, validate(loginSchema), login);

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get("/me", authenticate, getCurrentUser);

/**
 * @route   POST /api/auth/refresh
 * @desc    刷新 Token
 * @access  Private
 */
router.post("/refresh", authenticate, refreshToken);

router.post("/logout", authenticate, logout);

export default router;
