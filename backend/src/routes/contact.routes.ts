import { Router } from "express";
import { submitContact, getContactMessages, markAsRead } from "../controllers/contact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { contactSchema } from "../schemas/contact.schema";
import { contactLimiter } from "../middleware/rateLimit.middleware";
import { validateObjectId } from "../middleware/validateParams.middleware";

const router = Router();

/**
 * @route   POST /api/contact
 * @desc    提交联系消息
 * @access  Public
 */
router.post("/", contactLimiter, validate(contactSchema), submitContact);

/**
 * @route   GET /api/contact
 * @desc    获取所有联系消息
 * @access  Private (Admin)
 */
router.get("/", authenticate, getContactMessages);

/**
 * @route   PATCH /api/contact/:id/read
 * @desc    标记消息为已读
 * @access  Private (Admin)
 */
router.patch("/:id/read", authenticate, validateObjectId(), markAsRead);

export default router;
