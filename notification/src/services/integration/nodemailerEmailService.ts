import nodemailer from "nodemailer";
import { NotificationResponse, SendEmailOptions } from "./types";
import logger from "../../config/winston/logger";

export class NodemailerEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
  }

  async sendEmail(
    options: SendEmailOptions
  ): Promise<NotificationResponse | null> {
    const {
      to,
      subject,
      body,
      sourceEmail = process.env.SMTP_USER!,
      replyToAddresses = [],
    } = options;

    const mailOptions = {
      from: sourceEmail,
      to: to.email!,
      subject: subject,
      html: body,
      replyTo: replyToAddresses.length
        ? replyToAddresses.join(", ")
        : undefined,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      return {
        messageId: info.messageId || "",
        status: "sent",
        provider: "Nodemailer",
      };
    } catch (error) {
      logger.error("Error sending email with Nodemailer:", error);
      return null;
    }
  }
}

export default NodemailerEmailService;
