import mongoose from "mongoose";
import { ILoginAttempt } from "../database/models";
import { LoginAttemptRepository } from "../database/repository";

/**
 * Service for managing login attempts.
 */
class LoginAttemptService {
  private loginAttemptRepository: LoginAttemptRepository;

  /**
   * Initializes the LoginAttemptService with a new repository instance.
   */
  constructor() {
    this.loginAttemptRepository = new LoginAttemptRepository();
  }

  /**
   * Creates a new login attempt.
   * @param {CreateLoginAttemptParams} params - Object containing userId, ipAddress, userAgent, success, and optional timestamp.
   * @returns {Promise<ILoginAttempt>} - The created login attempt.
   */
  async createLoginAttempt(
    params: CreateLoginAttemptParams
  ): Promise<ILoginAttempt> {
    const loginAttempt = await this.loginAttemptRepository.createLoginAttempt(
      params
    );
    return loginAttempt;
  }

  /**
   * Finds a login attempt by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the login attempt to be found.
   * @returns {Promise<ILoginAttempt | null>} - The found login attempt or null if not found.
   */
  async findLoginAttemptById(
    id: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt | null> {
    return await this.loginAttemptRepository.findById(id);
  }

  /**
   * Finds login attempts by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the login attempts.
   * @returns {Promise<ILoginAttempt[]>} - An array of login attempts for the specified user.
   */
  async findLoginAttemptsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt[]> {
    return await this.loginAttemptRepository.findByUserId(userId);
  }

  /**
   * Finds login attempts by IP address.
   * @param {string} ipAddress - The IP address associated with the login attempts.
   * @returns {Promise<ILoginAttempt[]>} - An array of login attempts from the specified IP address.
   */
  async findLoginAttemptsByIpAddress(
    ipAddress: string
  ): Promise<ILoginAttempt[]> {
    return await this.loginAttemptRepository.findByIpAddress(ipAddress);
  }

  /**
   * Deletes a login attempt by ID.
   * @param {mongoose.Types.ObjectId} id - The ID of the login attempt to be deleted.
   * @returns {Promise<ILoginAttempt | null>} - The deleted login attempt or null if not found.
   */
  async deleteLoginAttempt(
    id: mongoose.Types.ObjectId
  ): Promise<ILoginAttempt | null> {
    return await this.loginAttemptRepository.deleteLoginAttempt(id);
  }

  /**
   * Deletes all login attempts by user ID.
   * @param {mongoose.Types.ObjectId} userId - The ID of the user associated with the login attempts to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted attempts.
   */
  async deleteLoginAttemptsByUserId(
    userId: mongoose.Types.ObjectId
  ): Promise<{ deletedCount?: number }> {
    return await this.loginAttemptRepository.deleteByUserId(userId);
  }

  /**
   * Deletes all login attempts by IP address.
   * @param {string} ipAddress - The IP address associated with the login attempts to be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted attempts.
   */
  async deleteLoginAttemptsByIpAddress(
    ipAddress: string
  ): Promise<{ deletedCount?: number }> {
    return await this.loginAttemptRepository.deleteByIpAddress(ipAddress);
  }

  /**
   * Deletes login attempts older than a specified date.
   * @param {Date} beforeDate - The date before which login attempts should be deleted.
   * @returns {Promise<{ deletedCount?: number }>} - The result containing the count of deleted attempts.
   */
  async deleteOldLoginAttempts(
    beforeDate: Date
  ): Promise<{ deletedCount?: number }> {
    return await this.loginAttemptRepository.deleteOldAttempts({ beforeDate });
  }
}

/**
 * Parameters for creating a login attempt.
 */
interface CreateLoginAttemptParams {
  userId: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp?: Date; // Optional parameter
}

export default LoginAttemptService;
