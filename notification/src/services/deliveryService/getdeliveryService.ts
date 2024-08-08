import SESEmailService from "./aws/ses";
import { SNSSMSService } from "./aws/sns";
import { NotificationService } from "./init";
import { NodemailerEmailService } from "./nodemailerEmailService";
import { SendGridEmailService } from "./sendGridEmailService";
import { TwilioSMSService } from "./twilioSMSService";

export function getNotificationService(
  type: "email" | "sms",
  provider: string
): NotificationService {
  switch (provider) {
    case "SendGrid":
      return new SendGridEmailService(process.env.SENDGRID_API_KEY!);
    case "Twilio":
      return new TwilioSMSService(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
    case "AWS SES":
      return new SESEmailService(
        process.env.AWS_ACCESS_KEY_ID!,
        process.env.AWS_SECRET_ACCESS_KEY!,
        process.env.AWS_REGION!
      );
    case "AWS SNS":
      return new SNSSMSService(
        process.env.AWS_ACCESS_KEY_ID!,
        process.env.AWS_SECRET_ACCESS_KEY!,
        process.env.AWS_REGION!
      );
    case "Nodemailer":
      return new NodemailerEmailService(
        process.env.SMTP_HOST!,
        Number(process.env.SMTP_PORT),
        process.env.SMTP_USER!,
        process.env.SMTP_PASS!
      );
    default:
      throw new Error("Unsupported provider");
  }
}
