import mongoose from "mongoose";
import { PasswordReset, IPasswordReset } from "../models";

interface CreatePasswordResetParams {
  userId: mongoose.Types.ObjectId;
  resetToken: string;
  expiresAt: Date;
}

interface UpdatePasswordResetParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IPasswordReset>;
}

interface DeleteByUserIdParams {
  userId: mongoose.Types.ObjectId;
}

interface DeleteExpiredParams {
  now: Date;
}

class PasswordResetRepository {
  /**
   * Creates a new password reset entry.
   * @param {CreatePasswordResetParams} params - Object containing userId, resetToken, and expiresAt.
   * @returns {Promise<IPasswordReset>} - The created password reset entry.
   */
  async createPasswordReset({
    userId,
    resetToken,
    expiresAt,
  }: CreatePasswordResetParams): Promise<IPasswordReset> {
    const passwordReset = new PasswordReset({
      userId,
      resetToken,
      expiresAt,
    });

    const result = await passwordReset.save();
    return result;
  }

  /**
   * Finds a password reset entry by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the password reset entry.
   * @returns {Promise<IPasswordReset | null>} - The found password reset entry or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<IPasswordReset | null> {
    return await PasswordReset.findById(id).exec();
  }

  /**
   * Finds a password reset entry by reset token.
   * @param {string} resetToken - The reset token.
   * @returns {Promise<IPasswordReset | null>} - The found password reset entry or null if not found.
   */
  async findByResetToken(resetToken: string): Promise<IPasswordReset | null> {
    return await PasswordReset.findOne({ resetToken }).exec();
  }

  /**
   * Finds password reset entries by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID.
   * @returns {Promise<IPasswordReset[]>} - The found password reset entries.
   */
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IPasswordReset[]> {
    return await PasswordReset.find({ userId }).exec();
  }

  /**
   * Updates a password reset entry by ID.
   * @param {UpdatePasswordResetParams} params - Object containing id and updateFields.
   * @returns {Promise<IPasswordReset | null>} - The updated password reset entry or null if not found.
   */
  async updatePasswordReset({
    id,
    updateFields,
  }: UpdatePasswordResetParams): Promise<IPasswordReset | null> {
    return await PasswordReset.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a password reset entry by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the password reset entry.
   * @returns {Promise<IPasswordReset | null>} - The deleted password reset entry or null if not found.
   */
  async deletePasswordReset(
    id: mongoose.Types.ObjectId
  ): Promise<IPasswordReset | null> {
    return await PasswordReset.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes password reset entries by user ID.
   * @param {DeleteByUserIdParams} params - Object containing userId.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted password reset entries.
   */
  async deleteByUserId({
    userId,
  }: DeleteByUserIdParams): Promise<{ deletedCount?: number }> {
    const result = await PasswordReset.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }

  /**
   * Deletes expired password reset entries.
   * @param {DeleteExpiredParams} params - Object containing the current date and time.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted password reset entries.
   */
  async deleteExpired({
    now,
  }: DeleteExpiredParams): Promise<{ deletedCount?: number }> {
    const result = await PasswordReset.deleteMany({
      expiresAt: { $lt: now },
    }).exec();
    return { deletedCount: result.deletedCount };
  }
}

export default PasswordResetRepository;
