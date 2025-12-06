import { Router } from "express";
import { login, getCurrentUser, refreshToken } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    管理员登录
 * @access  Public
 */
router.post("/login", validate(loginSchema), login);

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

export default router;
