import mongoose from "mongoose";
import { EmailVerificationToken, IEmailVerificationToken } from "../models";

class EmailVerificationTokenRepository {
  // Create a new email verification token
  async createEmailVerificationToken(
    userId: mongoose.Types.ObjectId,
    token: string
  ): Promise<IEmailVerificationToken> {
    const emailVerificationToken = new EmailVerificationToken({
      userId,
      token,
    });

    const result = await emailVerificationToken.save();
    return result;
  }

  // Find an email verification token by ID
  async findById(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findById(id).exec();
  }

  // Find an email verification token by user ID
  async findByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOne({ userId }).exec();
  }

  // Find an email verification token by token value
  async findByToken(token: string): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOne({ token }).exec();
  }

  // Update an email verification token by ID
  async updateEmailVerificationToken(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<IEmailVerificationToken>
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete an email verification token by ID
  async deleteEmailVerificationToken(
    id: mongoose.Types.ObjectId
  ): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findByIdAndDelete(id).exec();
  }

  // Delete email verification tokens by user ID
  async deleteByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await EmailVerificationToken.deleteMany({ userId }).exec();
  }

  // Delete email verification tokens by token value
  async deleteByToken(token: string): Promise<IEmailVerificationToken | null> {
    return await EmailVerificationToken.findOneAndDelete({ token }).exec();
  }
}

export default EmailVerificationTokenRepository;
