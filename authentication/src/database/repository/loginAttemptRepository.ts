import mongoose from "mongoose";
import { LoginAttempt, ILoginAttempt } from "../models";

interface CreateLoginAttemptParams {
  userId: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp?: Date;
}

interface FindByTimeRangeParams {
  start: Date;
  end: Date;
}

interface DeleteOldAttemptsParams {
  beforeDate: Date;
}

class LoginAttemptRepository {
  /**
   * Creates a new login attempt.
   * @param {CreateLoginAttemptParams} params - Object containing userId, ipAddress, userAgent, success, and optional timestamp.
   * @returns {Promise<ILoginAttempt>} - The created login attempt.
   */
  async createLoginAttempt({
    userId,
    ipAddress,
    userAgent,
    success,
  }: CreateLoginAttemptParams): Promise<ILoginAttempt> {
    const loginAttempt = new LoginAttempt({
      userId,
      ipAddress,
      userAgent,
      success,
    });

    const result = await loginAttempt.save();
    return result;
  }

  /**
   * Finds a login attempt by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the login attempt.
   * @returns {Promise<ILoginAttempt | null>} - The found login attempt or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<ILoginAttempt | null> {
    return await LoginAttempt.findById(id).exec();
  }

  /**
   * Finds login attempts by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID.
   * @returns {Promise<ILoginAttempt[]>} - The found login attempts.
   */
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({ userId }).exec();
  }

  /**
   * Finds login attempts by IP address.
   * @param {string} ipAddress - The IP address.
   * @returns {Promise<ILoginAttempt[]>} - The found login attempts.
   */
  async findByIpAddress(ipAddress: string): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({ ipAddress }).exec();
  }

  /**
   * Finds login attempts by success status.
   * @param {boolean} success - The success status.
   * @returns {Promise<ILoginAttempt[]>} - The found login attempts.
   */
  async findBySuccess(success: boolean): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({ success }).exec();
  }

  /**
   * Finds login attempts within a specific time range.
   * @param {FindByTimeRangeParams} params - Object containing start and end dates.
   * @returns {Promise<ILoginAttempt[]>} - The found login attempts.
   */
  async findByTimeRange({
    start,
    end,
  }: FindByTimeRangeParams): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({
      timestamp: { $gte: start, $lte: end },
    }).exec();
  }

  /**
   * Deletes a login attempt by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the login attempt.
   * @returns {Promise<ILoginAttempt | null>} - The deleted login attempt or null if not found.
   */
  async deleteLoginAttempt(
    id: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt | null> {
    return await LoginAttempt.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes login attempts by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted login attempts.
   */
  async deleteByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    const result = await LoginAttempt.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }

  /**
   * Deletes all login attempts by IP address.
   * @param {string} ipAddress - The IP address.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted login attempts.
   */
  async deleteByIpAddress(
    ipAddress: string
  ): Promise<{ deletedCount?: number }> {
    const result = await LoginAttempt.deleteMany({ ipAddress }).exec();
    return { deletedCount: result.deletedCount };
  }

  /**
   * Deletes all login attempts older than a specific date.
   * @param {DeleteOldAttemptsParams} params - Object containing the date before which login attempts should be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted login attempts.
   */
  async deleteOldAttempts({
    beforeDate,
  }: DeleteOldAttemptsParams): Promise<{ deletedCount?: number }> {
    const result = await LoginAttempt.deleteMany({
      timestamp: { $lt: beforeDate },
    }).exec();
    return { deletedCount: result.deletedCount };
  }
}

export default LoginAttemptRepository;
