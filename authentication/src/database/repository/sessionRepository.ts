import mongoose from "mongoose";
import { Session, ISession } from "../models";

interface CreateSessionParams {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  expiresAt: Date;
}

interface UpdateSessionParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<ISession>;
}

interface DeleteSessionsByUserIdParams {
  userId: mongoose.Types.ObjectId;
}

interface DeleteExpiredSessionsParams {
  currentDate: Date;
}

class SessionRepository {
  /**
   * Creates a new session.
   * @param {CreateSessionParams} params - Object containing details for the new session.
   * @returns {Promise<ISession>} - The created session.
   */
  async createSession({
    userId,
    refreshToken,
    userAgent,
    expiresAt,
  }: CreateSessionParams): Promise<ISession> {
    const session = new Session({
      userId,
      refreshToken,
      userAgent,
      expiresAt,
    });

    const result = await session.save();
    return result;
  }

  /**
   * Finds a session by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the session.
   * @returns {Promise<ISession | null>} - The found session or null if not found.
   */
  async findById(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await Session.findById(id).exec();
  }

  /**
   * Finds sessions by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user.
   * @returns {Promise<ISession[]>} - List of sessions for the user.
   */
  async findByUserId(userId: mongoose.Types.ObjectId): Promise<ISession[]> {
    return await Session.find({ userId }).exec();
  }

  /**
   * Updates a session's refresh token or other fields.
   * @param {UpdateSessionParams} params - Object containing ID and fields to update.
   * @returns {Promise<ISession | null>} - The updated session or null if not found.
   */
  async updateSession({
    id,
    updateFields,
  }: UpdateSessionParams): Promise<ISession | null> {
    return await Session.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).exec();
  }

  /**
   * Deletes a session by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the session.
   * @returns {Promise<ISession | null>} - The deleted session or null if not found.
   */
  async deleteSession(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await Session.findByIdAndDelete(id).exec();
  }

  /**
   * Deletes sessions by user ID.
   * @param {DeleteSessionsByUserIdParams} params - Object containing the user ID.
   * @returns {Promise<{ deletedCount?: number }>} - Object containing the count of deleted sessions.
   */
  async deleteSessionsByUserId({
    userId,
  }: DeleteSessionsByUserIdParams): Promise<{ deletedCount?: number }> {
    const result = await Session.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount };
  }

  /**
   * Finds a session by refresh token.
   * @param {string} refreshToken - The refresh token of the session.
   * @returns {Promise<ISession | null>} - The found session or null if not found.
   */
  async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
    return await Session.findOne({ refreshToken }).exec();
  }

  /**
   * Deletes expired sessions.
   * @param {DeleteExpiredSessionsParams} params - Object containing the current date.
   * @returns {Promise<{ deletedCount?: number }>} - Object containing the count of deleted sessions.
   */
  async deleteExpiredSessions({
    currentDate,
  }: DeleteExpiredSessionsParams): Promise<{ deletedCount?: number }> {
    const result = await Session.deleteMany({
      expiresAt: { $lt: currentDate },
    }).exec();
    return { deletedCount: result.deletedCount };
  }
}

export default SessionRepository;
