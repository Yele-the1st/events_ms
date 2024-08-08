import nodemailer from "nodemailer";
import { NotificationService, Recipient, NotificationResponse } from "./init";

export class NodemailerEmailService extends NotificationService {
  private transporter: nodemailer.Transporter;

  constructor(host: string, port: number, user: string, pass: string) {
    super();

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true if port is 465, false otherwise
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(
    to: Recipient,
    subject: string,
    body: string,
    sourceEmail: string,
    replyToAddresses: string[]
  ): Promise<NotificationResponse> {
    try {
      const info = await this.transporter.sendMail({
        from: sourceEmail,
        to: to.email,
        subject,
        html: body, // Make sure 'body' is used here
        replyTo: replyToAddresses,
      });

      // Determine status based on whether the email was accepted
      const status = info.accepted.length > 0 ? "sent" : "failed";

      return {
        messageId: info.messageId || "",
        status,
        provider: "Nodemailer",
      };
    } catch (error) {
      // Handle errors and return a failed status
      //   console.error("Error sending email:", error);
      return {
        messageId: "",
        status: "failed",
        provider: "Nodemailer",
      };
    }
  }

  async sendSMS(): Promise<NotificationResponse> {
    throw new Error("Nodemailer does not support SMS");
  }
}
