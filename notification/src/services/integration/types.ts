// Define a more general interface for recipients that includes email and phone number
export interface Recipient {
  name?: string; // Optional, as it may not be needed for SMS
  email?: string; // Optional, as it may not be needed for SMS
  phoneNumber?: string; // Optional, as it may not be needed for email
}

// Options for sending email
export interface SendEmailOptions {
  to: Recipient;
  subject: string;
  body: string;
  sourceEmail?: string; // Optional, default to environment variable if not provided
  replyToAddresses?: string[]; // Optional, default to empty array if not provided
}

// Options for sending SMS
export interface SendSMSOptions {
  to: Recipient; // Assumes phoneNumber is required
  body: string;
}

export interface NotificationResponse {
  messageId: string;
  status: string;
  provider: string;
}

export interface EmailService {
  sendEmail(options: SendEmailOptions): Promise<NotificationResponse | null>;
}

export interface SMSService {
  sendSMS(options: SendSMSOptions): Promise<NotificationResponse | null>;
}
