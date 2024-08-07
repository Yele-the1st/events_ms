import twilio from "twilio";

let twilioClient: twilio.Twilio;

const configureTwilio = (accountSid: string, authToken: string): void => {
  twilioClient = twilio(accountSid, authToken);
};

const getTwilioClient = (): twilio.Twilio => {
  if (!twilioClient) {
    throw new Error("Twilio client not configured");
  }
  return twilioClient;
};

export { configureTwilio, getTwilioClient };
