import sgMail from "@sendgrid/mail";
import { NotificationService, Recipient, NotificationResponse } from "./init";

export class SendGridEmailService extends NotificationService {
  constructor(apiKey: string) {
    super();
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(
    to: Recipient,
    subject: string,
    body: string
  ): Promise<NotificationResponse> {
    try {
      const msg = {
        to: to.email,
        from: "your-email@example.com",
        subject,
        html: body,
      };

      const response = await sgMail.send(msg);

      return {
        messageId: response[0].headers["x-message-id"] || "",
        status: response[0].statusCode.toString(),
        provider: "SendGrid",
      };
    } catch (error) {
      //   console.error("Error sending email:", error);
      return {
        messageId: "",
        status: "failed",
        provider: "SendGrid",
      };
    }
  }

  async sendSMS(): Promise<NotificationResponse> {
    throw new Error("SendGrid does not support SMS");
  }
}
