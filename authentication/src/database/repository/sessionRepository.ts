import mongoose from "mongoose";
import { Session, ISession } from "../models";

class SessionRepository {
  // Create a new session
  async createSession(
    userId: mongoose.Types.ObjectId,
    refreshToken: string,
    userAgent: string,
    expiresAt: Date
  ): Promise<ISession> {
    const session = new Session({
      userId,
      refreshToken,
      userAgent,
      expiresAt,
    });

    const result = await session.save();
    return result;
  }

  // Find a session by ID
  async findById(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await Session.findById(id).exec();
  }

  // Find sessions by user ID
  async findByUserId(userId: mongoose.Types.ObjectId): Promise<ISession[]> {
    return await Session.find({ userId }).exec();
  }

  // Update a session's refresh token or other fields
  async updateSession(
    id: mongoose.Types.ObjectId,
    updateFields: Partial<ISession>
  ): Promise<ISession | null> {
    return await Session.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  // Delete a session by ID
  async deleteSession(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await Session.findByIdAndDelete(id).exec();
  }

  // Delete sessions by user ID
  async deleteSessionsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await Session.deleteMany({ userId }).exec();
  }

  // Find sessions by refresh token
  async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
    return await Session.findOne({ refreshToken }).exec();
  }
}

export default SessionRepository;
