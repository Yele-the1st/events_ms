import mongoose from "mongoose";
import { SecurityLog, ISecurityLog } from "../models";

interface CreateLogParams {
  userId: mongoose.Types.ObjectId;
  action: string;
  ipAddress: string;
  userAgent: string;
  details: string;
}

interface UpdateLogParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<ISecurityLog>;
}

interface DeleteLogsByUserIdParams {
  userId: mongoose.Types.ObjectId;
}

class SecurityLogRepository {
  /**
   * Creates a new security log.
   * @param {CreateLogParams} params - Object containing details for the new log.
   * @returns {Promise<ISecurityLog>} - The created security log.
   */
  async createLog({
    userId,
    action,
    ipAddress,
    userAgent,
    details,
  }: CreateLogParams): Promise<ISecurityLog> {
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

  /**
   * Finds a security log by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the security log.
   * @returns {Promise<ISecurityLog | null>} - The found security log or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<ISecurityLog | null> {
    return await SecurityLog.findById(id).exec();
  }

  /**
   * Finds security logs by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user.
   * @returns {Promise<ISecurityLog[]>} - List of security logs for the user.
   */
  async findByUserId(userId: mongoose.Types.ObjectId): Promise<ISecurityLog[]> {
    return await SecurityLog.find({ userId }).exec();
  }

  /**
   * Finds security logs by action.
   * @param {string} action - The action of the security logs.
   * @returns {Promise<ISecurityLog[]>} - List of security logs matching the action.
   */
  async findByAction(action: string): Promise<ISecurityLog[]> {
    return await SecurityLog.find({ action }).exec();
  }

  /**
   * Updates a security log by ID.
   * @param {UpdateLogParams} params - Object containing ID and fields to update.
   * @returns {Promise<ISecurityLog | null>} - The updated security log or null if not found.
   */
  async updateLog({
    id,
    updateFields,
  }: UpdateLogParams): Promise<ISecurityLog | null> {
    return await SecurityLog.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a security log by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the security log.
   * @returns {Promise<ISecurityLog | null>} - The deleted security log or null if not found.
   */
  async deleteLog(id: mongoose.Types.ObjectId): Promise<ISecurityLog | null> {
    return await SecurityLog.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes logs by user ID.
   * @param {DeleteLogsByUserIdParams} params - Object containing the user ID.
   * @returns {Promise<{ deletedCount?: number }>} - Object containing the count of deleted logs.
   */
  async deleteLogsByUserId({
    userId,
  }: DeleteLogsByUserIdParams): Promise<{ deletedCount?: number }> {
    const result = await SecurityLog.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }
}

export default SecurityLogRepository;
