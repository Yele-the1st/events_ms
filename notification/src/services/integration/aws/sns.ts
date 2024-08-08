import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { NotificationResponse, Recipient } from "../types";

export class SNSSMSService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION!,
    });
  }

  async sendSMS(
    to: Recipient,
    body: string
  ): Promise<NotificationResponse | null> {
    const params = {
      Message: body,
      PhoneNumber: to.phoneNumber!, // PhoneNumber is required for SMS
    };

    try {
      const command = new PublishCommand(params);
      const response = await this.snsClient.send(command);

      return {
        messageId: response.MessageId || "",
        status: "sent",
        provider: "AWS SNS",
      };
    } catch (error) {
      console.error("Error sending SMS:", error);
      return null;
    }
  }
}

export default SNSSMSService;
