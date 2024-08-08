// import { Notification } from '../models/Notification';
// import { User } from '../models/User';
// import { Template } from '../models/Template';

// export class NotificationService {
//   async createNotification(data: any): Promise<Notification> {
//     const notification = new Notification(data);
//     return notification.save();
//   }

//   async updateNotification(id: string, data: any): Promise<Notification | null> {
//     return Notification.findByIdAndUpdate(id, data, { new: true });
//   }

//   async deleteNotification(id: string): Promise<void> {
//     await Notification.findByIdAndDelete(id);
//   }

//   async viewNotification(id: string): Promise<Notification | null> {
//     return Notification.findById(id);
//   }

//   async listNotifications(query: any): Promise<Notification[]> {
//     return Notification.find(query);
//   }

//   async getUserSubscriptions(userId: string): Promise<any[]> {
//     const user = await User.findById(userId);
//     return user ? user.preferences.subscribedTypes : [];
//   }
// }
