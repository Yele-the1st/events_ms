import twilio from "twilio";
import { NotificationService, NotificationResponse, Recipient } from "./init";

export class TwilioSMSService extends NotificationService {
  private client;

  constructor(accountSid: string, authToken: string) {
    super();
    this.client = twilio(accountSid, authToken);
  }

  async sendEmail(): Promise<NotificationResponse> {
    throw new Error("Twilio does not support email");
  }

  async sendSMS(to: Recipient, body: string): Promise<NotificationResponse> {
    try {
      const message = await this.client.messages.create({
        body,
        from: "your-twilio-number",
        to: to.phoneNumber!, // Use 'to.email' for the recipient's phone number
      });

      return {
        messageId: message.sid,
        status: message.status,
        provider: "Twilio",
      };
    } catch (error) {
      //   console.error("Error sending SMS:", error);
      return {
        messageId: "",
        status: "failed",
        provider: "Twilio",
      };
    }
  }
}
