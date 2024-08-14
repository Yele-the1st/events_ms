import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NotificationResponse, SendEmailOptions } from "../types";

class SESEmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION!,
    });
  }

  async sendEmail(
    options: SendEmailOptions
  ): Promise<NotificationResponse | null> {
    const {
      to,
      subject,
      body,
      sourceEmail = process.env.SMTP_USER!,
      replyToAddresses = [],
    } = options;

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
}

export default SESEmailService;
