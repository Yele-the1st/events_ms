import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NotificationService, Recipient, NotificationResponse } from "../init";

class SESEmailService extends NotificationService {
  private sesClient: SESClient;
  private awsAccessKeyId: string;
  private awsSecretAccessKey: string;
  private awsRegion: string;

  constructor(
    awsAccessKeyId: string,
    awsSecretAccessKey: string,
    awsRegion: string
  ) {
    super();
    this.awsAccessKeyId = awsAccessKeyId;
    this.awsSecretAccessKey = awsSecretAccessKey;
    this.awsRegion = awsRegion;
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: this.awsAccessKeyId,
        secretAccessKey: this.awsSecretAccessKey,
      },
      region: this.awsRegion,
    });
  }

  async sendEmail(
    to: Recipient,
    subject: string,
    body: string,
    sourceEmail: string,
    replyToAddresses: string[]
  ): Promise<NotificationResponse | null> {
    const params = {
      Source: sourceEmail,
      Destination: {
        ToAddresses: [to.email!],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
      },
      ReplyToAddresses: replyToAddresses,
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);

      return {
        messageId: response.MessageId || "",
        status: "sent",
        provider: "AWS SES",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return null;
    }
  }

  async sendSMS(): Promise<NotificationResponse | null> {
    throw new Error("AWS SES does not support SMS");
  }
}

export default SESEmailService;
