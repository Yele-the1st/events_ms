import sgMail from "@sendgrid/mail";
import { Recipient, NotificationResponse } from "./types";

export class SendGridEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmail(
    to: Recipient,
    subject: string,
    body: string,
    sourceEmail: string, // Default to SendGrid's from email
    replyToAddresses: string[] = []
  ): Promise<NotificationResponse | null> {
    const msg = {
      to: to.email!,
      from: sourceEmail,
      subject: subject,
      html: body,
      replyTo: replyToAddresses.length ? replyToAddresses[0] : undefined,
    };

    try {
      const response = await sgMail.send(msg);

      return {
        messageId: response[0].headers["x-message-id"] || "",
        status: "sent",
        provider: "SendGrid",
      };
    } catch (error) {
      console.error("Error sending email with SendGrid:", error);
      return null;
    }
  }

  async sendSMS(): Promise<NotificationResponse | null> {
    throw new Error("SendGrid does not support SMS");
  }
}

export default SendGridEmailService;
