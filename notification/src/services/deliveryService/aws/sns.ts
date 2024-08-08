import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { NotificationService, NotificationResponse, Recipient } from "../init";

export class SNSSMSService extends NotificationService {
  private sns: SNSClient;

  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    super();
    this.sns = new SNSClient({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });
  }

  async sendEmail(): Promise<NotificationResponse | null> {
    throw new Error("AWS SNS does not support email");
  }

  async sendSMS(
    to: Recipient, // The parameter type is string, aligning with NotificationService
    body: string
  ): Promise<NotificationResponse> {
    try {
      const params = {
        Message: body,
        PhoneNumber: to.phoneNumber,
      };

      const command = new PublishCommand(params);
      const response = await this.sns.send(command);
      return {
        messageId: response.MessageId || "",
        status: "sent",
        provider: "AWS SNS",
      };
    } catch (error) {
      //   console.error("Error sending SMS:", error);
      return {
        messageId: "",
        status: "failed",
        provider: "AWS SNS",
      };
    }
  }
}
