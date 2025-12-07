import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export const sendContactNotification = async (contact: {
  name: string;
  email: string;
  message: string;
}) => {
  if (!process.env.ADMIN_EMAIL) {
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New contact message from ${contact.name}`,
    text: `From: ${contact.name} (${contact.email})\n\nMessage:\n${contact.message}`,
  });
};
