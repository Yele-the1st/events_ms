import mongoose from "mongoose";
import { LoginAttempt, ILoginAttempt } from "../models";

class LoginAttemptRepository {
  // Create a new login attempt
  async createLoginAttempt(
    userId: mongoose.Types.ObjectId,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    timestamp: Date = new Date()
  ): Promise<ILoginAttempt> {
    const loginAttempt = new LoginAttempt({
      userId,
      ipAddress,
      userAgent,
      success,
      timestamp,
    });

    const result = await loginAttempt.save();
    return result;
  }

  // Find a login attempt by ID
  async findById(id: mongoose.Types.ObjectId): Promise<ILoginAttempt | null> {
    return await LoginAttempt.findById(id).exec();
  }

  // Find login attempts by user ID
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({ userId }).exec();
  }

  // Find login attempts by success status
  async findBySuccess(success: boolean): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({ success }).exec();
  }

  // Find login attempts within a specific time range
  async findByTimeRange(start: Date, end: Date): Promise<ILoginAttempt[]> {
    return await LoginAttempt.find({
      timestamp: { $gte: start, $lte: end },
    }).exec();
  }

  // Delete a login attempt by ID
  async deleteLoginAttempt(
    id: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt | null> {
    return await LoginAttempt.findByIdAndDelete(id).exec();
  }

  // Delete login attempts by user ID
  async deleteByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await LoginAttempt.deleteMany({ userId }).exec();
  }

  // Delete all login attempts older than a specific date
  async deleteOldAttempts(
    beforeDate: Date
  ): Promise<{ deletedCount?: number }> {
    return await LoginAttempt.deleteMany({
      timestamp: { $lt: beforeDate },
    }).exec();
  }
}

export default LoginAttemptRepository;
