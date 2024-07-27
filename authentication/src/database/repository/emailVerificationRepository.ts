import mongoose from "mongoose";
import { EmailVerificationToken, IEmailVerificationToken } from "../models";

interface CreateEmailVerificationTokenParams {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

interface UpdateEmailVerificationTokenParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IEmailVerificationToken>;
}

interface DeleteByUserIdParams {
  userId: mongoose.Types.ObjectId;
}

interface DeleteExpiredTokensParams {
  currentDate: Date;
}

class EmailVerificationTokenRepository {
  /**
   * Creates a new email verification token.
   * @param {CreateEmailVerificationTokenParams} params - Object containing user ID and token.
   * @returns {Promise<IEmailVerificationToken>} - The created email verification token.
   */
  async createEmailVerificationToken({
    userId,
    token,
    expiresAt,
  }: CreateEmailVerificationTokenParams): Promise<IEmailVerificationToken> {
    const emailVerificationToken = new EmailVerificationToken({
      userId,
      token,
      expiresAt,
    });

    return await emailVerificationToken.save();
  }

  /**
   * Finds an email verification token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the email verification token.
   * @returns {Promise<IEmailVerificationToken | null>} - The found email verification token or null if not found.
   */
  async findById(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findById(id).exec();
  }

  /**
   * Finds an email verification token by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID associated with the token.
   * @returns {Promise<IEmailVerificationToken | null>} - The found email verification token or null if not found.
   */
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOne({ userId }).exec();
  }

  /**
   * Finds an email verification token by token string.
   * @param {string} token - The token string.
   * @returns {Promise<IEmailVerificationToken | null>} - The found email verification token or null if not found.
   */
  async findByToken(token: string): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOne({ token }).exec();
  }

  /**
   * Updates an email verification token by ID.
   * @param {UpdateEmailVerificationTokenParams} params - Object containing ID and update fields.
   * @returns {Promise<IEmailVerificationToken | null>} - The updated email verification token or null if not found.
   */
  async updateEmailVerificationToken({
    id,
    updateFields,
  }: UpdateEmailVerificationTokenParams): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes an email verification token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the email verification token.
   * @returns {Promise<IEmailVerificationToken | null>} - The deleted email verification token or null if not found.
   */
  async deleteEmailVerificationToken(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes email verification tokens by user ID.
   * @param {DeleteByUserIdParams} params - Object containing user ID.
   * @returns {Promise<{ deletedCount?: number }>} - The result of the delete operation, including the count of deleted tokens.
   */
  async deleteByUserId({
    userId,
  }: DeleteByUserIdParams): Promise<{ deletedCount?: number }> {
    return await EmailVerificationToken.deleteMany({ userId }).exec();
  }

  /**
   * Deletes an email verification token by token string.
   * @param {string} token - The token string.
   * @returns {Promise<IEmailVerificationToken | null>} - The deleted email verification token or null if not found.
   */
  async deleteByToken(token: string): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOneAndDelete({ token }).exec();
  }

  /**
   * Deletes expired email verification tokens.
   * @param {DeleteExpiredTokensParams} params - Object containing the current date.
   * @returns {Promise<{ deletedCount?: number }>} - The result of the delete operation, including the count of deleted tokens.
   */
  async deleteExpiredTokens({
    currentDate,
  }: DeleteExpiredTokensParams): Promise<{ deletedCount?: number }> {
    return await EmailVerificationToken.deleteMany({
      expiresAt: { $lt: currentDate },
    }).exec();
  }
}

export default EmailVerificationTokenRepository;
