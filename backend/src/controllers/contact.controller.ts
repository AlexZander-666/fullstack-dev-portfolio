import { Request, Response, NextFunction } from "express";
import { ContactMessage } from "../models/ContactMessage";

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
      name,
      email,
      message,
      read: false,
    });

    // TODO: 可选 - 发送邮件通知
    // await sendEmailNotification(contactMessage);

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
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages,
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
