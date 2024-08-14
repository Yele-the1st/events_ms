import sgMail from "@sendgrid/mail";
import { NotificationResponse, SendEmailOptions } from "./types";
import logger from "../../config/winston/logger";

export class SendGridEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendEmail(
    options: SendEmailOptions
  ): Promise<NotificationResponse | null> {
    const {
      to,
      subject,
      body,
      sourceEmail = process.env.SENDGRID_FROM_EMAIL!,
      replyToAddresses = [],
    } = options;

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
      logger.error("Error sending email with SendGrid:", error);
      return null;
    }
  }
}

export default SendGridEmailService;
