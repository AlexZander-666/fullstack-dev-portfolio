import { Request, Response, NextFunction } from "express";
import xss from "xss";
import { ContactMessage } from "../models/ContactMessage";
import { sendContactNotification } from "../utils/email";
import logger from "../utils/logger";

/**
 * 提交联系消息
 */
export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name: xss(name),
      email: xss(email),
      message: xss(message),
      read: false,
    });

    // TODO: 可选 - 发送邮件通知
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendContactNotification({ name, email, message });
      } catch (error) {
        logger.error(`Failed to send contact notification: ${(error as Error).message}`);
      }
    }

    res.status(201).json({
      success: true,
      data: {
        message: "Message sent successfully. We'll get back to you soon!",
        id: contactMessage._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取所有联系消息（管理员）
 */
export const getContactMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 标记消息为已读（管理员）
 */
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Message not found",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};
