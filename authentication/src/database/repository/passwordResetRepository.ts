import mongoose from "mongoose";
import { PasswordReset, IPasswordReset } from "../models";

class PasswordResetRepository {
  // Create a new password reset entry
  async createPasswordReset(
    userId: mongoose.Types.ObjectId,
    resetToken: string,
    expiresAt: Date
  ): Promise<IPasswordReset> {
    const passwordReset = new PasswordReset({
      userId,
      resetToken,
      expiresAt,
    });

    const result = await passwordReset.save();
    return result;
  }

  // Find a password reset entry by ID
  async findById(id: mongoose.Types.ObjectId): Promise<IPasswordReset | null> {
    return await PasswordReset.findById(id).exec();
  }

  // Find a password reset entry by reset token
  async findByResetToken(resetToken: string): Promise<IPasswordReset | null> {
    return await PasswordReset.findOne({ resetToken }).exec();
  }

  // Find password reset entries by user ID
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IPasswordReset[]> {
    return await PasswordReset.find({ userId }).exec();
  }

  // Update a password reset entry by ID
  async updatePasswordReset(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IPasswordReset>
  ): Promise<IPasswordReset | null> {
    return await PasswordReset.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete a password reset entry by ID
  async deletePasswordReset(
    id: mongoose.Types.ObjectId
  ): Promise<IPasswordReset | null> {
    return await PasswordReset.findByIdAndDelete(id).exec();
  }

  // Delete password reset entries by user ID
  async deleteByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await PasswordReset.deleteMany({ userId }).exec();
  }

  // Delete expired password reset entries
  async deleteExpired(): Promise<{ deletedCount?: number }> {
    const now = new Date();
    return await PasswordReset.deleteMany({ expiresAt: { $lt: now } }).exec();
  }
}

export default PasswordResetRepository;
