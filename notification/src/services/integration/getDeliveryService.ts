import SESEmailService from "./aws/ses";
import { SNSSMSService } from "./aws/sns";
import NodemailerEmailService from "./nodemailerEmailService";
import SendGridEmailService from "./sendGridEmailService";
import TwilioSMSService from "./twilioSMSService";
import { EmailService, SMSService } from "./types";

export function getDeliveryService(
  type: "email",
  provider: "SENDGRID" | "SES" | "NODEMAILER"
): EmailService;

export function getDeliveryService(
  type: "sms",
  provider: "Twilio" | "SNS"
): SMSService;

export function getDeliveryService(
  type: "email" | "sms",
  provider: string
): EmailService | SMSService {
  switch (provider) {
    case "SENDGRID":
      if (type !== "email") throw new Error("SENDGRID is an email service");
      return new SendGridEmailService(); // Now handles env variables internally

    case "SES":
      if (type !== "email") throw new Error("SES is an email service");
      return new SESEmailService(); // Now handles env variables internally

    case "NODEMAILER":
      if (type !== "email") throw new Error("NODEMAILER is an email service");
      return new NodemailerEmailService(); // Now handles env variables internally

    case "Twilio":
      if (type !== "sms") throw new Error("Twilio is an SMS service");
      return new TwilioSMSService(); // Now handles env variables internally

    case "SNS":
      if (type !== "sms") throw new Error("SNS is an SMS service");
      return new SNSSMSService(); // Now handles env variables internally

    default:
      throw new Error("Unsupported provider");
  }
}
