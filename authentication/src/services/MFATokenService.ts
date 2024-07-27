import mongoose from "mongoose";
import { IMFAToken } from "../database/models";
import { MFATokenRepository } from "../database/repository";

/**
 * Service for managing MFA tokens.
 */
class MFATokenService {
  private mfaTokenRepository: MFATokenRepository;

  /**
   * Initializes the MFATokenService with a new repository instance.
   */
  constructor() {
    this.mfaTokenRepository = new MFATokenRepository();
  }

  /**
   * Creates a new MFA token.
   * @param {CreateMFATokenParams} params - Object containing userId and secret.
   * @returns {Promise<IMFAToken>} - The created MFA token.
   */
  async createMFAToken(params: CreateMFATokenParams): Promise<IMFAToken> {
    const mfaToken = await this.mfaTokenRepository.createMFAToken(params);
    return mfaToken;
  }

  /**
   * Finds an MFA token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the MFA token to be found.
   * @returns {Promise<IMFAToken | null>} - The found MFA token or null if not found.
   */
  async findMFATokenById(
    id: mongoose.Types.ObjectId
  ): Promise<IMFAToken | null> {
    return await this.mfaTokenRepository.findById(id);
  }

  /**
   * Finds MFA tokens by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the MFA tokens.
   * @returns {Promise<IMFAToken | null>} - The found MFA token or null if not found.
   */
  async findMFATokensByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IMFAToken | null> {
    return await this.mfaTokenRepository.findByUserId(userId);
  }

  /**
   * Deletes an MFA token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the MFA token to be deleted.
   * @returns {Promise<IMFAToken | null>} - The deleted MFA token or null if not found.
   */
  async deleteMFAToken(id: mongoose.Types.ObjectId): Promise<IMFAToken | null> {
    return await this.mfaTokenRepository.deleteMFAToken(id);
  }

  /**
   * Deletes all MFA tokens by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the MFA tokens to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted tokens.
   */
  async deleteMFATokensByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.mfaTokenRepository.deleteByUserId({ userId });
  }
}

/**
 * Parameters for creating an MFA token.
 */
interface CreateMFATokenParams {
  userId: mongoose.Types.ObjectId;
  secret: string;
}

export default MFATokenService;
