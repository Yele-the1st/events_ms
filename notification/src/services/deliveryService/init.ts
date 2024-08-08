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

// Abstract class for notification services
export abstract class NotificationService {
  abstract sendEmail(
    to: Recipient, // Use the general Recipient interface
    subject: string,
    body: string,
    sourceEmail?: string, // Optional parameter
    replyToAddresses?: string[] // Optional parameter
  ): Promise<NotificationResponse | null>;

  abstract sendSMS(
    to: Recipient, // Use the general Recipient interface
    body: string
  ): Promise<NotificationResponse | null>;
}
