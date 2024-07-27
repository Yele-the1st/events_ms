import mongoose from "mongoose";
import { MFAToken, IMFAToken } from "../models";

interface CreateMFATokenParams {
  userId: mongoose.Types.ObjectId;
  secret: string;
}

interface UpdateMFATokenParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<IMFAToken>;
}

interface DeleteByUserIdParams {
  userId: mongoose.Types.ObjectId;
}

class MFATokenRepository {
  /**
   * Creates a new MFA token.
   * @param {CreateMFATokenParams} params - Object containing userId and secret.
   * @returns {Promise<IMFAToken>} - The created MFA token.
   */
  async createMFAToken({
    userId,
    secret,
  }: CreateMFATokenParams): Promise<IMFAToken> {
    const mfaToken = new MFAToken({
      userId,
      secret,
    });

    const result = await mfaToken.save();
    return result;
  }

  /**
   * Finds an MFA token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the MFA token.
   * @returns {Promise<IMFAToken | null>} - The found MFA token or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<IMFAToken | null> {
    return await MFAToken.findById(id).exec();
  }

  /**
   * Finds an MFA token by user ID.
   * @param {mongoose.Types.ObjectId} userId - The user ID.
   * @returns {Promise<IMFAToken | null>} - The found MFA token or null if not found.
   */
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IMFAToken | null> {
    return await MFAToken.findOne({ userId }).exec();
  }

  /**
   * Updates an MFA token by ID.
   * @param {UpdateMFATokenParams} params - Object containing id and updateFields.
   * @returns {Promise<IMFAToken | null>} - The updated MFA token or null if not found.
   */
  async updateMFAToken({
    id,
    updateFields,
  }: UpdateMFATokenParams): Promise<IMFAToken | null> {
    return await MFAToken.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes an MFA token by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the MFA token.
   * @returns {Promise<IMFAToken | null>} - The deleted MFA token or null if not found.
   */
  async deleteMFAToken(id: mongoose.Types.ObjectId): Promise<IMFAToken | null> {
    return await MFAToken.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes MFA tokens by user ID.
   * @param {DeleteByUserIdParams} params - Object containing userId.
   * @returns {Promise<{ deletedCount?: number }>} - The number of deleted MFA tokens.
   */
  async deleteByUserId({
    userId,
  }: DeleteByUserIdParams): Promise<{ deletedCount?: number }> {
    const result = await MFAToken.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }
}

export default MFATokenRepository;
