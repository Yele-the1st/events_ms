import sendgrid from "@sendgrid/mail";

const configureSendGrid = (apiKey: string): void => {
  sendgrid.setApiKey(apiKey);
};

export default configureSendGrid;
