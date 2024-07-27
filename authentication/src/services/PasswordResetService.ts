import mongoose from "mongoose";
import { IPasswordReset } from "../database/models";
import { PasswordResetRepository } from "../database/repository";

/**
 * Service for managing password reset tokens.
 */
class PasswordResetService {
  private passwordResetRepository: PasswordResetRepository;

  /**
   * Initializes the PasswordResetService with a new repository instance.
   */
  constructor() {
    this.passwordResetRepository = new PasswordResetRepository();
  }

  /**
   * Creates a new password reset token.
   * @param {CreatePasswordResetParams} params - Object containing userId, resetToken, and expiresAt.
   * @returns {Promise<IPasswordReset>} - The created password reset token.
   */
  async createPasswordReset(
    params: CreatePasswordResetParams
  ): Promise<IPasswordReset> {
    const passwordReset =
      await this.passwordResetRepository.createPasswordReset(params);
    return passwordReset;
  }

  /**
   * Finds a password reset token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the password reset token to be found.
   * @returns {Promise<IPasswordReset | null>} - The found password reset token or null if not found.
   */
  async findPasswordResetById(
    id: mongoose.Types.ObjectId
  ): Promise<IPasswordReset | null> {
    return await this.passwordResetRepository.findById(id);
  }

  /**
   * Finds password reset tokens by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the password reset tokens.
   * @returns {Promise<IPasswordReset[]>} - An array of password reset tokens for the specified user.
   */
  async findPasswordResetsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IPasswordReset[]> {
    return await this.passwordResetRepository.findByUserId(userId);
  }

  /**
   * Finds a password reset token by reset token.
   * @param {string} resetToken - The reset token to be found.
   * @returns {Promise<IPasswordReset | null>} - The found password reset token or null if not found.
   */
  async findPasswordResetByToken(
    resetToken: string
  ): Promise<IPasswordReset | null> {
    return await this.passwordResetRepository.findByResetToken(resetToken);
  }

  /**
   * Deletes a password reset token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the password reset token to be deleted.
   * @returns {Promise<IPasswordReset | null>} - The deleted password reset token or null if not found.
   */
  async deletePasswordReset(
    id: mongoose.Types.ObjectId
  ): Promise<IPasswordReset | null> {
    return await this.passwordResetRepository.deletePasswordReset(id);
  }

  /**
   * Deletes all password reset tokens by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the password reset tokens to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted tokens.
   */
  async deletePasswordResetsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.passwordResetRepository.deleteByUserId({ userId });
  }

  /**
   * Deletes expired password reset tokens.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted tokens.
   */
  async deleteExpiredPasswordResets(): Promise<{ deletedCount?: number }> {
    const now = new Date();
    return await this.passwordResetRepository.deleteExpired({ now });
  }
}

/**
 * Parameters for creating a password reset token.
 */
interface CreatePasswordResetParams {
  userId: mongoose.Types.ObjectId;
  resetToken: string;
  expiresAt: Date;
}

export default PasswordResetService;
