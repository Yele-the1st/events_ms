import nodemailer from "nodemailer";
import { Recipient, NotificationResponse } from "./types";

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
    to: Recipient,
    subject: string,
    body: string,
    sourceEmail: string = process.env.SMTP_USER!, // Default to SMTP user if not provided
    replyToAddresses: string[] = []
  ): Promise<NotificationResponse | null> {
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
      console.error("Error sending email with Nodemailer:", error);
      return null;
    }
  }

  async sendSMS(): Promise<NotificationResponse | null> {
    throw new Error("Nodemailer does not support SMS");
  }
}

export default NodemailerEmailService;
