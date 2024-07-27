import mongoose from "mongoose";
import { ISession } from "../database/models";
import { SessionRepository } from "../database/repository";

/**
 * Service for managing sessions.
 */
class SessionService {
  private sessionRepository: SessionRepository;

  /**
   * Initializes the SessionService with a new repository instance.
   */
  constructor() {
    this.sessionRepository = new SessionRepository();
  }

  /**
   * Creates a new session.
   * @param {CreateSessionParams} params - Object containing userId, refreshToken, userAgent, and expiresAt for the new session.
   * @returns {Promise<ISession>} - The created session.
   */
  async createSession(params: CreateSessionParams): Promise<ISession> {
    const session = await this.sessionRepository.createSession({
      userId: params.userId,
      refreshToken: params.refreshToken,
      userAgent: params.userAgent,
      expiresAt: params.expiresAt,
    });
    return session;
  }

  /**
   * Finds a session by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the session to be found.
   * @returns {Promise<ISession | null>} - The found session or null if not found.
   */
  async findSessionById(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await this.sessionRepository.findById(id);
  }

  /**
   * Finds sessions by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user whose sessions are to be found.
   * @returns {Promise<ISession[]>} - An array of sessions for the specified user.
   */
  async findSessionByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ISession[]> {
    return await this.sessionRepository.findByUserId(userId);
  }

  /**
   * Finds a session by refresh token.
   * @param {string} refreshToken - The refresh token to find the session by.
   * @returns {Promise<ISession | null>} - The found session or null if not found.
   */
  async findSessionByRefreshToken(
    refreshToken: string
  ): Promise<ISession | null> {
    return await this.sessionRepository.findByRefreshToken(refreshToken);
  }

  /**
   * Updates a session by ID.
   * @param {UpdateSessionParams} params - Object containing id and updateFields for updating the session.
   * @returns {Promise<ISession | null>} - The updated session or null if not found.
   */
  async updateSession(params: UpdateSessionParams): Promise<ISession | null> {
    return await this.sessionRepository.updateSession({
      id: params.id,
      updateFields: params.updateFields,
    });
  }

  /**
   * Deletes a session by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the session to be deleted.
   * @returns {Promise<ISession | null>} - The deleted session or null if not found.
   */
  async deleteSession(id: mongoose.Types.ObjectId): Promise<ISession | null> {
    return await this.sessionRepository.deleteSession(id);
  }

  /**
   * Deletes all sessions by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user whose sessions are to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - An object containing the count of deleted sessions.
   */
  async deleteSessionsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.sessionRepository.deleteSessionsByUserId({ userId });
  }

  /**
   * Deletes expired sessions.
   * @returns {Promise<{ deletedCount?: number }>} - An object containing the count of deleted sessions.
   */
  async deleteExpiredSessions(): Promise<{ deletedCount?: number }> {
    const now = new Date();
    return await this.sessionRepository.deleteExpiredSessions({
      currentDate: now,
    });
  }
}

/**
 * Parameters for creating a session.
 */
interface CreateSessionParams {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  userAgent: string;
  expiresAt: Date;
}

/**
 * Parameters for updating a session.
 */
interface UpdateSessionParams {
  id: mongoose.Types.ObjectId;
  updateFields: Partial<ISession>;
}

export default SessionService;
