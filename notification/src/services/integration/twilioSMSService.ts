import { Twilio } from "twilio";
import { NotificationResponse, SendSMSOptions } from "./types";
import logger from "../../config/winston/logger";

export class TwilioSMSService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }

  async sendSMS(options: SendSMSOptions): Promise<NotificationResponse | null> {
    const { to, body } = options;

    try {
      const message = await this.twilioClient.messages.create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER!, // Your Twilio phone number
        to: to.phoneNumber!, // Recipient's phone number
      });

      return {
        messageId: message.sid || "",
        status: message.status || "sent",
        provider: "Twilio",
      };
    } catch (error) {
      logger.error("Error sending SMS with Twilio:", error);
      return null;
    }
  }
}

export default TwilioSMSService;
