import mongoose from "mongoose";
import { MFAToken, IMFAToken } from "../models";

class MFATokenRepository {
  // Create a new MFA token
  async createMFAToken(
    userId: mongoose.Types.ObjectId,
    secret: string
  ): Promise<IMFAToken> {
    const mfaToken = new MFAToken({
      userId,
      secret,
    });

    const result = await mfaToken.save();
    return result;
  }

  // Find an MFA token by ID
  async findById(id: mongoose.Types.ObjectId): Promise<IMFAToken | null> {
    return await MFAToken.findById(id).exec();
  }

  // Find an MFA token by user ID
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IMFAToken | null> {
    return await MFAToken.findOne({ userId }).exec();
  }

  // Update an MFA token by ID
  async updateMFAToken(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IMFAToken>
  ): Promise<IMFAToken | null> {
    return await MFAToken.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete an MFA token by ID
  async deleteMFAToken(id: mongoose.Types.ObjectId): Promise<IMFAToken | null> {
    return await MFAToken.findByIdAndDelete(id).exec();
  }

  // Delete MFA token by user ID
  async deleteByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await MFAToken.deleteMany({ userId }).exec();
  }
}

export default MFATokenRepository;
