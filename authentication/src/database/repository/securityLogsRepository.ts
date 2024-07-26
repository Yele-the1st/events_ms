import mongoose from "mongoose";
import { SecurityLog, ISecurityLog } from "../models";

class SecurityLogRepository {
  // Create a new security log
  async createLog(
    userId: mongoose.Types.ObjectId,
    action: string,
    ipAddress: string,
    userAgent: string,
    details: string
  ): Promise<ISecurityLog> {
    const securityLog = new SecurityLog({
      userId,
      action,
      ipAddress,
      userAgent,
      details,
    });

    const result = await securityLog.save();
    return result;
  }

  // Find a security log by ID
  async findById(id: mongoose.Types.ObjectId): Promise<ISecurityLog | null> {
    return await SecurityLog.findById(id).exec();
  }

  // Find security logs by user ID
  async findByUserId(userId: mongoose.Types.ObjectId): Promise<ISecurityLog[]> {
    return await SecurityLog.find({ userId }).exec();
  }

  // Find security logs by action
  async findByAction(action: string): Promise<ISecurityLog[]> {
    return await SecurityLog.find({ action }).exec();
  }

  // Update a security log by ID
  async updateLog(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<ISecurityLog>
  ): Promise<ISecurityLog | null> {
    return await SecurityLog.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete a security log by ID
  async deleteLog(id: mongoose.Types.ObjectId): Promise<ISecurityLog | null> {
    return await SecurityLog.findByIdAndDelete(id).exec();
  }

  // Delete logs by user ID
  async deleteLogsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await SecurityLog.deleteMany({ userId }).exec();
  }
}

export default SecurityLogRepository;
