import mongoose from "mongoose";
import { IEmailVerificationToken } from "../database/models";
import { EmailVerificationTokenRepository } from "../database/repository";

/**
 * Service for managing email verification tokens.
 */
class EmailVerificationTokenService {
  private emailVerificationTokenRepository: EmailVerificationTokenRepository;

  /**
   * Initializes the EmailVerificationTokenService with a new repository instance.
   */
  constructor() {
    this.emailVerificationTokenRepository =
      new EmailVerificationTokenRepository();
  }

  /**
   * Creates a new email verification token.
   * @param {CreateEmailVerificationTokenParams} params - Object containing userId and token.
   * @returns {Promise<IEmailVerificationToken>} - The created email verification token.
   */
  async createEmailVerificationToken(
    params: CreateEmailVerificationTokenParams
  ): Promise<IEmailVerificationToken> {
    const emailVerificationToken =
      await this.emailVerificationTokenRepository.createEmailVerificationToken({
        userId: params.userId,
        token: params.token,
        expiresAt: params.expiresAt,
      });
    return emailVerificationToken;
  }

  /**
   * Finds an email verification token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the token to be found.
   * @returns {Promise<IEmailVerificationToken | null>} - The found token or null if not found.
   */
  async findEmailVerificationTokenById(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await this.emailVerificationTokenRepository.findById(id);
  }

  /**
   * Finds an email verification token by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID associated with the token.
   * @returns {Promise<IEmailVerificationToken | null>} - The found token or null if not found.
   */
  async findEmailVerificationTokensByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await this.emailVerificationTokenRepository.findByUserId(userId);
  }

  /**
   * Finds an email verification token by token string.
   * @param {string} token - The token string to be found.
   * @returns {Promise<IEmailVerificationToken | null>} - The found token or null if not found.
   */
  async findEmailVerificationTokenByToken(
    token: string
  ): Promise<IEmailVerificationToken | null> {
    return await this.emailVerificationTokenRepository.findByToken(token);
  }

  /**
   * Deletes an email verification token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the token to be deleted.
   * @returns {Promise<IEmailVerificationToken | null>} - The deleted token or null if not found.
   */
  async deleteEmailVerificationToken(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await this.emailVerificationTokenRepository.deleteEmailVerificationToken(
      id
    );
  }

  /**
   * Deletes all email verification tokens by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID associated with the tokens to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - Object containing the count of deleted tokens.
   */
  async deleteEmailVerificationTokensByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.emailVerificationTokenRepository.deleteByUserId({
      userId,
    });
  }

  /**
   * Deletes expired email verification tokens.
   * @returns {Promise<{ deletedCount?: number }>} - Object containing the count of deleted tokens.
   */
  async deleteExpiredEmailVerificationTokens(): Promise<{
    deletedCount?: number;
  }> {
    const now = new Date();
    return await this.emailVerificationTokenRepository.deleteExpiredTokens({
      currentDate: now,
    });
  }

  /**
   * Creates a random activation OTP token for a user.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user to create the token for.
   * @returns {Promise<IEmailVerificationToken>} - The created email verification token.
   */
  async createActivationToken(
    userId: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken> {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    const emailVerificationToken =
      await this.emailVerificationTokenRepository.createEmailVerificationToken({
        userId,
        token,
        expiresAt,
      });
    return emailVerificationToken;
  }
}

/**
 * Parameters for creating an email verification token.
 */
interface CreateEmailVerificationTokenParams {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

export default EmailVerificationTokenService;
