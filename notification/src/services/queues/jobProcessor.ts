// import { EmailDeliveryService } from '../delivery/emailDeliveryService';
// import { SmsDeliveryService } from '../delivery/smsDeliveryService';
// import { NotificationService } from '../notification/notificationService';

// const emailDeliveryService = new EmailDeliveryService();
// const smsDeliveryService = new SmsDeliveryService();
// const notificationService = new NotificationService();

// export async function processNotificationJob(job: any) {
//   const { userId, templateId, provider, type } = job.data;

//   const user = await notificationService.viewNotification(userId);
//   const template = await notificationService.viewNotification(templateId);

//   if (!user || !template) {
//     throw new Error('User or template not found');
//   }

//   const emailBody = template.body; // Customize this if needed
//   const deliveryService = type === 'email' ? emailDeliveryService : smsDeliveryService;

//   try {
//     await deliveryService.sendEmail(user.email, template.subject, emailBody, provider);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// }
