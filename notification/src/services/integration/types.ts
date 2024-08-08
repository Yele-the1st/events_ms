// Define a more general interface for recipients that includes email and phone number
export interface Recipient {
  name?: string; // Optional, as it may not be needed for SMS
  email?: string; // Optional, as it may not be needed for SMS
  phoneNumber?: string; // Optional, as it may not be needed for email
}

export interface NotificationResponse {
  messageId: string;
  status: string;
  provider: string;
}

export interface EmailService {
  sendEmail(
    to: Recipient,
    subject: string,
    body: string,
    sourceEmail?: string,
    replyToAddresses?: string[]
  ): Promise<NotificationResponse | null>;
}

export interface SMSService {
  sendSMS(to: Recipient, body: string): Promise<NotificationResponse | null>;
}
